import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import UserManagement from '../features/admin/UserManagement';
import StoreManagement from '../features/admin/StoreManagement';

function AdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <Tabs defaultValue="users" className="w-full">
                <TabsList>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="store">Store Management</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="mt-4">
                    <UserManagement />
                </TabsContent>
                <TabsContent value="store" className="mt-4">
                    <StoreManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AdminPage;