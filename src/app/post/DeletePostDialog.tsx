import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostData } from "@/lip/types";
import useDeletePost from "./mutation";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";


interface DeletePostDialogProps{
    post:PostData;
    open:boolean;
    onClose:() => void;
}

export default function DeletePostDialog({
    post,
    open,
    onClose
}:DeletePostDialogProps){

    const muataion = useDeletePost();
    function handleOpenChange(open:boolean){
        if(!open || !muataion.isPending){
            onClose();
        }
    }
    return <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete post?</DialogTitle>
                <DialogDescription>
                    Are you sure you wnat to delete this post? this action can not be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                variant={'outline'}
                onClick={onClose}
                disabled={muataion?.isPending}
                >
                cancel
                </Button>
                <LoadingButton
                variant={'destructive'} 
                onClick={() => muataion.mutate(post.id , {onSuccess: onClose})}
                loading={muataion.isPending}
                >
                    Delete
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}