        import { Metadata } from "next";
import LoginImage from '@/assets/login-image.jpg'
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata:Metadata={
    title:'Login'
}

export default async function page(){
    return(
     <main className="h-screen flex items-center justify-center p-5">
        <div className="flex h-full w-full max-h-[40rem] max-w-[64rem] overflow-hidden bg-card shadow-2xl">
            <div className="w-full space-y-10 p-10 overflow-y-auto md:1/2">
                <div className="text-center space-y-1">
                        <h1 className="font-bold text-3xl">Login</h1>
                </div>
                <div className="space-y-5">
                    <LoginForm />

                    <Link href={'signup'} className="font-semibold ">
                    Don't have an Account ? <span className="text-[#3B82F6] font-bold">SignUp</span>
                    </Link>
                </div>
            </div>
            <Image 
            src={LoginImage}
            alt=""
            className="w-1/2 object-cover hidden md:block"
            />
        </div>
     </main>
    )
}