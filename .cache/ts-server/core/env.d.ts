/**
 * Environment variables that has been validated and sanitized.
 *
 * @see https://github.com/ilyakaznacheev/cleanenv#readme
 */
export declare const env: Readonly<{
    VERSION: string;
    APP_STORAGE_BUCKET: string;
    GOOGLE_CLOUD_PROJECT: string;
    GOOGLE_CLOUD_DATABASE: string;
    OPENAI_ORGANIZATION: string;
    OPENAI_API_KEY: string;
} & import("envalid").CleanedEnvAccessors>;
