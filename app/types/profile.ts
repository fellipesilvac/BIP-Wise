export interface Profile {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    parent_id: string | null;
    direct_referrals_count: number;
    total_network_size: number;
    created_at: string;
    social_media_links?: {
        instagram?: string;
        twitter?: string;
    };
    whatsapp?: string; // Public copy
    display_social_links?: boolean;
    subscriptions?: {
        status: string;
        plans?: {
            name: string;
        };
    }[];
}
