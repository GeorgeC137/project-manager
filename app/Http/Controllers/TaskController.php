<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if (request()->has('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        if (request('created_by')) {
            $query->where('created_by', request('created_by'));
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'users' => User::select('id', 'name')->get(),
            'success' => session('success'),
            'error' => session('error'),
            'currentRoute' => 'tasks.index', // Add this line
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if ($image) {
            $data['image_path'] = $image->store('tasks/'.Str::random(), 'public');
        }

        Task::create($data);

        return to_route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // return "Hello, this is the show method for task {$task->id}";
        return inertia('Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return inertia("Task/Edit", [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $image = $data['image'] ?? null;

        if ($image) {
            // Delete the old image if it exists
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            // Store the new image
            $data['image_path'] = $image->store('tasks/'.Str::random(), 'public');
        }
        $task->update($data);

        return to_route('tasks.index')->with('success', "Task '{$task->name}' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        # Delete the task
        $task->delete();

        # Delete the image if it exists
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }

        return to_route('tasks.index')->with('success', "Task '{$name}' deleted successfully.");
    }

    public function myTasks()
    {
        $user = Auth::user();
        $query = Task::query()->where('assigned_to', $user->id);

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if (request()->has('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        if (request('created_by')) {
            $query->where('created_by', request('created_by'));
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Task/MyTasks', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'users' => User::select('id', 'name')->get(),
            'success' => session('success'),
            'error' => session('error'),
            'currentRoute' => 'tasks.myTasks', // Add this line
        ]);
    }
}
