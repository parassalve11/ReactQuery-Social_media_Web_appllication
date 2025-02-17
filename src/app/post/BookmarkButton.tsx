import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import kyInstance from "@/lip/ky";
import { BookmarkInfo } from "@/lip/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const {mutate} = useMutation({
    mutationFn: async () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),

    onMutate:async()=>{

        toast({
            description:`Post ${data.isBookmarkedByUser ? 'Un': ''}bookmarked.`
        })
        await queryClient.cancelQueries({queryKey});

        const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

        queryClient.setQueryData<BookmarkInfo>(queryKey , () => ({
            isBookmarkedByUser:!previousState?.isBookmarkedByUser
        }))

        return {previousState};
    },

    onError(error, variables, context) {
        queryClient.setQueryData<BookmarkInfo>(queryKey , context?.previousState)
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
    },
    
    
  });

  return (
    <button type="button" onClick={() => mutate()} className="flex items-center gap-2">
        <Bookmark className={cn('size-5', data.isBookmarkedByUser && "fill-primary text-primary")} />
    </button>
  )
}
