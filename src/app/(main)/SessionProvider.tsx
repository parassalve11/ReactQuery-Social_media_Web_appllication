'use client'

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";


interface SessionContext{
    session:Session;
    user:User;
}

const SessionContext = createContext<SessionContext | null>(null)
export default function SessionProvider({
    children,
    value
}:React.PropsWithChildren<{value:SessionContext}>){
return(
    <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>
)

};

export function useSession(){
    const context = useContext(SessionContext);
    if(!context){
        throw new Error('useSession() can not be used without SessionProvider.');
    };3
    return context;
}