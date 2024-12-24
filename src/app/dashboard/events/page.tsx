
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import EventListPage from './_components/events-list-page';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Events | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);

    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    return <EventListPage
        page={page}
        search={search}
        pageLimit={pageLimit}
    />;
}
