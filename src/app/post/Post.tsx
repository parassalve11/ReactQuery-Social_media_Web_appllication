"use client";


import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lip/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import Link from "next/link";
import { memo, useMemo, useRef, useState } from "react";
import "./style.css";
import PostMoreButton from "./PostMoreButton";
import UserToolTip from "@/components/UserToolTip";
import UserAvatar from "@/components/UserAvatar";
import Linkify from "@/components/Linkifiy"; 
import LikeButton from "./LIkeButton"; 
import BookmarkButton from "./BookmarkButton";

interface PostProps {
  post: PostData;
}

const Post = memo(function Post({ post }: PostProps) {
  const { user } = useSession();
  const isOwnPost = useMemo(() => post.user.id === user.id, [post.user.id, user.id]);

  return (
    <article className="group/post rounded-lg  border border-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} className="w-10 h-10" />
            </Link>
          </UserToolTip>
          <div className=" flex flex-col ">
            <UserToolTip user={post.user}>
              <Link href={`/users/${post.user.username}`} className="font-semibold text-gray-900 hover:underline">
                {post.user.displayName}
                {/* <h2 className="text-muted-foreground text-xs">@{post.user.displayName}</h2> */}
              </Link>
            </UserToolTip>
            <Link
              href={`/posts/${post.id}`}
              className="text-xs text-gray-500 hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {isOwnPost && (
          <PostMoreButton
            post={post}
            className="opacity-0 group-hover/post:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
          />
        )}
      </header>

      <Linkify>
        <p className="text-gray-800 text-sm whitespace-pre-wrap break-words mb-3">{post.content}</p>
      </Linkify>

      {post.attachments.length > 0 && <MediaPreviews attachments={post.attachments} />}

      <footer className="flex items-center gap-4 mt-3">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => user.id === like.userId),
          }}
          className="text-gray-500 hover:text-red-500 transition-colors"
        />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some((bookmark) => bookmark.userId === user.id),
          }}
          className="text-gray-500 hover:text-blue-500 transition-colors"
        />
      </footer>
    </article>
  );
});

interface MediaPreviewsProps {
  attachments: Media[];
}

interface MediaItem {
  type: string;
  url: string;
}

const MediaPreviews = memo(function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const mediaItems = useMemo(() => attachments.map((m) => ({ type: m.type, url: m.url })), [attachments]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleNext = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) currentVideo.pause();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) currentVideo.pause();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="relative w-full max-w-[600px] mx-auto mb-3">
      <div className="relative overflow-hidden rounded-lg bg-black">
        {currentMedia.type === "VIDEO" ? (
          <video
            ref={(el:any) => (videoRefs.current[currentIndex] = el) || null}
            src={currentMedia.url}
            controls
            preload="metadata"
            className="w-full max-h-[500px] object-contain bg-black"
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Post media"
            className="w-full max-h-[500px] object-contain bg-gray-100"
          />
        )}
      </div>

      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full hover:bg-gray-900 transition-all"
            aria-label="Previous media"
          >
            ◄
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full hover:bg-gray-900 transition-all"
            aria-label="Next media"
          >
            ►
          </button>
          <nav className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  currentIndex === index ? "bg-white" : "bg-gray-400 hover:bg-gray-300"
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to media ${index + 1}`}
              />
            ))}
          </nav>
        </>
      )}
    </div>
  );
});

export default Post;