"use client"

import { useState } from "react"
import {
  useIncidentDetail,
  useAddIncidentComment,
  useUpdateIncident,
} from "@/lib/queries/incidents"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function IncidentDetail({ id }: { id: string }) {
  const router = useRouter()
  const { data, isLoading } = useIncidentDetail(id)
  const addComment = useAddIncidentComment()
  const update = useUpdateIncident()

  const [role, setRole] = useState<"ADMIN" | "DRIVER" | "FLEET_MANAGER">(
    "DRIVER"
  )

  if (isLoading) return <div className="p-4">Loading…</div>
  const inc = data

  async function onComment(formData: FormData) {
    await addComment.mutateAsync({
      id,
      comment: String(formData.get("message") || ""),
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Select Your Role:</label>
            <Select
              value={role}
              onValueChange={(val: any) => setRole(val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
                <SelectItem value="FLEET_MANAGER">Fleet Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "ADMIN" && (
            <Button
              onClick={() => router.push("/fleetmanager/incidents/stats")}
            >
              Go to Stats
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{inc.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">{inc.type}</span> •{" "}
            {inc.severity} • {inc.status}
          </div>
          <div className="text-foreground">{inc.description}</div>
          <div>
            Occurred:{" "}
            <span className="font-medium text-foreground">
              {new Date(inc.occurredAt).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {inc.images?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {inc.images.map((url: string) => (
                <img
                  key={url}
                  src={url}
                  alt="Incident image"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No images available.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          {role === "ADMIN" ? (
            <Select
              defaultValue={inc.status}
              onValueChange={(val) =>
                update.mutate({
                  id,
                  data: { status: val },
                })
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "PENDING",
                  "IN_PROGRESS",
                  "RESOLVED",
                  "CLOSED",
                  "CANCELLED",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm">
              Current Status:{" "}
              <span className="font-medium text-foreground">
                {inc.status}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Updates / Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-2">
            {inc.updates?.map((u: any) => (
              <li key={u.id} className="text-sm">
                <span className="text-muted-foreground">
                  {new Date(u.createdAt).toLocaleString()} —{" "}
                </span>
                {u.message}
              </li>
            ))}
          </ol>

          {role === "ADMIN" && (
            <form action={onComment} className="flex gap-2">
              <Input
                name="message"
                placeholder="Add a comment"
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
