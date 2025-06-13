import mongoose from "mongoose";
import { AlgorandActionSchema, DiscordConfigSchema, EmailConfigSchema, GitHubConfigSchema } from "./providers";
const { Schema } = mongoose;

const NodeSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["GitHub", "Discord", "Gmail", "Algorand"],
        required: true
    },
    config: {
        type: Schema.Types.Mixed,
        required: true
    },
    nextNodeIds: {
        type: [String],
        default: []
    },
    condition: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
}, { _id: false });

const AppSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "login",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    sourcePlatform: {
        type: String,
        enum: ["GitHub", "Discord", "Gmail"],
        required: true,
    },
    destination: {
        type: String,
        enum: ["Algorand"],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },

    githubConfig: {
        type: GitHubConfigSchema,
        required: function (this: { sourcePlatform: string }) { return this.sourcePlatform === "GitHub"; }
    },
    discordConfig: {
        type: DiscordConfigSchema,
        required: function (this: { sourcePlatform: string }) { return this.sourcePlatform === "Discord"; }
    },
    emailConfig: {
        type: EmailConfigSchema,
        required: function (this: { sourcePlatform: string }) { return this.sourcePlatform === "Gmail"; }
    },

    algorandAction: {
        type: AlgorandActionSchema,
        required: true
    },

    nodes: {
        type: [NodeSchema],
        default: []
    },

    triggerCount: {
        type: Number,
        default: 0
    },
    lastTriggered: {
        type: Date
    },
    totalAlgoSent: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

AppSchema.index({ userId: 1, sourcePlatform: 1 });
AppSchema.index({ "githubConfig.repository": 1 });
AppSchema.index({ "discordConfig.guildId": 1 });
AppSchema.index({ "emailConfig.emailAddress": 1 });
AppSchema.index({ "nodes.id": 1 });
AppSchema.index({ isActive: 1 });

AppSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

AppSchema.virtual('webhookUrl').get(function () {
    if (this.sourcePlatform === 'GitHub' && this.githubConfig) {
        return this.githubConfig.webhookUrl;
    }
    return null;
});

AppSchema.methods.recordTrigger = function (algoAmount = 0) {
    this.triggerCount += 1;
    this.lastTriggered = new Date();
    this.totalAlgoSent += algoAmount;
    return this.save();
};

AppSchema.statics.findByPlatform = function (platform) {
    return this.find({ sourcePlatform: platform, isActive: true });
};

export default mongoose.model("projects", AppSchema);
