import { Firestore } from "@google-cloud/firestore";
import { WorkspaceInput } from "../models";
/**
 * Test workspaces.
 */
export declare const testWorkspaces: (WorkspaceInput & {
    id: string;
})[];
export declare function seed(db: Firestore): Promise<void>;
