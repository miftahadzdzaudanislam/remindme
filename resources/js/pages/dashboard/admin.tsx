import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/dashboard-admin',
    },
];

interface Log {
    id: number;
    user: {
        name: string;
        email: string;
    };
    activity: string;
    details: string;
    created_at: string;
}

interface IndexProps extends PageProps {
    totalStudents: number;
    activeToday: number;
    totalActivities: number;
    recentLogs: Log[];
}

export default function AdminDashboard() {
    // Ambil props dari backend lewat usePage().props
    const { totalStudents, activeToday, totalActivities, recentLogs } = usePage<IndexProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6 text-center">
                        <h2 className="text-lg font-semibold">Total Mahasiswa</h2>
                        <p className="mt-2 text-3xl font-bold">{totalStudents}</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6 text-center">
                        <h2 className="text-lg font-semibold">Mahasiswa Aktif Hari Ini</h2>
                        <p className="mt-2 text-3xl font-bold">{activeToday}</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-6 text-center">
                        <h2 className="text-lg font-semibold">Total Aktivitas 7 Hari Terakhir</h2>
                        <p className="mt-2 text-3xl font-bold">{totalActivities}</p>
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                    <h2 className="mb-4 text-xl font-semibold">Aktivitas Terbaru</h2>
                    {recentLogs.length === 0 && (
                        <p className="text-center text-gray-500">Belum ada aktivitas.</p>
                    )}
                    {recentLogs.map((log) => (
                        <div key={log.id} className="border-b border-gray-200 py-3 last:border-b-0">
                            <div className="font-semibold">{log.user.name}</div>
                            <div className="text-sm text-gray-600">{log.user.email}</div>
                            <div className="mt-1">
                                <span className="font-medium">{log.activity}:</span> {log.details}
                            </div>
                            <div className="text-xs text-gray-400 text-right">
                                {dayjs(log.created_at).format('dddd, HH:mm A')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
