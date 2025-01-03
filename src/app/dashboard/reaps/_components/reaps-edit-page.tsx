"use client";
import { client } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';
import ReapForm from './reap-form';


type ReapEditPageProps = {
    reapId: string;
};

export default async function ReapEditPage({
    reapId,
}: ReapEditPageProps) {
    let admin = null;
    let pageTitle = 'Create New Reap';

    const {
        data,
    } = useQuery({
        queryKey: ['get-reap'],
        queryFn: async () => {
            const response = await client.auth.getUserById.$get({ id: reapId });
            const { user } = await response.json();
            return user;
        },
    })
    pageTitle = `Update Reap Details`;

    if (data) {
        admin = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
    }

    return (
        <>
            <ReapForm initialData={admin} pageTitle={pageTitle} />
        </>
    )
}
