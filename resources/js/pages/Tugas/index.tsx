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
import React, { useState } from 'react';
import { Edit, Trash } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tugas Mahasiswa',
        href: '/tugas',
    },
];

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

interface IndexProps extends PageProps {
    tugas: Tugas[];
    mata_kuliahs: MataKuliah[];
}

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTugas, setEditingTugas] = useState<Tugas | null>(null);
    const { mata_kuliahs, tugas } = usePage<IndexProps>().props;

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
                },
            });
        } else {
            post(route('tugas.store'), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                },
                onError: () => {
                    setEditingTugas(null);
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
        if (confirm(`Apakah Anda yakin ingin menghapus tugas "${judul}"?`)) {
            destroy(route('tugas.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tugas Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Daftar Tugas</h1>
                <div className="mb-4 flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="cursor-pointer bg-violet-500 text-white hover:bg-violet-700 hover:text-white"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setEditingTugas(null);
                                    setIsDialogOpen(true);
                                }}
                            >
                                + Tambah Tugas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingTugas ? 'Edit Tugas' : 'Tambah Tugas'}</DialogTitle>
                                <DialogDescription>
                                    {editingTugas ? 'Edit data tugas di bawah ini.' : 'Isi form berikut untuk menambahkan tugas baru.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4">
                                    <Label htmlFor="judul">Judul</Label>
                                    <Input
                                        id="judul"
                                        type="text"
                                        tabIndex={1}
                                        placeholder="Masukkan judul tugas"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.judul} className="mt-2" />

                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        tabIndex={2}
                                        placeholder="Masukkan deskripsi tugas"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                    />
                                    <InputError message={errors.deskripsi} className="mt-2" />

                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        tabIndex={3}
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.deadline} className="mt-2" />

                                    <Label htmlFor="prioritas">Prioritas</Label>
                                    <select
                                        id="prioritas"
                                        tabIndex={4}
                                        value={data.prioritas}
                                        onChange={(e) => setData('prioritas', e.target.value)}
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <InputError message={errors.prioritas} className="mt-2" />

                                    <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
                                    <select
                                        id="mata_kuliah_id"
                                        tabIndex={5}
                                        value={data.mata_kuliah_id}
                                        onChange={(e) => setData('mata_kuliah_id', Number(e.target.value))}
                                        required
                                    >
                                        <option value="">-- Pilih Mata Kuliah --</option>
                                        {mata_kuliahs.map((mk) => (
                                            <option key={mk.id} value={mk.id}>
                                                {mk.nama_matkul}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.mata_kuliah_id} className="mt-2" />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                            setEditingTugas(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {editingTugas ? 'Ubah' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <table className="w-full table-auto border">
                    <thead className="bg-violet-500 text-white">
                        <tr>
                            <th className="border border-gray-400 p-2">No.</th>
                            <th className="border border-gray-400 p-2">Judul</th>
                            <th className="border border-gray-400 p-2">Deskripsi</th>
                            <th className="border border-gray-400 p-2">Deadline</th>
                            <th className="border border-gray-400 p-2">Prioritas</th>
                            <th className="border border-gray-400 p-2">Mata Kuliah</th>
                            <th className="border border-gray-400 p-2">Aksi</th>
                            <th className="border border-gray-400 p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tugas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="border p-4 text-center">
                                    Belum ada tugas.
                                </td>
                            </tr>
                        )}
                        {tugas.map((tgs, idx) => (
                            <tr key={tgs.id} className="odd:bg-gray-100 even:bg-white hover:bg-violet-100">
                                <td className="border border-gray-400 p-2">{idx + 1}</td>
                                <td className="border border-gray-400 p-2">{tgs.judul}</td>
                                <td className="border border-gray-400 p-2">{tgs.deskripsi}</td>
                                <td className="border border-gray-400 p-2">
                                    {new Date(tgs.deadline).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="border border-gray-400 p-2">{tgs.prioritas}</td>
                                <td className="border border-gray-400 p-2">
                                    {mata_kuliahs.find((mk) => mk.id === tgs.mata_kuliah_id)?.nama_matkul ?? tgs.mata_kuliah_id}
                                </td>
                                <td className="space-x-2 border border-gray-400 p-2 text-center">
                                    <Button size="icon" variant="outline" onClick={() => handleEdit(tgs)} className="h-8 w-8 bg-transparent hover:bg-transparent cursor-pointer">
                                        <Edit className="h-5 w-5 text-yellow-600" />
                                    </Button>

                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(tgs.id, tgs.judul)} className="h-8 w-8 bg-transparent hover:bg-transparent cursor-pointer">
                                        <Trash className="h-5 w-5 text-red-600" />
                                    </Button>
                                </td>
                                <td className="border border-gray-400 p-2 text-center">
                                    <input
                                        className="h-5 w-5 cursor-pointer accent-green-700"
                                        type="checkbox"
                                        checked={tgs.is_done}
                                        onChange={() => router.patch(route('tugas.toggle', tgs.id))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
