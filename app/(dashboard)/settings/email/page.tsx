'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { requestEmailChange, confirmEmailChange } from './actions';
import { useUser } from '@/app/hooks/useUser';

export default function EmailSettingsPage() {
    const router = useRouter();
    const { user } = useUser();
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [loading, setLoading] = useState(false);

    // Form States
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [otp, setOtp] = useState('');

    // Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleInitialSubmit = () => {
        if (!newEmail || !newEmail.includes('@')) {
            toast.error("Por favor, insira um email válido.");
            return;
        }

        if (user?.email && newEmail === user.email) {
            toast.error("O novo email deve ser diferente do atual.");
            return;
        }

        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async () => {
        if (!currentPassword) {
            toast.error("Por favor, digite sua senha.");
            return;
        }

        setLoading(true);
        try {
            const result = await requestEmailChange(newEmail, currentPassword);
            if (result.success) {
                setIsPasswordModalOpen(false);
                setStep('otp');
                toast.success("Código de verificação enviado para o novo email.");
            } else {
                toast.error(result.error || "Erro ao solicitar alteração.");
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        if (!otp || otp.length < 6) {
            toast.error("Por favor, insira o código completo.");
            return;
        }

        setLoading(true);
        try {
            const result = await confirmEmailChange(newEmail, otp);
            if (result.success) {
                toast.success("Email atualizado com sucesso!");
                router.push('/settings'); // Redirect to settings main or refresh
            } else {
                toast.error(result.error || "Erro ao confirmar alteração.");
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    const Modal = () => {
        if (!mounted) return null;

        return createPortal(
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#1c1f1d] border border-[#ffffff10] rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                                    <Lock size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-[#e8ebe6]">Confirmar Senha</h3>
                            </div>

                            <p className="text-[#a8aaac] text-sm mb-6">
                                Para sua segurança, por favor confirme sua senha atual para prosseguir com a alteração de email.
                            </p>

                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Senha Atual</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-[#171916] border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                    placeholder="Sua senha"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handlePasswordSubmit();
                                    }}
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-[#a8aaac] hover:text-[#e8ebe6] hover:bg-[#ffffff05] transition-colors text-sm font-medium"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePasswordSubmit}
                                    disabled={loading || !currentPassword}
                                    className="px-6 py-2 rounded-lg bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading && <Loader2 size={14} className="animate-spin" />}
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
        );
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 font-inter relative">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-[#ffffff05] border border-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff10] transition-colors group"
                >
                    <ArrowLeft size={20} className="text-[#a8aaac] group-hover:text-[#e8ebe6] transition-colors" />
                </Link>
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Alterar Email</h1>
            </div>

            <div className="space-y-8">
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#e8ebe6] font-semibold text-lg">Email da Conta</h2>
                            <p className="text-[#a8aaac] text-sm">Atualize seu endereço de email principal.</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#ffffff08]">

                        {step === 'input' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Novo Email</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                        placeholder="Digite o novo email"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleInitialSubmit}
                                        disabled={!newEmail}
                                        className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'otp' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-[#9fe870]/5 border border-[#9fe870]/10 rounded-xl flex gap-3 items-center mb-4">
                                    <CheckCircle2 size={20} className="text-[#9fe870]" />
                                    <p className="text-sm text-[#e8ebe6]">
                                        Enviamos um código de confirmação para <span className="font-bold text-[#9fe870]">{newEmail}</span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Código de Verificação</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors tracking-[1em] text-center font-mono text-lg"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setStep('input')}
                                        className="px-6 py-3 rounded-full text-[#a8aaac] hover:bg-[#ffffff05] transition-colors font-semibold text-sm"
                                        disabled={loading}
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={handleOtpSubmit}
                                        disabled={loading || otp.length < 6}
                                        className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                        Verificar e Alterar
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>

            {/* Password Modal Overlay via AnimatePresence */}
            <Modal />

        </div>
    );
}
