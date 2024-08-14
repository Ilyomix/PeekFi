/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
/**
 * Sends an email message using SendGrid API.
 *
 * @example
 *   sendEmail({
 *     to: [{ email: "user@example.com" }],
 *     // https://mc.sendgrid.com/dynamic-templates
 *     templateId: "d-12345678501234537890143456789511",
 *     templateData: { name: "John" },
 *     waitUntil: ctx.executionCtx.waitUntil,
 *     env: ctx.env,
 *   });
 *
 * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
export function sendEmail(options) {
    const { env, to, subject, templateData, templateId, waitUntil } = options;
    const inFlight = (async function send() {
        const data = {
            personalizations: [{ to, dynamic_template_data: templateData }],
            from: { email: env.FROM_EMAIL, name: env.APP_NAME },
            template_id: templateId,
            subject,
        };
        const req = new Request("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                ["Authorization"]: `Bearer ${env.SENDGRID_API_KEY}`,
                ["Content-Type"]: "application/json",
            },
            body: JSON.stringify(data),
        });
        const res = await fetch(req, options.req);
        if (!res.ok) {
            const body = await res.json().catch(() => undefined);
            console.error({
                req: { url: req.url, method: req.method },
                res: {
                    status: res.status,
                    statusText: res.statusText,
                    errors: body?.errors,
                },
            });
            throw new Error("Failed to send an email message.");
        }
    })();
    waitUntil?.(inFlight);
    return inFlight;
}
// #endregion
