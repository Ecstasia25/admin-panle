
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import MyTeamsList from './_components/my-teams-list';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'My Teams | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);
    
    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    const groupSize = searchParamsCache.get('groupSize') || '';

    return <MyTeamsList
        page={page}
        pageLimit={pageLimit}
        search={search}
        groupSize={groupSize}
    />
}
