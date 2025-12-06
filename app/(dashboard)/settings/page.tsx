'use client';

import React from 'react';
import Link from 'next/link';
import {
    User, MapPin, Sparkles,
    Lock, Mail, Key, Shield,
    CreditCard, QrCode, FileText,
    Inbox, HelpCircle, ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
    const sections = [
        {
            title: 'Dados Pessoais',
            items: [
                { label: 'Editar Perfil', icon: User, href: '/settings/profile' },
                { label: 'Endereço', icon: MapPin, href: '/settings/address' },
                { label: 'Meu plano', icon: Sparkles, href: '/settings/plan' },
            ]
        },
        {
            title: 'Privacidade',
            items: [
                { label: 'Alterar Senha', icon: Lock, href: '/settings/password' },
                { label: 'Alterar Email', icon: Mail, href: '/settings/email' },
                { label: 'Métodos de login', icon: Key, href: '/settings/methods' },
                { label: 'Políticas de privacidade', icon: Shield, href: '/settings/privacy' },
            ]
        },
        {
            title: 'Financeiro',
            items: [
                { label: 'Métodos de pagamento', icon: CreditCard, href: '/settings/payment-methods' },
                { label: 'Meu PIX', icon: QrCode, href: '/settings/pix' },
                { label: 'Histórico de Pagamentos', icon: FileText, href: '/settings/history' },
            ]
        },
        {
            title: 'Outros',
            items: [
                { label: 'Caixa de entrada', icon: Inbox, href: '/inbox' },
                { label: 'Central de ajuda', icon: HelpCircle, href: '/ajuda' },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-[#e8ebe6] mb-8">Configurações</h1>

            <div className="space-y-8">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h2 className="text-[#a8aaac] text-sm font-semibold uppercase tracking-wider mb-4 pl-2">
                            {section.title}
                        </h2>
                        <div className="bg-[#171916] rounded-2xl overflow-hidden border border-[#ffffff08]">
                            {section.items.map((item, itemIdx) => (
                                <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className={`
                                        flex items-center justify-between p-4 
                                        hover:bg-[#ffffff05] transition-colors
                                        ${itemIdx !== section.items.length - 1 ? 'border-b border-[#ffffff08]' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                                            <item.icon size={20} className="text-[#9fe870]" />
                                        </div>
                                        <span className="text-[#e8ebe6] font-medium">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[#a8aaac]" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
