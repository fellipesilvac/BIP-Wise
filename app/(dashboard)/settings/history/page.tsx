'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Filter, ArrowUpDown, CreditCard, QrCode, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

// DB Types
type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

interface Invoice {
    id: string;
    issue_date: string; // ISO String
    description: string;
    amount: number;
    status: InvoiceStatus;
    receipt_url?: string;
    subscription_id: string;
}

export default function PaymentHistoryPage() {
    const supabase = createClient();
    const [payments, setPayments] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;

    // Filters
    const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
    const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLTableRowElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchPayments = async (pageNum: number) => {
        setLoading(true);
        try {
            const from = pageNum * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let query = supabase
                .from('invoices')
                .select('*', { count: 'exact' })
                .range(from, to)
                .order('issue_date', { ascending: dateSort === 'asc' });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            if (data) {
                setPayments(prev => pageNum === 0 ? data : [...prev, ...data]);
                // Check if we reached the end
                setHasMore(data.length === PAGE_SIZE);
            }
        } catch (error: any) {
            console.error('Error fetching invoices:', error);
            toast.error('Erro ao carregar histórico de pagamentos.');
        } finally {
            setLoading(false);
        }
    };

    // Reset list when filters change
    useEffect(() => {
        setPage(0);
        setPayments([]);
        setHasMore(true);
        fetchPayments(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, dateSort]);

    // Infinite Scroll load
    useEffect(() => {
        if (page > 0) {
            fetchPayments(page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const formatDate = (isoString: string) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
        const styles = {
            paid: 'bg-[#9fe870]/10 text-[#9fe870] border border-[#9fe870]/20',
            pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
            overdue: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border border-red-500/20'
        };

        const labels = {
            paid: 'Pago',
            pending: 'Pendente',
            overdue: 'Atrasado',
            cancelled: 'Cancelado'
        };

        const icons = {
            paid: CheckCircle2,
            pending: Clock,
            overdue: AlertCircle,
            cancelled: XCircle
        };

        const Icon = icons[status] || Clock;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${styles[status]}`}>
                <Icon size={12} />
                {labels[status]}
            </span>
        );
    };

    // Helper to guess payment type from description since we don't have a column for it yet
    const getPaymentIcon = (description: string) => {
        const lowerDesc = (description || '').toLowerCase();
        if (lowerDesc.includes('pix')) return <QrCode size={16} className="text-[#a8aaac]" />;
        return <CreditCard size={16} className="text-[#a8aaac]" />;
    };

    const getPaymentLabel = (description: string) => {
        const lowerDesc = (description || '').toLowerCase();
        if (lowerDesc.includes('pix')) return 'PIX';
        return 'Cartão'; // Default
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 font-inter">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/settings"
                    className="w-10 h-10 rounded-full bg-[#ffffff05] border border-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff10] transition-colors group"
                >
                    <ArrowLeft size={20} className="text-[#a8aaac] group-hover:text-[#e8ebe6] transition-colors" />
                </Link>
                <h1 className="text-2xl font-bold text-[#e8ebe6]">Histórico de Pagamentos</h1>
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8aaac]">
                                <Filter size={16} />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-[#171916] border border-[#ffffff10] rounded-xl pl-10 pr-8 py-2 text-sm text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] appearance-none cursor-pointer hover:bg-[#ffffff05] transition-colors"
                            >
                                <option value="all">Todos os status</option>
                                <option value="paid">Pagos</option>
                                <option value="pending">Pendentes</option>
                                <option value="overdue">Atrasados</option>
                                <option value="cancelled">Cancelados</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8aaac]">
                                <ArrowUpDown size={16} />
                            </div>
                            <select
                                value={dateSort}
                                onChange={(e) => setDateSort(e.target.value as any)}
                                className="bg-[#171916] border border-[#ffffff10] rounded-xl pl-10 pr-8 py-2 text-sm text-[#e8ebe6] focus:outline-none focus:border-[#9fe870] appearance-none cursor-pointer hover:bg-[#ffffff05] transition-colors"
                            >
                                <option value="desc">Mais recentes</option>
                                <option value="asc">Mais antigos</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#171916] border border-[#ffffff08] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#ffffff08] bg-[#ffffff02]">
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Data</th>
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Tipo</th>
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Descrição</th>
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Valor</th>
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-[#a8aaac] uppercase tracking-wider text-right">Recibo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ffffff05]">
                                {payments.length > 0 ? (
                                    payments.map((payment, index) => {
                                        const isLast = index === payments.length - 1;
                                        return (
                                            <tr
                                                key={payment.id}
                                                ref={isLast ? lastElementRef : null}
                                                className="hover:bg-[#ffffff02] transition-colors"
                                            >
                                                <td className="p-4 text-sm text-[#e8ebe6] whitespace-nowrap">
                                                    {formatDate(payment.issue_date)}
                                                </td>
                                                <td className="p-4 text-sm text-[#e8ebe6]">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentIcon(payment.description)}
                                                        <span className="capitalize">{getPaymentLabel(payment.description)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-[#e8ebe6]">{payment.description || '-'}</td>
                                                <td className="p-4 text-sm font-medium text-[#e8ebe6]">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="p-4">
                                                    <StatusBadge status={payment.status} />
                                                </td>
                                                <td className="p-4 text-right">
                                                    {payment.receipt_url ? (
                                                        <a
                                                            href={payment.receipt_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center p-2 rounded-lg text-[#a8aaac] hover:text-[#e8ebe6] hover:bg-[#ffffff05] transition-colors"
                                                            title="Baixar Recibo"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    ) : (
                                                        <span className="text-[#a8aaac]/30 text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    !loading && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 rounded-full bg-[#ffffff05] flex items-center justify-center text-[#a8aaac]">
                                                        <FileText size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#e8ebe6] font-medium">Nenhum pagamento encontrado</p>
                                                        <p className="text-[#a8aaac] text-sm mt-1">
                                                            Não há registros correspondentes aos filtros selecionados.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {loading && (
                        <div className="p-6 flex justify-center">
                            <Loader2 className="w-6 h-6 text-[#9fe870] animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
