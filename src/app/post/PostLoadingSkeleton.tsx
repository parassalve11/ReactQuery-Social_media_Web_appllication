import { Skeleton } from '@/components/ui/skeleton'

export default function PostLoadingSkeleton(){
    return <div className="space-y-5">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
    </div>
}


function PostSkeleton(){
    return(
        <div className="w-full animate-pulse sapce-y-3 rounded-2xl shadow-sm bg-card p-5">
            <div className="flex flex-wrap gap-3">
                <Skeleton className='size-12 rounded-full' />
                <div className='space-y-1.5'>
                    <Skeleton  className='h-4 w-24 rounded'/>
                    <Skeleton  className='h-4 w-20 rounded'/>
                </div>
            </div>
            <Skeleton className='h-16 rounded mt-4' />
        </div>
    )
}