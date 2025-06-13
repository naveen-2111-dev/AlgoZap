import crypto from "crypto"

export async function WebhookGen() {
    const secret = crypto.randomBytes(32).toString('hex');
    const appId = crypto.randomBytes(8).toString('hex');

    return {
        appId,
        secret
    }
}