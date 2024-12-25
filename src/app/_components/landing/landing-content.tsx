"use client"

import { ShinyButton } from '@/components/shared/shity-button'
import { useUser } from '@/hooks/users/use-user'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


const LandingPageContent = () => {
    const router = useRouter()
    const { user } = useUser()
    useEffect(() => {
        if (user?.id) {
            router.replace('/dashboard')
        }
    }, [user, router])
    return (
        <main className="flex !dark:grainy  flex-col items-center justify-center min-h-[90vh]">
            <div className="container flex flex-col items-center justify-center gap-12 md:gap-6 px-4 py-16">
                <h1 className="text-5xl font-medium font-heading tracking-tight sm:text-[5rem] text-center">
                    Ecstasia Admin Panel
                </h1>

                <p className="text-center max-w-prose text-balance">
                    Admin panel  to manage the events and the users.
                </p>
                <div className="w-full max-w-80">
                    {user?.id ? (
                        <ShinyButton
                            href="/dashboard"
                            className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl dark:text-black"
                        >
                            Start Manage
                        </ShinyButton>
                    ) : (
                        <ShinyButton
                            href="/sign-up"
                            className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
                        >
                            Start Manage
                        </ShinyButton>
                    )}
                </div>
            </div>
        </main>
    )
}

export default LandingPageContent