export const queryKeys = {
  incidents: {
    root: ["incidents"] as const,
    lists: () => [["incidents", "list"]] as const,
    list: (filters: Record<string, unknown>) =>
      [["incidents", "list", filters]] as const,
    detail: (id: string) => [["incidents", "detail", id]] as const,
    stats: () => [["incidents", "stats"]] as const,
  },

  users:{
    list:()=>["users"],
    lists:()=>["users"],
    detail:(id:string) => ['user',id]
  },

  cars:{
    list:()=>["cars"],
    lists:()=>["cars"],
    detail:(id:string)=>["car",id]
  },

  notifications:{
    lists:()=>["notifications" as const],
    list:(role:string)=> ["notifications" as const],
  },

  comments:{
    list:(incidentId:number)=> ["comments", "list", incidentId] as const
  }
};

