

'use client'

import {  PostsPage } from "@/lip/types"
import { useInfiniteQuery} from "@tanstack/react-query"
import { Loader2 } from "lucide-react";

import kyInstance from "@/lip/ky";
import InfiniteScrollConatiner from "@/components/InfiniteScrollContainer";
import PostLoadingSkeleton from "@/app/post/PostLoadingSkeleton"; 
import Post from "@/app/post/Post";




export default function BookmarkFeed(){

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey:['post-feed','for-you'],
        queryFn:({pageParam}) => kyInstance.get('/api/posts/bookmarked',pageParam? {searchParams : {cursor:pageParam}}:{},
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam:(lastPage) => lastPage.nextCursor
    });

    const posts = data?.pages.flatMap(page => page.posts) || [];

    if(status === 'pending'){
        return(<PostLoadingSkeleton />)
    };

    if(status === 'success' && !posts.length && !hasNextPage){
        return <p className="text-center font-semibold text-muted-foreground ">No bookmarked yet.</p>
    }
    if(status === 'error'){
        return <p className="text-center font-semibold text-destructive">An error occur during loading bookmarks.</p>
    }


    return <InfiniteScrollConatiner className="space-y-5"
    onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
    {posts?.map((post) =>(
        <Post key={post.id} post={post} />
    ))}
   {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
   
    </InfiniteScrollConatiner>
}