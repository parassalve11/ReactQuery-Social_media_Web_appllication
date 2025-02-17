import { validateRequest } from "@/auth"
import db from "@/lip/db";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelector } from "@/lip/types";
import UserToolTip from "./UserToolTip";




export default function TrendsSidebar(){
    return(
        <div className="sticky top-[5.25rem] flex-none space-y-5 h-fit hidden md:block  lg:w-80 w-72">
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                <WhoToFollow />
                <TrendingTopics />
            </Suspense>
        </div>
    )
}



async function WhoToFollow(){
    const{user} = await validateRequest();
    if(!user) return null;
    //await new Promise(r => setTimeout(r,10000));
    const userToFollow = await db.user.findMany({
        where:{
            NOT:{
                id:user.id,
            },
            followers:{
                none:{
                    followerId:user.id
                }
            }
        },
        select:getUserDataSelector(user.id),
        take:4
    });

    return(
        <div className="rounded-2xl space-y-5 p-5 bg-card shadow-sm">
            <h1 className="text-xl font-bold">Who to Follow</h1>
            {userToFollow.map((user) =>(
               <div key={user.id} className="flex items-center justify-between gap-3 ">
               <UserToolTip user={user}>
               <Link href={`/users/${user.username}`} >
                <div className="flex items-center justify-center gap-3">
                    <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                   <div>
                   <p className="line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</p>
                   <p className="line-clamp-1 break-all font-semibold text-muted-foreground text-xs">@{user.username}</p>
                   </div>
                </div>
                </Link>
               </UserToolTip>
               <FollowButton 
               userId={user.id}
               intialState={{
                followers:user._count.followers,
                isFollowedByUser: user.followers.some(
                    ({followerId}) => followerId === user.id 
                ),
               }
               }
               />
               </div>
            ))}
        </div>
    )

}

const getTrendingTopics = unstable_cache(
    async () => {
      const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;
  
      return result.map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }));
    },
    ["trending_topics"],
    {
      revalidate: 3 * 60 * 60,
    },
  );
  

  async function TrendingTopics(){
    const trendingTopics = await getTrendingTopics();

    return <div className='space-y-5 p-5 shadow-sm bg-card rounded-2xl  '>
        <h1 className="text-2xl font-bold">trending_topics</h1>
        {trendingTopics.map(({hashtag,count}) =>{
            const title = hashtag.split('#')[1];
            return <Link key={title} href={`/hashtag/${title}`} className="block ">
                <p className="line-clamp-1 break-all font-semibold hover:underline" title={hashtag}>
                    {hashtag}
                </p>
                <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? 'post' : 'posts'}
                </p>
            </Link>
        })}
    </div>
  }