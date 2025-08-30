"use client";

import {
  useIncidentDetail,
  useAddIncidentComment,
  useUpdateIncident,
} from "@/lib/queries/incidents";


export default function IncidentDetail({ id }: { id: string }) {
  const { data, isLoading } = useIncidentDetail(id);
  const addComment = useAddIncidentComment();
  const update = useUpdateIncident();
  if (isLoading) return <div className="p-4">Loading…</div>;
  const inc = data;
  async function onComment(formData: FormData) {
    await addComment.mutateAsync({
      id,
      comment: String(formData.get("message") || ""),
    });
  }
  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <div className="text-2xl font-semibold">{inc.title}</div>
        <div className="text-sm text-gray-600">
          {inc.type} • {inc.severity} •{inc.status}
        </div>
        <div className="mt-2">{inc.description}</div>
        <div className="text-sm text-gray-600 mt-2">
          Occurred: {new Date(inc.occurredAt).toLocaleString()}
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Images</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {inc.images?.map((url: string) => (
            <img
              key={url}
              src={url}
              alt=""
              className="w-full h-28 object-cover rounded"
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Workflow</div>
        <div className="flex gap-2 items-center">
          <select
            defaultValue={inc.status}
            onChange={(e) =>
              update.mutate({
                id,
                data: { status: e.target.value },
              })
            }
            className="border rounded px-2py-1">
            {["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Updates</div>
        <ol className="space-y-2">
          {inc.updates?.map((u: any) => (
            <li key={u.id} className="text-sm">
              <span className="text-gray-500">
                {new Date(u.createdAt).toLocaleString()} —{" "}
              </span>
              <span className="font-medium">{u.user?.name ?? "User"}:</span>
              {u.message}
            </li>
          ))}
        </ol>
        <form action={onComment} className="mt-3 flex gap-2">
          <input
            name="message"
            className="border rounded px-3 py-2 flex-1"
            placeholder="Add a comment"
          />
          <button className="px-3 py-2 rounded bg-black text-white">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
