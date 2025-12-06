'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Save, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AddressSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Form Query
    const [cepLoading, setCepLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: ''
    });

    // Initial Data for Dirty State
    const [initialData, setInitialData] = useState({
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: ''
    });

    // Determine if form has changes
    const hasChanges =
        formData.zipCode !== initialData.zipCode ||
        formData.street !== initialData.street ||
        formData.number !== initialData.number ||
        formData.complement !== initialData.complement ||
        formData.district !== initialData.district ||
        formData.city !== initialData.city ||
        formData.state !== initialData.state;

    // Fetch User Data
    useEffect(() => {
        const fetchAddress = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            const { data: details } = await supabase
                .from('private_details')
                .select('address_zip, address_street, address_number, address_complement, address_district, address_city, address_state')
                .eq('id', user.id)
                .single();

            if (details) {
                const loadedData = {
                    zipCode: details.address_zip || '',
                    street: details.address_street || '',
                    number: details.address_number || '',
                    complement: details.address_complement || '',
                    district: details.address_district || '',
                    city: details.address_city || '',
                    state: details.address_state || ''
                };
                setFormData(loadedData);
                setInitialData(loadedData);
            }

            setLoading(false);
        };

        fetchAddress();
    }, [supabase]);

    // CEP Auto-fill
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        // Apply masking 00000-000
        let formattedValue = value;
        if (value.length > 5) {
            formattedValue = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }

        setFormData(prev => ({ ...prev, zipCode: formattedValue }));

        // Search CEP when complete (8 digits)
        if (value.length === 8) {
            searchCep(value);
        }
    };

    const searchCep = async (cep: string) => {
        try {
            setCepLoading(true);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error('CEP não encontrado.');
                return;
            }

            setFormData(prev => ({
                ...prev,
                street: data.logradouro || prev.street,
                district: data.bairro || prev.district,
                city: data.localidade || prev.city,
                state: data.uf || prev.state,
            }));
            toast.success('Endereço encontrado!');
        } catch (error) {
            toast.error('Erro ao buscar CEP.');
        } finally {
            setCepLoading(false);
        }
    };

    const handleUndo = () => {
        setFormData(initialData);
        toast.info("Alterações desfeitas.");
    };

    // Save Data
    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from('private_details')
                .upsert({
                    id: userId,
                    address_zip: formData.zipCode,
                    address_street: formData.street,
                    address_number: formData.number,
                    address_complement: formData.complement,
                    address_district: formData.district,
                    address_city: formData.city,
                    address_state: formData.state,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setInitialData(formData);
            toast.success('Endereço atualizado com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao salvar endereço.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[#9fe870] animate-spin" />
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
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Endereço</h1>
            </div>

            <div className="space-y-8">
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl p-6 space-y-6">
                    <h2 className="text-[#e8ebe6] font-semibold mb-4">Localização</h2>

                    {/* CEP Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">CEP</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={handleCepChange}
                                    maxLength={9}
                                    className="w-full bg-transparent border border-[#ffffff10] rounded-xl pl-4 pr-10 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                    placeholder="00000-000"
                                />
                                {cepLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 size={16} className="text-[#9fe870] animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* City / State Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Cidade</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors disabled:opacity-50"
                                placeholder="Cidade"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Estado (UF)</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                maxLength={2}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors uppercase disabled:opacity-50"
                                placeholder="UF"
                            />
                        </div>
                    </div>

                    {/* Neighborhood Row */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Bairro</label>
                        <input
                            type="text"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                            placeholder="Seu bairro"
                        />
                    </div>

                    {/* Street Row */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Endereço (Rua, Av...)</label>
                        <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                            placeholder="Nome da rua"
                        />
                    </div>

                    {/* Number / Complement Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Número</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="123"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Complemento</label>
                            <input
                                type="text"
                                value={formData.complement}
                                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                                className="w-full bg-transparent border border-[#ffffff10] rounded-xl px-4 py-3 text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] transition-colors"
                                placeholder="Apto, Bloco..."
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {hasChanges && (
                    <div className="flex justify-end gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={handleUndo}
                            disabled={!hasChanges || saving}
                            className="px-6 py-3 rounded-full text-[#a8aaac] hover:bg-[#ffffff05] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Desfazer ações
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="px-8 py-3 rounded-full bg-[#9fe870] text-[#163300] hover:bg-[#8fd860] transition-all font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Salvar Alterações
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
