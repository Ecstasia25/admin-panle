"use client";
import { client } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';
import CoordinatorForm from './coordinator-form';


type CoordinatorPageProps = {
    coordnatorId: string;
};

export default async function CoordinatorEditPage({
    coordnatorId,
}: CoordinatorPageProps) {
    let coordinator = null;
    let pageTitle = 'Create New Coordinator';

    const {
        data,
    } = useQuery({
        queryKey: ['get-coordinator'],
        queryFn: async () => {
            const response = await client.auth.getUserById.$get({ id: coordnatorId });
            const { user } = await response.json();
            return user;
        },
    })
    pageTitle = `Update Coordinator Details`;

    if (data) {
        coordinator = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
    }

    return (
        <>
            <CoordinatorForm initialData={coordinator} pageTitle={pageTitle} />

        </>
    )
}
