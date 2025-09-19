// "use client"

// import { useUpdateIncident } from "@/lib/queries/incidents"


// const Dropdown = ({defaultValue,values,incidentId}) => {
//     const update = useUpdateIncident();

//   return (
//     <div>
//         <select defaultValue={defaultValue} onChange={(e)=>update.mutate({id:incidentId,data:{status:e.target.value}})}>
//             <option>{defaultValue}</option>
//             {values.map((s:any)=>(
//                 <option>
//                     {s}
//                 </option>
//             ))}
//         </select>

//     </div>
//   )
// }

// export default Dropdown