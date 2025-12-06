'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Clock } from 'lucide-react';

export default function PaymentMethodsPage() {
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
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Métodos de pagamento</h1>
            </div>

            {/* Empty State */}
            <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#9fe870]/10 flex items-center justify-center text-[#9fe870] mb-2">
                    <CreditCard size={40} />
                </div>

                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold text-[#e8ebe6]">Gerenciamento de pagamentos</h2>
                    <p className="text-[#a8aaac] leading-relaxed">
                        Em breve você poderá adicionar, remover e gerenciar seus cartões de crédito e outras formas de pagamento diretamente por aqui.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#9fe870] bg-[#9fe870]/10 px-4 py-2 rounded-full uppercase tracking-wider">
                    <Clock size={14} />
                    <span>Em breve</span>
                </div>
            </div>
        </div>
    );
}
