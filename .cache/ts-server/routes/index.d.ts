/**
 * The root tRPC router.
 * @see https://trpc.io/docs/quickstart
 */
export declare const router: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        readonly db: FirebaseFirestore.Firestore;
        readonly log: import("pino").Logger;
        readonly token: import("../core/auth").DecodedIdToken | null;
    };
    meta: object;
    errorShape: {
        data: {
            zodError?: import("zod").typeToFlattenedError<any, string> | undefined;
            code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
            httpStatus: number;
            path?: string | undefined;
            stack?: string | undefined;
        };
        message: string;
        code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    workspace: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            readonly db: FirebaseFirestore.Firestore;
            readonly log: import("pino").Logger;
            readonly token: import("../core/auth").DecodedIdToken | null;
        };
        meta: object;
        errorShape: {
            data: {
                zodError?: import("zod").typeToFlattenedError<any, string> | undefined;
                code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
                httpStatus: number;
                path?: string | undefined;
                stack?: string | undefined;
            };
            message: string;
            code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        update: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    readonly db: FirebaseFirestore.Firestore;
                    readonly log: import("pino").Logger;
                    readonly token: import("../core/auth").DecodedIdToken | null;
                };
                meta: object;
                errorShape: {
                    data: {
                        zodError?: import("zod").typeToFlattenedError<any, string> | undefined;
                        code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
                        httpStatus: number;
                        path?: string | undefined;
                        stack?: string | undefined;
                    };
                    message: string;
                    code: import("@trpc/server/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                db: FirebaseFirestore.Firestore;
                log: import("pino").Logger;
                token: import("../core/auth").DecodedIdToken;
            };
            _input_in: {
                id: string;
                name: string;
            };
            _input_out: {
                id: string;
                name: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, void>;
    }>;
}>;
export type AppRouter = typeof router;
