import { Button } from "@/components/ui/button"
import { Bell, Bookmark, Home, MessageCircle } from "lucide-react"
import Link from "next/link"

interface MenubarProps{
    className?:string
}

export default function Menubar({className}:MenubarProps){
return(
    <div className={className}>
        <Button
        title="Home"
        variant={'ghost'}
        className="flex items-center justify-start gap-3"
        asChild
        >
            <Link href={'/'}>
            <Home />
            <span className="hidden lg:inline">Home</span>
            </Link>
        </Button>

        <Button
        title="Notifications"
        variant={'ghost'}
        className="flex justify-start items-center gap-3"
        asChild
        >
            <Link href={'/notifications'}>
            <Bell />
            <span className="hidden lg:inline">Notifications</span>
            </Link>
        </Button>

        <Button
        title="Messages"
        variant={'ghost'}
        className="flex items-center justify-start gap-3"
        asChild
        >
            <Link href={'/messages'}>
            <MessageCircle />
            <span  className="hidden lg:inline">Messages</span>
            </Link>
        </Button>

        <Button
        title="Bookmarks"
        variant={'ghost'}
        className="flex items-center justify-start gap-3"
        asChild
        >
            <Link href={'/bookmarks'}>
            <Bookmark />
            <span  className="hidden lg:inline">BookMark</span>
            </Link>
        </Button>
    </div>
)
}