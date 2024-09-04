
import PostEditor from "../post/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";



export default function Home() {
 
  return (
    <main className="w-full flex min-w-0 gap-x-5">
    <span className="w-full min-w-0 space-y-5">
      <PostEditor />
     <Tabs defaultValue="for-you">
      <TabsList>
        <TabsTrigger value="for-you">For You</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="for-you">
        <ForYouFeed />
      </TabsContent>
      <TabsContent value="following">
        <FollowingFeed />
      </TabsContent>
     </Tabs>
    </span>
    <TrendsSidebar />
    </main>
  );
}
