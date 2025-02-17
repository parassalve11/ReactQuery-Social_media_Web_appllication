import db from "@/lip/db";
import { getPostDataInclude, UserData } from "@/lip/types";
import { cache, Suspense } from "react";

import { validateRequest } from "@/auth";
import { notFound } from "next/navigation";
import Post from "@/app/post/Post";
import Link from "next/link";
import UserToolTip from "@/components/UserToolTip";
import UserAvatar from "@/components/UserAvatar";
import { Loader2 } from "lucide-react";
import Linkify from "@/components/Linkifiy";
import FollowButton from "@/components/FollowButton";

interface PageProps {
  params: { postId: string };
}

export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) return notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}:${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this Page.
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

export async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) return null;

  return (
    <div className="space-y-5 z-50 rounded-2xl bg-card p-5 shadow-sm">
      <h1 className="text-xl font-bold">About this user</h1>
      <UserToolTip  user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-words text-base font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-words text-sm text-muted-foreground hover:underline">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      {user.bio && (
        <Linkify>
          <p className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </p>
        </Linkify>
      )}
      {user.id !== loggedInUserId.id && (
        <FollowButton
          userId={user.id}
          intialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUserId.id,
            ),
          }}
        />
      )}
    </div>
  );
}
