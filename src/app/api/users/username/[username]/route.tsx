import { validateRequest } from "@/auth";
import db from "@/lip/db";
import { getUserDataSelector } from "@/lip/types";

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelector(loggedInUser.id),
    });

    if (!user)
      return Response.json({ error: "User not found." }, { status: 404 });

    return Response.json(user);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server Error." }, { status: 500 });
  }
}
