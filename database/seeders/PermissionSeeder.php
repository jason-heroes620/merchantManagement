<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $allRoles = Role::all()->keyBy('id');

        // $permissions = [
        //     'cancel-merchant' => [Role::ROLE_ADMINISTRATOR],
        //     'list-merchant' => [Role::ROLE_ADMINISTRATOR],
        //     'create-merchant' => [Role::ROLE_ADMINISTRATOR],
        //     'edit-merchant' => [Role::ROLE_ADMINISTRATOR],
        //     'create-event' => [Role::ROLE_ADMINISTRATOR],
        //     'edit-event' => [Role::ROLE_ADMINISTRATOR],
        //     'cancel-event' => [Role::ROLE_ADMINISTRATOR],
        //     'list-event' => [Role::ROLE_ADMINISTRATOR],
        //     'create-event' => [Role::ROLE_MERCHANT],
        //     'edit-event' => [Role::ROLE_MERCHANT],
        //     'cancel-event' => [Role::ROLE_MERCHANT],
        //     'show-profile' => [Role::ROLE_MERCHANT],
        //     'edit-profile' => [Role::ROLE_MERCHANT],
        // ];

        // foreach ($permissions as $key => $roles) {
        //     $permission = Permission::create(['name' => $key]);
        //     foreach ($roles as $role) {
        //         $allRoles[$role]->givePermissionTo($permission);
        //     }
        // }
    }
}
