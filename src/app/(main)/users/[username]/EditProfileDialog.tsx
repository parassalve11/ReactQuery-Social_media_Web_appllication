import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserData } from "@/lip/types";
import {
  upadateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lip/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useUpdateUserProfile from "./mutation";
import { Textarea } from "@/components/ui/textarea";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { Camera } from "lucide-react";
import CropImageDialog from "@/components/CropImageDialog";
import Resizer from "react-image-file-resizer";
interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(upadateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });
  const muatation = useUpdateUserProfile();
  const [cropedAvatar, setCropedAvatar] = useState<Blob | null>(null);
  function onSubmit(values: UpdateUserProfileValues) {
    const newAvatarUrl = cropedAvatar
      ? new File([cropedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    muatation.mutate(
      { values, avatar: newAvatarUrl },
      {
        onSuccess: () => {
          setCropedAvatar(null);
          onOpenChange(false);
        },
      },
    );
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5]">
            <Label>Avatar</Label>
            <AvatarInput
              src={
                cropedAvatar
                  ? URL.createObjectURL(cropedAvatar)
                  : user.avatarUrl || avatarPlaceHolder
              }
              onImageCroped={setCropedAvatar}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="displayName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name.." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bio"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell just about Your Self"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <LoadingButton
                  className="mt-7"
                  type="submit"
                  loading={muatation.isPending}
                >
                  Save
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCroped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCroped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar Preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-2xl bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={22} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          onCroped={onImageCroped}
          cropAspectRatio={1}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
