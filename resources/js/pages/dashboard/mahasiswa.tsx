import KalenderMini from '@/components/kalender-mini';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Mahasiswa',
        href: '/dashboard-mahasiswa',
    },
];

interface Tugas {
    id: number;
    judul: string;
    deadline: string;
}

interface MataKuliah {
    id: number;
    nama_matkul: string;
    jam: string;
    ruangan: string;
    hari: number; // 1=Senin, ..., 7=Minggu
}

interface IndexProps extends PageProps {
    progress: number;
    tugas_terdekat: Tugas[];
    jadwal_hari_ini: MataKuliah[];
}

export default function MahasiswaDashboard() {
    const { progress, tugas_terdekat, jadwal_hari_ini } = usePage<IndexProps>().props;

    // Ambil hari sekarang (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
    const hariSekarangJs = new Date().getDay();

    // Konversi ke format hari: 1=Senin ... 7=Minggu
    const hariSekarang = hariSekarangJs === 0 ? 7 : hariSekarangJs;

    // Filter jadwal matkul hanya yang sesuai hari sekarang
    const jadwalHariIniFiltered = jadwal_hari_ini.filter((mk) => mk.hari === hariSekarang);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Mahasiswa" />

            <div className="flex min-h-screen flex-col gap-6 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 dark:from-gray-900 dark:to-gray-800">
                <h1 className="text-3xl font-bold text-indigo-800 dark:text-white">📚 Dashboard Mahasiswa</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Progress Tugas */}
                    <div className="rounded-2xl border border-indigo-300 bg-indigo-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-indigo-700 dark:bg-indigo-900">
                        <h2 className="mb-3 text-lg font-semibold text-indigo-900 dark:text-white">Progress Tugas</h2>
                        <div className="mb-2 text-sm text-indigo-700 dark:text-indigo-200">Kamu sudah menyelesaikan {progress}% tugas.</div>
                        <progress
                            value={progress}
                            max={100}
                            className="h-3 w-full overflow-hidden rounded bg-indigo-200 [&::-webkit-progress-bar]:bg-indigo-200 [&::-webkit-progress-value]:bg-indigo-600 dark:[&::-webkit-progress-value]:bg-indigo-400"
                        />
                    </div>

                    {/* Tugas Terdekat */}
                    <div className="rounded-2xl border border-yellow-300 bg-yellow-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-yellow-700 dark:bg-yellow-900">
                        <h2 className="mb-3 text-lg font-semibold text-yellow-800 dark:text-yellow-100">📝 Tugas Terdekat</h2>
                        <ul className="space-y-3">
                            {tugas_terdekat.length > 0 ? (
                                tugas_terdekat.map((tugas) => (
                                    <li
                                        key={tugas.id}
                                        className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
                                    >
                                        <strong>{tugas.judul}</strong> <br />
                                        Deadline: {new Date(tugas.deadline).toLocaleDateString('id-ID')}
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-yellow-800 dark:text-yellow-100">Tidak ada tugas saat ini.</p>
                            )}
                        </ul>
                    </div>

                    {/* Jadwal Hari Ini */}
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-100 p-5 shadow-md transition hover:scale-[1.01] dark:border-emerald-700 dark:bg-emerald-900">
                        <h2 className="mb-3 text-lg font-semibold text-emerald-800 dark:text-emerald-100">📅 Jadwal Hari Ini</h2>
                        <ul className="space-y-3">
                            {jadwalHariIniFiltered.length > 0 ? (
                                jadwalHariIniFiltered.map((mk) => (
                                    <li
                                        key={mk.id}
                                        className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
                                    >
                                        <strong>{mk.nama_matkul}</strong>
                                        <br />
                                        {mk.jam.slice(0, 5)} - Ruangan {mk.ruangan}
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-emerald-800 dark:text-emerald-100">Tidak ada jadwal hari ini.</p>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-6">
                    <KalenderMini tugas={tugas_terdekat} />
                </div>
            </div>
        </AppLayout>
    );
}
