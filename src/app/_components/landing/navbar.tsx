import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowRight, LogIn } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { MaxWidthWrapper } from "@/components/shared/max-width-wrapper"

export const Navbar = async () => {
  const user = await currentUser()

  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logos/logo.png" alt="logo" className="w-14 h-auto" />
            <h1 className="flex z-40 font-semibold">
              Ecstasia
            </h1>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>

                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1",
                  })}
                >
                  Dashboard <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                >
                  <Button
                    className="active:scale-95 flex items-center gap-2 md:gap-3 text-xs md:text-sm rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>

                <div className="h-8 w-px bg-gray-200" />

                <Link href={"/sign-up"}>
                  <Button
                    variant="outline"
                    className="active:scale-95 flex items-center gap-2 md:gap-3 text-xs md:text-sm rounded-lg"
                  >
                    Sign Up
                    <LogIn className="size-4 shrink-0" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}