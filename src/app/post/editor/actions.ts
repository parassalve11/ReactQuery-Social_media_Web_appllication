"use server";

import { validateRequest } from "@/auth";
import { getPostDataInclude } from "@/lip/types"; 
import db from "@/lip/db";
import { createPost } from "@/lip/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPost.parse(input);

  const newPost = await db.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}