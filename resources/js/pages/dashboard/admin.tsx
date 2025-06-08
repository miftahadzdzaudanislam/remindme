import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Activity, ClipboardList, Clock, Users } from 'lucide-react'; // Icon dari Lucide

dayjs.extend(relativeTime);

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
    const { totalStudents, activeToday, totalActivities, recentLogs } = usePage<IndexProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            <div className="flex min-h-screen flex-col gap-6 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 dark:from-gray-900 dark:to-gray-800">
                <h1 className="text-3xl font-bold text-indigo-800 dark:text-white">🎓 Dashboard Admin</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Total Mahasiswa */}
                    <div className="rounded-2xl border border-indigo-300 bg-indigo-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-indigo-700 dark:bg-indigo-900">
                        <div className="mb-3 flex items-center gap-3 text-indigo-900 dark:text-white">
                            <Users className="h-6 w-6" />
                            <h2 className="text-lg font-semibold">Total Mahasiswa</h2>
                        </div>
                        <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-200">{totalStudents}</p>
                    </div>

                    {/* Mahasiswa Aktif Hari Ini */}
                    <div className="rounded-2xl border border-yellow-300 bg-yellow-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-yellow-700 dark:bg-yellow-900">
                        <div className="mb-3 flex items-center gap-3 text-yellow-800 dark:text-yellow-100">
                            <Clock className="h-6 w-6" />
                            <h2 className="text-lg font-semibold">Aktif Hari Ini</h2>
                        </div>
                        <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">{activeToday}</p>
                    </div>

                    {/* Total Aktivitas */}
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-emerald-700 dark:bg-emerald-900">
                        <div className="mb-3 flex items-center gap-3 text-emerald-800 dark:text-emerald-100">
                            <Activity className="h-6 w-6" />
                            <h2 className="text-lg font-semibold">Total Aktivitas</h2>
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">{totalActivities}</p>
                    </div>
                </div>

                {/* Aktivitas Terbaru */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-3 text-gray-800 dark:text-white">
                        <ClipboardList className="h-6 w-6 text-indigo-800 dark:text-white" />
                        <h2 className="text-xl font-semibold text-indigo-800 dark:text-white">Aktivitas Terbaru</h2>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto pr-2">
                        {recentLogs.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">Belum ada aktivitas.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentLogs.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className={`rounded-xl p-4 ${
                                            index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'
                                        }`}
                                    >
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">{log.user.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-300">{log.user.email}</div>
                                        <div className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-200">
                                            <span className="font-medium">{log.activity}:</span> {log.details}
                                        </div>
                                        <div className="mt-1 text-right text-xs text-gray-400 dark:text-gray-400">
                                            {dayjs(log.created_at).fromNow()} • {dayjs(log.created_at).format('HH:mm')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
