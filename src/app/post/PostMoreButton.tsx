import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PostData } from "@/lip/types";
import { MoreHorizontalIcon, Trash2 } from "lucide-react";
import DeletePostDialog from "./DeletePostDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";


interface PostMoreButtonProps{
    post:PostData;
    className?:string
};

export default function PostMoreButton({
    post,
    className
}:PostMoreButtonProps){

    const[showDeleteDialog , setShowDeleteDialog] = useState(false);
   return<>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>

            <MoreHorizontalIcon className={cn("size-5 text-muted-foreground " ,className)}/>
      
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    <span className="flex items-center gap-2 font-semibold text-destructive">
                        <Trash2 className="size-4" />
                        Delete
                    </span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}  />
   
   </>

}