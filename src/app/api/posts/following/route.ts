import { validateRequest } from "@/auth";
import db from "@/lip/db";
import { getPostDataInclude, PostsPage } from "@/lip/types";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest){
    try {
        const cursor = req.nextUrl.searchParams.get('cursor') || undefined
        const {user} = await validateRequest();
        if(!user){
            return Response.json({error:"Unauthorized."},{status:401})
        }
        const pageSize =10;

        const posts = await db.post.findMany({
            where:{
                user:{
                    followers:{
                        some:{
                            followerId:user?.id
                        }
                    }
                }
            },
            orderBy:{createdAt:'desc'},
            take:pageSize + 1,
            cursor:cursor?{id:cursor} :undefined,
            include:getPostDataInclude(user.id)
        });

        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

        const data:PostsPage ={
            posts:posts.slice(0,pageSize),
            nextCursor
        }

        return Response.json(data);

    } catch (error) {
        console.log(error);
        return Response.json({error:'Internal Server error.'},{status:500})
    }
} 