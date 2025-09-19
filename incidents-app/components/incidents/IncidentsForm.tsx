"use client"

import { useState } from "react"
import { useCreateIncident } from "@/lib/queries/incidents"
import { uploadImages } from "@/lib/cloudinary"
import { useUsers } from "@/lib/queries/users"
import { useCars } from "@/lib/queries/cars"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {Card,CardContent,CardHeader} from "@/components/ui/card"

interface Car {
  id: number
  regNumber: string
}

interface User {
  id: number
  name: string
  role: string
}

export default function IncidentForm() {
  const { data: users = [] } = useUsers()
  const { data: cars = [] } = useCars()
  const { mutateAsync, isPending } = useCreateIncident()

  const [images, setImages] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload: any = Object.fromEntries(formData.entries())

    // ---- Validation ----
    const newErrors: string[] = []

    if (!payload.title || payload.title.trim().length < 3)
      newErrors.push("Title is required (min 3 chars).")

    if (!payload.type)
      newErrors.push("Incident type is required.")

    if (!payload.severity)
      newErrors.push("Severity is required.")

    if (!payload.description || payload.description.trim().length < 5)
      newErrors.push("Description is required (min 5 chars).")

    if (!payload.occurredAt)
      newErrors.push("Occurred date/time is required.")

    if (!payload.carId)
      newErrors.push("Car must be selected.")

    if (!payload.reportedById)
      newErrors.push("Reporter must be selected.")

    if (!images.length)
      newErrors.push("At least one image is required.")

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])

    // ---- Transform payload ----
    payload.carId = Number(payload.carId)
    payload.reportedById = Number(payload.reportedById)
    payload.assignedToId =
      payload.assignedToId && payload.assignedToId !== "UNASSIGNED"
        ? Number(payload.assignedToId)
        : null
    payload.status = "PENDING"
    payload.occurredAt = new Date(payload.occurredAt as string).toISOString()

    if (images.length) {
      const urls = await uploadImages(images)
      payload.images = urls
    }

    console.log("Final Payload:", payload)

    await mutateAsync(payload)
    window.location.href = "/fleetmanager/incidents"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          {/* <CardTitle>Create Incident</CardTitle> */}
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input name="title" placeholder="Title" />

          <Select name="type">
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {[
                "ACCIDENT",
                "BREAKDOWN",
                "THEFT",
                "VANDALISM",
                "MAINTENANCE_ISSUE",
                "TRAFFIC_VIOLATION",
                "FUEL_ISSUE",
              ].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select name="severity">
            <SelectTrigger>
              <SelectValue placeholder="Select Severity" />
            </SelectTrigger>
            <SelectContent>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="datetime-local" name="occurredAt" />

          <Textarea
            name="description"
            placeholder="Description"
            className="md:col-span-2"
          />
          <Select name="carId">
            <SelectTrigger>
              <SelectValue placeholder="Select Car" />
            </SelectTrigger>
            <SelectContent>
              {cars.map((c: Car) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.regNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="reportedById">
            <SelectTrigger>
              <SelectValue placeholder="Reported By" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u: User) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="assignedToId">
            <SelectTrigger>
              <SelectValue placeholder="Assign To" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="UNASSIGNED">Unassigned</SelectItem> */}
              {users.filter((u: User) => u.role !== "DRIVER").map((u: User) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input name="location" placeholder="Location (optional)" className="md:col-span-2" />
          <div className="md:col-span-2">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create Incident"}
      </Button>
    </form>
  )
}
