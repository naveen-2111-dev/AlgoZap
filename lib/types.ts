/**
 * Object containing the names of MongoDB collections used in the app.
 * The keys represent collection identifiers used in code,
 * and the values are the actual collection names in the database.
 */
export const COLLECTIONS = {
    LOGIN: "login",
    PROJECTS: "projects"
    // POSTS: "posts",
    // COMMENTS: "comments",
} as const;

/**
 * Type representing the valid collection names defined in COLLECTIONS.
 * It is a union type of the keys of COLLECTIONS.
 */
export type CollectionName = keyof typeof COLLECTIONS;

export type GitHubConfig = {
    events: string[];
    webhookSecret: string;
    repository: string;
    branch?: string;
};

export type DiscordConfig = {
    events: string[];
    botToken: string;
    guildId: string;
    channelId?: string;
    triggers?: {
        keywords?: string[];
        mentions?: boolean;
        reactions?: string[];
    };
};

export type EmailConfig = {
    events: string[];
    emailAddress: string;
    filters?: {
        senderEmail?: string;
        subject?: string;
        labels?: string[];
        hasAttachment?: boolean;
        isUnread?: boolean;
    };
    oauthToken: string;
    refreshToken: string;
};

export type AlgorandAction = {
    actionType: string;
    amount?: number;
    assetId?: number;
    recipientAddress?: string;
    smartContractId?: number;
    memo?: string;
};

export type CreateAppInput = {
    name: string;
    description?: string;
    sourcePlatform: 'GitHub' | 'Discord' | 'Gmail';
    destination: 'Algorand';

    githubConfig?: GitHubConfig;
    discordConfig?: DiscordConfig;
    emailConfig?: EmailConfig;
    newAppId?: string,
    algorandAction: AlgorandAction;
};
