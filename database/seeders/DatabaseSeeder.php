<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin RemindMe',
            'nim' => '0000000000',
            'email' => 'admin@remindme.com',
            'password' => Hash::make('admin123'),

            'role' => 'admin',
        ]);
    }
}
