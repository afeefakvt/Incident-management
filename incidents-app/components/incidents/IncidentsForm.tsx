'use client';


import { useState } from 'react';
import { useCreateIncident } from '@/lib/queries/incidents';
import { uploadImages } from '@/lib/cloudinary';

export default function IncidentForm({ users = [], cars = [] }: { users?: any[]; cars?: any[] }) {
  const { mutateAsync, isPending } = useCreateIncident();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);

  async function onSubmit(formData: FormData) {
    const payload: any = Object.fromEntries(formData.entries());
    payload.carId = Number(payload.carId);
    payload.reportedById = Number(payload.reportedById);
    payload.assignedToId = payload.assignedToId ? Number(payload.assignedToId) : null;
    payload.severity = String(payload.severity);
    payload.status = 'PENDING';
    payload.type = String(payload.type);
    payload.occurredAt = new Date(String(payload.occurredAt)).toISOString();

    if (images.length) {
      const urls = await uploadImages(images);
      payload.images = urls;
    }

    await mutateAsync(payload);
    window.location.href = '/fleetmanager/incidents';
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="title"
            required
            placeholder="Title"
            className="border rounded px-3 py-2"
          />

          <select name="type" className="border rounded px-3 py-2" required>
            {[
              'ACCIDENT',
              'BREAKDOWN',
              'THEFT',
              'VANDALISM',
              'MAINTENANCE_ISSUE',
              'TRAFFIC_VIOLATION',
              'FUEL_ISSUE',
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
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
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
      )}

      {/* Step 2: Associations */}
      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <select name="carId" className="border rounded px-3 py-2" required>
            <option value="">Select Vehicle</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.regNumber}
              </option>
            ))}
          </select>

          <select name="reportedById" className="border rounded px-3 py-2" required>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select name="assignedToId" className="border rounded px-3 py-2">
            <option value="">Unassigned</option>
            {users
              .filter((u) => u.role !== 'DRIVER')
              .map((u) => (
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
      )}

      {/* Step 3: Uploads */}
      {step === 3 && (
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
          />
        </div>
      )}

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
            onClick={() => setStep((s) => s + 1)}
            className="px-3 py-2 rounded bg-black text-white"
          >
            Next
          </button>
        ) : (
          <button
            disabled={isPending}
            className="px-3 py-2 rounded bg-green-600 text-white"
          >
            {isPending ? 'Creating…' : 'Create Incident'}
          </button>
        )}
      </div>
    </form>
  );
}
