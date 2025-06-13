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

        $tugas_terdekat = [];
        if ($user) {
            $tugas_terdekat = Tugas::with('mata_kuliah')
                ->where('user_id', $user->id)
                ->where('is_done', '!=', true)
                ->orderBy('deadline', 'asc')
                ->get();
        }

        // Data Statistik
        $jumlah_mahasiswa = User::where('role', 'mahasiswa')->count();
        $jumlah_matkul = MataKuliah::count();
        $jumlah_tugas = Tugas::count();
        $jumlah_tugas_selesai = Tugas::where('is_done', true)->count();

        return view('index', compact(
            'tugas_terdekat',
            'jumlah_mahasiswa', 
            'jumlah_matkul', 
            'jumlah_tugas', 
            'jumlah_tugas_selesai'
        ));
    }
}
