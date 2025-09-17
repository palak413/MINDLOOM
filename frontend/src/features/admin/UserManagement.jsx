import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const fetchUsers = async () => {
    const { data } = await apiClient.get('/admin/users');
    return data.data;
};

function UserManagement() {
    const { data: users, isLoading } = useQuery({ queryKey: ['allUsers'], queryFn: fetchUsers });

    if (isLoading) return <div>Loading users...</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Streak</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                    <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>{user.points}</TableCell>
                        <TableCell>{user.currentStreak}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default UserManagement;