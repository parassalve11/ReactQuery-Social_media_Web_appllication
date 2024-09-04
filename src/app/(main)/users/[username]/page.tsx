import { validateRequest } from "@/auth"
import FollowButton from "@/components/FollowButton"
import FollowerCount from "@/components/FollowerCount"
import TrendsSidebar from "@/components/TrendsSidebar"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import db from "@/lip/db"
import { FollowerInfo, getUserDataSelector, UserData } from "@/lip/types"
import format from "date-fns/format"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import UserPosts from "./UserPost"



interface PageProps{
    params : {username :string}
}

const getUser = cache(async(username:string , loggedInUserId:string) =>{
    const user  = await db.user.findFirst({
        where:{
            username:{
                equals:username,
                mode:'insensitive'
            }
        },

        select:getUserDataSelector(loggedInUserId)
    });

    if(!user) notFound();

    return user;
})

export async function generateMetadata({
    params: { username },
  }: PageProps): Promise<Metadata>{
const{user:loggedInUser} = await validateRequest();

if(!loggedInUser) return {}

const user = await getUser(username , loggedInUser.id)

    return{
        title:`${user?.displayName} (@${user?.username})`
    }
}

export default async function Page({params:{username}}:PageProps){
const{user:loggedInUser} = await validateRequest();

if(!loggedInUser){
    return<>
    <p className="text-destructive">You&apos;re not authorized to veiw this Page👽.</p>
    </>
}

const user = await getUser(username, loggedInUser.id);

return <main className="flex w-full min-w-0 gap-5">
<div className="w-full min-w-0 space-y-5">
 <UserProfile user={user} loggedInUserId={loggedInUser.id} />
 
 <UserPosts userId={user.id} /> 
</div>
<TrendsSidebar />
</main>
}


interface UserProfileProps{
    user:UserData,
    loggedInUserId:string,
}

export async function UserProfile({user , loggedInUserId}:UserProfileProps){
const followerInfo : FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
        ({followerId})  => followerId === loggedInUserId
    )
};

return(
    <div className="w-full h-fit p-5 rounded-2xl shadow-sm bg-card">
        <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto max-h-60 max-w-60 rounded-full size-full"
        />
        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="me-auto space-y-3">
                <div>
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <div className="text-foreground">@{user.username}</div>
                </div>
                <div>Member since {format(user.createdAt ,'d MMM, yyy')}</div>
                <div className="flex items-center gap-3 ">
                    <span className="font-serif">
                        Posts : {''}
                        <span className="font-semibold">{user._count.posts}</span>
                    </span>
                    <FollowerCount userId={user.id} initialState={followerInfo} />
                </div>
            </div>
               {user.id === loggedInUserId? (
                <Button>Edit Button</Button>
               ):(
                <FollowButton userId={user.id} intialState={followerInfo} />
               )}
        </div>
        {user.bio &&
        <>
        <hr />
        <p className="whitespace-pre-line break-words overflow-hidden">{user.bio}</p>
        </>
        }
    </div>
)
}