import { PageProps, router } from '@inertiajs/core';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Dialog } from '@radix-ui/react-dialog';
import { useState } from 'react';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

import { Edit, Trash2 } from 'lucide-react';

import Swal from 'sweetalert2';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Mahasiswa',
        href: '/users',
    },
];

interface Mahasiswa {
    id: number;
    name: string;
    email: string;
    nim: string;
    phone_number: string;
    jurusan: string;
    password: string;
    status: 'active' | 'inactive' | 'suspended';
    role: 'mahasiswa' | 'admin';
    last_login_at: string | null;
    created_at: string;
}

interface MahasiswaPagination {
    data: Mahasiswa[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps extends PageProps {
    mahasiswa: MahasiswaPagination;
}

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Mahasiswa | null>(null);
    const { mahasiswa } = usePage<IndexProps>().props;
    const dataMahasiswa = mahasiswa.data ?? [];

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
        name: '',
        email: '',
        nim: '',
        phone_number: '62',
        jurusan: '',
        status: 'inactive',
        role: 'mahasiswa',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                    setEditingUser(null);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data mahasiswa berhasil diubah.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat mengubah data.',
                    });
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Mahasiswa baru berhasil ditambahkan.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat menambahkan mahasiswa baru.',
                    });
                },
            });
        }
    };

    const handleEdit = (user: Mahasiswa) => {
        setData({
            name: user.name,
            email: user.email,
            nim: user.nim,
            phone_number: user.phone_number,
            jurusan: user.jurusan,
            role: user.role,
            password: '',
            password_confirmation: '',
            status: user.status,
        });
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number, name: string) => {
        Swal.fire({
            title: `Apakah Anda yakin ingin menghapus Mahasiswa "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('users.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus',
                            text: 'Mahasiswa berhasil dihapus.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat menghapus mahasiswa.',
                        });
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-3xl font-semibold text-indigo-800 dark:text-white">Daftar Mahasiswa</h1>
                <div className="mb-2 flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="cursor-pointer bg-[#1E63B0] text-white hover:bg-[#174a7a]"
                                onClick={() => {
                                    reset();
                                    setEditingUser(null);
                                    setIsDialogOpen(true);
                                }}
                            >
                                Tambah User +
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>{editingUser ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</DialogTitle>
                                <DialogDescription>
                                    {editingUser ? 'Edit data mahasiswa di bawah ini.' : 'Isi form berikut untuk menambahkan mahasiswa baru.'}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit}>
                                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nama</Label>
                                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div>
                                            <Label htmlFor="nim">NIM</Label>
                                            <Input id="nim" value={data.nim} onChange={(e) => setData('nim', e.target.value)} required />
                                            <InputError message={errors.nim} />
                                        </div>

                                        <div>
                                            <Label htmlFor="jurusan">Jurusan</Label>
                                            <select
                                                id="jurusan"
                                                className="w-full rounded border border-gray-300 p-2"
                                                value={data.jurusan}
                                                onChange={(e) => setData('jurusan', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Pilih Jurusan --</option>
                                                <option value="Teknik Informatika">Teknik Informatika</option>
                                                <option value="Sistem Informasi">Sistem Informasi</option>
                                                <option value="Bisnis Digital">Bisnis Digital</option>
                                            </select>
                                            <InputError message={errors.jurusan} />
                                        </div>
                                    </div>

                                    {/* Kolom Kanan */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="phone_number">No. Telepon</Label>
                                            <Input
                                                id="phone_number"
                                                value={data.phone_number}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (!val.startsWith('62')) {
                                                        val = '62' + val.replace(/^62*/, '');
                                                    }
                                                    setData('phone_number', val);
                                                }}
                                                required
                                            />
                                            <InputError message={errors.phone_number} />
                                        </div>

                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <select
                                                id="role"
                                                className="w-full rounded border border-gray-300 p-2"
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                required
                                            >
                                                <option value="mahasiswa">Mahasiswa</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <InputError message={errors.role} />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <select
                                                id="status"
                                                className="w-full rounded border border-gray-300 p-2"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                required
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Tidak Aktif</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                            <InputError message={errors.status} />
                                        </div>

                                        {!editingUser && (
                                            <>
                                                <div>
                                                    <Label htmlFor="password">Password</Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div>
                                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.password_confirmation} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            reset();
                                            setEditingUser(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" className="bg-[#1E63B0] text-white hover:bg-[#174a7a] cursor-pointer" disabled={processing}>
                                        {editingUser ? 'Simpan' : 'Tambah'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-[#1E63B0] text-white">
                        <tr>
                            <th className="border border-gray-300 p-2">Nama</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">NIM</th>
                            <th className="border border-gray-300 p-2">Jurusan</th>
                            <th className="border border-gray-300 p-2">Role</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Terakhir Login</th>
                            <th className="border border-gray-300 p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMahasiswa.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center p-4 border">
                                    Belum ada Mahasiswa.
                        {mahasiswa.length > 0 ? (
                            mahasiswa.map((user) => (
                                <tr key={user.id} className="odd:bg-white even:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{user.name}</td>
                                    <td className="border border-gray-300 p-2">{user.email}</td>
                                    <td className="border border-gray-300 p-2">{user.nim}</td>
                                    <td className="border border-gray-300 p-2">{user.jurusan}</td>
                                    <td className="border border-gray-300 p-2">{user.role}</td>
                                    <td className="border border-gray-300 p-2">{user.status}</td>
                                    <td className="border border-gray-300 p-2">
                                        {user.last_login_at
                                            ? dayjs(user.last_login_at).isToday()
                                                ? `Hari ini, ${dayjs(user.last_login_at).format('HH:mm:ss')}`
                                                : dayjs(user.last_login_at).isYesterday()
                                                  ? `Kemarin, ${dayjs(user.last_login_at).format('HH:mm:ss')}`
                                                  : dayjs(user.last_login_at).format('DD/MM/YYYY HH:mm:ss')
                                            : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            title="Edit"
                                            className="mr-2 cursor-pointer text-yellow-600 hover:text-yellow-700"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.name)}
                                            title="Hapus"
                                            className="cursor-pointer text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="border border-gray-300 px-2 py-1 text-center text-gray-500">
                                    Tidak ada data mahasiswa.
                                </td>
                            </tr>
                        )}
                        {dataMahasiswa.map((mhs, idx) => (
                            <tr key={mhs.id}>
                                <td className="p-2 border">{idx + 1 + (mahasiswa.current_page - 1) * 10}</td>
                                <td className="p-2 border">{mhs.name}</td>
                                <td className="p-2 border">{mhs.email}</td>
                                <td className="p-2 border">{mhs.jurusan}</td>
                                <td className="p-2 border">{mhs.status}</td>
                                <td className="p-2 border">
                                    {mhs.last_login_at
                                    ? dayjs(mhs.last_login_at).isToday()
                                        ? `Today, ${dayjs(mhs.last_login_at).format('HH:mm')}`
                                        : dayjs(mhs.last_login_at).isYesterday()
                                        ? `Yesterday, ${dayjs(mhs.last_login_at).format('HH:mm')}`
                                        : dayjs(mhs.last_login_at).format('MMM D, YYYY HH:mm')
                                    : '-'}

                                </td>
                                <td className="p-2 border">
                                    {dayjs(mhs.created_at).format('D MMM YYYY')}
                                </td>
                                <td className="p-2 border">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(mhs)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(mhs.id, mhs.name)}
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
                {mahasiswa.links.map((link, idx) => (
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
