import { useUploadThing } from "@/lip/uploadthing";
import { UpdateUserProfileValues } from "@/lip/validation";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { toast } from "@/components/ui/use-toast";

export default function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { startUpload: startAavatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAavatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilters: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilters);

      queryClient.invalidateQueries(queryFilters);

      router.refresh();

      toast({
        description: "Profile Updated.",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Faild to Update User Profile.",
      });
    },
  });
  return mutation;
}
