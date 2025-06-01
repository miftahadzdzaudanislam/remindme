<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|numeric|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'jurusan' => ['required', 'string'],
            'phone_number' => ['required', 'numeric'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'nim' => $request->nim,
            'email' => $request->email,
            'jurusan' => $request->jurusan,
            'role' => 'mahasiswa',
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
        ]);

        Log::create([
            'user_id' => $user->id,
            'activity' => 'Register',
            'details' => 'User baru telah mendaftar',
            'ip_address' => $request->ip(),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('mahasiswa.dashboard');
    }
}
