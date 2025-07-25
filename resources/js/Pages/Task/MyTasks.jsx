import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import TasksTable from "./TasksTable";
import Alert from "@/Components/Alert";

export default function Index({ auth, tasks, users, queryParams, success, error, currentRoute }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    My Tasks
                </h2>

            }
        >
            <Head title="My Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {success && <Alert message={success} type="success" />}
                    {error && <Alert message={error} type="error" />}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <TasksTable tasks={tasks} users={users} queryParams={queryParams} currentRoute={currentRoute} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}