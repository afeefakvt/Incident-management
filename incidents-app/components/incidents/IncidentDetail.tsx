"use client";

import { useState } from "react";
import {
  useIncidentDetail,
  useAddIncidentComment,
  useUpdateIncident,
} from "@/lib/queries/incidents";
import { useRouter } from "next/navigation";

export default function IncidentDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useIncidentDetail(id);
  const addComment = useAddIncidentComment();
  const update = useUpdateIncident();

  const [role, setRole] = useState<"ADMIN" | "DRIVER" | "FLEET_MANAGER">(
    "DRIVER"
  );

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
      {/* Role selector */}
      <div className="rounded-xl border p-4 bg-gray-50">
        <label className="font-medium mr-2">Select Your Role: </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="ADMIN">Admin</option>
          <option value="DRIVER">Driver</option>
          <option value="FLEET_MANAGER">Fleet Manager</option>
        </select>

        {role === "ADMIN" && (
          <button
            onClick={() => router.push("/fleetmanager/incidents/stats")}
            className="ml-4 px-3 py-2 bg-black text-white rounded cursor-pointer"
          >
            Go to Stats
          </button>
        )}
      </div>

      {/* Incident main info */}
      <div className="rounded-xl border p-4">
        <div className="text-2xl font-semibold">{inc.title}</div>
        <div className="text-sm text-gray-600">
          {inc.type} • {inc.severity} • {inc.status}
        </div>
        <div className="mt-2">{inc.description}</div>
        <div className="text-sm text-gray-600 mt-2">
          Occurred: {new Date(inc.occurredAt).toLocaleString()}
        </div>
      </div>

      {/* Images */}
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

      {/* Workflow - depends on role */}
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Workflow</div>
        {role === "ADMIN" ? (
          <div className="flex gap-2 items-center">
            <select
              defaultValue={inc.status}
              onChange={(e) =>
                update.mutate({
                  id,
                  data: { status: e.target.value },
                })
              }
              className="border rounded px-2 py-1"
            >
              {[
                "PENDING",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED",
                "CANCELLED",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            Current Status:{" "}
            <span className="font-medium text-gray-900">{inc.status}</span>
          </div>
        )}
      </div>

      {/* Updates/comments */}
      <div className="rounded-xl border p-4">
        <div className="font-medium mb-2">Updates</div>
        <ol className="space-y-2">
          {inc.updates?.map((u: any) => (
            <li key={u.id} className="text-sm">
              <span className="text-gray-500">
                {new Date(u.createdAt).toLocaleString()} —{" "}
              </span>
              {u.message}
            </li>
          ))}
        </ol>
        {role === "ADMIN" && (
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
        )}
      </div>
    </div>
  );
}
