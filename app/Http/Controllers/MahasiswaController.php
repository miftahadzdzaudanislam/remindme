<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\MataKuliah;
use App\Models\Tugas;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Http;

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
        $mata_kuliahs = MataKuliah::where('user_id',$user->id)->paginate(10);

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
            'sync_to_google' => 'nullable|boolean',
        ]);

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Tambah Mata Kuliah',
            'details' => "Menambahkan mata kuliah: {$validatedData['nama_matkul']}",
            'ip_address' => $request->ip(),
        ]);


        $validatedData['jam'] = date('H:i', strtotime($validatedData['jam']));
        $validatedData['user_id'] = $user->id;

        // Sinkronisasi ke Google Calendar jika diminta
        if ($request->sync_to_google && $user->google_refresh_token) {
            $englishDay = $this->getEnglishDay($validatedData['hari']);
            $startDateTime = now()->next($englishDay)->format('Y-m-d') . 'T' . $validatedData['jam'] . ':00';

            $response = Http::withHeaders(['Accept' => 'application/json'])
                ->post('/api/create-event', [
                'summary' => $validatedData['nama_matkul'],
                'description' => 'Dosen: ' . $validatedData['nama_dosen'],
                'location' => $validatedData['ruangan'],
                'startDate' => $startDateTime,
                'endDate' => Carbon::parse($startDateTime)->addHour()->toIso8601String(),
                'refresh_token' => $user->google_refresh_token,
                'recurrence' => [
                    "RRULE:FREQ=WEEKLY;BYDAY=" . $this->getGoogleDayCode($validatedData['hari'])
                ],
            ]);
            $eventId = optional($response->json()['data'])['id'] ?? null;
            $validatedData['google_event_id'] = $eventId;
        }
        $matkul = MataKuliah::create($validatedData);

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
            'sync_to_google' => 'nullable|boolean',
        ]);

        $validatedData['jam'] = date('H:i', strtotime($validatedData['jam']));
        $mata_kuliah->update($validatedData);

        // Update event di Google Calendar jika sync aktif dan sudah pernah sinkron
        if ($user->google_refresh_token && $mata_kuliah->google_event_id) {
            $englishDay = $this->getEnglishDay($validatedData['hari']);
            $startDateTime = now()->next($englishDay)->format('Y-m-d') . 'T' . $validatedData['jam'] . ':00';

            $response = Http::withHeaders(['Accept' => 'application/json'])
                ->put('/api/update-event', [
                'eventId' => $mata_kuliah->google_event_id,
                'summary' => $validatedData['nama_matkul'],
                'description' => 'Dosen: ' . $validatedData['nama_dosen'],
                'location' => $validatedData['ruangan'],
                'startDate' => $startDateTime,
                'endDate' => Carbon::parse($startDateTime)->addHour()->toIso8601String(),
                'refresh_token' => $user->google_refresh_token,
                'recurrence' => [
                    "RRULE:FREQ=WEEKLY;BYDAY=" . $this->getGoogleDayCode($validatedData['hari'])
                ],
            ]);
        }

        return redirect()->route('matkul.index')->with('success', 'Mata Kuliah berhasil diperbarui.');
    }

    // Delete a Mata Kuliah
    public function destroyMatkul(MataKuliah $mata_kuliah)
    {
        $user = Auth::user();

        if ($mata_kuliah->user_id !== $user->id) {
            return redirect()->route('matkul.index')->with('error', 'Anda tidak memiliki akses untuk menghapus mata kuliah ini.');
        }

        // Hapus event Google Calendar jika ada
        if ($mata_kuliah->google_event_id && $user->google_refresh_token) {
            $response = Http::withHeaders(['Accept' => 'application/json'])
                ->delete('/api/delete-event', [
                'eventId' => $mata_kuliah->google_event_id,
                'refresh_token' => $user->google_refresh_token,
            ]);
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
            ->orderBy('deadline', 'asc')
            ->paginate(10);
            
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

        $mahasiswa = $tugas->user->name ?? 'Mahasiswa';
        $judul_tugas = $tugas->judul ?? 'Tugas';
        $matkul = $tugas->mata_kuliah->nama_matkul ?? '-';
        $deskripsi = $tugas->deskripsi ?? '-';
        $deadline = Carbon::parse($tugas->deadline)->locale('id')->translatedFormat('d F Y');
        $pesan3hari = <<<EOT
📌 Daily Reminder - Deadline Tugas
Subjek: 3 Hari Lagi Menuju Deadline!

Halo {$mahasiswa},

Kami ingin mengingatkan bahwa tugas "{$judul_tugas}" dari mata kuliah {$matkul} akan jatuh tempo dalam 3 hari lagi.

📄 Deskripsi: {$deskripsi}
📅 Deadline: {$deadline}

Masih ada waktu untuk menyelesaikan dan merapikan tugasnya. Lebih baik diselesaikan lebih awal agar bisa santai menjelang deadline ✨

Semangat mengerjakan! Kamu pasti bisa 💪
Terima kasih 😊
Salam,
Tim RemindMe
EOT;

$pesanDeadline = <<<EOT
📌 Daily Reminder - Deadline Tugas
Subjek: Deadline Hari Ini - Jangan Lupa Tugasnya!

Halo {$mahasiswa},

Hari ini adalah batas akhir untuk tugas berjudul "{$judul_tugas}" pada mata kuliah {$matkul}.

📄 Deskripsi: {$deskripsi}
📅 Deadline: {$deadline}

Pastikan tugasnya sudah selesai dan dikumpulkan, ya. Kalau sempat, lakukan pengecekan akhir biar hasilnya makin mantap!

Semangat menyelesaikannya tinggal selangkah lagi 💪
Terima kasih 😊
Salam,
Tim RemindMe
EOT;

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

    // Store Google Refresh Token
    public function storeGoogleToken(Request $request)
    {
        $request->validate([
            'google_refresh_token' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        $user->google_refresh_token = $request->google_refresh_token;
        $user->save();

        return response()->json(['message' => 'Google token saved']);
    }

    // Get Google Day
    private function getGoogleDayCode($hari)
    {
        $map = [
            'senin' => 'MO',
            'selasa' => 'TU',
            'rabu' => 'WE',
            'kamis' => 'TH',
            'jumat' => 'FR',
            'sabtu' => 'SA',
            'minggu' => 'SU',
        ];
        return $map[strtolower($hari)] ?? 'MO';
    }

    private function getEnglishDay($hari)
    {
        $map = [
            'senin' => 'Monday',
            'selasa' => 'Tuesday',
            'rabu' => 'Wednesday',
            'kamis' => 'Thursday',
            'jumat' => 'Friday',
            'sabtu' => 'Saturday',
            'minggu' => 'Sunday',
        ];
        return $map[strtolower($hari)] ?? 'Monday';
    }

}
