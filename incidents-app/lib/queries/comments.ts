import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api-client"
import { queryKeys } from "../query-keys"


export const fetchComments = async (incidentId: number) =>{
  const {data} = await apiClient.get(`/incidents/${incidentId}/comments`)
  return data;
}


export const useComments = (incidentId: number) =>
  useQuery({
    queryKey: queryKeys.comments.list(incidentId),
    queryFn: () => fetchComments(incidentId),
    enabled: !!incidentId,
})
export const useAddComment = (incidentId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { message: string; userId: number }) => {
      return apiClient.post(`/incidents/${incidentId}/comments`, data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.comments.list(incidentId) })
    },
  })
}
