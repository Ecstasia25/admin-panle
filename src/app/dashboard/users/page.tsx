
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import CoordinatorListPage from './_components/user-list';
import UserListPage from './_components/user-list';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Users | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);

    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    return <UserListPage
        page={page}
        search={search}
        pageLimit={pageLimit}
    />;
}
