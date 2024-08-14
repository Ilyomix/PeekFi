import { Timestamp } from "@google-cloud/firestore";
import { z } from "zod";
export declare const WorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
    ownerId: z.ZodString;
    created: z.ZodType<Timestamp, z.ZodTypeDef, Timestamp>;
    updated: z.ZodType<Timestamp, z.ZodTypeDef, Timestamp>;
    archived: z.ZodNullable<z.ZodType<Timestamp, z.ZodTypeDef, Timestamp>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ownerId: string;
    created: Timestamp;
    updated: Timestamp;
    archived: Timestamp | null;
}, {
    name: string;
    ownerId: string;
    created: Timestamp;
    updated: Timestamp;
    archived: Timestamp | null;
}>;
export type Workspace = z.output<typeof WorkspaceSchema>;
export type WorkspaceInput = z.input<typeof WorkspaceSchema>;
