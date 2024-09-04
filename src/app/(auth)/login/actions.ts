'use server'
import { lucia } from "@/auth";
import db from "@/lip/db";
import { LoginFrom, LoginValues } from "@/lip/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from 'bcrypt'
export async function Login(
    credentials:LoginValues
):Promise<{error:string}>{
    try {
        const {username , password} = LoginFrom.parse(credentials);

        const existingUser = await db.user.findFirst({
            where:{
                username:{
                    equals:username,
                    mode:'insensitive'
                }
            }
        });

        if(!existingUser || !existingUser?.passwordHash){
            return{
                error:'Incorrect Username '
            }
        };

        const validPassword = await bcrypt.compare(password , existingUser.passwordHash);

        if(!validPassword){
            return{
                error:'Incorrect password '
            }
        }

        const session = await lucia.createSession(existingUser.id,{});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        )

        return redirect('/')
    } catch (error) {
        if(isRedirectError(error)) throw error;
        console.log(error);
        return{
            error:'Somthing went Wrong!'
        }
        
    }

}