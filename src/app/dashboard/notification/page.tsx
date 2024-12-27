
import { SearchParams } from 'nuqs/parsers';
import { searchParamsCache } from '@/lib/searchparams';
import NotificationsListPage from './_components/notification-list-page';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Notifications | Ecstasia Panel'
};

export default async function Page({ searchParams }: pageProps) {
    searchParamsCache.parse(searchParams);

    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('limit');
    const search = searchParamsCache.get('q') || '';
    const deviceOs = searchParamsCache.get('deviceOs') || '';

    return <NotificationsListPage
        page={page}
        search={search}
        pageLimit={pageLimit}
        deviceOs={deviceOs}
    />;
}
