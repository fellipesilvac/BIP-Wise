'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Calendar, Users, Edit2, Copy, Check, Instagram, Twitter } from 'lucide-react';
import { Profile } from '@/app/types/profile';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile | null;
}

export default function ProfileDrawer({ isOpen, onClose, profile }: ProfileDrawerProps) {
    const supabase = createClient();
    const [fetchedProfile, setFetchedProfile] = useState<Profile | null>(null);
    const [realDirectsCount, setRealDirectsCount] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [copiedUsername, setCopiedUsername] = useState(false);
    const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [parentProfile, setParentProfile] = useState<Profile | null>(null);

    useEffect(() => {
        setMounted(true);
        // Get current user to check if we are viewing our own profile
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        }
        getUser();
    }, [supabase]);

    // Fetch Fresh Profile Data on Open
    useEffect(() => {
        if (isOpen && profile?.id) {
            // Reset state initially to show prop data
            setFetchedProfile(profile);
            setRealDirectsCount(null); // Reset count

            async function fetchData() {
                // 1. Fetch Profile Details
                const profileQuery = supabase
                    .from('profiles')
                    .select('*, subscriptions(status, plans(name))')
                    .eq('id', profile!.id)
                    .single();

                // 2. Fetch Real Count of Directs
                const countQuery = supabase
                    .from('profiles')
                    .select('id', { count: 'exact', head: true })
                    .eq('parent_id', profile!.id);

                const [profileRes, countRes] = await Promise.all([profileQuery, countQuery]);

                if (profileRes.data) {
                    setFetchedProfile(profileRes.data as Profile);
                }
                if (countRes.count !== null) {
                    setRealDirectsCount(countRes.count);
                }
            }
            fetchData();
        }
    }, [isOpen, profile?.id, supabase]);

    // Fetch Parent Profile
    useEffect(() => {
        const activeProfile = fetchedProfile || profile; // Use fetched if available for parent logic too

        if (activeProfile?.parent_id) {
            async function getParent() {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', activeProfile!.parent_id)
                    .single();
                if (data) setParentProfile(data as Profile);
            }
            getParent();
        } else {
            setParentProfile(null);
        }
    }, [fetchedProfile, profile, supabase]);

    const handleCopy = (text: string, type: 'username' | 'whatsapp') => {
        navigator.clipboard.writeText(text);
        if (type === 'username') {
            setCopiedUsername(true);
            setTimeout(() => setCopiedUsername(false), 2000);
        } else {
            setCopiedWhatsapp(true);
            setTimeout(() => setCopiedWhatsapp(false), 2000);
        }
    };

    if (!mounted || !profile) return null;

    // Use fetchedProfile if available, otherwise fallback to prop profile
    const displayProfile = fetchedProfile || profile;

    const isOwnProfile = currentUserId === displayProfile.id;
    const joinedDate = new Date(displayProfile.created_at || Date.now()).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const hasWhatsApp = !!displayProfile.whatsapp;
    const hasSocials = displayProfile.display_social_links && displayProfile.social_media_links && (displayProfile.social_media_links.instagram || displayProfile.social_media_links.twitter);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#171916] border-l border-[#ffffff10] z-[10000] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#ffffff10]">
                            <h2 className="text-lg font-bold text-[#e8ebe6]">Detalhes do Perfil</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#a8aaac] hover:text-[#e8ebe6] hover:bg-[#ffffff10] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Identity Section */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-[#9fe870]/10 border-2 border-[#9fe870]/20 flex items-center justify-center text-[#9fe870] mb-4">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-[#e8ebe6]">
                                    {profile.full_name || 'Usuário sem nome'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[#a8aaac] text-sm font-mono">@{profile.username}</span>
                                    <button
                                        onClick={() => handleCopy(profile.username, 'username')}
                                        className="text-[#9fe870] hover:text-[#b4f58c] transition-colors"
                                    >
                                        {copiedUsername ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>

                                {isOwnProfile && (
                                    <Link
                                        href="/settings/profile"
                                        onClick={onClose}
                                        className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#9fe870]/10 text-[#9fe870] rounded-full text-sm font-semibold hover:bg-[#9fe870]/20 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                        Editar Perfil
                                    </Link>
                                )}
                            </div>

                            {/* Parent Account Section */}
                            {parentProfile && (
                                <div className="bg-[#ffffff03] rounded-xl p-4 border border-[#ffffff08]">
                                    <div className="flex items-center gap-2 text-[#a8aaac] text-xs uppercase tracking-wider mb-3">
                                        <Users size={14} />
                                        Indicado por
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#9fe870]/10 flex items-center justify-center text-[#9fe870]">
                                            {parentProfile.avatar_url ? (
                                                <img src={parentProfile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={16} />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#e8ebe6]">
                                                {parentProfile.full_name || 'Sem nome'}
                                            </span>
                                            <span className="text-xs text-[#a8aaac]">
                                                @{parentProfile.username}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#ffffff03] rounded-xl p-4 border border-[#ffffff08]">
                                    <div className="flex items-center gap-2 text-[#a8aaac] text-xs uppercase tracking-wider mb-2">
                                        <Users size={14} />
                                        Rede Total
                                    </div>
                                    <div className="text-2xl font-bold text-[#e8ebe6]">
                                        {profile.total_network_size}
                                    </div>
                                </div>
                                <div className="bg-[#ffffff03] rounded-xl p-4 border border-[#ffffff08]">
                                    <div className="flex items-center gap-2 text-[#a8aaac] text-xs uppercase tracking-wider mb-2">
                                        <User size={14} />
                                        Diretos
                                    </div>
                                    <div className="text-2xl font-bold text-[#e8ebe6]">
                                        {realDirectsCount ?? displayProfile.direct_referrals_count}
                                    </div>
                                </div>
                            </div>

                            {/* Info List */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-[#a8aaac] uppercase tracking-wider">Informações</h4>

                                <div className="flex items-center gap-4 bg-[#ffffff03] p-4 rounded-xl border border-[#ffffff05]">
                                    <div className="w-10 h-10 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[#a8aaac] text-xs">Membro desde</p>
                                        <p className="text-[#e8ebe6] text-sm font-medium">{joinedDate}</p>
                                    </div>
                                </div>

                                {/* Privacy Protected Contact Info */}
                                {hasWhatsApp && (
                                    <div className="flex items-center gap-4 bg-[#ffffff03] p-4 rounded-xl border border-[#ffffff05]">
                                        <div className="w-10 h-10 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[#a8aaac] text-xs">WhatsApp</p>
                                            <p className="text-[#e8ebe6] text-sm font-medium">{profile.whatsapp}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(profile.whatsapp || '', 'whatsapp')}
                                            className="w-8 h-8 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870] hover:bg-[#ffffff10] transition-colors"
                                        >
                                            {copiedWhatsapp ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                )}

                                {hasSocials && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {profile.social_media_links?.instagram && (
                                            <a
                                                href={`https://instagram.com/${profile.social_media_links.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 bg-[#ffffff03] p-4 rounded-xl border border-[#ffffff05] hover:bg-[#ffffff08] transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#a8aaac] group-hover:text-[#e8ebe6]">
                                                    <Instagram size={18} />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-[#a8aaac] text-[10px] uppercase">Instagram</p>
                                                    <p className="text-[#e8ebe6] text-sm font-medium truncate">{profile.social_media_links.instagram}</p>
                                                </div>
                                            </a>
                                        )}
                                        {profile.social_media_links?.twitter && (
                                            <a
                                                href={`https://twitter.com/${profile.social_media_links.twitter.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 bg-[#ffffff03] p-4 rounded-xl border border-[#ffffff05] hover:bg-[#ffffff08] transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#a8aaac] group-hover:text-[#e8ebe6]">
                                                    <Twitter size={18} />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-[#a8aaac] text-[10px] uppercase">Twitter</p>
                                                    <p className="text-[#e8ebe6] text-sm font-medium truncate">{profile.social_media_links.twitter}</p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {!hasWhatsApp && !hasSocials && (
                                    <div className="p-4 rounded-xl border border-dashed border-[#ffffff10] text-center text-[#a8aaac] text-xs">
                                        Este usuário optou por não exibir informações de contato adicionais.
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
