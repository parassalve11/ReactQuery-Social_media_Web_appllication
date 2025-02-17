import { validateRequest } from "@/auth";
import db from "@/lip/db";
import { getPostDataInclude, PostsPage } from "@/lip/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || null;
    const { user } = await validateRequest();
    const pageSize = 10;
    if (!user)
      return Response.json({ error: "Unauthorized." }, { status: 401 });

    const bookmark = await db.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmark.length > pageSize ? bookmark[pageSize].id : null;
    const data: PostsPage = {
      posts: bookmark.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data); 
  } catch (error) {
    console.log(error);
    return Response.json({ error: "INternal server error." }, { status: 500 });
  }
}
