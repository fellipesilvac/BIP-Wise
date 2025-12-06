'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Key, Smartphone, Mail, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthMethodsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [otpEnabled, setOtpEnabled] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data } = await supabase
                .from('private_details')
                .select('otp_enabled')
                .eq('id', user.id)
                .single();

            if (data) {
                setOtpEnabled(data.otp_enabled || false);
            }
            setLoading(false);
        };
        fetchSettings();
    }, [supabase]);

    const handleToggleOtp = async () => {
        if (!userId) return;
        setToggling(true);
        const newState = !otpEnabled;

        try {
            const { error } = await supabase
                .from('private_details')
                .update({ otp_enabled: newState })
                .eq('id', userId);

            if (error) throw error;

            setOtpEnabled(newState);
            toast.success(newState
                ? "Login com código via email ativado!"
                : "Login com código desativado. Use sua senha para entrar."
            );
        } catch (error: any) {
            toast.error("Erro ao atualizar configuração.");
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 rounded-full border-2 border-[#9fe870] border-t-transparent animate-spin" />
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
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Métodos de Login</h1>
            </div>

            <div className="space-y-4">
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870] mt-1">
                                <Mail size={20} />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-[#e8ebe6] font-semibold text-lg">Login sem senha (OTP)</h3>
                                <p className="text-[#a8aaac] text-sm mt-1">
                                    Quando ativado, enviaremos um código de verificação para o seu email toda vez que você tentar entrar. Você não precisará digitar sua senha.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleToggleOtp}
                            disabled={toggling}
                            className={`
                                relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#9fe870] focus:ring-offset-2 focus:ring-offset-[#171916]
                                ${otpEnabled ? 'bg-[#9fe870]' : 'bg-[#ffffff10]'}
                            `}
                        >
                            <span
                                className={`
                                    absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center
                                    ${otpEnabled ? 'translate-x-6' : 'translate-x-0'}
                                `}
                            >
                                {toggling ? (
                                    <RefreshCw size={12} className="text-[#163300] animate-spin" />
                                ) : otpEnabled ? (
                                    <CheckCircle size={14} className="text-[#163300]" />
                                ) : (
                                    <XCircle size={14} className="text-[#a8aaac]" />
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-[#9fe870]/5 border border-[#9fe870]/10 rounded-xl flex gap-3 items-start">
                    <div className="mt-0.5 text-[#9fe870]">
                        <Key size={16} />
                    </div>
                    <p className="text-sm text-[#e8ebe6]/80">
                        <span className="font-semibold text-[#9fe870]">Nota de Segurança:</span> Sua senha continuará válida mesmo se esta opção estiver ativada, mas a interface de login priorizará o código se detectado.
                    </p>
                </div>
            </div>
        </div>
    );
}
