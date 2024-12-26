
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
    const groupSize = searchParamsCache.get('groupSize') || '';
    const day = searchParamsCache.get('day') || '';
    const validCategories = ['DANCE', 'MUSIC', 'DRAMA', 'LITERARY', 'INFORMALS', 'ART', 'SPORTS', 'PHOTORAPHY'] as const;
    const category = searchParamsCache.get('category') as typeof validCategories[number] | undefined;
    const stage = (searchParamsCache.get('stage') === 'ONSTAGE' || searchParamsCache.get('stage') === 'OFFSTAGE') ? searchParamsCache.get('stage') as "ONSTAGE" | "OFFSTAGE" : undefined;

    return <EventListPage
        page={page}
        search={search}
        pageLimit={pageLimit}
        stage={stage}
        groupSize={groupSize}
        category={category}
        day={day}
    />;
}
