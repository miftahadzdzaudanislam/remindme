<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Display the admin dashboard
    public function dashboardAdmin()
    {
        $mahasiswaCount = User::where('role', 'mahasiswa')->count();

        return Inertia::render('dashboard/admin', compact('mahasiswaCount'));
    }

    // Display the user management page
    public function indexUsers()
    {
        $mahasiswa = User::where('role', 'mahasiswa')->get();

        return Inertia::render('Mahasiswa/index', compact('mahasiswa'));
    }

    // Store a new user
    public function storeUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|numeric|unique:users,nim',
            'email' => 'required|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed'],
            'role' => 'required|in:mahasiswa,admin',
            'jurusan' => 'required|string',
            'phone_number' => 'required|numeric',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        User::create($validatedData);
        
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    // Update an existing user
    public function updateUser(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|numeric|unique:users,nim,'.$user->id,
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|in:mahasiswa,admin',
            'jurusan' => 'required|string',
            'phone_number' => 'required|numeric',
        ]);

        $user->update($validatedData);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    // Delete a user
    public function destroyUser(User $user)
    {
        $user->delete();
        
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    // Display the logs management page
    public function indexLogs()
    {
        $logs = Log::with('user')->latest()->paginate(10);

        return Inertia::render('Logs/index', compact('logs'));
    }
    
    // Delete a log entry
    public function destroyLog(Log $log)
    {
        $log->delete();

        return redirect()->route('logs.index')->with('success', 'Log entry deleted successfully.');
    }
}
