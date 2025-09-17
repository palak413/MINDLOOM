// A simple in-memory store for active breathing session rooms
const activeRooms = new Map();

// The breathing pattern (in milliseconds)
const BREATHING_CYCLE = [
    { phase: 'inhale', duration: 4000 },
    { phase: 'hold', duration: 7000 },
    { phase: 'exhale', duration: 8000 },
];

const registerBreathingHandlers = (io, socket) => {
    
    // --- Create a new breathing room ---
    socket.on('breathing:createRoom', () => {
        const roomId = `room-${socket.id}`; // Generate a unique room ID
        socket.join(roomId);
        activeRooms.set(roomId, { host: socket.id, participants: [socket.user.username] });
        socket.emit('breathing:roomCreated', { roomId });
    });

    // --- Join an existing breathing room ---
    socket.on('breathing:joinRoom', ({ roomId }) => {
        const room = activeRooms.get(roomId);
        if (room) {
            socket.join(roomId);
            room.participants.push(socket.user.username);
            // Notify others in the room that a new user has joined
            io.to(roomId).emit('breathing:userJoined', { participants: room.participants });
        } else {
            socket.emit('breathing:error', { message: "Room not found." });
        }
    });

    // --- Host starts the breathing session ---
    socket.on('breathing:startSession', ({ roomId }) => {
        const room = activeRooms.get(roomId);
        // Only the host can start the session
        if (room && room.host === socket.id) {
            let cycleIndex = 0;

            const runCycle = () => {
                const currentPhase = BREATHING_CYCLE[cycleIndex];
                // Broadcast the current phase to everyone in the room
                io.to(roomId).emit('breathing:updateState', currentPhase);

                cycleIndex = (cycleIndex + 1) % BREATHING_CYCLE.length;
            };

            // Start the cycle and repeat every 19 seconds (4+7+8)
            runCycle(); // Run the first cycle immediately
            const intervalId = setInterval(runCycle, 19000);
            room.intervalId = intervalId; // Store interval to clear it later
        }
    });

    // --- User leaves a room (can be tied to disconnect) ---
    const leaveRoom = () => {
        for (const [roomId, room] of activeRooms.entries()) {
            if (room.participants.includes(socket.user.username)) {
                room.participants = room.participants.filter(name => name !== socket.user.username);
                // If the host leaves, stop the session
                if (room.host === socket.id) {
                    clearInterval(room.intervalId);
                    io.to(roomId).emit('breathing:sessionEnded', { message: "The host has ended the session." });
                    activeRooms.delete(roomId);
                } else {
                    io.to(roomId).emit('breathing:userLeft', { participants: room.participants });
                }
                break;
            }
        }
    };
    
    socket.on('breathing:leaveRoom', leaveRoom);
    socket.on('disconnect', leaveRoom);
};

export default registerBreathingHandlers;