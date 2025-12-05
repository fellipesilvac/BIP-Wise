'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home as HomeIcon,
    FileText,
    TrendingUp,
    Wallet,
    Users,
    GraduationCap,
    LifeBuoy,
    Settings,
    ChevronDown
} from 'lucide-react';

const imgImage1 = "/wise-logo.png";

type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    hasDropdown?: boolean;
    isExpanded?: boolean;
    className?: string;
    onClick?: () => void;
    href?: string;
};

function MenuItem({ icon, label, isActive = false, hasDropdown = false, isExpanded = false, className = "", onClick, href }: MenuItemProps) {
    const content = (
        <div
            onClick={onClick}
            className={`box-border flex gap-3.5 items-center px-4 py-3 relative rounded-[60px] shrink-0 w-full cursor-pointer transition-colors select-none ${isActive
                ? 'bg-[rgba(255,255,255,0.1)]'
                : 'hover:bg-[rgba(255,255,255,0.05)]'
                } ${className}`}>
            <div className="relative shrink-0 w-6 h-6 flex items-center justify-center">
                {icon}
            </div>
            <p className={`flex-1 font-semibold leading-[1.4] relative shrink-0 text-sm ${isActive ? 'text-[#9fe870]' : 'text-[#e8ebe6]'
                }`}>
                {label}
            </p>
            {hasDropdown && (
                <ChevronDown className={`w-4 h-4 text-[#e8ebe6] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            )}
        </div>
    );

    if (href) {
        return <Link href={href} className="w-full">{content}</Link>;
    }

    return content;
}

export default function Sidebar() {
    const [isIndicacoesExpanded, setIsIndicacoesExpanded] = useState(true);
    const pathname = usePathname();
    const isIndicacoesActive = pathname.startsWith('/indicacoes') || pathname === '/carteira' || pathname === '/academy';

    return (
        <div className="hidden md:flex box-border flex-col items-start overflow-hidden px-6 py-0 shrink-0 sticky top-0 w-[280px] h-screen" data-node-id="28:78">
            <div className="box-border flex flex-col gap-2.5 h-[140px] items-start justify-center px-4 py-0 relative shrink-0 w-full" data-node-id="28:79">
                <div className="h-6 relative shrink-0 w-[106px]" data-name="image 1" data-node-id="28:80">
                    <img alt="Wise Logo" className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full" src={imgImage1} />
                </div>
            </div>
            <div className="flex flex-col gap-0.5 items-start relative shrink-0 w-full" data-node-id="28:81">
                <MenuItem
                    icon={<HomeIcon className={`w-6 h-6 ${pathname === '/' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                    label="Página Inicial"
                    isActive={pathname === '/'}
                    href="/"
                />
                <MenuItem
                    icon={<FileText className={`w-6 h-6 ${pathname === '/meu-plano' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                    label="Meu Plano"
                    isActive={pathname === '/meu-plano'}
                    href="/meu-plano"
                />
                <MenuItem
                    icon={<TrendingUp className={`w-6 h-6 ${isIndicacoesActive ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                    label="Indicações"
                    hasDropdown={true}
                    isExpanded={isIndicacoesExpanded}
                    onClick={() => setIsIndicacoesExpanded(!isIndicacoesExpanded)}
                />
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isIndicacoesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="box-border flex flex-col items-start pl-6 pr-0 py-0 relative shrink-0 w-full" data-node-id="28:85">
                            <MenuItem
                                icon={<Wallet className={`w-6 h-6 ${pathname === '/carteira' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                                label="Carteira"
                                isActive={pathname === '/carteira'}
                                href="/carteira"
                            />
                            <MenuItem
                                icon={<Users className={`w-6 h-6 ${pathname === '/indicacoes' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                                label="Minhas indicações"
                                isActive={pathname === '/indicacoes'}
                                href="/indicacoes"
                            />
                            <MenuItem
                                icon={<GraduationCap className={`w-6 h-6 ${pathname === '/academy' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                                label="Academy"
                                isActive={pathname === '/academy'}
                                href="/academy"
                            />
                        </div>
                    </div>
                </div>
                <MenuItem
                    icon={<LifeBuoy className={`w-6 h-6 ${pathname === '/ajuda' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                    label="Central de Ajuda"
                    isActive={pathname === '/ajuda'}
                    href="/ajuda"
                />
                <MenuItem
                    icon={<Settings className={`w-6 h-6 ${pathname === '/configuracoes' ? 'text-[#9fe870]' : 'text-[#e8ebe6]'}`} />}
                    label="Configurações"
                    isActive={pathname === '/configuracoes'}
                    href="/configuracoes"
                />
            </div>
        </div>
    );
}
