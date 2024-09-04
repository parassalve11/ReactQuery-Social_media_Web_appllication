import { useToast } from "@/components/ui/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import deletePost from "./actions";
import { PostsPage } from "@/lip/types";
import { useSession } from "../(main)/SessionProvider";



export default function useDeletePost(){
    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const {user} = useSession();
    const mutaions = useMutation({
        mutationFn:deletePost,
        onSuccess:async(deletePost) =>{
            const queryFliter : QueryFilters = {queryKey:['post-feed']};
           
            await queryClient.cancelQueries(queryFliter);

            queryClient.setQueriesData<InfiniteData<PostsPage , string | null >>(
                queryFliter,
                (oldData) =>{
                    if(!oldData) return;

                    return{
                        pageParams:oldData.pageParams,
                        pages:oldData.pages.map((page) =>({
                            nextCursor:page.nextCursor,
                            posts:page.posts.filter((p) => p.id !== deletePost.id),
                        }))
                    }
                }
            );

            toast({
                description:'Post deleted Sucessfully.'
            });

            if(pathname === `/posts/${deletePost.id}`){
                return router.push(`/users/${deletePost.user.username}`)
            }
        },
        onError:(error) =>{
            console.log(error);
            toast({
                variant:'destructive',
                description:'falied to delete the Post,Plesase try again.'
            })
        }
    })
    return mutaions;
}