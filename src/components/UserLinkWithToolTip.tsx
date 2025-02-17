import kyInstance from "@/lip/ky";
import { UserData } from "@/lip/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserToolTip from "./UserToolTip";

interface UserLinkWithToolTipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithToolTip({
  children,
  username,
}: UserLinkWithToolTipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link href={`/users/${username}`}>
        <p className="font-bold text-primary hover:underline">{children}</p>
      </Link>
    );
  }
  return (
    <UserToolTip user={data}>
      <Link href={`/users/${username}`}>
        <p className="font-bold text-primary hover:underline">{children}</p>
      </Link>
    </UserToolTip>
  );
}
