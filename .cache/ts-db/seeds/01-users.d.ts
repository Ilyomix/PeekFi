import { identitytoolkit_v3 } from "@googleapis/identitytoolkit";
/**
 * Test user accounts generated by https://randomuser.me/.
 */
export declare const testUsers: identitytoolkit_v3.Schema$UserInfo[];
/**
 * Seeds the Google Identity Platform (Firebase Auth) with test user accounts.
 *
 * @see https://randomuser.me/
 * @see https://cloud.google.com/identity-platform
 */
export declare function seed(): Promise<void>;
