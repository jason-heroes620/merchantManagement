<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class MerchantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'merchant',
            'email' => 'merchant@heroes.my',
            'password' => '$2y$12$GLEmphKwTFSH2YziYUR.F.wEVVOAl4dEgSSkoCmYw90/zSslwFrAe',
            'remember_token' => Str::random(10)
        ])->assignRole('merchant');
    }
}
