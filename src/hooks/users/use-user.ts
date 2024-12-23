import { client } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['get-user'],
        queryFn: async () => {
            const response = await client.auth.getUser.$get();
            const { user } = await response.json();
            return user;
        },
    },
    )

    return { user, isLoading, error };
};
