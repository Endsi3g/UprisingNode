import { Header } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased">
            <Header userName="K. Miller" userRole="Opérateur" />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-20">
                {/* Lead Drop Section */}
                <section className="flex flex-col gap-8 items-center w-full max-w-2xl mx-auto">
                    <div className="text-center space-y-3 flex flex-col items-center w-full">
                        <Skeleton className="h-10 w-64 md:h-14 md:w-96" />
                        <Skeleton className="h-4 w-40" />
                    </div>

                    {/* Lead Input */}
                    <div className="w-full mt-4">
                        <Skeleton className="h-14 w-full rounded-none" />
                    </div>
                </section>

                {/* Stats Section */}
                <section className="w-full pt-10 border-t border-gray-50 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
                    {/* Quick Access */}
                    <div className="md:col-span-3 flex flex-col justify-center items-start border-r border-gray-50 pr-8 w-full gap-4">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Commission Tracker */}
                    <div className="md:col-span-9 space-y-5 w-full">
                        <div className="flex items-baseline justify-between w-full">
                            <Skeleton className="h-3 w-32" />
                            <div className="flex items-baseline gap-2">
                                <Skeleton className="h-8 w-32" />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <Skeleton className="h-px w-full" />
                    </div>
                </section>

                {/* Quick Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 border border-gray-100">
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </section>

                {/* Quick Actions */}
                <section className="flex flex-wrap gap-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                </section>
            </main>
        </div>
    );
}
