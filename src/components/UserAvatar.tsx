
import Image from "next/image";
import UserIcon from '@/assets/avatar-placeholder.png' 
import { cn } from "@/lib/utils";

interface UserAvatarProps{
    avatarUrl?:string|null|undefined;
    size?:number;
    className?:string;
};

export default function UserAvatar({
    avatarUrl,
    size,
    className
}:UserAvatarProps){
    return <Image 
    src={avatarUrl || UserIcon}
    alt="user"
    height={size ?? 48}
    width={size ?? 48}
    className={cn("aspect-square flex-none h-fit bg-secondary rounded-full object-cover",className)}
    />
}