import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-300 flex items-center justify-center p-4 overflow-hidden">
                {/* Ornamen latar belakang blur */}
                <div className="absolute -top-10 -left-10 h-40 w-40 bg-white/30 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 h-56 w-56 bg-cyan-200/30 rounded-full blur-3xl" />

                <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-lg">
                            <LockKeyhole className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-indigo-700">Welcome to RemindMe</h1>
                        <p className="text-sm text-gray-900">Log in to your account</p>
                    </div>

                    {status && (
                        <div className="rounded bg-green-100 px-4 py-2 text-center text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                                className="mt-1 bg-white/70"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-indigo-600 hover:underline">
                                        Forgot?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 bg-white/70"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                            />
                            <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#1E63B0] text-white hover:bg-[#174a7a] transition duration-150 ease-in-out cursor-pointer"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Logging in...
                                </span>
                            ) : (
                                'Log in'
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-800">
                        Don’t have an account?{' '}
                        <TextLink href={route('register')} className="text-indigo-600 hover:underline font-bold">
                            Sign up
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}
