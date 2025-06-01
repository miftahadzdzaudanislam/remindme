import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Log Aktivitas',
        href: '/logs',
    },
];

interface Log {
    id: number;
    user_id: number;
    activity: string;
    details?: string;
    ip_address: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface LogsPagination {
    data: Log[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Index() {
    const { logs } = usePage<{logs: LogsPagination}>().props;
    const logData = logs.data ?? [];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus log ini?')) {
            router.delete(route('logs.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Log Aktivitas</h1>
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="border p-2">No.</th>
                            <th className="border p-2">User</th>
                            <th className="border p-2">Aktivitas</th>
                            <th className="border p-2">Detail</th>
                            <th className="border p-2">IP Address</th>
                            <th className="border p-2">Waktu</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center p-4 border">
                                    Tidak ada data log.
                                </td>
                            </tr>
                        )}
                        {logData.map((log, idx) => (
                            <tr key={log.id}>
                                <td className="border p-2">{idx + 1 + (logs.current_page - 1) * 10}</td>
                                <td className="border p-2">{log.user?.name} <br />
                                    <span className="text-xs text-gray-500">{log.user?.email}</span>
                                </td>
                                <td className="border p-2">{log.activity}</td>
                                <td className="border p-2">{log.details || '-'}</td>
                                <td className="border p-2">{log.ip_address}</td>
                                <td className="border p-2">{dayjs(log.created_at).format('DD MMM YYYY HH:mm')}</td>
                                <td className="border p-2">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(log.id)}
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {logs.links.map((link, idx) => (
                        <Button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
