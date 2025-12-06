'use client';

import React, { useState } from 'react';
import TreeTable from '@/app/components/hierarchy/TreeTable';
import ProfileDrawer from '@/app/components/ProfileDrawer';
import { Profile } from '@/app/types/profile';

export default function Indicacoes() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1200px] pb-10 relative z-[2] px-4 md:px-0">
            <div className="flex flex-col gap-2 mt-8">
                <h1 className="text-[#e8ebe6] text-3xl font-bold font-manrope">Minhas Indicações</h1>
                <p className="text-[#a8aaac] text-base">
                    Visualize e gerencie sua rede de indicações em tempo real.
                </p>
            </div>

            <div className="mt-4">
                <TreeTable onProfileClick={setSelectedProfile} />
            </div>

            <div className="mt-8 p-4 rounded-lg bg-[#9fe870]/5 border border-[#9fe870]/10 text-[#a8aaac] text-xs">
                <p>
                    <strong className="text-[#9fe870]">Dica:</strong> Clique na seta ao lado do nome para ver os indicados (filhos). Clique no nome para ver detalhes do perfil.
                </p>
            </div>

            <ProfileDrawer
                isOpen={!!selectedProfile}
                onClose={() => setSelectedProfile(null)}
                profile={selectedProfile}
            />
        </div>
    );
}

