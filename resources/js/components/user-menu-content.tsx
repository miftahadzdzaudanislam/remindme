import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Home, LogOut, Settings } from 'lucide-react';
import Swal from 'sweetalert2';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Yakin Ingin Logout?',
            text: 'Kamu akan keluar dari sesi saat ini.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Logout!',
        });

        if (result.isConfirmed) {
            cleanup();
            router.post(
                route('logout'),
                {},
                {
                    onSuccess: () => {
                        window.location.href = '/';
                    },
                }
            );
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <a href="/" className="block w-full px-2 py-1.5 text-sm">
                        <Home size={16} />
                        <span className='ml-2'>Halaman Utama</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                {/* ganti dari Link ke button karena kita tidak langsung submit form post */}
                <button onClick={handleLogout} className="flex w-full items-center px-2 py-1.5 text-sm">
                    <LogOut className="mr-2" />
                    Log out
                </button>
            </DropdownMenuItem>
        </>
    );
}
