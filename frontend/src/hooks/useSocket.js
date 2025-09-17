import { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";

export const useSocket = () => {
    // The context can be null if the user is not authenticated, so we don't throw an error.
    // Components using this hook should handle the null case.
    return useContext(SocketContext);
};