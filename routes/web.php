<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MahasiswaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/test-calendar', function () {
    return view('index');
})->name('test.calendar');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard-admin', [AdminController::class, 'dashboardAdmin'])
            ->name('admin.dashboard');

        // Routes for User Management
        Route::get('/users', [AdminController::class, 'indexUsers'])
            ->name('users.index');
        Route::post('/users', [AdminController::class, 'storeUser'])
            ->name('users.store');
        Route::put('/users/{user}', [AdminController::class, 'updateUser'])
            ->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])
            ->name('users.destroy');

        // Routes for Logs
        Route::get('/logs', [AdminController::class, 'indexLogs'])
            ->name('logs.index');
        Route::delete('/logs/{log}', [AdminController::class, 'destroyLog'])
            ->name('logs.destroy');
    });

    Route::middleware(['mahasiswa'])->prefix('mahasiswa')->group(function () {
        Route::get('/dashboard-mahasiswa', [MahasiswaController::class, 'dashboardMahasiswa'])
            ->name('mahasiswa.dashboard');

        // Routes for Matkul 
        Route::get('/matkul', [MahasiswaController::class, 'indexMatkul'])
            ->name('matkul.index');
        Route::post('/matkul', [MahasiswaController::class, 'storeMatkul'])
            ->name('matkul.store');
        Route::put('/matkul/{mata_kuliah}', [MahasiswaController::class, 'updateMatkul'])
            ->name('matkul.update');
        Route::delete('/matkul/{mata_kuliah}', [MahasiswaController::class, 'destroyMatkul'])
            ->name('matkul.destroy');
        
        // Routes for Tugas
        Route::get('/tugas', [MahasiswaController::class, 'indexTugas'])
            ->name('tugas.index');
        Route::post('/tugas', [MahasiswaController::class, 'storeTugas'])
            ->name('tugas.store');
        Route::put('/tugas/{tugas}', [MahasiswaController::class, 'updateTugas'])
            ->name('tugas.update');
        Route::delete('/tugas/{tugas}', [MahasiswaController::class, 'destroyTugas'])
            ->name('tugas.destroy');
        Route::patch('/tugas/{tugas}/toggle', [MahasiswaController::class, 'toggleTugas'])
            ->name('tugas.toggle');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
