// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, 
    ChartLine, 
    // Folder,
    LayoutGrid, Pencil, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user?.role;

    const mainNavItems: NavItem[] =
        role === 'admin'
            ? [
                {
                    title: 'Dashboard Admin',
                    href: '/admin/dashboard-admin',
                    icon: LayoutGrid,
                },
                {
                    title: 'Kelola Mahasiswa',
                    href: '/admin/users',
                    icon: Users,
                },
                {
                    title: 'Lihat Log',
                    href: '/admin/logs',
                    icon: ChartLine,
                },

              ]
            : role === 'mahasiswa'
            ? [
                {
                    title: 'Dashboard Mahasiswa',
                    href: '/mahasiswa/dashboard-mahasiswa',
                    icon: LayoutGrid,
                },
                {
                    title: 'Jadwal Kuliah',
                    href: '/mahasiswa/matkul',
                    icon: BookOpen,
                },
                {
                    title: 'Tugas',
                    href: '/mahasiswa/tugas',
                    icon: Pencil,
                }
              ]
            : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={role === 'admin' ? '/admin/dashboard-admin' : role === 'mahasiswa' ? '/mahasiswa/dashboard-mahasiswa' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
