'use client'
import { useSession } from "@/app/(main)/SessionProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Check, LogOutIcon, Monitor, Moon, Sun, User2 } from "lucide-react";
import { LogOut } from "@/app/(auth)/actions";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";


interface UserButtonProps{
    className?:string;
}

export default function UserButton({className}:UserButtonProps){
    const{user}= useSession();

    const{theme,setTheme}=useTheme();

    const queryClient = useQueryClient();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("rounded-full flex-none",className)}>
                    <UserAvatar avatarUrl={user.avatarUrl} size={40} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>
                Log in as {<span className="text-primary text-[16px] font-bold">@{user.username}</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
                <DropdownMenuItem>
                    <User2 className="mr-2 size-5" />
                    <span>Profile</span>
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Monitor  className="mr-2 size-5"/>
                    Theme
                </DropdownMenuSubTrigger>
               <DropdownMenuPortal>
               <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                        <Monitor  className="mr-2 size-5"/>
                        System
                        {theme === 'system' && <Check className="ms-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        <Sun className="mr-2 size-5" />
                        Light
                        {theme === 'light' && <Check className="ms-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setTheme('dark')}>
                        <Moon className="mr-2 size-5" />
                        Dark
                        {theme === 'dark' && <Check className="ms-2"/>}
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
               </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            onClick={()=>{
                queryClient.clear();
                LogOut();
            }}
            className='text-destructive group'
            >
                <LogOutIcon  className="mr-2 size-5 text-destructive hover:text-destructive"/>
                <span className="text-destructive hover:text-destructive">Log Out</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}