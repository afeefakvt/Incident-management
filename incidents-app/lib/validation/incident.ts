import { z } from "zod";

export const IncidentCreateSchema = z.object({
  carId: z.number().int(),
  reportedById: z.number().int(),
  assignedToId: z.number().int().optional().nullable(),
  title: z.string().min(3),
  description: z.string().min(5),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"])
    .default("PENDING"),
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
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  occurredAt: z.string().or(z.date()),
  carReadingId: z.number().int().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  documents: z.array(z.string().url()).optional().default([]),
  estimatedCost: z.number().optional().nullable(),
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
  ]),
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
