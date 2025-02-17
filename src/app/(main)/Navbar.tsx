'use client'

import SearchFiled from "@/components/SearchFiled"
import UserButton from "@/components/UserButton"


export default function Navbar(){
    return(
        <nav className="sticky top-0 z-20 bg-card shadow-md">
            <div className="flex flex-wrap max-w-7xl m-auto items-center justify-center px-5 py-3 gap-x-5  ">
                <h1 className="text-primary text-2xl font-semibold">MetroSphare</h1>
                <SearchFiled />
                <UserButton className="sm:ms-auto" />
            </div>
        </nav>
    )
}

