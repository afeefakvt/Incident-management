export const queryKeys = {
  incidents: {
    root: ["incidents"] as const,
    lists: () => [["incidents", "list"]] as const,
    list: (filters: Record<string, unknown>) =>
      [["incidents", "list", filters]] as const,
    detail: (id: string) => [["incidents", "detail", id]] as const,
    stats: () => [["incidents", "stats"]] as const,
  },
};
