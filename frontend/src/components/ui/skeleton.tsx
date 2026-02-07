"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "skeleton animate-pulse bg-gray-200",
                {
                    "h-4 w-full rounded": variant === "text",
                    "rounded-full": variant === "circular",
                    "rounded-xl": variant === "rectangular",
                },
                className
            )}
            {...props}
        />
    );
}

export function LandCardSkeleton() {
    return (
        <div className="land-card overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton variant="text" className="h-5 w-3/4" />
                <Skeleton variant="text" className="h-4 w-1/2" />
                <Skeleton variant="text" className="h-4 w-1/3" />
                <div className="pt-2 border-t">
                    <Skeleton variant="text" className="h-6 w-2/5" />
                </div>
            </div>
        </div>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
            <Skeleton variant="circular" className="h-12 w-12" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-3/4" />
                <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 text-center">
            <Skeleton variant="circular" className="h-14 w-14 mx-auto mb-3" />
            <Skeleton variant="text" className="h-8 w-20 mx-auto mb-2" />
            <Skeleton variant="text" className="h-4 w-24 mx-auto" />
        </div>
    );
}
