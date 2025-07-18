<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if (request()->has('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }

        if (request('email')) {
            $query->where('email', 'like', '%' . request('email') . '%');
        }

        $users = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('User/Index', [
            'users' => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['email_verified_at'] = time(); // Set email verified at to now
        $data['password'] = bcrypt($data['password']); // Hash the password before saving   

        User::create($data);

        return to_route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $password = $data['password'] ?? null;  // Hash the password if provided
        // Only hash the password if it is present in the request
        if ($password) {
            $data['password'] = bcrypt($password); // Hash the password before updating
        } else {
            unset($data['password']); // Remove password if not provided
        }
        $user->update($data);

        return to_route('users.index')->with('success', "User '{$user->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent user from deleting themselves
        if (Auth::id() === $user->id) {
            return to_route('users.index')->with('error', "You cannot delete your own account.");
        }
        
        // Check if the user has any associated projects or tasks
        if ($user->projects()->exists() || $user->tasks()->exists()) {
            return to_route('users.index')->with('error', "User '{$user->name}' cannot be deleted because they have associated projects or tasks.");
        }

        $name = $user->name;
        # Delete the user
        $user->delete();

        return to_route('users.index')->with('success', "User '{$name}' deleted successfully.");
    }
}
