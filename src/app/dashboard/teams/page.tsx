
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import TeamsList from './_components/teams-list-page';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Teams | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);

    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    const groupSize = searchParamsCache.get('groupSize') || '';

    return <TeamsList
        page={page}
        pageLimit={pageLimit}
        search={search}
        groupSize={groupSize}
    />
}
