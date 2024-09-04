'use client'
import useFollowerInfo from "@/hooks/userFollowerInfo";
import { formatNumber } from "@/lib/utils";
import { FollowerInfo } from "@/lip/types";
import { format } from "date-fns";


interface FollowerCountProps{
userId:string;
initialState:FollowerInfo
}

export default function FollowerCount({userId , initialState}:FollowerCountProps){
const {data} = useFollowerInfo(userId , initialState);
return(
    <span className="font-serif">
        Followers : {''}
        <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
)
}