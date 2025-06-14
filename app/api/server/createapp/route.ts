import { cookies } from 'next/headers';
import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken';
import getCollection from "@/lib/link/collections";
import { CreateAppInput } from '@/lib/types';

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        const requestData = await req.json() as CreateAppInput;
        const {
            name,
            description,
            sourcePlatform,
            destination,
            githubConfig,
            discordConfig,
            emailConfig,
            algorandAction,
            newAppId
        } = requestData;

        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        const wallet = decoded.walletId;

        if (!name || !sourcePlatform || !destination || !algorandAction) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }

        const platformConfig: {
            githubConfig?: {
                webhookSecret: string;
                repository: string;
                webhookUrl: string;
            };
            discordConfig?: {
                botToken: string;
                guildId: string;
            };
            emailConfig?: {
                emailAddress: string;
                oauthToken: string;
            };
        } = {};

        switch (sourcePlatform) {
            case 'GitHub':
                if (!githubConfig || !githubConfig.webhookSecret || !githubConfig.repository) {
                    return new Response(JSON.stringify({ error: "GitHub configuration is incomplete" }), {
                        status: 400,
                    });
                }
                platformConfig.githubConfig = {
                    ...githubConfig,
                    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://algo-zap-iq98.vercel.app'}/api/webhook/PLACEHOLDER_ID`
                };
                break;

            case 'Discord':
                if (!discordConfig || !discordConfig.botToken || !discordConfig.guildId) {
                    return new Response(JSON.stringify({ error: "Discord configuration is incomplete" }), {
                        status: 400,
                    });
                }
                platformConfig.discordConfig = discordConfig;
                break;

            case 'Gmail':
                if (!emailConfig || !emailConfig.emailAddress || !emailConfig.oauthToken) {
                    return new Response(JSON.stringify({ error: "Gmail configuration is incomplete" }), {
                        status: 400,
                    });
                }
                platformConfig.emailConfig = emailConfig;
                break;

            default:
                return new Response(JSON.stringify({ error: "Invalid source platform" }), {
                    status: 400,
                });
        }

        const validActionTypes = ["send_token", "send_nft", "create_asset", "opt_in", "smart_contract_call"];
        if (!validActionTypes.includes(algorandAction.actionType)) {
            return new Response(JSON.stringify({ error: "Invalid Algorand action type" }), {
                status: 400,
            });
        }

        const collection = await getCollection("PROJECTS");
        const user = await getCollection("LOGIN");

        const existingApp = await collection.findOne({
            name: name,
            userId: { $exists: true }
        });

        const loggeduser = await user.findOne({ walletid: wallet });

        if (!loggeduser) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        if (existingApp) {
            return new Response(JSON.stringify({ error: "App name already exists" }), {
                status: 409,
            });
        }

        const appDocument = {
            userId: new ObjectId(loggeduser._id),
            name: name,
            description: description || '',
            sourcePlatform: sourcePlatform,
            destination: destination,
            isActive: true,
            ...platformConfig,
            algorandAction: algorandAction,
            triggerCount: 0,
            totalAlgoSent: 0,
            algorandAppId: newAppId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const app = await collection.insertOne(appDocument);

        if (app.insertedId) {
            if (sourcePlatform === 'GitHub') {
                const actualWebhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://algo-zap-iq98.vercel.app'}/api/webhook/${app.insertedId}`;

                await collection.updateOne(
                    { _id: app.insertedId },
                    {
                        $set: {
                            'githubConfig.webhookUrl': actualWebhookUrl,
                            updatedAt: new Date()
                        }
                    }
                );

                return new Response(JSON.stringify({
                    message: "Success",
                    appId: app.insertedId,
                    webhookUrl: actualWebhookUrl
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({
                message: "Success",
                appId: app.insertedId
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: "Failed to create app" }), {
            status: 500,
        });

    } catch (err) {
        console.error("App creation error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
