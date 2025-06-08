import { PageProps, router } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

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

    const {data, setData, post, put, processing, reset, errors, delete: destroy} = useForm({
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
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    setIsDialogOpen(false);
                },
                onError: () => {
                    setEditingUser(null);
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
        if (confirm(`Apakah Anda yakin ingin menghapus Mahasiswa "${name}"?`)) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Mahasiswa" /> 
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Daftar Mahasiswa</h1>
                <div className="flex justify-end mb-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setEditingUser(null);
                                    setIsDialogOpen(true);
                                }}
                            >
                                Tambah User +
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingUser ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</DialogTitle>
                                <DialogDescription>
                                    {editingUser
                                        ? 'Edit data mahasiswa di bawah ini.'
                                        : 'Isi form berikut untuk menambahkan mahasiswa baru.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type='text'
                                        tabIndex={1}
                                        placeholder='Masukkan nama mahasiswa'
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />

                                    <Label htmlFor="email">Email Mahasiswa</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        tabIndex={2}
                                        placeholder='Masukkan email mahasiswa'
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />

                                    <Label htmlFor="nim">NIM</Label>
                                    <Input
                                        id="nim"
                                        type="text"
                                        tabIndex={3}
                                        placeholder="Masukkan NIM"
                                        value={data.nim}
                                        onChange={e => setData('nim', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nim} className="mt-2" />

                                    {!editingUser && (
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
                                    )}

                                    <Label htmlFor="jurusan">Jurusan</Label>
                                    <select
                                        id="jurusan"
                                        tabIndex={4}
                                        value={data.jurusan}
                                        onChange={e => setData('jurusan', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Jurusan --</option>
                                        <option value="Teknik Informatika">Teknik Informatika</option>
                                        <option value="Sistem Informasi">Sistem Informasi</option>
                                        <option value="Bisnis Digital">Bisnis Digital</option>
                                    </select>
                                    <InputError message={errors.jurusan} className="mt-2" />

                                    <Label htmlFor="phone_number">Nomor Telepon</Label>
                                    <Input
                                        id="phone_number"
                                        type="text"
                                        tabIndex={5}
                                        placeholder="Masukkan nomor telepon"
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
                                    <InputError message={errors.phone_number} className="mt-2" />

                                    <Label htmlFor="role">Role</Label>
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        required
                                    >
                                        <option value="mahasiswa">Mahasiswa</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <InputError message={errors.role} className="mt-2" />

                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                <DialogFooter>
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
                                    <Button type="submit" disabled={processing}>
                                        {editingUser ? 'Ubah' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="border p-2">No.</th>
                            <th className="border p-2">Nama</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Jurusan</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Last Login</th>
                            <th className="border p-2">Created</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataMahasiswa.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center p-4 border">
                                    Belum ada Mahasiswa.
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
