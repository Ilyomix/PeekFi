import { NextFunction, Request, Response } from "express";
import { Certificates, GoogleAuth, TokenPayload } from "google-auth-library";
export declare const auth: GoogleAuth<import("google-auth-library/build/src/auth/googleauth").JSONClient>;
/**
 * Fetches the latest Google Cloud Identity Platform certificates.
 */
export declare function fetchCertificates(options?: {
    signal: AbortSignal;
}): import("got").CancelableRequest<Certificates>;
/**
 * Express middleware that verifies that the request has a valid Firebase ID
 * token attached, and adds the decoded token to `req.token`.
 */
export declare function sessionMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Interface representing a decoded Firebase ID token, returned from the
 * {@link verifyIdToken} method.
 *
 * Firebase ID tokens are OpenID Connect spec-compliant JSON Web Tokens (JWTs).
 * See the
 * [ID Token section of the OpenID Connect spec](http://openid.net/specs/openid-connect-core-1_0.html#IDToken)
 * for more information about the specific properties below.
 */
export interface DecodedIdToken extends TokenPayload {
    /**
     * Time, in seconds since the Unix epoch, when the end-user authentication
     * occurred.
     *
     * This value is not set when this particular ID token was created, but when the
     * user initially logged in to this session. In a single session, the Firebase
     * SDKs will refresh a user's ID tokens every hour. Each ID token will have a
     * different [`iat`](#iat) value, but the same `auth_time` value.
     */
    auth_time: number;
    /**
     * Information about the sign in event, including which sign in provider was
     * used and provider-specific identity details.
     *
     * This data is provided by the Firebase Authentication service and is a
     * reserved claim in the ID token.
     */
    firebase: {
        /**
         * Provider-specific identity details corresponding
         * to the provider used to sign in the user.
         */
        identities: {
            [key: string]: any;
        };
        /**
         * The ID of the provider used to sign in the user.
         * One of `"anonymous"`, `"password"`, `"facebook.com"`, `"github.com"`,
         * `"google.com"`, `"twitter.com"`, `"apple.com"`, `"microsoft.com"`,
         * `"yahoo.com"`, `"phone"`, `"playgames.google.com"`, `"gc.apple.com"`,
         * or `"custom"`.
         *
         * Additional Identity Platform provider IDs include `"linkedin.com"`,
         * OIDC and SAML identity providers prefixed with `"saml."` and `"oidc."`
         * respectively.
         */
        sign_in_provider: string;
        /**
         * The type identifier or `factorId` of the second factor, provided the
         * ID token was obtained from a multi-factor authenticated user.
         * For phone, this is `"phone"`.
         */
        sign_in_second_factor?: string;
        /**
         * The `uid` of the second factor used to sign in, provided the
         * ID token was obtained from a multi-factor authenticated user.
         */
        second_factor_identifier?: string;
        /**
         * The ID of the tenant the user belongs to, if available.
         */
        tenant?: string;
        [key: string]: any;
    };
    /**
     * The phone number of the user to whom the ID token belongs, if available.
     */
    phone_number?: string;
    /**
     * The `uid` corresponding to the user who the ID token belonged to.
     *
     * This value is not actually in the JWT token claims itself. It is added as a
     * convenience, and is set as the value of the [`sub`](#sub) property.
     */
    uid: string;
    /**
     * Indicates whether or not the user is an admin.
     */
    admin?: boolean;
}
