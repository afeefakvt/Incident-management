import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { queryKeys } from "../query-keys";

export const fetchNotifications = async()=>{
    const {data} = await apiClient.get(`/notifications`)
    return data
}

export const useNotifications = ()=>{
    return useQuery({
        queryKey:queryKeys.notifications.lists(),
        queryFn:()=>fetchNotifications(),
        staleTime:30_000,
        refetchInterval:30_000 //auto poll every 30s
    })
}

export const useCreateNotification = ()=>{
    const qc = useQueryClient()
    return useMutation({
        mutationFn:(data:{role:string; message:string})=>
            apiClient.post('/notifications',data),
        onSuccess:()=>{
            qc.invalidateQueries({queryKey:queryKeys.notifications.lists()})
        }
    })
}

export const useMarkNotificationRead = ()=>{
    const qc = useQueryClient()
    return useMutation({
        mutationFn:(id:number)=>apiClient.patch(`/notifications/${id}`),
        onSuccess:()=>{
            qc.invalidateQueries({queryKey:queryKeys.notifications.lists()})
        }
    })
}