import GoogleLoginButton from '@/components/GoogleLoginButton';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps, router } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Edit, LogOut, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mata Kuliah',
        href: '/matkul',
    },
];

interface MataKuliah {
    id: number;
    nama_matkul: string;
    nama_dosen: string;
    hari: string;
    jam: string;
    ruangan: string;
}

interface MataKuliahPagination {
    data: MataKuliah[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps extends PageProps {
    mata_kuliahs: MataKuliahPagination;
}

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMatkul, setEditingMatkul] = useState<MataKuliah | null>(null);
    const { mata_kuliahs } = usePage<IndexProps>().props;
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [calendarActive, setCalendarActive] = useState(false);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const dataMataKuliah = mata_kuliahs.data ?? [];

    // Tab Hari
    const urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const [selectedHari, setSelectedHari] = useState(urutanHari[0]);

    interface FormData {
        nama_matkul: string;
        nama_dosen: string;
        hari: string;
        jam: string;
        ruangan: string;
        sync_to_google: boolean;
        [key: string]: string | boolean;
    }

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        delete: destroy,
    } = useForm<FormData>({
        nama_matkul: '',
        nama_dosen: '',
        hari: '',
        jam: '',
        ruangan: '',
        sync_to_google: false,
    });

    useEffect(() => {
        if (localStorage.getItem('google_signed_in') === '1') {
            setIsSignedIn(true);
        }

        const calendarStatus = localStorage.getItem('calendar_active');
        setCalendarActive(calendarStatus === '1');
        setData('sync_to_google', calendarStatus === '1');
    }, [setData]);

    const handleCalendarToggle = (checked: boolean) => {
        setCalendarActive(checked);
        setData('sync_to_google', checked);
        localStorage.setItem('calendar_active', checked ? '1' : '0');
    };

    const handleGoogleLogout = () => {
        Swal.fire({
            title: 'Logout Google?',
            text: 'Apakah Anda yakin ingin logout dari akun Google?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#1E63B0',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsSignedIn(false);
                localStorage.removeItem('google_signed_in');
                Swal.fire('Berhasil!', 'Anda telah logout dari akun Google.', 'success');
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const successMessage = editingMatkul ? 'Jadwal berhasil diperbarui!' : 'Jadwal berhasil ditambahkan!';

        const action = editingMatkul
            ? put(route('matkul.update', editingMatkul.id), {
                  onSuccess: () => {
                      Swal.fire('Berhasil!', successMessage, 'success');
                      reset();
                      setIsDialogOpen(false);
                      setEditingMatkul(null);
                  },
              })
            : post(route('matkul.store'), {
                  onSuccess: () => {
                      Swal.fire('Berhasil!', successMessage, 'success',);
                      reset();
                      setIsDialogOpen(false);
                  },
                  onError: () => {
                      setEditingMatkul(null);
                  },
              });

        return action;
    };

    const handleEdit = (matkul: MataKuliah) => {
        setData({
            nama_matkul: matkul.nama_matkul,
            nama_dosen: matkul.nama_dosen,
            hari: matkul.hari,
            jam: matkul.jam,
            ruangan: matkul.ruangan,
            sync_to_google: calendarActive,
        });
        setEditingMatkul(matkul);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number, nama_matkul: string) => {
        Swal.fire({
            title: 'Hapus Jadwal?',
            text: `Apakah Anda yakin ingin menghapus jadwal "${nama_matkul}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#1E63B0',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('matkul.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Dihapus!', `Jadwal "${nama_matkul}" berhasil dihapus.`, 'success');
                    },
                });
            }
        });
    };

    // Kelompokkan data berdasarkan hari
    const matkulPerHari: { [key: string]: MataKuliah[] } = {};
    urutanHari.forEach((hari) => {
        matkulPerHari[hari] = dataMataKuliah.filter((mk) => mk.hari === hari);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-3xl font-semibold text-indigo-800 dark:text-white">Jadwal Mata Kuliah</h1>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {!isSignedIn ? (
                            <GoogleOAuthProvider clientId={clientId}>
                                <GoogleLoginButton setIsSignedIn={setIsSignedIn} />
                            </GoogleOAuthProvider>
                        ) : (
                            <>
                                <label htmlFor="calendarToggle" className="text-sm font-medium text-gray-700">
                                    Aktifkan Google Calendar
                                </label>
                                <Switch
                                    className="cursor-pointer data-[state=checked]:bg-[#1E63B0]"
                                    id="calendarToggle"
                                    checked={calendarActive}
                                    onCheckedChange={handleCalendarToggle}
                                />
                                <Button
                                    variant="outline"
                                    className="flex cursor-pointer items-center gap-2 rounded-xl border-red-500 text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
                                    onClick={handleGoogleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout Google
                                </Button>
                            </>
                        )}
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-[#1E63B0] text-white hover:bg-[#174a7a] hover:text-white"
                                onClick={() => {
                                    reset();
                                    setEditingMatkul(null);
                                    setIsDialogOpen(true);
                                    setData('sync_to_google', calendarActive);
                                }}
                            >
                                + Tambah Jadwal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingMatkul ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk {editingMatkul ? 'mengedit' : 'menambah'} jadwal mata kuliah baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-2">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="nama_matkul">Nama Mata Kuliah</Label>
                                        <Input
                                            id="nama_matkul"
                                            type="text"
                                            placeholder="Contoh: Pemrograman Web"
                                            value={data.nama_matkul}
                                            onChange={(e) => setData('nama_matkul', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.nama_matkul} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="nama_dosen">Dosen</Label>
                                        <Input
                                            id="nama_dosen"
                                            type="text"
                                            placeholder="Contoh: Dr. John Doe"
                                            value={data.nama_dosen}
                                            onChange={(e) => setData('nama_dosen', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.nama_dosen} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="hari">Hari</Label>
                                        <select
                                            id="hari"
                                            className="rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#1E63B0] focus:ring-1 focus:ring-[#1E63B0] focus:outline-none"
                                            value={data.hari}
                                            onChange={(e) => setData('hari', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih hari --</option>
                                            {urutanHari.map((hari) => (
                                                <option key={hari} value={hari}>
                                                    {hari}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.hari} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="jam">Jam</Label>
                                        <Input id="jam" type="time" value={data.jam} onChange={(e) => setData('jam', e.target.value)} required />
                                        <InputError message={errors.jam} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="ruangan">Ruangan</Label>
                                        <Input
                                            id="ruangan"
                                            type="text"
                                            placeholder="Contoh: Ruang A101"
                                            value={data.ruangan}
                                            onChange={(e) => setData('ruangan', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.ruangan} />
                                    </div>
                                </div>
                                <DialogFooter className="mt-4 flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="cursor-pointer text-gray-800 hover:bg-gray-300"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                            setEditingMatkul(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing} className="cursor-pointer bg-[#1E63B0] text-white hover:bg-[#174a7a]">
                                        {editingMatkul ? 'Ubah' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tab Hari */}
                <div className="mb-4 flex flex-wrap justify-center rounded-lg bg-gray-200 p-1">
                    {urutanHari.map((hari) => (
                        <button
                            key={hari}
                            onClick={() => setSelectedHari(hari)}
                            className={`min-w-[100px] flex-1 rounded-lg cursor-pointer p-2 font-medium transition ${
                                selectedHari === hari ? 'bg-[#1E63B0] text-white' : 'bg-transparent text-gray-700 hover:bg-[#e3eefd]'
                            }`}
                            style={{ border: 'none' }}
                        >
                            {hari}
                        </button>
                    ))}
                </div>

                {/* List untuk hari yang dipilih */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-[#1E63B0]">{selectedHari}</h2>
                    {matkulPerHari[selectedHari].length === 0 ? (
                        <div className="rounded bg-gray-100 p-4 text-gray-500 italic">Tidak ada jadwal Perkuliahan.</div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {matkulPerHari[selectedHari].map((mata_kuliah) => (
                                <li
                                    key={mata_kuliah.id}
                                    className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <div className="font-bold text-indigo-800">{mata_kuliah.nama_matkul}</div>
                                        <div className="text-sm text-gray-700">Dosen: {mata_kuliah.nama_dosen}</div>
                                        <div className="text-sm text-gray-700">
                                            Jam: {mata_kuliah.jam.slice(0, 5)} | Ruangan: {mata_kuliah.ruangan}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-2 md:mt-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer bg-transparent hover:bg-transparent"
                                            onClick={() => handleEdit(mata_kuliah)}
                                        >
                                            <Edit className="h-5 w-5 text-yellow-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer bg-transparent hover:bg-transparent"
                                            onClick={() => handleDelete(mata_kuliah.id, mata_kuliah.nama_matkul)}
                                            disabled={processing}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-600" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {mata_kuliahs.links.map((link, idx) => (
                        <Button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={link.active ? 'bg-[#1E63B0] hover:bg-[#1E63B0]  text-white border-[#1E63B0]' : ''}
                            size="sm"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
