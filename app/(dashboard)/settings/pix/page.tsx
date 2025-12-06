'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, QrCode, Save, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

type KeyType = 'cpf' | 'cnpj' | 'phone' | 'email' | 'random';

export default function PixSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [keyType, setKeyType] = useState<KeyType>('cpf');
    const [keyValue, setKeyValue] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchPixData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data, error } = await supabase
                .from('private_details')
                .select('pix_key, pix_key_type')
                .eq('id', user.id)
                .single();

            if (data) {
                if (data.pix_key_type) setKeyType(data.pix_key_type as KeyType);
                if (data.pix_key) setKeyValue(data.pix_key);
            }
            setFetching(false);
        };
        fetchPixData();
    }, [supabase]);

    const formatValue = (value: string, type: KeyType) => {
        // Remove non-numeric chars for numeric masks
        const numeric = value.replace(/\D/g, '');

        if (type === 'cpf') {
            return numeric
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }

        if (type === 'cnpj') {
            return numeric
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }

        if (type === 'phone') {
            // (11) 99999-9999
            return numeric
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }

        return value; // Email and Random key allow all chars (or specific validation)
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setKeyValue(formatValue(rawValue, keyType));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKeyType(e.target.value as KeyType);
        setKeyValue(''); // Reset value on type change to avoid format conflicts
    };

    const handleSave = async () => {
        if (!keyValue) {
            toast.error("Por favor, insira uma chave PIX.");
            return;
        }

        if (!userId) {
            toast.error("Usuário não identificado.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('private_details')
                .update({
                    pix_key: keyValue,
                    pix_key_type: keyType
                })
                .eq('id', userId);

            if (error) throw error;

            toast.success("Chave PIX atualizada com sucesso!");
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao salvar chave PIX.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto pb-20 font-inter flex justify-center pt-20">
                <Loader2 className="animate-spin text-[#9fe870]" />
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Meu PIX</h1>
            </div>

            <div className="space-y-8">
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#9fe870]">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#e8ebe6] font-semibold text-lg">Chave PIX</h2>
                            <p className="text-[#a8aaac] text-sm">Cadastre sua chave para receber pagamentos.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#ffffff08]">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Select Type - Smaller Width */}
                            <div className="w-full md:w-1/3 space-y-2">
                                <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Tipo de Chave</label>
                                <div className="relative">
                                    <select
                                        value={keyType}
                                        onChange={handleTypeChange}
                                        className="w-full bg-[#171916] border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="cpf">CPF</option>
                                        <option value="cnpj">CNPJ</option>
                                        <option value="phone">Telefone</option>
                                        <option value="email">E-mail</option>
                                        <option value="random">Chave Aleatória</option>
                                    </select>
                                    {/* Custom Arrow because appearance-none removes it */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8aaac]">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Input Value - Larger Width */}
                            <div className="w-full md:w-2/3 space-y-2">
                                <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Chave</label>
                                <input
                                    type={keyType === 'email' ? 'email' : 'text'}
                                    value={keyValue}
                                    onChange={handleValueChange}
                                    className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                    placeholder={
                                        keyType === 'cpf' ? '000.000.000-00' :
                                            keyType === 'cnpj' ? '00.000.000/0000-00' :
                                                keyType === 'phone' ? '(00) 00000-0000' :
                                                    keyType === 'email' ? 'exemplo@email.com' :
                                                        'Chave aleatória'
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleSave}
                                disabled={loading || !keyValue}
                                className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Salvar Chave
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
