'use server'

import { validateRequest } from "@/auth"
import db from "@/lip/db";
import { getPostDataInclude } from "@/lip/types";
import { createPost } from "@/lip/validation";

export default async function SubmitPost(input:string){
    const{user} = await validateRequest();

    if(!user) throw new Error('Unauthorized.');

    const{content} = createPost.parse({content:input});

    const newPost =  await db.post.create({
        data:{
            content,
            userId:user.id,
        },
        include:getPostDataInclude(user.id),
    })
    return newPost;
}