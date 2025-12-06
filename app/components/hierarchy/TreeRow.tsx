'use client';

import React, { useState } from 'react';
import { Profile } from '@/app/types/profile';
import { ChevronRight, ChevronDown, Plus, Move, User, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface TreeRowProps {
    profile: Profile;
    level: number;
    onProfileClick?: (profile: Profile) => void;
    disableExpansion?: boolean;
}

export default function TreeRow({ profile, level, onProfileClick, disableExpansion = false }: TreeRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Styling indentation
    const paddingLeft = level * 20 + 24; // 24px base padding for grid alignment

    const handleExpand = async (e: React.MouseEvent) => {
        if (disableExpansion) return;

        e.stopPropagation(); // Prevent drawer open when clicking expand
        if (isExpanded) {
            setIsExpanded(false);
            return;
        }

        setIsExpanded(true);
        // ... rest of logic


        if (!hasLoaded) {
            setIsLoading(true);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('profiles')
                .select('*, subscriptions(status, plans(name))')
                .eq('parent_id', profile.id)
                .order('created_at', { ascending: true });

            if (data) {
                setChildren(data as Profile[]);
                setHasLoaded(true);
            }
            setIsLoading(false);
        }
    };

    // Helper to get plan name
    const planName = profile.subscriptions?.[0]?.plans?.name || 'Gratuito';
    const whatsappLink = profile.whatsapp
        ? `https://wa.me/55${profile.whatsapp.replace(/\D/g, '')}`
        : null;

    return (
        <>
            {/* Row Content */}
            <div
                onClick={() => onProfileClick?.(profile)}
                className="grid grid-cols-[minmax(250px,3fr)_1.2fr_100px_120px_140px] gap-4 items-center hover:bg-[#ffffff05] border-b border-[#ffffff10] transition-colors py-3 px-6 text-sm group cursor-pointer"
            >
                {/* Column 1: Name (Tree structure) */}
                <div className="flex items-center min-w-0" style={{ paddingLeft: `${disableExpansion ? 24 : level * 20}px` }}> {/* Padding handled via style for indentation */}
                    <button
                        onClick={handleExpand}
                        disabled={disableExpansion}
                        className={`mr-2 p-1 rounded hover:bg-[#ffffff10] text-[#9fe870] transition-colors focus:outline-none ${profile.direct_referrals_count === 0 || disableExpansion ? 'invisible' : ''}`}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    <div className="flex items-center gap-2 truncate text-[#e8ebe6]">
                        <div className="w-6 h-6 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-[#9fe870]">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User size={12} />
                            )}
                        </div>
                        <span className="font-medium truncate" title={profile.full_name}>
                            {profile.full_name || 'Sem Nome'}
                        </span>
                        {profile.total_network_size > 0 && (
                            <span className="flex-shrink-0 ml-1 flex items-center gap-1 text-[10px] bg-[#ffffff10] px-1.5 py-0.5 rounded text-[#a8aaac]" title="Tamanho total da rede">
                                <Users size={10} /> {profile.total_network_size}
                            </span>
                        )}
                    </div>
                </div>

                {/* Column 2: Username */}
                <div className="text-[#a8aaac] truncate" title={`@${profile.username}`}>
                    @{profile.username}
                </div>

                {/* Column 3: Status (Mock -> Real would need logic) */}
                <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#9fe870]/10 text-[#9fe870] border border-[#9fe870]/20">
                        Ativo
                    </span>
                </div>

                {/* Column 4: Plano */}
                <div>
                    <span className="text-[#a8aaac] text-xs">
                        {planName}
                    </span>
                </div>

                {/* Column 5: WhatsApp */}
                <div className="text-right sm:text-left">
                    {profile.whatsapp ? (
                        <a
                            href={whatsappLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#ffffff05] hover:bg-[#25D366]/20 text-[#a8aaac] hover:text-[#25D366] transition-colors text-xs border border-[#ffffff10] hover:border-[#25D366]/30"
                        >
                            <span className="font-medium">WhatsApp</span>
                        </a>
                    ) : (
                        <span className="text-[#ffffff10] text-xs">-</span>
                    )}
                </div>
            </div>

            {/* Children Rendering */}
            {isExpanded && (
                <div className="w-full">
                    {isLoading && (
                        <div className="py-2 text-[10px] text-[#a8aaac] flex items-center gap-2" style={{ paddingLeft: `${paddingLeft + 20}px` }}>
                            <div className="w-2 h-2 rounded-full border border-[#9fe870] border-t-transparent animate-spin"></div>
                            Carregando...
                        </div>
                    )}

                    {!isLoading && children.length === 0 && hasLoaded && (
                        <div className="py-2 text-[10px] text-[#a8aaac] italic" style={{ paddingLeft: `${paddingLeft + 26}px` }}>
                            Sem indicações diretas.
                        </div>
                    )}

                    {children.map(child => (
                        <TreeRow
                            key={child.id}
                            profile={child}
                            level={level + 1}
                            onProfileClick={onProfileClick} // Pass recursive
                        />
                    ))}
                </div>
            )}

        </>
    );
}
