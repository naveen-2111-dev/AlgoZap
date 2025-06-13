import { Schema } from "mongoose";

export const GitHubConfigSchema = new Schema({
    events: {
        type: [String],
        enum: ["push", "pull_request", "issues", "release", "fork", "star", "watch", "commit_comment"],
        default: ["push"],
        required: true
    },
    webhookSecret: {
        type: String,
        required: true
    },
    webhookUrl: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        default: "main"
    },
    repository: {
        type: String,
        required: true
    }
}, { _id: false });

export const DiscordConfigSchema = new Schema({
    events: {
        type: [String],
        enum: ["message", "reaction", "member_join", "member_leave", "voice_join", "voice_leave", "role_update"],
        default: ["message"],
        required: true
    },
    botToken: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String
    },
    triggers: {
        keywords: [String],
        mentions: Boolean,
        reactions: [String]
    }
}, { _id: false });

export const EmailConfigSchema = new Schema({
    events: {
        type: [String],
        enum: ["new_email", "email_reply", "email_forward", "attachment_received"],
        default: ["new_email"],
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    filters: {
        senderEmail: String,
        subject: String,
        labels: [String],
        hasAttachment: Boolean,
        isUnread: Boolean
    },
    oauthToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
}, { _id: false });

export const AlgorandActionSchema = new Schema({
    actionType: {
        type: String,
        enum: ["send_token", "send_nft", "create_asset", "opt_in", "smart_contract_call"],
        required: true
    },
    amount: {
        type: Number,
        min: 0
    },
    assetId: {
        type: Number
    },
    recipientAddress: {
        type: String
    },
    smartContractId: {
        type: Number
    },
    memo: {
        type: String,
        maxlength: 1000
    }
}, { _id: false });
