
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import AdminListingPage from './_components/admin-list';
import { searchParamsCache } from '@/lib/searchparams';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Admins | Ecstasia Admin'
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('limit');
  const search = searchParamsCache.get('q') || '';
  return <AdminListingPage
    page={page}
    search={search}
    pageLimit={pageLimit}
  />;
}
