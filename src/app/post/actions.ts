'use server'

import { validateRequest } from "@/auth"
import db from "@/lip/db";
import { getPostDataInclude } from "@/lip/types";


export default async function deletePost(id:string){

    const{user} = await validateRequest();

    if(!user) throw new Error('Unauthorized.');

    const post = await db.post.findUnique({
        where:{id}
    });

    if(!post) throw new Error('Post is not exisit.');

    if(post.userId !== user.id) throw new Error('Unauthorized.');

     const deletePost = await db.post.delete({
        where:{id},
        include:getPostDataInclude(user.id),
    });

    return deletePost;
}