import { validateRequest } from "@/auth";
import db from "@/lip/db";
import { LikeInfo } from "@/lip/types";

export async function GET(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized." }, { status: 401 });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ error: "Post not found." }, { status: 404 });

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server Error." }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized." }, { status: 401 });

    await db.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server Error." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { postId },
  }: {
    params: { postId: string };
  },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized." }, { status: 401 });

    await db.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server Error." }, { status: 500 });
  }
}
