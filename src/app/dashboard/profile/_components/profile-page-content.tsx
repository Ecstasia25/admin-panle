import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import React from 'react'

const ProfilePageContent = () => {
    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Profile Details`}
                        description="Manage your profile details and settings"
                    />
                </div>
                <Separator />
            </div>
        </PageContainer>
    )
}

export default ProfilePageContent