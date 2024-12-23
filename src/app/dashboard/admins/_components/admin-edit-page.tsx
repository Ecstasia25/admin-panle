"use client";
import { client } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import AdminForm from './admin-form';


type AdminEditPageProps = {
    adminId: string;
};

export default async function AdminEditPage({
    adminId,
}: AdminEditPageProps) {
    let admin = null;
    let pageTitle = 'Create New Admin';

    const {
        data,
    } = useQuery({
        queryKey: ['get-admin'],
        queryFn: async () => {
            const response = await client.auth.getUserById.$get({ id: adminId });
            const { user } = await response.json();
            return user;
        },
    })
    pageTitle = `Update Admin Details`;

    if (data) {
        admin = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
    }

    return (
        <>
            <AdminForm initialData={admin} pageTitle={pageTitle} />;

        </>
    )
}
