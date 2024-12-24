"use client";
import { client } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import UserForm from './user-form';





type UserEditPageProps = {
    id: string;
};

export default async function UserEditPage({
    id,
}: UserEditPageProps) {
    let user = null;
    let pageTitle = 'Create New user';

    const {
        data,
    } = useQuery({
        queryKey: ['get-user-id'],
        queryFn: async () => {
            const response = await client.auth.getUserById.$get({ id });
            const { user } = await response.json();
            return user;
        },
    })
    pageTitle = `Update User Details`;

    if (data) {
        user = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
    }

    return (
        <>
            <UserForm initialData={user} pageTitle={pageTitle} />
        </>
    )
}
