import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { apiClient } from "../api-client";

export interface IncidentFilters {
  [key: string]: string | number | undefined;
  status?: string;
  severity?: string;
  carId?: number;
  assignedToId?: number;
  startDate?: string;
  endDate?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface IncidentStats {
  total: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
  avgResolutionTime: number;
  openIncidents: number;
}

//query functions
export const fetchIncidents = async (filters: IncidentFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const endpoint = params.toString() ? `/incidents?${params}` : "/incidents";
  const { data } = await apiClient.get(endpoint);
  return data;
};

export const fetchIncidentDetail = async (id: string) =>
  (await apiClient.get(`/incidents/${id}`)).data;

export const fetchIncidentStats = async () =>
  (await apiClient.get(`/incidents/stats`)).data as IncidentStats;

//custom hooks
export const useIncidents = (filters: IncidentFilters = {}) =>
  useQuery({
    queryKey: queryKeys.incidents.list(filters),
    queryFn: () => fetchIncidents(filters),
    staleTime: 120_000,
    placeholderData: (prev) => prev,
  });

export const useIncidentDetail = (id: string) =>
  useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: () => fetchIncidentDetail(id),
    enabled: !!id,
    staleTime: 60_000,
  });

export const useIncidentStats = () =>
  useQuery({
    queryKey: queryKeys.incidents.stats(),
    queryFn: fetchIncidentStats,
    staleTime: 300_000,
  });


  //mutations
export const useCreateIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiClient.post("/incidents", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};

export const useUpdateIncident = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      apiClient.put(`/incidents/${id}`, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.incidents.detail(vars.id) });
      qc.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};

export const useAddIncidentComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      apiClient.post(`/incidents/${id}/updates`, {
        message: comment,
        updateType: "COMMENT",
      }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: queryKeys.incidents.detail(vars.id),
      });
    },
  });
};
