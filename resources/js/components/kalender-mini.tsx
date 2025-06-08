import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { useState } from 'react';

interface Tugas {
    id: number;
    judul: string;
    deadline: string;
    status?: 'selesai' | 'belum';
}

interface MataKuliah {
    id: number;
    nama_matkul: string;
    jam: string;
    ruangan: string;
    tanggal: string; // tanggal matkul harus ada, misal "2025-06-08"
}

interface KalenderMiniProps {
    tugas: Tugas[];
    matkul?: MataKuliah[];
}

export default function KalenderMini({ tugas, matkul = [] }: KalenderMiniProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => (
        <div className="mb-4 flex items-center justify-between px-2">
            <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 text-indigo-700 hover:bg-indigo-300 dark:bg-indigo-700 dark:text-indigo-200 dark:hover:bg-indigo-600"
                aria-label="Bulan sebelumnya"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">{format(currentMonth, 'MMMM yyyy', { locale: id })}</h2>

            <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 text-indigo-700 hover:bg-indigo-300 dark:bg-indigo-700 dark:text-indigo-200 dark:hover:bg-indigo-600"
                aria-label="Bulan berikutnya"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    {format(addDays(startDate, i), 'EEE', { locale: id })}
                </div>,
            );
        }

        return <div className="mb-2 grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;

                // Cari tugas hari ini
                const tugasHariIni = tugas.filter((t) => isSameDay(new Date(t.deadline), cloneDay));
                // Cari matkul hari ini
                const matkulHariIni = matkul.filter((m) => isSameDay(new Date(m.tanggal), cloneDay));

                // Tooltip gabungan (judul tugas + nama matkul), pisahkan koma
                const tooltipItems = [...tugasHariIni.map((t) => `Tugas: ${t.judul}`), ...matkulHariIni.map((m) => `Matkul: ${m.nama_matkul}`)];
                const tooltipText = tooltipItems.join(', ');

                // Buat tanda titik untuk tugas (merah/hijau) dan matkul (kuning)
                const tandaTugas =
                    tugasHariIni.length > 0 ? (
                        <span
                            className={`inline-block h-5 w-5 rounded-full ${
                                tugasHariIni.some((t) => t.status === 'belum') ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            title={tugasHariIni.map((t) => `Tugas: ${t.judul}`).join('\n')}
                        />
                    ) : null;

                const tandaMatkul =
                    matkulHariIni.length > 0 ? (
                        <span
                            className="inline-block h-5 w-5 rounded-full bg-yellow-400"
                            title={matkulHariIni.map((m) => `Matkul: ${m.nama_matkul}`).join('\n')}
                        />
                    ) : null;

                // Gabungkan tanda titik jadi satu baris flex dengan jarak kecil
                const tandaGabungan = (tandaTugas || tandaMatkul) && (
                    <div className="mt-1 flex justify-center space-x-1" aria-label={tooltipText}>
                        {tandaTugas}
                        {tandaMatkul}
                    </div>
                );

                days.push(
                    <div
                        key={cloneDay.toString()}
                        className={`relative flex h-14 w-full flex-col items-center justify-center border p-1 text-center text-sm ${
                            !isSameMonth(cloneDay, monthStart) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                        }`}
                    >
                        <span className="z-10">{format(cloneDay, 'd')}</span>
                        {tandaGabungan}
                    </div>,
                );

                day = addDays(day, 1);
            }

            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>,
            );
            days = [];
        }

        return <div>{rows}</div>;
    };

    return (
        <div className="rounded-2xl border border-indigo-300 bg-white p-4 shadow dark:border-indigo-700 dark:bg-zinc-800">
            <h2 className="mb-2 text-lg font-semibold text-indigo-700 dark:text-white">📆 Kalender Tugas</h2>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="mt-3 flex justify-center space-x-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                    <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> <span>Tugas</span>
                </div>
            </div>
        </div>
    );
}
