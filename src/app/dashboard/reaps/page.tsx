
import { SearchParams } from 'nuqs/parsers';
import { searchParamsCache } from '@/lib/searchparams';
import ReapListingPage from './_components/reap-list';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Reaps | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('limit');
  const search = searchParamsCache.get('q') || '';
  return <ReapListingPage
    page={page}
    search={search}
    pageLimit={pageLimit}
  />;
}
