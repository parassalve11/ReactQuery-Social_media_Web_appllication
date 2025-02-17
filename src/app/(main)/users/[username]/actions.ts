"use server";

import { validateRequest } from "@/auth";
import db from "@/lip/db";
import { getUserDataSelector } from "@/lip/types";
import {
  upadateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lip/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized.");

  const data = upadateUserProfileSchema.parse(values);

  const updatedProfile = await db.user.update({
    where: {
      id: user.id,
    },
    data: data,
    select: getUserDataSelector(user.id),
  });

  return updatedProfile;
}
