import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { queryKeys } from "../query-keys";

//fetch all users

export const fetchUsers = async()=>{
    const {data} = await apiClient.get('/users');
    return data;
}

//hook:list of users

export const useUsers = ()=>{
   return useQuery({
        queryKey:queryKeys.users.list(),
        queryFn:fetchUsers,
        staleTime:120_000,
        placeholderData:(prev)=>prev
    });
}