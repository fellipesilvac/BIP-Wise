'use client'

import { login, signInWithGoogle, signInWithApple } from './actions'
import { Mail, Lock, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()
    const formRef = useRef<HTMLFormElement>(null)

    // Flow State
    const [step, setStep] = useState<'email' | 'password' | 'otp'>('email')
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']) // 6 digits

    // Refs for OTP inputs
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const signupSuccess = searchParams.get('signup_success')
        const error = searchParams.get('error')

        if (signupSuccess) {
            toast.success('Conta criada com sucesso!', {
                description: 'Verifique seu e-mail para confirmar sua conta.',
                duration: 5000,
            })
            router.replace('/login')
        }

        if (error) {
            toast.error('Erro na autenticação', {
                description: error,
            })
        }
    }, [searchParams, router])

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error('Por favor, digite seu email.')
            return
        }

        setLoading(true)
        try {
            // Check if user has OTP enabled
            const { data: isOtpEnabled, error } = await supabase.rpc('check_user_otp_status', {
                user_email: email
            })

            if (error) throw error

            if (isOtpEnabled) {
                // If OTP enabled, send code and switch to OTP step
                const { error: otpError } = await supabase.auth.signInWithOtp({
                    email,
                    options: { shouldCreateUser: false }
                })
                if (otpError) throw otpError

                setStep('otp')
                toast.success(`Código enviado para ${email}`)
            } else {
                // Default: Password step
                setStep('password')
            }
        } catch (error: any) {
            console.error(error)
            toast.error('Erro ao verificar conta.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]; // Take first char
        if (!/^\d*$/.test(value)) return; // Only numbers

        const newOtp = [...otpCode];
        newOtp[index] = value;
        setOtpCode(newOtp);

        // Auto move focus
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = otpCode.join('')
        if (token.length < 6) {
            toast.error('O código deve ter 6 dígitos.')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email'
            })

            if (error) throw error

            // Successfully logged in
            toast.success('Login realizado com sucesso!')
            router.refresh()
            router.push('/')
        } catch (error: any) {
            toast.error('Código inválido ou expirado.')
        } finally {
            setLoading(false)
        }
    }

    const resendOtp = async () => {
        try {
            await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false }
            })
            toast.success('Novo código enviado!')
        } catch (error) {
            toast.error('Erro ao reenviar código.')
        }
    }

    // Determine what to render based on step
    return (
        <div className="w-full max-w-md bg-[#171916] rounded-[28px] p-8 shadow-[0_4px_12px_5px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="w-12 h-12 relative mb-2">
                    <img src="/wise-logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-manrope font-bold text-white">
                    {step === 'otp' ? 'Código de Verificação' : 'Bem-vindo de volta'}
                </h1>
                <p className="text-[#e8ebe6] opacity-60 font-inter text-sm text-center">
                    {step === 'otp'
                        ? `Enviamos um código para ${email}`
                        : 'Faça login para acessar sua conta'}
                </p>
            </div>

            {/* STEP 1: Email */}
            {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu e-mail"
                            required
                            autoFocus
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none focus:border-[#9fe870] transition-colors font-inter"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#9fe870] hover:bg-[#8fd860] text-[#163300] font-semibold py-3 rounded-xl transition-colors font-inter mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <>Continuar <ArrowRight size={20} /></>}
                    </button>

                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => signInWithGoogle()} className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 font-inter">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => signInWithApple()} className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 font-inter">
                            <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                            </svg>
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 2: Password */}
            {step === 'password' && (
                <form action={login} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <input type="hidden" name="email" value={email} />

                    <div className="bg-[#ffffff05] rounded-xl p-3 flex items-center justify-between border border-[#ffffff08]">
                        <span className="text-[#e8ebe6] text-sm">{email}</span>
                        <button type="button" onClick={() => setStep('email')} className="text-[#9fe870] text-xs hover:underline">Alterar</button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8ebe6] opacity-40" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Sua senha"
                            required
                            autoFocus
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-12 pr-4 text-base text-[#e8ebe6] placeholder:text-[#e8ebe6] placeholder:opacity-40 focus:outline-none focus:border-[#9fe870] transition-colors font-inter"
                        />
                    </div>

                    <div className="text-right">
                        <Link href="/forgot-password" className="text-xs text-[#a8aaac] hover:text-[#e8ebe6] hover:underline">
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <button type="submit" className="w-full bg-[#9fe870] hover:bg-[#8fd860] text-[#163300] font-semibold py-3 rounded-xl transition-colors font-inter mt-2">
                        Entrar
                    </button>
                </form>
            )}

            {/* STEP 3: OTP */}
            {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-[#ffffff05] rounded-xl p-3 flex items-center justify-between border border-[#ffffff08]">
                        <span className="text-[#e8ebe6] text-sm">{email}</span>
                        <button type="button" onClick={() => setStep('email')} className="text-[#9fe870] text-xs hover:underline">Alterar</button>
                    </div>

                    <div className="flex gap-2 justify-between">
                        {otpCode.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el: HTMLInputElement | null) => { otpRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-14 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-center text-xl text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors font-inter font-bold"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otpCode.join('').length < 6}
                        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 rounded-xl transition-colors font-inter mt-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Verificar Código'}
                    </button>

                    <div className="text-center">
                        <p className="text-[#a8aaac] text-sm mb-2">Não recebeu o código?</p>
                        <button type="button" onClick={resendOtp} className="text-[#e8ebe6] hover:underline text-sm font-semibold">
                            Reenviar código
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <button type="button" onClick={() => setStep('password')} className="text-[#9fe870] hover:underline text-sm font-semibold">
                            Prefiro usar minha senha
                        </button>
                    </div>
                </form>
            )}

            {step === 'email' && (
                <div className="mt-8 text-center">
                    <p className="text-[#e8ebe6] opacity-60 font-inter text-sm">
                        Não tem uma conta?{' '}
                        <Link href="/signup" className="text-[#9fe870] hover:underline opacity-100 font-semibold">
                            Registre-se agora
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#121511] flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Carregando...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
