
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import MyEventsListPage from './_components/my-events-list-page';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'My Events | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);

    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    const groupSize = searchParamsCache.get('groupSize') || '';
    const stage = (searchParamsCache.get('stage') === 'ONSTAGE' || searchParamsCache.get('stage') === 'OFFSTAGE') ? searchParamsCache.get('stage') as "ONSTAGE" | "OFFSTAGE" : undefined;

    return <MyEventsListPage
        page={page}
        search={search}
        pageLimit={pageLimit}
        stage={stage}
        groupSize={groupSize}
    />;
}
