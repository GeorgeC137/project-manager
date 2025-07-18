import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import Alert from "@/Components/Alert";

export default function Index({ auth, users, queryParams = null, success, error }) {
    queryParams = queryParams || {};
    const searchFieldChanged = (field, value) => {
        // Handle search field changes
        if (value) {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        router.get(route('users.index'), queryParams);
    };

    const onKeyPress = (field, e) => {
        // Handle key press events
        if (e.key !== 'Enter') return;

        searchFieldChanged(field, e.target.value);
    };

    const sortChanged = (field) => {
        // Handle sorting changes
        if (queryParams.sort_field === field) {
            queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            queryParams.sort_field = field;
            queryParams.sort_direction = 'asc';
        }

        router.get(route('users.index'), queryParams);
    }

    const deleteUser = (user) => {
        if (!window.confirm("Are you sure you want to delete the user?")) {
            return;
        }
        router.delete(route("users.destroy", user.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Users
                    </h2>
                    <Link href={route('users.create')} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                        Add New
                    </Link>
                </div>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {error && <Alert message={error} type="error" />}
                    {success && <Alert message={success} type="success" />}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                                ID
                                            </TableHeading>
                                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                                Name
                                            </TableHeading>
                                            <TableHeading name="email" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                                Email
                                            </TableHeading>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                                Create Date
                                            </TableHeading>
                                            <th className="px-3 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3">
                                                <TextInput className="w-full" defaultValue={queryParams.name} placeholder="Search by name" onBlur={(e) => searchFieldChanged('name', e.target.value)} onKeyPress={(e) => onKeyPress('name', e)} />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput className="w-full" defaultValue={queryParams.email} placeholder="Search by email" onBlur={(e) => searchFieldChanged('email', e.target.value)} onKeyPress={(e) => onKeyPress('email', e)} />
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                                            <td className="px-3 py-2">{user.id}</td>
                                            <th className="px-3 py-2 text-gray-100 text-nowrap">
                                                {user.name}
                                            </th>
                                            <td className="px-3 py-2">
                                                {user.email}
                                            </td>
                                            <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                                            <td className="px-3 py-2 text-nowrap">
                                                <Link href={route('users.edit', user.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">Edit</Link>
                                                <button
                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                    onClick={(e) => deleteUser(user)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={users.meta.links} queryParams={queryParams} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}