'use client'
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";



export default function SearchFiled(){
    const router = useRouter();

    function handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget;
        const q = (form.q as HTMLInputElement).value.trim();
        if(!q) return;
        router.push(`search?q=${encodeURIComponent(q)}`);
    };

    return(
        <form onSubmit={handleSubmit} action={'/search'}>
            <div className="relative">
                <Input type="text" placeholder="Search..." className="pe-32"/>
                <Search className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground" />
            </div>
        </form>
    )
}