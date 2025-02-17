import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
export const SignUpForm = z.object({
  email: requiredString.email("Invalid Email Address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "only letter,number & _ ,- can be used!",
  ),
  password: requiredString.min(8, "minimum 8 Charecter are Required!"),
});

export type SignUpValues = z.infer<typeof SignUpForm>;

export const LoginFrom = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof LoginFrom>;

export const createPost = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Maximum 5 attactments can be slected."),
});

export const upadateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "reached to the 1000 charecter limit."),
});

export type UpdateUserProfileValues = z.infer<typeof upadateUserProfileSchema>;
