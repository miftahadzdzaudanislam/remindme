import { Head, Link, usePage } from '@inertiajs/react';

interface User {
    name: string;
    email: string;
    role: string;
}

interface MataKuliah {
    nama_matkul?: string;
    hari?: string;
}

interface Tugas {
    id: number;
    judul: string;
    deadline?: string | null;
    mata_kuliah?: MataKuliah | null;
}

interface Statistik {
    mahasiswa?: number;
    matkul?: number;
    tugas?: number;
    tugas_selesai?: number;
}

interface PageProps {
    auth: {
        user?: User | null;
    };
    tugas: Tugas[];
    statistik?: Statistik;
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth, tugas, statistik } = usePage<PageProps>().props;

    const getDashboardRoute = () => {
        if (auth?.user?.role === 'admin') return route('admin.dashboard');
        if (auth?.user?.role === 'mahasiswa') return route('mahasiswa.dashboard');
        return route('dashboard'); // fallback
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <div className="mr-4 text-sm text-gray-700 dark:text-gray-200">
                                    <div><b>{auth.user.name}</b></div>
                                    <div>{auth.user.email}</div>
                                </div>
                                <Link
                                    href={getDashboardRoute()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="max-w-2xl mx-auto mt-8 w-full">
                                <h2 className="text-lg font-bold mb-2">Statistik</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="rounded bg-gray-100 dark:bg-[#232323] p-4 text-center">
                                        <div className="text-2xl font-bold">{statistik?.mahasiswa ?? 0}</div>
                                        <div className="text-xs text-gray-500">Mahasiswa</div>
                                    </div>
                                    <div className="rounded bg-gray-100 dark:bg-[#232323] p-4 text-center">
                                        <div className="text-2xl font-bold">{statistik?.matkul ?? 0}</div>
                                        <div className="text-xs text-gray-500">Mata Kuliah</div>
                                    </div>
                                    <div className="rounded bg-gray-100 dark:bg-[#232323] p-4 text-center">
                                        <div className="text-2xl font-bold">{statistik?.tugas ?? 0}</div>
                                        <div className="text-xs text-gray-500">Tugas Tercatat</div>
                                    </div>
                                    <div className="rounded bg-gray-100 dark:bg-[#232323] p-4 text-center">
                                        <div className="text-2xl font-bold">{statistik?.tugas_selesai ?? 0}</div>
                                        <div className="text-xs text-gray-500">Tugas Selesai</div>
                                    </div>
                                </div>
                            </div>

                            {auth.user && auth.user.role == 'mahasiswa' &&(
                            <div className="max-w-2xl mx-auto mt-8 w-full">
                                <h2 className="text-lg font-bold mb-2">Daftar Tugas Anda</h2>
                                <table className="w-full border text-sm">
                                    <thead>
                                        <tr>
                                            <th className="border p-2">Tugas</th>
                                            <th className="border p-2">Mata Kuliah</th>
                                            <th className="border p-2">Hari</th>
                                            <th className="border p-2">Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tugas) && tugas.length > 0 ? tugas
                                            .slice(0, 3)
                                            .map((t) => (
                                                <tr key={t.id}>
                                                    <td className="border p-2">{t.judul}</td>
                                                    <td className="border p-2">{t.mata_kuliah?.nama_matkul ?? '-'}</td>
                                                    <td className="border p-2">{t.mata_kuliah?.hari ?? '-'}</td>
                                                    <td className="border p-2">
                                                        {t.deadline
                                                            ? new Date(t.deadline).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            )) : (
                                            <tr>
                                                <td colSpan={4} className="border p-2 text-center">Belum ada tugas.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            )}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
