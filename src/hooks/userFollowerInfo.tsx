import kyInstance from "@/lip/ky";
import { FollowerInfo } from "@/lip/types";
import { useQuery } from "@tanstack/react-query";



export default  function useFollowerInfo(
    userId:string,
    intialState:FollowerInfo,
){
 const query = useQuery({
    queryKey:['follower-info', userId],
    queryFn:() => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData:intialState,
    staleTime:Infinity
 });
 return query;
}