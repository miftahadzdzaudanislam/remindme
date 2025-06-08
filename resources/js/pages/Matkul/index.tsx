import { PageProps, router } from '@inertiajs/core';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Edit, LogOut, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        delete: destroy,
    } = useForm({
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
            cancelButtonColor: '#d33'
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
                      Swal.fire('Berhasil!', successMessage, 'success');
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
            cancelButtonColor: '#d33'
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
                                            <option value="Senin">Senin</option>
                                            <option value="Selasa">Selasa</option>
                                            <option value="Rabu">Rabu</option>
                                            <option value="Kamis">Kamis</option>
                                            <option value="Jumat">Jumat</option>
                                            <option value="Sabtu">Sabtu</option>
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

                <table className="w-full table-auto border">
                    <thead className="bg-[#1E63B0] text-white">
                        <tr>
                            <th className="border border-gray-400 p-2">No.</th>
                            <th className="border border-gray-400 p-2">Nama Mata Kuliah</th>
                            <th className="border border-gray-400 p-2">Dosen</th>
                            <th className="border border-gray-400 p-2">Hari</th>
                            <th className="border border-gray-400 p-2">Jam</th>
                            <th className="border border-gray-400 p-2">Ruangan</th>
                            <th className="border border-gray-400 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMataKuliah.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4 border">Belum ada jadwal.</td>
                            </tr>
                        )}

                        {dataMataKuliah.map((mata_kuliah, idx) => (
                            <tr key={mata_kuliah.id}>
                                <td className="p-2 border text-center">{idx + 1 + ((mata_kuliahs.current_page - 1) * 10)}</td>
                                <td className="p-2 border">{mata_kuliah.nama_matkul}</td>
                                <td className="p-2 border">{mata_kuliah.nama_dosen}</td>
                                <td className="p-2 border">{mata_kuliah.hari}</td>
                                <td className="p-2 border">{mata_kuliah.jam.slice(0, 5)}</td>
                                <td className="p-2 border">{mata_kuliah.ruangan}</td>
                                <td className='p-2 border'>
                                    <Button 
                                        variant="outline" size="sm" className="mr-2" 
                                        onClick={() => handleEdit(mata_kuliah)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        disabled={processing} 
                                        onClick={() => handleDelete(mata_kuliah.id, mata_kuliah.nama_matkul)} variant="destructive" size="sm"
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
                {mata_kuliahs.links.map((link, idx) => (
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
