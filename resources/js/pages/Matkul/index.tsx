import { PageProps } from '@inertiajs/core';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';

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

interface IndexProps extends PageProps {
    mata_kuliahs: MataKuliah[];
}

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMatkul, setEditingMatkul] = useState<MataKuliah | null>(null);
    const { mata_kuliahs } = usePage<IndexProps>().props;

    const {data, setData, post, put, processing, reset, errors, delete: destroy} = useForm({
        nama_matkul: '',
        nama_dosen: '',
        hari: '',
        jam: '',
        ruangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (editingMatkul) {
            put(route('matkul.update', editingMatkul.id), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                    setEditingMatkul(null);
                },
            });
        } else {
            post(route('matkul.store'), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                },
                onError: () => {
                    setEditingMatkul(null);
                },
            });
        }
    }

    const handleEdit = (matkul: MataKuliah) => {
        setData({
            nama_matkul: matkul.nama_matkul,
            nama_dosen: matkul.nama_dosen,
            hari: matkul.hari,
            jam: matkul.jam,
            ruangan: matkul.ruangan,
        });
        setEditingMatkul(matkul);
        setIsDialogOpen(true);
    };


    const handleDelete = (id: number, nama_matkul: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jadwal mata kuliah "${nama_matkul}"?`)) {
            destroy(route('matkul.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Jadwal Mata Kuliah</h1>
                <div className="flex justify-end mb-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setEditingMatkul(null);
                                    setIsDialogOpen(true); 
                                }}
                            >
                                Tambah Jadwal +
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingMatkul ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
                                <DialogDescription className='flex text-center text-sm'>
                                    Isi form berikut untuk {editingMatkul ? 'mengedit' : 'menambah'} jadwal mata kuliah baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4">
                                    <Label htmlFor="nama_matkul">Nama Mata Kuliah</Label>
                                    <Input 
                                        id="nama_matkul" 
                                        type='text' 
                                        tabIndex={1}
                                        placeholder="Contoh: Pemrograman Web" value={data.nama_matkul}
                                        onChange={(e) => setData('nama_matkul', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nama_matkul} />
                                    
                                    <Label htmlFor="nama_dosen">Dosen</Label>
                                    <Input 
                                        id="nama_dosen" 
                                        type='text' 
                                        tabIndex={2}
                                        placeholder="Contoh: Dr. John Doe" value={data.nama_dosen}
                                        onChange={(e) => setData('nama_dosen', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nama_dosen} />
                                    
                                    <Label htmlFor="hari">Hari</Label>
                                    <select id="hari" value={data.hari} tabIndex={3}
                                        onChange={(e) => setData('hari', e.target.value)} required>
                                        <option value="">-- Pilih hari --</option>
                                        <option value="Senin">Senin</option>
                                        <option value="Selasa">Selasa</option>
                                        <option value="Rabu">Rabu</option>
                                        <option value="Kamis">Kamis</option>
                                        <option value="Jumat">Jumat</option>
                                        <option value="Sabtu">Sabtu</option>
                                    </select>
                                    <InputError message={errors.hari} />
                                    
                                    <Label htmlFor="jam">Jam</Label>
                                    <Input id="jam" type='time' tabIndex={4}
                                        placeholder="Contoh: 08:00" value={data.jam}
                                        onChange={(e) => setData('jam', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.jam} />
                                    
                                    <Label htmlFor="ruangan">Ruangan</Label>
                                    <Input id="ruangan" type='text' tabIndex={5}
                                        placeholder="Contoh: Ruang A101" value={data.ruangan}
                                        onChange={(e) => setData('ruangan', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.ruangan} />
                                </div>
                                <DialogFooter>
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                            setEditingMatkul(null);
                                        }}>
                                        Batal
                                    </Button>
                                    <Button disabled={processing} type="submit">
                                        {editingMatkul ? 'Ubah' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="p-2 border">No.</th>
                            <th className="p-2 border">Nama Mata Kuliah</th>
                            <th className="p-2 border">Dosen</th>
                            <th className="p-2 border">Hari</th>
                            <th className="p-2 border">Jam</th>
                            <th className="p-2 border">Ruangan</th>
                            <th className='p-2 border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mata_kuliahs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4 border">Belum ada jadwal.</td>
                            </tr>
                        )}

                        {mata_kuliahs.map((mata_kuliah, idx) => (
                            <tr key={mata_kuliah.id}>
                                <td className="p-2 border text-center">{idx + 1}</td>
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
            </div>
        </AppLayout>
    );
}
