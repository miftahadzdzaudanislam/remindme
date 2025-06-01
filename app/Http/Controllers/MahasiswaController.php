<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\MataKuliah;
use App\Models\Tugas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MahasiswaController extends Controller
{
    // Display the dashboard for the student
    public function dashboardMahasiswa()
    {
        $user = Auth::user();

        // Progress tugas
        $total = Tugas::where('user_id', $user->id)->count();
        $done = Tugas::where('user_id', $user->id)->where('is_done', true)->count();
        $progress = $total > 0 ? round($done / $total * 100) : 0;

        // 3 tugas terdekat
        $tugas_terdekat = Tugas::where('user_id', $user->id)
            ->where('is_done', false)
            ->orderBy('deadline')
            ->take(3)
            ->get();

        // Jadwal matkul hari ini
        $hari_ini = now()->locale('id')->isoFormat('dddd');
        $jadwal_hari_ini = MataKuliah::where('user_id', $user->id)
            ->where('hari', $hari_ini)
            ->orderBy('jam')
            ->get();

        return Inertia::render('dashboard/mahasiswa', compact('user', 'progress', 'tugas_terdekat', 'jadwal_hari_ini'));
    }

    // Mata Kuliah Management
    public function indexMatkul()
    {
        $user = Auth::user();
        $mata_kuliahs = MataKuliah::where('user_id',$user->id)->get();

        return Inertia::render('Matkul/index', compact('mata_kuliahs'));
    }

    // Store a new Mata Kuliah
    public function storeMatkul(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'nama_matkul' => 'required|string|max:255',
            'nama_dosen' => 'required|string|max:255',
            'hari' => 'required|string|max:50',
            'jam' => 'required|string|max:50',
            'ruangan' => 'required|string|max:50',
        ]);

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Tambah Mata Kuliah',
            'details' => "Menambahkan mata kuliah: {$validatedData['nama_matkul']}",
            'ip_address' => $request->ip(),
        ]);


        $validatedData['jam'] = date('H:i', strtotime($validatedData['jam']));
        $validatedData['user_id'] = $user->id;

        MataKuliah::create($validatedData);

        return redirect()->route('matkul.index')->with('success', 'Mata Kuliah berhasil ditambahkan.');
    }

    // Update an existing Mata Kuliah
    public function updateMatkul(Request $request, MataKuliah $mata_kuliah)
    {
        $user = Auth::user();

        if ($mata_kuliah->user_id !== $user->id) {
            return redirect()->route('matkul.index')->with('error', 'Anda tidak memiliki akses untuk mengubah mata kuliah ini.');
        }

        $validatedData = $request->validate([
            'nama_matkul' => 'required|string|max:255',
            'nama_dosen' => 'required|string|max:255',
            'hari' => 'required|string|max:50',
            'jam' => 'required|string|max:50',
            'ruangan' => 'required|string|max:50',
        ]);

        $validatedData['jam'] = date('H:i', strtotime($validatedData['jam']));
        $mata_kuliah->update($validatedData);

        return redirect()->route('matkul.index')->with('success', 'Mata Kuliah berhasil diperbarui.');
    }

    // Delete a Mata Kuliah
    public function destroyMatkul(MataKuliah $mata_kuliah)
    {
        $user = Auth::user();

        if ($mata_kuliah->user_id !== $user->id) {
            return redirect()->route('matkul.index')->with('error', 'Anda tidak memiliki akses untuk menghapus mata kuliah ini.');
        }

        $mata_kuliah->delete();

        return redirect()->route('matkul.index')->with('success', 'Mata Kuliah berhasil dihapus.');
    }

    // Tugas Management
    public function indexTugas()
    {
        $user = Auth::user();
        $tugas = Tugas::where('user_id', $user->id)
            ->with('mata_kuliah')
            ->get();
            
        $mata_kuliahs = MataKuliah::where('user_id', $user->id)
            ->select('id', 'nama_matkul')
            ->get();

        return Inertia::render('Tugas/index', compact('tugas', 'mata_kuliahs'));
    }

    // Store a new Tugas
    public function storeTugas(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'deadline' => 'required|date',
            'prioritas' => 'required|in:low,medium,high',
        ]);

        $validatedData['user_id'] = $user->id;

        $tugas = Tugas::create($validatedData);

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Tambah Tugas',
            'details' => "Menambahkan tugas: {$tugas->judul}",
            'ip_address' => $request->ip(),
        ]);

        $this->kirimReminderTugas($user->phone_number, $tugas);

        return redirect()->route('tugas.index')->with('success', 'Tugas berhasil ditambahkan.');
    }

    // Update an existing Tugas
    public function updateTugas(Request $request, Tugas $tugas)
    {
        $user = Auth::user();

        if ($tugas->user_id !== $user->id) {
            return redirect()->route('tugas.index')->with('error', 'Anda tidak memiliki akses untuk mengubah tugas ini.');
        }

        $validatedData = $request->validate([
            'mata_kuliah_id'  => 'required|exists:mata_kuliahs,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'deadline' => 'required|date',
            'prioritas' => 'required|in:low,medium,high',
        ]);

        $oldDeadline = $tugas->deadline;
        $tugas->update($validatedData);

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Ubah Tugas',
            'details' => "Mengubah tugas: {$tugas->judul}",
            'ip_address' => $request->ip(),
        ]);


        if ($oldDeadline !== $validatedData['deadline']) {
            $this->hapusReminderTugas($tugas->id);
            $this->kirimReminderTugas($user->phone_number, $tugas);
        }

        return redirect()->route('tugas.index')->with('success', 'Tugas berhasil diperbarui.');
    }

    // Delete a Tugas
    public function destroyTugas(Request $request, Tugas $tugas)
    {
        $user = Auth::user();

        if ($tugas->user_id !== $user->id) {
            return redirect()->route('tugas.index')->with('error', 'Anda tidak memiliki akses untuk menghapus tugas ini.');
        }

        $this->hapusReminderTugas($tugas->id);
        $tugas->delete();

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Hapus Tugas',
            'details' => "Menghapus tugas: {$tugas->judul}",
            'ip_address' => $request->ip(),
        ]);


        return redirect()->route('tugas.index')->with('success', 'Tugas berhasil dihapus.');
    }

    // Toggle Tugas Status
    public function toggleTugas(Tugas $tugas)
    {
        $user = Auth::user();

        if ($tugas->user_id !== $user->id) {
            return redirect()->route('tugas.index')->with('error', 'Anda tidak memiliki akses untuk mengubah status tugas ini.');
        }

        $tugas->is_done = !$tugas->is_done;
        $tugas->save();

        $status = $tugas->is_done ? 'Selesai' : 'Belum Selesai';

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Ubah Status Tugas',
            'details' => "Menandai tugas '{$tugas->judul}' sebagai $status",
            'ip_address' => request()->ip(),
        ]);


        return back()->with('success', 'Status tugas berhasil diubah.');
    }

    // Send Reminder for Tugas
    private function kirimReminderTugas($nomor, $tugas)
    {
        if ($tugas->is_done == true) {
            return;
        }

        $urlSendMessage = env('WABLAS_API_SEND_MESSAGE');
        $token = env('WABLAS_TOKEN');
        $secret = env('WABLAS_SECRET');
        $accessKey = "$token.$secret";

        $tgl3hariSebelum = now()->parse($tugas->deadline)->subDays(3)->startOfDay();
        $tglDeadline    = now()->parse($tugas->deadline)->startOfDay();
        $hariIni        = now()->startOfDay();

        $pesan3hari = "Halo, ini pengingat bahwa tugas '{$tugas->judul}' akan jatuh tempo 3 hari lagi.";
        $pesanDeadline = "Hari ini adalah deadline untuk tugas '{$tugas->judul}'. Jangan lupa diselesaikan ya!";

        if ($hariIni->eq($tgl3hariSebelum) || $hariIni->eq($tglDeadline)) {
            $pesan = $hariIni->eq($tgl3hariSebelum) ? $pesan3hari : $pesanDeadline;

            $data = [
                'phone'   => $nomor,
                'message' => $pesan,
            ];

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                "Authorization: $accessKey",
            ]);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($curl, CURLOPT_URL, $urlSendMessage); // API untuk kirim pesan langsung
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

            $response = curl_exec($curl);
            curl_close($curl);

            return $response;
        }
    }

    // Delete Reminder for Tugas
    private function hapusReminderTugas($tugasId)
    {
        $reminderBaseUrl = env('WABLAS_API_REMINDER');
        $token = env('WABLAS_TOKEN');
        $secret = env('WABLAS_SECRET');
        $accessKey = "$token.$secret";

        foreach (['H3', 'H0'] as $suffix) {
            $id = "{$tugasId}-{$suffix}";
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                "Authorization: $accessKey",
            ]);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_URL, "{$reminderBaseUrl}/{$id}");
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            curl_exec($curl);
            curl_close($curl);
        }
    }

}
