'use client'

import { signup, signInWithGoogle, signInWithApple } from '../login/actions'
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

export default function SignupPage() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [touched, setTouched] = useState(false)

    // New Fields State
    const [username, setUsername] = useState('')
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)

    const [referralUsername, setReferralUsername] = useState('')
    const [referralStatus, setReferralStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
    const [parentId, setParentId] = useState<string | null>(null)
    const [isCheckingReferral, setIsCheckingReferral] = useState(false)

    const supabase = createClient()

    const validateUsername = async (val: string) => {
        if (!val || val.length < 3) {
            setUsernameStatus('invalid');
            return;
        }
        setIsCheckingUsername(true);
        const { data, error } = await supabase.rpc('check_username_available', { p_username: val });
        // RPC: check_username_available returns TRUE if available
        if (data === true) {
            setUsernameStatus('valid');
        } else {
            setUsernameStatus('invalid');
            toast.error('Este nome de usuário já está em uso.');
        }
        setIsCheckingUsername(false);
    }

    const validateReferral = async (val: string) => {
        if (!val) {
            setReferralStatus('invalid');
            return;
        }
        setIsCheckingReferral(true);
        const { data, error } = await supabase.rpc('get_profile_id_by_username', { p_username: val });
        // RPC returns UUID or NULL
        if (data) {
            setReferralStatus('valid');
            setParentId(data);
        } else {
            setReferralStatus('invalid');
            setParentId(null);
            toast.error('Conta de indicação não encontrada.');
        }
        setIsCheckingReferral(false);
    }

    const checks = {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasUpper: /[A-Z]/.test(password),
    }

    const isValid = Object.values(checks).every(Boolean)

    const handleSubmit = async (formData: FormData) => {
        if (!isValid) {
            toast.error('A senha não atende aos requisitos de segurança.')
            return
        }
        if (usernameStatus !== 'valid') {
            toast.error('Verifique seu nome de usuário.')
            return
        }
        if (referralStatus !== 'valid' || !parentId) {
            toast.error('Conta de indicação inválida.')
            return
        }

        await signup(formData)
    }

    return (
        <div className="min-h-screen bg-[#121511] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#171916] rounded-[28px] p-8 shadow-[0_4px_12px_5px_rgba(0,0,0,0.25)]">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-12 h-12 relative mb-2">
                        <img src="/wise-logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-manrope font-bold text-white">Crie sua conta</h1>
                    <p className="text-[#e8ebe6] opacity-60 font-inter text-sm">Preencha seus dados para começar</p>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4">
                    {/* Hidden input for validated Parent ID */}
                    <input type="hidden" name="parentId" value={parentId || ''} />

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Nome completo"
                                required
                                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none focus:border-[#9fe870] transition-colors font-inter"
                            />
                        </div>
                        <div className="relative flex-1">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                            <input
                                name="username"
                                type="text"
                                placeholder="Seu usuário"
                                required
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setUsername(val);
                                    setUsernameStatus('idle');
                                }}
                                onBlur={() => validateUsername(username)}
                                className={`w-full bg-[rgba(255,255,255,0.05)] border rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none transition-colors font-inter
                                 ${usernameStatus === 'valid' ? 'border-[#9fe870]' : usernameStatus === 'invalid' ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#9fe870]'}
                               `}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isCheckingUsername && <div className="w-3 h-3 rounded-full border-2 border-[#9fe870] border-t-transparent animate-spin"></div>}
                                {usernameStatus === 'valid' && <Check className="w-4 h-4 text-[#9fe870]" />}
                                {usernameStatus === 'invalid' && <X className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                        <input
                            name="referralUsername"
                            type="text"
                            placeholder="Usuário de quem te convidou (Obrigatório)"
                            required
                            onChange={(e) => {
                                setReferralUsername(e.target.value);
                                setReferralStatus('idle');
                                setParentId(null);
                            }}
                            onBlur={(e) => validateReferral(e.target.value)}
                            className={`w-full bg-[rgba(255,255,255,0.05)] border rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none transition-colors font-inter
                                ${referralStatus === 'valid' ? 'border-[#9fe870]' : referralStatus === 'invalid' ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)] focus:border-[#9fe870]'}
                            `}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isCheckingReferral && <div className="w-3 h-3 rounded-full border-2 border-[#9fe870] border-t-transparent animate-spin"></div>}
                            {referralStatus === 'valid' && <Check className="w-4 h-4 text-[#9fe870]" />}
                            {referralStatus === 'invalid' && <X className="w-4 h-4 text-red-500" />}
                        </div>
                        {referralStatus === 'invalid' && <p className="text-red-500 text-xs mt-1 ml-2">Usuário não encontrado.</p>}
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Seu e-mail"
                            required
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none focus:border-[#9fe870] transition-colors font-inter"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Sua senha"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setTouched(true)
                            }}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-12 pr-12 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none focus:border-[#9fe870] transition-colors font-inter"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e8ebe6] opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Strength Indicators */}
                    <div className={`flex flex-col gap-1 text-xs transition-all duration-300 ${touched ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <div className={`flex items-center gap-2 ${checks.minLength ? 'text-[#9fe870]' : 'text-[#e8ebe6] opacity-60'}`}>
                            {checks.minLength ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                            <span>Mínimo de 8 caracteres</span>
                        </div>
                        <div className={`flex items-center gap-2 ${checks.hasUpper ? 'text-[#9fe870]' : 'text-[#e8ebe6] opacity-60'}`}>
                            {checks.hasUpper ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                            <span>Pelo menos uma letra maiúscula</span>
                        </div>
                        <div className={`flex items-center gap-2 ${checks.hasNumber ? 'text-[#9fe870]' : 'text-[#e8ebe6] opacity-60'}`}>
                            {checks.hasNumber ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                            <span>Pelo menos um número</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || usernameStatus !== 'valid' || referralStatus !== 'valid'}
                        className="w-full bg-[#9fe870] hover:bg-[#8fd860] text-[#163300] font-semibold py-3 rounded-xl transition-colors font-inter mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Criar conta
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#171916] text-[#e8ebe6] opacity-40 font-inter">Ou continue com</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <form action={signInWithGoogle} className="flex-1">
                        <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 font-inter">
                            {/* Google Icon SVG */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </form>

                    <form action={signInWithApple} className="flex-1">
                        <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 font-inter">
                            {/* Apple Icon SVG */}
                            <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                            </svg>
                            Apple
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[#e8ebe6] opacity-60 font-inter text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-[#9fe870] hover:underline opacity-100 font-semibold">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
