'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock, AlertCircle } from 'lucide-react';

export default function MyPlanSettingsPage() {
    return (
        <div className="max-w-3xl mx-auto pb-20 font-inter">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-[#ffffff05] border border-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff10] transition-colors group"
                >
                    <ArrowLeft size={20} className="text-[#a8aaac] group-hover:text-[#e8ebe6] transition-colors" />
                </Link>
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Meu Plano</h1>
            </div>

            {/* Empty State */}
            <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#9fe870]/10 flex items-center justify-center text-[#9fe870] mb-2">
                    <Sparkles size={40} />
                </div>

                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold text-[#e8ebe6]">Novidades em breve!</h2>
                    <p className="text-[#a8aaac] leading-relaxed">
                        Estamos preparando uma nova experiência para você gerenciar seu plano e assinatura.
                        Em breve você poderá visualizar faturas, mudar de plano e muito mais por aqui.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#9fe870] bg-[#9fe870]/10 px-4 py-2 rounded-full uppercase tracking-wider">
                    <Clock size={14} />
                    <span>Aguarde as atualizações</span>
                </div>
            </div>
        </div>
    );
}
