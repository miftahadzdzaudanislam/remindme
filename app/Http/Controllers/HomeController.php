<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use App\Models\Tugas;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    // Home
    public function home()
    {
         $user = Auth::user();

    $tugas_terdekat = Tugas::with('mata_kuliah')
        ->where('deadline', '>=', now())
        ->orderBy('deadline')
        ->take(3)
        ->get();

    return view('index', compact('tugas_terdekat'));
    //    $user = Auth::user();

    //     $tugas = [];
    //     if ($user) {
    //         $tugas = Tugas::with('mata_kuliah')
    //             ->where('user_id', $user->id)
    //             ->where('is_done', '!=', true)
    //             ->orderBy('deadline', 'asc')
    //             ->get();
    //     }

    //     // Data Statistik
    //     $jumlah_mahasiswa = User::where('role', 'mahasiswa')->count();
    //     $jumlah_matkul = MataKuliah::count();
    //     $jumlah_tugas = Tugas::count();
    //     $jumlah_tugas_selesai = Tugas::where('is_done', true)->count();

    //     return Inertia::render('welcome', [
    //         'auth' => [
    //             'user' => $user,
    //         ],
    //         'tugas' => $tugas,
    //         'statistik' => [
    //             'mahasiswa' => $jumlah_mahasiswa,
    //             'matkul' => $jumlah_matkul,
    //             'tugas' => $jumlah_tugas,
    //             'tugas_selesai' => $jumlah_tugas_selesai,
    //         ],
    //     ]);
    }
}
