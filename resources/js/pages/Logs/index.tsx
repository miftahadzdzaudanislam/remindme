import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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

// Badge warna untuk aktivitas
function ActivityBadge({ activity }: { activity: string }) {
    let color = 'bg-gray-100 text-gray-700 border-gray-300';
    // Contoh mapping, sesuaikan dengan kebutuhan aktivitas di sistem Anda
    if (/login|masuk/i.test(activity)) color = 'bg-green-100 text-green-700 rounded-full';
    else if (/logout|keluar/i.test(activity)) color = 'bg-gray-200 text-gray-600 rounded-full ';
    else if (/hapus|delete/i.test(activity)) color = 'bg-red-100 text-red-700 rounded-full';
    else if (/edit|ubah|update/i.test(activity)) color = 'bg-yellow-100 text-yellow-700 rounded-full';
    else if (/tambah|add|create/i.test(activity)) color = 'bg-blue-100 text-blue-700 rounded-full';

    return <span className={`inline-block rounded border px-2 py-1 text-xs font-semibold ${color}`}>{activity}</span>;
}

export default function Index() {
    const { logs } = usePage<{ logs: LogsPagination }>().props;
    const logData = logs.data ?? [];

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Yakin ingin menghapus log ini?',
            text: 'Tindakan ini tidak dapat dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1E63B0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('logs.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Log telah berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#1E63B0',
                        });
                    },
                    onError: () => {
                        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus log.', 'error');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-3xl font-semibold text-indigo-800 dark:text-white">Log Aktivitas</h1>
                <table className="w-full table-auto border">
                    <thead className="bg-[#1E63B0] text-white">
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
                                <td colSpan={7} className="border p-4 text-center">
                                    Tidak ada data log.
                                </td>
                            </tr>
                        )}
                        {logData.map((log, idx) => (
                            <tr key={log.id}>
                                <td className="border p-2">{idx + 1 + (logs.current_page - 1) * 10}</td>
                                <td className="border p-2">
                                    {log.user?.name} <br />
                                    <span className="text-xs text-gray-500">{log.user?.email}</span>
                                </td>
                                <td className="border p-2">
                                    <ActivityBadge activity={log.activity} />
                                </td>
                                <td className="border p-2">{log.details || '-'}</td>
                                <td className="border p-2">{log.ip_address}</td>
                                <td className="border p-2">{dayjs(log.created_at).format('DD MMM YYYY HH:mm')}</td>
                                <td className="border p-2 text-center">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(log.id)}
                                        className="cursor-pointer text-red-600 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
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
                            size="sm"
                            className={`${link.url ? 'cursor-pointer' : 'cursor-not-allowed'} ${
                                link.active
                                    ? 'bg-[#1E63B0] text-white hover:bg-[#174a7a]'
                                    : 'border border-[#1E63B0] bg-white text-[#1E63B0] hover:bg-[#f0f8ff]'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
