'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function IndiquePage() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-[1200px] pb-10">
            {/* Hero Section */}
            <div className="bg-[#163300] rounded-[24px] p-8 md:p-12 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 flex flex-col gap-6">
                        <h1 className="text-[#9fe870] text-[3.2rem] font-bold font-manrope leading-[1.1] tracking-tight">
                            Compartilhe a<br />Wise e ganhe<br />R$ 80
                        </h1>
                        <p className="text-[#e8ebe6] text-base md:text-lg leading-relaxed max-w-md">
                            Para cada 3 amigos que transferirem mais de R$ 800, enviaremos R$ 80 para você.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <button className="bg-[#9fe870] hover:bg-[#8fd860] text-[#163300] font-semibold py-3 px-6 rounded-[24px] transition-colors">
                                Copiar link de convite
                            </button>
                        </div>
                        <Link href="#" className="flex items-center gap-2 text-[#9fe870] font-semibold mt-2 hover:underline">
                            Como funciona o programa de convites?
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Illustration */}
                    <div className="flex-1 w-full max-w-[500px] flex items-center justify-center">
                        <img
                            src="/assets/indique/host-action.png"
                            alt="Convide amigos"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[24px] p-8 flex flex-col gap-6 items-start">

                    <div className="h-[120px] w-full flex items-center justify-center">
                        <img src="/assets/indique/megaphone.png" alt="Convide" className="h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-[#e8ebe6]">Convide amigos</h3>
                        <p className="text-[#a8aaac] text-sm leading-relaxed">
                            Compartilhe seu link de convite com amigos. Eles ganham uma transferência sem tarifas de até R$ 3.000.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[24px] p-8 flex flex-col gap-6 items-start">

                    <div className="h-[120px] w-full flex items-center justify-center">
                        <img src="/assets/indique/globe.png" alt="Transfiram" className="h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-[#e8ebe6]">Eles transferem</h3>
                        <p className="text-[#a8aaac] text-sm leading-relaxed">
                            Quando 3 amigos transferirem mais de R$ 800 em uma única transação, eles se qualificam.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[rgba(255,255,255,0.05)] rounded-[24px] p-8 flex flex-col gap-6 items-start">

                    <div className="h-[120px] w-full flex items-center justify-center">
                        <img src="/assets/indique/monetary.png" alt="Ganhe" className="h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-[#e8ebe6]">Você ganha</h3>
                        <p className="text-[#a8aaac] text-sm leading-relaxed">
                            Enviaremos R$ 80 para sua conta assim que os 3 amigos se qualificarem.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[#a8aaac] text-xs text-center mt-4 opacity-60">
                Aplicam-se os Termos e Condições do programa de convites.
            </p>
        </div>
    );
}
