'use client'

import {  PostsPage } from "@/lip/types"
import { useInfiniteQuery} from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import Post from "../post/Post";
import kyInstance from "@/lip/ky";
import InfiniteScrollConatiner from "@/components/InfiniteScrollContainer";
import PostLoadingSkeleton from "../post/PostLoadingSkeleton";



export default function FollowingFeed(){

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey:['post-feed','following'],
        queryFn:({pageParam}) => kyInstance.get('/api/posts/following',pageParam? {searchParams : {cursor:pageParam}}:{},
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam:(lastPage) => lastPage.nextCursor
    });

    const posts = data?.pages.flatMap(page => page.posts) || [];

    if(status === 'pending'){
        return(<PostLoadingSkeleton />)
    };

    if(status === 'success' && !posts.length && !hasNextPage){
        return <p className="text-center font-semibold text-muted-foreground ">You have To follow people to see theree Posts"👽".</p>
    }
    if(status === 'error'){
        return <p className="text-center font-semibold text-destructive">An error occur during loading.</p>
    }


    return <InfiniteScrollConatiner className="space-y-5"
    onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
    {posts.map((post) =>(
        <Post key={post.id} post={post} />
    ))}
   {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
   
    </InfiniteScrollConatiner>
}