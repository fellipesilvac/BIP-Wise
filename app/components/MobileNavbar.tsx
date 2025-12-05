'use client'

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
}

function MobileNavItem({ icon, label, isActive = false, onClick }: MobileNavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors ${isActive ? 'text-[#9fe870]' : 'text-[#e8ebe6] opacity-60 hover:opacity-100'
                }`}
        >
            <div className="w-6 h-6">
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    )
}

export default function MobileNavbar() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm bg-[rgba(23,25,22,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-[32px] px-2 py-2 z-50 md:hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between px-2">
                <MobileNavItem
                    icon={<HomeIcon className="w-6 h-6" />}
                    label="Início"
                    isActive={true}
                />
                <MobileNavItem
                    icon={<FileText className="w-6 h-6" />}
                    label="Plano"
                />
                <MobileNavItem
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Indicações"
                />
                <MobileNavItem
                    icon={<LifeBuoy className="w-6 h-6" />}
                    label="Ajuda"
                />
            </div>
        </div>
    )
}
