'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PasswordSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const hasChanges = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;

    const handleUndo = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.info("Campos limpos.");
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword) {
            toast.error("Por favor, digite sua senha atual.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            // 1. Verify Current Password by attempting a sign-in
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) throw new Error("Usuário não identificado.");

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            });

            if (signInError) {
                toast.error("Senha atual incorreta.");
                setLoading(false);
                return;
            }

            // 2. Update to New Password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            toast.success("Senha atualizada com sucesso!");
            handleUndo();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) {
            toast.error("Não foi possível identificar seu email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/settings/password`,
        });

        if (error) {
            toast.error("Erro ao enviar email de recuperação.");
        } else {
            toast.success("Email de recuperação enviado para " + user.email);
        }
    };

    // Password validation checks helper
    const validations = [
        { label: 'Pelo menos 8 caracteres', valid: newPassword.length >= 8 },
        { label: 'Pelo menos uma letra maiúscula', valid: /[A-Z]/.test(newPassword) },
        { label: 'Pelo menos uma letra minúscula', valid: /[a-z]/.test(newPassword) },
        { label: 'Pelo menos um número', valid: /[0-9]/.test(newPassword) },
        { label: 'Pelo menos um caractere especial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    ];

    const isPasswordStrong = validations.every(v => v.valid);

    return (
        <div className="max-w-3xl mx-auto pb-20 font-inter">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-[#ffffff05] border border-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff10] transition-colors group"
                >
                    <ArrowLeft size={20} className="text-[#a8aaac] group-hover:text-[#e8ebe6] transition-colors" />
                </Link>
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Alterar Senha</h1>
            </div>

            <div className="space-y-8">
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#e8ebe6] font-semibold text-lg">Segurança da Conta</h2>
                            <p className="text-[#a8aaac] text-sm">Gerencie sua senha de acesso.</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#ffffff08]">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Senha Atual</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="Digite sua senha atual"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Nova Senha</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="Digite a nova senha"
                            />
                        </div>

                        {/* Password Strength Indicators */}
                        {newPassword && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1">
                                {validations.map((v, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${v.valid ? 'bg-[#9fe870]' : 'bg-[#ffffff20]'}`} />
                                        <span className={`text-xs ${v.valid ? 'text-[#e8ebe6]' : 'text-[#a8aaac]'}`}>{v.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Confirme a Nova Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="Digite a nova senha novamente"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <button
                            onClick={handleResetPassword}
                            className="text-xs text-[#9fe870] hover:underline hover:text-[#8fd860] transition-colors"
                        >
                            Esqueci minha senha atual
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                {hasChanges && (
                    <div className="flex justify-end gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={handleUndo}
                            disabled={!hasChanges || loading}
                            className="px-6 py-3 rounded-full text-[#a8aaac] hover:bg-[#ffffff05] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Limpar campos
                        </button>
                        <button
                            onClick={handleUpdatePassword}
                            disabled={loading || !isPasswordStrong || newPassword !== confirmPassword || !currentPassword}
                            className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                            Atualizar Senha
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
