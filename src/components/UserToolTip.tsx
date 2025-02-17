'use client'
import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lip/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkifiy";

interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserToolTip({ children, user }: UserToolTipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words  px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} intialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <p className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="text-sm text-muted-foreground hover:underline">
                  @{user.username}
                </p>
              </Link>
            </div>
            <Linkify>
              {user.bio && (
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              )}
            </Linkify>
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
