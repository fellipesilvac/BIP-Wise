import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
    User,
    Settings,
    LifeBuoy,
    BookOpen,
    LogOut,
    Sparkles
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '@/app/hooks/useUser'
import ProfileDrawer from '@/app/components/ProfileDrawer'

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()
    const { user, profile, loading } = useUser()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Erro ao sair da conta')
        } else {
            router.push('/login')
        }
    }

    if (loading) {
        return <div className="w-12 h-12 rounded-full bg-[#ffffff05] animate-pulse" />
    }

    if (!user) return null

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative rounded-[60px] shrink-0 w-12 h-12 transition-transform hover:scale-105 focus:outline-none"
                >
                    <div className="absolute inset-0 rounded-[60px] overflow-hidden border-2 border-transparent hover:border-[#9fe870] transition-colors">
                        {user.avatar_url ? (
                            <img
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                                src={user.avatar_url}
                            />
                        ) : (
                            <div className="w-full h-full bg-[#ffffff05] flex items-center justify-center text-[#e8ebe6]">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                </button>

                {/* Dropdown Menu */}
                <div
                    className={`
            absolute right-0 top-14 w-[280px] bg-[#171916] rounded-[24px] 
            shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)]
            overflow-hidden transition-all duration-200 origin-top-right z-50
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}
                >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#ffffff05]">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={16} className="text-[#a8aaac]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[#e8ebe6] font-manrope font-bold text-sm truncate">{user.name}</p>
                                <p className="text-[#e8ebe6] opacity-60 font-inter text-xs truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 flex flex-col gap-1">
                        <button
                            onClick={() => {
                                setIsDrawerOpen(true)
                                setIsOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors group text-left"
                        >
                            <User className="w-4 h-4 text-[#e8ebe6] opacity-60 group-hover:opacity-100 group-hover:text-[#9fe870] transition-all" />
                            <span className="text-[#e8ebe6] font-inter text-sm flex-1">Meu Perfil</span>
                        </button>

                        <Link href="/settings" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors group text-left">
                            <Settings className="w-4 h-4 text-[#e8ebe6] opacity-60 group-hover:opacity-100 group-hover:text-[#9fe870] transition-all" />
                            <span className="text-[#e8ebe6] font-inter text-sm flex-1">Configurações</span>
                        </Link>

                        <Link href="/ajuda" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors group text-left">
                            <LifeBuoy className="w-4 h-4 text-[#e8ebe6] opacity-60 group-hover:opacity-100 group-hover:text-[#9fe870] transition-all" />
                            <span className="text-[#e8ebe6] font-inter text-sm flex-1">Suporte</span>
                        </Link>

                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors group text-left">
                            <BookOpen className="w-4 h-4 text-[#e8ebe6] opacity-60 group-hover:opacity-100 group-hover:text-[#9fe870] transition-all" />
                            <span className="text-[#e8ebe6] font-inter text-sm flex-1">Guias</span>
                        </button>
                    </div>

                    {/* Plan Section */}
                    <div className="mx-2 mb-2 p-3 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-[#9fe870]" />
                                <span className="text-[#e8ebe6] font-manrope font-bold text-xs">Plano {user.plan}</span>
                            </div>
                            <Link href="/meu-plano" className="text-[#9fe870] text-[10px] font-bold hover:underline">
                                GERENCIAR
                            </Link>
                        </div>
                        <p className="text-[#e8ebe6] opacity-40 font-inter text-[10px] leading-relaxed">
                            Você tem acesso a todos os recursos premium e suporte prioritário.
                        </p>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-[rgba(255,255,255,0.05)]">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,60,60,0.1)] transition-colors group text-left"
                        >
                            <LogOut className="w-4 h-4 text-[#e8ebe6] opacity-60 group-hover:opacity-100 group-hover:text-red-400 transition-all" />
                            <span className="text-[#e8ebe6] font-inter text-sm flex-1 group-hover:text-red-400 transition-colors">Sair da conta</span>
                        </button>
                    </div>
                </div>
            </div>

            <ProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                profile={profile}
            />
        </>
    )
}
