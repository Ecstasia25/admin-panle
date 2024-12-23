
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import { searchParamsCache } from '@/lib/searchparams';
import CoordinatorListPage from './_components/coordinator-list';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Coordinators | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('limit');
  const search = searchParamsCache.get('q') || '';
  return <CoordinatorListPage
    page={page}
    search={search}
    pageLimit={pageLimit}
  />;
}
