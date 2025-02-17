'use client'
import useFollowerInfo from "@/hooks/userFollowerInfo";
import { FollowerInfo } from "@/lip/types";
import { QueryFilters, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lip/ky";
import { useToast } from "./ui/use-toast";


interface FollowButtonProps{
    userId:string,
    intialState:FollowerInfo
}

export default function FollowButton({
    userId,
    intialState
}:FollowButtonProps){

    const{toast} = useToast();
    const queryClient = useQueryClient();

    const {data} = useFollowerInfo(userId , intialState);
    const queryKey:QueryKey = ['follower-info', userId]
    const{mutate} = useMutation({
        mutationFn:() => data.isFollowedByUser? 
            kyInstance.delete(`/api/users/${userId}/followers`)
            :kyInstance.post(`/api/users/${userId}/followers`),

        onMutate: async() => { 
            
          await queryClient.cancelQueries({queryKey})

           const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

           queryClient.setQueryData<FollowerInfo>(queryKey , () =>({
            followers:
                (previousState?.followers || 0) +
                (previousState?.isFollowedByUser? -1 : 1),
             isFollowedByUser: !previousState?.isFollowedByUser   
            
           }));
           return{ previousState }
        },
        
        onError(error, variables, context) {
            queryClient.setQueriesData(queryKey as QueryFilters , context?.previousState );
            console.log(error);
            toast({
                variant:'destructive',
                description:'Someting went Wrong, Please try again.'
            })
            
        }
        
    })

    return <Button 
    onClick={() => mutate()}
    variant={data.isFollowedByUser ? "secondary":'default'}>
        {data.isFollowedByUser ? 'Unfollow':'Follow'}
    </Button>
}