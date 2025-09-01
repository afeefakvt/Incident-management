"use client";

import { useState } from "react";
import { useCreateIncident } from "@/lib/queries/incidents";
import { uploadImages } from "@/lib/cloudinary";
import { useUsers } from "@/lib/queries/users";
import { useCars } from "@/lib/queries/cars";

interface Car {
  id: number;
  regNumber: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export default function IncidentForm() {
  const { data: users = [] } = useUsers();
  const { data: cars = [] } = useCars();
  const { mutateAsync, isPending } = useCreateIncident();

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function onSubmit(formData: FormData) {
    const payload: any = Object.fromEntries(formData.entries());
    payload.carId = Number(payload.carId);
    payload.reportedById = Number(payload.reportedById);
    payload.assignedToId = payload.assignedToId
      ? Number(payload.assignedToId)
      : null;
    payload.severity = String(payload.severity);
    payload.status = "PENDING";
    payload.type = String(payload.type);
    payload.occurredAt = new Date(payload.occurredAt + ":00").toISOString();

    if (images.length) {
      const urls = await uploadImages(images);
      payload.images = urls;
    }

    await mutateAsync(payload);
    window.location.href = "/fleetmanager/incidents";
  }

  function validateStep(form: HTMLFormElement): boolean {
    const newErrors: string[] = [];

    if (step === 1) {
      const title = (form.elements.namedItem("title") as HTMLInputElement | null)?.value || "";
      const type = (form.elements.namedItem("type") as HTMLSelectElement | null)?.value || "";
      const description = (form.elements.namedItem("description") as HTMLTextAreaElement | null)?.value || "";
      const occurredAt = (form.elements.namedItem("occurredAt") as HTMLInputElement | null)?.value || "";

      if (!title.trim()) {
        newErrors.push("Title is required.");
      } else if (title.trim().length <= 3) {
        newErrors.push("Title must be longer than 3 characters.");
      }      

      if (!type) newErrors.push("Type is required.");

      if (description.trim()) {
        if (description.trim().length <= 5) {
          newErrors.push("Description must be longer than 5 characters.");
        }
      }

      if (!occurredAt) newErrors.push("Occurred date/time is required.");
    }

    if (step === 2) {
      if (!form.carId.value) newErrors.push("Car must be selected.");
      if (!form.reportedById.value) newErrors.push("Reported By is required.");
    }

    if (step === 3) {
      if (!images.length) newErrors.push("At least one image must be uploaded.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  function handleNext(form: HTMLFormElement) {
    if (validateStep(form)) {
      setStep((s) => s + 1);
    }
  }

  async function handleFinalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (validateStep(form)) {
      const formData = new FormData(form);
      await onSubmit(formData);
    }
  }

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-4">
      {/* Error Box */}
      {errors.length > 0 && (
        <div className="text-red-700  p-3">
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1: Basics */}
      <div className={step === 1 ? "grid md:grid-cols-2 gap-4" : "hidden"}>
        <input
          name="title"
          placeholder="Title"
          className="border rounded px-3 py-2"
        />

        <select name="type" className="border rounded px-3 py-2">
          <option value="">Select Type</option>
          {[
            "ACCIDENT",
            "BREAKDOWN",
            "THEFT",
            "VANDALISM",
            "MAINTENANCE_ISSUE",
            "TRAFFIC_VIOLATION",
            "FUEL_ISSUE",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          className="border rounded px-3 py-2 md:col-span-2"
        />

        <select name="severity" className="border rounded px-3 py-2">
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          name="occurredAt"
          type="datetime-local"
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Step 2: Associations */}
      <div className={step === 2 ? "grid md:grid-cols-2 gap-4" : "hidden"}>
        <select name="carId" className="border rounded px-3 py-2">
          <option value="">Select Car</option>
          {cars.map((c: Car) => (
            <option key={c.id} value={c.id}>
              {c.regNumber}
            </option>
          ))}
        </select>

        <select name="reportedById" className="border rounded px-3 py-2">
          <option value="">Select Your Name</option>
          {users.map((u: User) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select name="assignedToId" className="border rounded px-3 py-2">
          <option value="">Unassigned</option>
          {users
            .filter((u: User) => u.role !== "DRIVER")
            .map((u: User) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>

        <input
          name="location"
          placeholder="Location (optional)"
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Step 3: Uploads */}
      <div className={step === 3 ? "space-y-2" : "hidden"}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
      </div>

      {/* Stepper Controls */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="px-3 py-2 rounded border"
        >
          Back
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() =>
              handleNext(document.querySelector("form") as HTMLFormElement)
            }
            className="px-3 py-2 rounded bg-black text-white"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 rounded bg-green-600 text-white"
          >
            {isPending ? "Creating…" : "Create Incident"}
          </button>
        )}
      </div>
    </form>
  );
}
