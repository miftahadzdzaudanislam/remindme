import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    nim: string;
    email: string;
    jurusan: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        nim: '',
        email: '',
        jurusan: '',
        phone_number: '62',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-300 p-4">
                {/* Ornamen blur */}
                <div className="absolute -top-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-white/30 blur-2xl" />
                <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />

                <div className="animate-fade-in relative z-10 w-full max-w-2xl space-y-6 rounded-2xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#1E63B0] shadow-lg">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-indigo-700">Create your account</h1>
                        <p className="text-sm text-gray-800">Enter your details below</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Nama - full width */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                className='bg-white/70'
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    type="text"
                                    required
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    disabled={processing}
                                    placeholder="01123456789"
                                    className='bg-white/70'
                                />
                                <InputError message={errors.nim} />
                            </div>

                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                    className='bg-white/70'
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="jurusan">Jurusan</Label>
                                <select
                                    id="jurusan"
                                    required
                                    value={data.jurusan}
                                    onChange={(e) => setData('jurusan', e.target.value)}
                                    disabled={processing}
                                    className="border-input bg-white/70 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">-- Pilih Jurusan --</option>
                                    <option value="Teknik Informatika">Teknik Informatika</option>
                                    <option value="Sistem Informasi">Sistem Informasi</option>
                                    <option value="Bisnis Digital">Bisnis Digital</option>
                                </select>
                                <InputError message={errors.jurusan} />
                            </div>

                            <div>
                                <Label htmlFor="phone_number">Nomor Telepon</Label>
                                <Input
                                    id="phone_number"
                                    type="text"
                                    required
                                    value={data.phone_number}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (!val.startsWith('62')) {
                                            val = '62' + val.replace(/^62*/, '');
                                        }
                                        setData('phone_number', val);
                                    }}
                                    disabled={processing}
                                    placeholder="Contoh: 62XXXXXXXXXX"
                                    className='bg-white/70'
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                    className='bg-white/70'
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                    className='bg-white/70'
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-[#1E63B0] text-white transition duration-150 ease-in-out hover:bg-[#174a7a]"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Creating...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-800">
                        Already have an account?{' '}
                        <TextLink href={route('login')} className="text-[#1E63B0] hover:underline font-bold">
                            Log in
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
