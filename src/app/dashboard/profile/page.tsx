import { SearchParams } from 'nuqs/parsers';
import React from 'react'
import ProfilePageContent from './_components/profile-page-content';


type pageProps = {
    searchParams: SearchParams;
};


export const metadata = {
    title: 'Profile | Ecstasia Panel'
};

export default async function PagePage({ searchParams }: pageProps) {
    return <ProfilePageContent />;
}
