import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

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
}

interface IndexProps extends PageProps {
    progress: number;
    tugas_terdekat: Tugas[];
    jadwal_hari_ini: MataKuliah[];
}

export default function MahasiswaDashboard() {
    const { progress, tugas_terdekat, jadwal_hari_ini } = usePage<IndexProps>().props;
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <h2>Progress Tugas: {progress}%</h2>
                        <progress value={progress} max={100}></progress>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <h3 className="mt-4">3 Tugas Terdekat</h3>
                        <ul>
                            {tugas_terdekat.map((tugas) => (
                                <li key={tugas.id}>
                                    {tugas.judul} - Deadline: {new Date(tugas.deadline).toLocaleDateString('id-ID')}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <h3 className="mt-4">Jadwal Mata Kuliah Hari Ini</h3>
                        <ul>
                            {jadwal_hari_ini.map(mk => (
                                <li key={mk.id}>
                                    {mk.nama_matkul} - {mk.jam.slice(0, 5)} - {mk.ruangan}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
