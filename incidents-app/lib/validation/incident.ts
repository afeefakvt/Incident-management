import { z } from "zod";

export const IncidentCreateSchema = z.object({
  carId: z.coerce.number().int(),
  reportedById: z.coerce.number().int(),
  assignedToId: z.coerce.number().int().optional().nullable(),
  title: z.string().min(3),
  description: z.string().min(5),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
  status: z.enum([
    "PENDING",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
    "CANCELLED",
  ]).default("PENDING"),
  type: z.enum([
    "ACCIDENT",
    "BREAKDOWN",
    "THEFT",
    "VANDALISM",
    "MAINTENANCE_ISSUE",
    "TRAFFIC_VIOLATION",
    "FUEL_ISSUE",
  ]),
  location: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  occurredAt: z.coerce.date(), // ✅ auto-convert string → Date
  carReadingId: z.coerce.number().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  documents: z.array(z.string().url()).optional().default([]),
  estimatedCost: z.coerce.number().optional().nullable(),
});


export const IncidentUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"])
    .optional(),
  type: z.enum([
    "ACCIDENT",
    "BREAKDOWN",
    "THEFT",
    "VANDALISM",
    "MAINTENANCE_ISSUE",
    "TRAFFIC_VIOLATION",
    "FUEL_ISSUE",
  ]).optional(),
  location: z.number().int().nullable().optional(),
  resolutionNotes: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  actualCost: z.number().optional().nullable(),
  resolvedAt: z.string().or(z.date()).optional().nullable(),
  images: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
});

export const IncidentCommentSchema = z.object({
  message: z.string().min(1),
  updateType: z.literal("COMMENT"),
});
