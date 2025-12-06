'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home as HomeIcon,
    FileText,
    TrendingUp,
    LifeBuoy
} from 'lucide-react'

type MobileNavItemProps = {
    icon: React.ReactNode
    label: string
    isActive?: boolean
    onClick?: () => void
    href?: string
}

function MobileNavItem({ icon, label, isActive = false, onClick, href }: MobileNavItemProps) {
    const className = `flex-1 flex flex-col items-center justify-center gap-1 py-3 px-0 rounded-xl transition-colors ${isActive ? 'text-[#9fe870]' : 'text-[#e8ebe6] opacity-60 hover:opacity-100'
        }`

    const content = (
        <>
            <div className="w-6 h-6">
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </>
    )

    if (href) {
        return (
            <Link href={href} className={className} onClick={onClick}>
                {content}
            </Link>
        )
    }

    return (
        <button
            onClick={onClick}
            className={className}
        >
            {content}
        </button>
    )
}

export default function MobileNavbar() {
    const pathname = usePathname();
    const isIndicacoesActive = pathname.startsWith('/indicacoes') || pathname === '/carteira' || pathname === '/academy';

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm bg-[rgba(23,25,22,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px] overflow-hidden z-50 md:hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center w-full">
                <MobileNavItem
                    icon={<HomeIcon className="w-6 h-6" />}
                    label="Início"
                    href="/"
                    isActive={pathname === '/'}
                />
                <MobileNavItem
                    icon={<FileText className="w-6 h-6" />}
                    label="Plano"
                    href="/meu-plano"
                    isActive={pathname === '/meu-plano'}
                />
                <MobileNavItem
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Indicações"
                    href="/indicacoes"
                    isActive={isIndicacoesActive}
                />
                <MobileNavItem
                    icon={<LifeBuoy className="w-6 h-6" />}
                    label="Ajuda"
                    href="/ajuda"
                    isActive={pathname === '/ajuda'}
                />
            </div>
        </div>
    )
}
