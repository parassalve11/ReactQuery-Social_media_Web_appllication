"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lip/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./style.css";

// import MuiImageSlider from 'mui-image-slider';
import PostMoreButton from "./PostMoreButton";
import UserToolTip from "@/components/UserToolTip";
import UserAvatar from "@/components/UserAvatar";
import Linkify from "@/components/Linkifiy";
import LikeButton from "./LIkeButton";
import BookmarkButton from "./BookmarkButton";
// import SimpleImageSlider from "react-simple-image-slider";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>
          <div>
            <UserToolTip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />

      <div className="flex items-center gap-5">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => user.id === like.userId),
          }}
        />

        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const mediaItems = attachments.map((m) => ({
    type: m.type,
    url: m.url,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]); // Store refs for all videos
  const videoStates = useRef(
    mediaItems.map(() => ({ currentTime: 0, isPlaying: false })),
  ); // Store playback state for each video

  const handleNext = () => {
    saveVideoState(currentIndex); // Save current video state
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    saveVideoState(currentIndex); // Save current video state
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1,
    );
  };

  const saveVideoState = (index: number) => {
    const currentVideo = videoRefs.current[index];
    if (currentVideo) {
      videoStates.current[index] = {
        currentTime: currentVideo.currentTime, // Save the current playback time
        isPlaying: !currentVideo.paused, // Save if the video is playing
      };
      currentVideo.pause(); // Pause the video when navigating away
    }
  };

  const restoreVideoState = (index: number) => {
    const currentVideo = videoRefs.current[index];
    const videoState = videoStates.current[index];
    if (currentVideo) {
      currentVideo.currentTime = videoState.currentTime; // Restore playback time
      if (videoState.isPlaying) {
        currentVideo.play(); // Resume playback if it was playing
      }
    }
  };

  useEffect(() => {
    restoreVideoState(currentIndex); // Restore state for the current video
  }, [currentIndex]);

  const currentMedia = mediaItems[currentIndex];

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[800px] overflow-hidden rounded-3xl"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Blurred Background */}
      {currentMedia && (
        <div
          className="blur-background absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentMedia.url})`,
          }}
        ></div>
      )}

      {/* Render Images or Videos */}
      {currentMedia.type === "VIDEO" ? (
        <video
          ref={(el) => {
            if (el) videoRefs.current[currentIndex] = el;
          }}
          key={currentMedia.url} // Ensure the video element is re-rendered correctly
          src={currentMedia.url}
          controls
          preload="auto"
          className="media-video z-10"
        />
      ) : (
        <img src={currentMedia.url} alt="Media" className="media-image z-10" />
      )}

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
      >
        Next
      </button>

      {/* Bullet Indicators */}
      <div className="absolute bottom-4 z-20 flex space-x-2">
        {mediaItems.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-500"
            } cursor-pointer`}
            onClick={() => {
              saveVideoState(currentIndex); // Save state before switching
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
