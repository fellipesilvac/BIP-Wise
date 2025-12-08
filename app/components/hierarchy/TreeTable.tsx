'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Profile } from '@/app/types/profile';
import TreeRow from './TreeRow';
import { X, Search, FilterX, ChevronDown, Check, Coins, MessageCircle } from 'lucide-react';

interface TreeTableProps {
    onProfileClick?: (profile: Profile) => void;
}

// Custom Select Component
interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    icon?: React.ReactNode;
    placeholder: string;
}

function CustomSelect({ value, onChange, options, icon, placeholder }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className="relative min-w-[180px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Simple delay to allow click
                className={`w-full bg-[#171916] border ${isOpen ? 'border-[#9fe870]/50' : 'border-[#ffffff10]'} rounded-lg px-4 py-2 text-sm text-[#e8ebe6] flex items-center justify-between gap-3 transition-all hover:border-[#ffffff20]`}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-[#a8aaac]">{icon}</span>}
                    <span className={value === 'all' ? 'text-[#a8aaac]' : 'text-[#e8ebe6]'}>
                        {selectedLabel}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-[#a8aaac] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#171916] border border-[#ffffff10] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${value === option.value
                                ? 'bg-[#9fe870]/10 text-[#9fe870]'
                                : 'text-[#e8ebe6] hover:bg-[#ffffff05]'
                                }`}
                        >
                            {option.label}
                            {value === option.value && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TreeTable({ onProfileClick }: TreeTableProps) {
    const [roots, setRoots] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [whatsappFilter, setWhatsappFilter] = useState('all');
    const [isSearching, setIsSearching] = useState(false);

    // State for dynamic plans
    const [availablePlans, setAvailablePlans] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        // Fetch active plans for the filter
        async function fetchPlans() {
            const supabase = createClient();
            const { data } = await supabase
                .from('plans')
                .select('id, name')
                .eq('is_active', true)
                .order('price', { ascending: true }); // Order by price logically usually

            if (data) {
                setAvailablePlans(data);
            }
        }
        fetchPlans();
    }, []);

    // Debounce search term
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Check if any filter is active
    const hasActiveFilters = debouncedSearch.length > 0 || planFilter !== 'all' || whatsappFilter !== 'all';

    // Handler to clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setPlanFilter('all');
        setWhatsappFilter('all');
    };

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const supabase = createClient();
            let query = supabase
                .from('profiles')
                .select('*, subscriptions(status, plans(name))');

            if (hasActiveFilters) {
                setIsSearching(true);
                // Search Mode: Flat List
                if (debouncedSearch) {
                    query = query.or(`full_name.ilike.%${debouncedSearch}%,username.ilike.%${debouncedSearch}%`);
                }

                if (whatsappFilter !== 'all') {
                    if (whatsappFilter === 'yes') query = query.not('whatsapp', 'is', null);
                    if (whatsappFilter === 'no') query = query.is('whatsapp', null);
                }

                // Limit result for safety
                query = query.limit(50);

                const { data, error } = await query;

                if (data) {
                    let results = data as Profile[];

                    // Client-side Filter for Plan (Simplest approach for now)
                    if (planFilter !== 'all') {
                        results = results.filter(p => {
                            // Careful with case sensitivity
                            const pName = p.subscriptions?.[0]?.plans?.name || 'Gratuito';
                            return pName.toLowerCase() === planFilter.toLowerCase();
                        });
                    }

                    setRoots(results);
                }
            } else {
                setIsSearching(false);
                // Tree Mode: Hierarchical Roots (Start from Master or Current User's roots)
                const { data, error } = await query
                    .eq('username', 'usuario_master')
                    .single();

                if (data) {
                    setRoots([data as Profile]);
                }
            }

            setIsLoading(false);
        }

        loadData();
    }, [hasActiveFilters, debouncedSearch, planFilter, whatsappFilter]);

    // Helper options for CustomSelect
    const planOptions = [
        { value: 'all', label: 'Todos os Planos' },
        ...availablePlans.map(p => ({ value: p.name.toLowerCase(), label: p.name }))
    ];

    const whatsappOptions = [
        { value: 'all', label: 'WhatsApp (Todos)' },
        { value: 'yes', label: 'Com WhatsApp' },
        { value: 'no', label: 'Sem WhatsApp' },
    ];

    return (
        <div className="w-full flex flex-col gap-4 font-inter">

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8aaac]">
                        <Search size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#171916] border border-[#ffffff10] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e8ebe6] placeholder-[#a8aaac] focus:outline-none focus:border-[#9fe870]/50 transition-colors"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <CustomSelect
                        value={planFilter}
                        onChange={setPlanFilter}
                        options={planOptions}
                        icon={<Coins size={14} />}
                        placeholder="Planos"
                    />

                    <CustomSelect
                        value={whatsappFilter}
                        onChange={setWhatsappFilter}
                        options={whatsappOptions}
                        icon={<MessageCircle size={14} />}
                        placeholder="WhatsApp"
                    />

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg px-3 py-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm whitespace-nowrap font-medium h-[38px]"
                            title="Limpar todos os filtros"
                        >
                            <FilterX size={16} />
                            <span className="hidden md:inline">Limpar Filtros</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full bg-[#171916] border border-[#ffffff08] rounded-[16px] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header */}
                        <div className="grid grid-cols-[minmax(250px,3fr)_1.2fr_100px_120px_140px] gap-4 items-center bg-[#ffffff03] border-b border-[#ffffff08] py-3 px-6 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">
                            <div>Nome da Conta</div>
                            <div>Username</div>
                            <div>Status</div>
                            <div>Plano</div>
                            <div>WhatsApp</div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col">
                            {roots.length === 0 && !isLoading && (
                                <div className="p-8 text-center text-[#a8aaac] text-sm">
                                    Nenhum resultado encontrado para os filtros selecionados.
                                </div>
                            )}

                            {roots.map(root => (
                                <TreeRow
                                    key={root.id}
                                    profile={root}
                                    level={0} // In search mode (flat), level is always 0
                                    onProfileClick={onProfileClick}
                                    disableExpansion={isSearching}
                                />
                            ))}
                        </div>

                        {isLoading && (
                            <div className="p-8 text-[#a8aaac] text-sm flex items-center justify-center gap-2">
                                <div className="w-3 h-3 rounded-full border-2 border-[#9fe870] border-t-transparent animate-spin"></div>
                                Carregando...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
