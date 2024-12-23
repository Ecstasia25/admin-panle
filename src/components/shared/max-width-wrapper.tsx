import { cn } from "@/utils";


interface MaxWidthWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
export const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
    return (
        <div
            className={cn("h-full mx-auto w-full max-w-screen-2xl px-2.5 md:px-14 2xl:px-20", className)}>
            {children}
        </div>
    )
}