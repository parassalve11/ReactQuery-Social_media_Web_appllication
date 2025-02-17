import { useToast } from "@/components/ui/use-toast";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import { useSession } from "@/app/(main)/SessionProvider";
import { submitPost } from "./actions";

export default function useSubmitPostMuataion() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async () => {
      const queryFliter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFliter);

      // queryClient.setQueriesData<InfiniteData<PostsPage,string |null>>(
      //     queryFliter,
      //     (oldData) => {
      //         const firstPage = oldData?.pages[0];
      //          if (firstPage) {
      //             return {
      //                 pageParams:oldData.pageParams,
      //                 pages:[
      //                     {
      //                         posts:[newPost , ...firstPage.posts],
      //                         nextCursor:firstPage.nextCursor,
      //                     },
      //                     ...oldData.pages.slice(1),
      //                 ],
      //             }

      //          };
      //     }
      // );

      queryClient.invalidateQueries(queryFliter);

      queryClient.invalidateQueries({
        queryKey: queryFliter.queryKey,
        predicate(query) {
          return queryFliter.predicate(query) && !query.state.data;
        },
      });
      toast({
        description: "Post Created.",
      });
      // queryClient.invalidateQueries(queryFliter);
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Post is not Submited , Please try again!",
      });
    },
  });
  return mutation;
}
