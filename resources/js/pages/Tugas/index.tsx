import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // ⬅️ Tambahan import

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tugas Mahasiswa', href: '/tugas' }];

interface Tugas {
    id: number;
    judul: string;
    deskripsi: string;
    deadline: string;
    prioritas: 'low' | 'medium' | 'high';
    mata_kuliah_id: number;
    is_done: boolean;
}

interface MataKuliah {
    id: number;
    nama_matkul: string;
}

interface TugasPagination {
    data: Tugas[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps extends PageProps {
    tugas: TugasPagination;
    mata_kuliahs: MataKuliah[];
}

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTugas, setEditingTugas] = useState<Tugas | null>(null);
    const [tab, setTab] = useState<'progress' | 'completed'>('progress');

    const { mata_kuliahs, tugas } = usePage<IndexProps>().props;
    const dataTugas = tugas.data ?? [];

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
        mata_kuliah_id: 0,
        judul: '',
        deskripsi: '',
        deadline: '',
        prioritas: 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTugas) {
            put(route('tugas.update', editingTugas.id), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                    setEditingTugas(null);
                    Swal.fire('Berhasil!', 'Tugas berhasil diperbarui.', 'success');
                },
            });
        } else {
            post(route('tugas.store'), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                    Swal.fire('Berhasil!', 'Tugas berhasil ditambahkan.', 'success');
                },
                onError: () => {
                    setEditingTugas(null);
                    Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan tugas.', 'error');
                },
            });
        }
    };

    const handleEdit = (tugas: Tugas) => {
        setData({
            mata_kuliah_id: tugas.mata_kuliah_id,
            judul: tugas.judul,
            deskripsi: tugas.deskripsi,
            deadline: tugas.deadline,
            prioritas: tugas.prioritas,
        });
        setEditingTugas(tugas);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number, judul: string) => {
        Swal.fire({
            title: `Hapus tugas "${judul}"?`,
            text: 'Tindakan ini tidak dapat dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1E63B0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('tugas.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Dihapus!', 'Tugas telah dihapus.', 'success');
                    },
                });
            }
        });
    };

    const handleToggleDone = (id: number) => {
        router.patch(route('tugas.toggle', id));
    };

    const tugasBelumSelesai = tugas.filter((tgs) => !tgs.is_done);
    const tugasSelesai = tugas.filter((tgs) => tgs.is_done);

    const renderTabel = (data: Tugas[], selesai: boolean) => (
        <table className="w-full table-auto rounded-md border border-gray-300 shadow-sm">
            <thead className={selesai ? 'bg-[#1E63B0] text-white' : 'bg-[#1E63B0] text-white'}>
                <tr>
                    <th className="border p-2">No.</th>
                    <th className="border p-2">Judul</th>
                    <th className="border p-2">Deskripsi</th>
                    <th className="border p-2">Deadline</th>
                    <th className="border p-2">Prioritas</th>
                    <th className="border p-2">Mata Kuliah</th>
                    <th className="border p-2">Aksi</th>
                    <th className="border p-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="border p-4 text-center text-gray-600 italic">
                            Tidak ada tugas {selesai ? 'selesai' : 'yang belum selesai'}.
                        </td>
                    </tr>
                ) : (
                    data.map((tgs, idx) => (
                        <tr
                            key={tgs.id}
                            className={`transition-colors odd:bg-white even:bg-gray-50 hover:${selesai ? 'bg-green-50' : 'bg-violet-50'}`}
                        >
                            <td className="border p-2">{idx + 1}</td>
                            <td className={`border p-2 ${selesai && 'text-gray-500 line-through'}`}>{tgs.judul}</td>
                            <td className={`border p-2 ${selesai && 'text-gray-500 line-through'}`}>{tgs.deskripsi}</td>
                            <td className={`border p-2 ${selesai && 'text-gray-500 line-through'}`}>
                                {new Date(tgs.deadline).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </td>
                            <td className={`border p-2 capitalize ${selesai && 'text-gray-500 line-through'}`}>{tgs.prioritas}</td>
                            <td className={`border p-2 ${selesai && 'text-gray-500 line-through'}`}>
                                {mata_kuliahs.find((mk) => mk.id === tgs.mata_kuliah_id)?.nama_matkul ?? tgs.mata_kuliah_id}
                            </td>
                            <td className="space-x-2 border p-2 text-center">
                                <Button size="icon" variant="ghost" onClick={() => handleEdit(tgs)} className="h-8 w-8 cursor-pointer bg-transparent">
                                    <Edit className="h-5 w-5 text-yellow-600" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(tgs.id, tgs.judul)}
                                    className="h-8 w-8 cursor-pointer bg-transparent"
                                >
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </Button>
                            </td>
                            <td className="border p-2 text-center">
                                <input
                                    className="h-5 w-5 cursor-pointer accent-green-700"
                                    type="checkbox"
                                    checked={tgs.is_done}
                                    onChange={() => handleToggleDone(tgs.id)}
                                />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tugas Mahasiswa" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-3xl font-semibold text-indigo-800 dark:text-white">Daftar Tugas</h1>

                <div className="flex items-center justify-between">
                    <div className="flex rounded-lg bg-gray-200">
                        <button
                            onClick={() => setTab('progress')}
                            className={`cursor-pointer rounded-lg px-4 py-2 font-medium ${tab === 'progress' ? 'bg-[#1E63B0] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Progress
                        </button>
                        <button
                            onClick={() => setTab('completed')}
                            className={`cursor-pointer rounded-lg px-4 py-2 font-medium ${tab === 'completed' ? 'bg-[#1E63B0] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Completed
                        </button>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    reset();
                                    setEditingTugas(null);
                                    setIsDialogOpen(true);
                                }}
                                className="cursor-pointer bg-[#1E63B0] text-white hover:bg-[#174a7a]"
                            >
                                + Tambah Tugas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{editingTugas ? 'Edit Tugas' : 'Tambah Tugas'}</DialogTitle>
                                <DialogDescription>
                                    {editingTugas ? 'Edit data tugas di bawah ini.' : 'Isi form berikut untuk menambahkan tugas baru.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="judul">Judul</Label>
                                        <Input
                                            id="judul"
                                            type="text"
                                            value={data.judul}
                                            onChange={(e) => setData('judul', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.judul} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
                                        <select
                                            id="mata_kuliah_id"
                                            value={data.mata_kuliah_id}
                                            onChange={(e) => setData('mata_kuliah_id', Number(e.target.value))}
                                            required
                                            className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#1E63B0] focus:ring-[#1E63B0]"
                                        >
                                            <option value="">-- Pilih Mata Kuliah --</option>
                                            {mata_kuliahs.map((mk) => (
                                                <option key={mk.id} value={mk.id}>
                                                    {mk.nama_matkul}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.mata_kuliah_id} className="mt-1" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="deskripsi">Deskripsi</Label>
                                        <Textarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                                        <InputError message={errors.deskripsi} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="deadline">Deadline</Label>
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={data.deadline}
                                            onChange={(e) => setData('deadline', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.deadline} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="prioritas">Prioritas</Label>
                                        <select
                                            id="prioritas"
                                            value={data.prioritas}
                                            onChange={(e) => setData('prioritas', e.target.value)}
                                            required
                                            className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#1E63B0] focus:ring-[#1E63B0]"
                                        >
                                            <option value="low">🔵 Rendah</option>
                                            <option value="medium">🟡 Sedang</option>
                                            <option value="high">🔴 Tinggi</option>
                                        </select>
                                        <InputError message={errors.prioritas} className="mt-1" />
                                    </div>
                                </div>
                                <DialogFooter className="mt-4">
                                    <Button
                                        type="button"
                                        className="cursor-pointer hover:bg-gray-300"
                                        variant="secondary"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                            setEditingTugas(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing} className="cursor-pointer bg-[#1E63B0] text-white hover:bg-[#174a7a]">
                                        {editingTugas ? 'Ubah Tugas' : 'Simpan Tugas'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {tab === 'progress' ? renderTabel(tugasBelumSelesai, false) : renderTabel(tugasSelesai, true)}
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="p-2 border">No.</th>
                            <th className="p-2 border">Judul</th>
                            <th className="p-2 border">Deskripsi</th>
                            <th className="p-2 border">Deadline</th>
                            <th className="p-2 border">Prioritas</th>
                            <th className="p-2 border">Mata Kuliah</th>
                            <th className="p-2 border">Aksi</th>
                            <th className='p-2 border'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTugas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4 border">
                                    Belum ada tugas.
                                </td>
                            </tr>
                        )}
                        {dataTugas.map((tgs, idx) => (
                            <tr key={tgs.id}>
                                <td className="p-2 border">{idx + 1 + (tugas.current_page - 1) * 10}</td>
                                <td className="p-2 border">{tgs.judul}</td>
                                <td className="p-2 border">{tgs.deskripsi}</td>
                                <td className="p-2 border">
                                    {new Date(tgs.deadline).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="p-2 border">{tgs.prioritas}</td>
                                <td className="p-2 border">
                                    {mata_kuliahs.find(mk => mk.id === tgs.mata_kuliah_id)?.nama_matkul ?? tgs.mata_kuliah_id}
                                </td>
                                <td className="p-2 border">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(tgs)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(tgs.id, tgs.judul)}
                                    >
                                        Hapus
                                    </Button>
                                </td>
                                <td className="p-2 border text-center">
                                    <input
                                        type="checkbox"
                                        checked={tgs.is_done}
                                        onChange={() => router.patch(route('tugas.toggle', tgs.id))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {tugas.links.map((link, idx) => (
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
