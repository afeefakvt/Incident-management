    import { useQuery } from "@tanstack/react-query";
    import { apiClient } from "../api-client";
    import { queryKeys } from "../query-keys";

    //fetch all cars

    export const fetchCars = async()=>{
        const {data} = await apiClient.get('/cars');
        return data
    }

    //hook:list of cars

    export const useCars = ()=>{
        return useQuery({
            queryKey:queryKeys.cars.list(),
            queryFn:fetchCars,
            staleTime:120_000,
            placeholderData:(prev)=>prev,
        });
    }




  