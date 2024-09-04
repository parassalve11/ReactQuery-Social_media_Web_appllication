import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import Menubar from "./Menubar";



export default async function Layout({children}:{children:ReactNode}){
    const session = await validateRequest();

    if(!session?.user){
        return redirect('/login');
    };

    return(
        <SessionProvider value={session}>
            <>
            <div className="h-screen flex flex-col">
                <Navbar />
                <div className="max-w-7xl mx-auto flex w-full grow gap-5 p-5">
                    <Menubar className="sticky top-[5.25rem] hidden sm:block h-fit flex-none space-y-3 px-3 py-5 lg:px-5 shadow-sm rounded-2xl bg-card xl:w-80" />
                    {children}
                </div>
                <Menubar className="sm:hidden sticky  flex justify-center bottom-0 border-t  gap-x-8  bg-card p-3 " />
            </div>
            </>
        </SessionProvider>
    )
}