'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [whatsapp, setWhatsapp] = useState('');
    const [marketingConsent, setMarketingConsent] = useState(false);
    const [whatsappIsPublic, setWhatsappIsPublic] = useState(false);
    const [displaySocialLinks, setDisplaySocialLinks] = useState(true);
    const [socials, setSocials] = useState({
        instagram: '',
        twitter: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for initial data to check for changes
    const [initialData, setInitialData] = useState({
        fullName: '',
        whatsapp: '',
        marketingConsent: false,
        whatsappIsPublic: false,
        displaySocialLinks: true,
        socials: {
            instagram: '',
            twitter: ''
        }
    });

    const hasChanges =
        fullName !== initialData.fullName ||
        whatsapp !== initialData.whatsapp ||
        marketingConsent !== initialData.marketingConsent ||
        whatsappIsPublic !== initialData.whatsappIsPublic ||
        displaySocialLinks !== initialData.displaySocialLinks ||
        socials.instagram !== initialData.socials.instagram ||
        socials.twitter !== initialData.socials.twitter;

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            // Fetch Profiles
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Fetch Private Details
            const { data: details } = await supabase
                .from('private_details')
                .select('*')
                .eq('id', user.id)
                .single();

            const newInitialData = {
                fullName: '',
                whatsapp: '',
                marketingConsent: false,
                whatsappIsPublic: false,
                displaySocialLinks: true,
                socials: {
                    instagram: '',
                    twitter: ''
                }
            };

            if (profile) {
                setFullName(profile.full_name || '');
                setUsername(profile.username || '');
                setAvatarUrl(profile.avatar_url);
                setDisplaySocialLinks(profile.display_social_links ?? true); // Default true
                newInitialData.fullName = profile.full_name || '';
                newInitialData.displaySocialLinks = profile.display_social_links ?? true;

                if (profile.social_media_links) {
                    const links = profile.social_media_links as any;
                    const loadedSocials = {
                        instagram: links.instagram || '',
                        twitter: links.twitter || ''
                    };
                    setSocials(loadedSocials);
                    newInitialData.socials = loadedSocials;
                }
            }

            if (details) {
                setWhatsapp(details.whatsapp || '');
                setMarketingConsent(details.marketing_consent || false);
                setWhatsappIsPublic(details.whatsapp_is_public || false);

                newInitialData.whatsapp = details.whatsapp || '';
                newInitialData.marketingConsent = details.marketing_consent || false;
                newInitialData.whatsappIsPublic = details.whatsapp_is_public || false;
            }

            setInitialData(newInitialData);
            setLoading(false);
        };

        fetchProfile();
    }, [supabase]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        setWhatsapp(value);
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Selecione uma imagem para upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Auto-save to profile
            setAvatarUrl(publicUrl);
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
                .eq('id', userId);

            toast.success('Foto de perfil atualizada!');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
        }
    };

    const handleUndo = () => {
        setFullName(initialData.fullName);
        setWhatsapp(initialData.whatsapp);
        setMarketingConsent(initialData.marketingConsent);
        setWhatsappIsPublic(initialData.whatsappIsPublic);
        setDisplaySocialLinks(initialData.displaySocialLinks);
        setSocials({ ...initialData.socials });
        toast.info("Alterações desfeitas.");
    };

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            // Logic: If whatsappIsPublic is true, we copy the number to the public 'whatsapp' column in 'profiles'.
            // If false, we set 'profiles.whatsapp' to NULL (or don't update it, but null is safer for privacy).
            const publicWhatsapp = whatsappIsPublic ? whatsapp : null;

            // Update Profile (Public)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    social_media_links: socials,
                    whatsapp: publicWhatsapp,
                    display_social_links: displaySocialLinks,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (profileError) throw profileError;

            // Update Private Details (Private)
            const { error: detailsError } = await supabase
                .from('private_details')
                .upsert({
                    id: userId,
                    whatsapp: whatsapp,
                    marketing_consent: marketingConsent,
                    whatsapp_is_public: whatsappIsPublic,
                    updated_at: new Date().toISOString()
                });

            if (detailsError) throw detailsError;

            // Update initial data to current state so button disables again
            setInitialData({
                fullName,
                whatsapp,
                marketingConsent,
                whatsappIsPublic,
                displaySocialLinks,
                socials: { ...socials }
            });

            toast.success('Perfil atualizado com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao salvar perfil: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[#9fe870] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 font-inter">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-[#ffffff05] border border-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff10] transition-colors group"
                >
                    <ArrowLeft size={20} className="text-[#a8aaac] group-hover:text-[#e8ebe6] transition-colors" />
                </Link>
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Editar Perfil</h1>
            </div>

            <div className="space-y-8">
                {/* 1. Avatar Section */}
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-[#ffffff05] border-2 border-[#ffffff10]">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#a8aaac]">
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <button
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-[#9fe870] text-[#163300] p-2 rounded-full hover:bg-[#8fd860] transition-colors shadow-lg"
                        >
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                        </button>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-[#e8ebe6] font-semibold text-lg">Sua Foto</h3>
                        <p className="text-[#a8aaac] text-sm mt-1">
                            Isso será exibido no seu perfil público.
                        </p>
                    </div>
                </div>

                {/* 2. Public Info */}
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <h2 className="text-[#e8ebe6] font-semibold mb-4">Informações Públicas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Nome de Usuário</label>
                            <div className="bg-[#ffffff05] border border-[#ffffff08] rounded-xl px-4 py-3 text-[#a8aaac] cursor-not-allowed">
                                @{username}
                            </div>
                            <p className="text-[10px] text-[#a8aaac]/60">O nome de usuário não pode ser alterado.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Nome Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="Seu nome"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Contact Info */}
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <h2 className="text-[#e8ebe6] font-semibold mb-4">Contato</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Whatsapp</label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={handlePhoneChange}
                                maxLength={15}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        {/* Privacy Switch */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#ffffff05]">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-[#e8ebe6]">Exibir no perfil</h3>
                                <p className="text-xs text-[#a8aaac]">Seu número ficará visível para toda a sua rede.</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={whatsappIsPublic}
                                onClick={() => setWhatsappIsPublic(!whatsappIsPublic)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9fe870] focus:ring-offset-2 focus:ring-offset-[#171916] ${whatsappIsPublic ? 'bg-[#9fe870]' : 'bg-[#ffffff20]'}`}
                            >
                                <span className={`${whatsappIsPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Social Media */}
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <h2 className="text-[#e8ebe6] font-semibold mb-4">Redes Sociais</h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Instagram</label>
                                <input
                                    type="text"
                                    value={socials.instagram}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value && !value.startsWith('@')) value = '@' + value;
                                        setSocials({ ...socials, instagram: value });
                                    }}
                                    className={`w-full bg-transparent border rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none transition-colors ${!displaySocialLinks ? 'opacity-50 border-[#ffffff05]' : 'border-[#ffffff10] focus:border-[#9fe870]'}`}
                                    placeholder="@seu.insta"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Twitter (X)</label>
                                <input
                                    type="text"
                                    value={socials.twitter}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value && !value.startsWith('@')) value = '@' + value;
                                        setSocials({ ...socials, twitter: value });
                                    }}
                                    className={`w-full bg-transparent border rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none transition-colors ${!displaySocialLinks ? 'opacity-50 border-[#ffffff05]' : 'border-[#ffffff10] focus:border-[#9fe870]'}`}
                                    placeholder="@seu.twitter"
                                />
                            </div>
                        </div>

                        {/* Privacy Switch */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#ffffff05]">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-[#e8ebe6]">Exibir no perfil</h3>
                                <p className="text-xs text-[#a8aaac]">Seus links sociais ficarão visíveis para toda a sua rede.</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={displaySocialLinks}
                                onClick={() => setDisplaySocialLinks(!displaySocialLinks)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9fe870] focus:ring-offset-2 focus:ring-offset-[#171916] ${displaySocialLinks ? 'bg-[#9fe870]' : 'bg-[#ffffff20]'}`}
                            >
                                <span className={`${displaySocialLinks ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {hasChanges && (
                    <div className="flex justify-end gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={handleUndo}
                            disabled={!hasChanges || saving}
                            className="px-6 py-3 rounded-full text-[#a8aaac] hover:bg-[#ffffff05] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Desfazer ações
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Salvar Alterações
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
