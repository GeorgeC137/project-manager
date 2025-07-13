import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import TableHeading from "@/Components/TableHeading";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({ tasks, users = [], queryParams = null, hideProjectColumn = false }) {
    queryParams = queryParams || {};
    const searchFieldChanged = (field, value) => {
        // Handle search field changes
        if (value) {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        router.get(route('tasks.index'), queryParams);
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

        router.get(route('tasks.index'), queryParams);
    }
    return (
        <>
            <div className="oveflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                ID
                            </TableHeading>
                            <th className="px-3 py-3">Image</th>
                            { !hideProjectColumn && <th className="px-3 py-3">Project Name</th> }
                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                Name
                            </TableHeading>
                            <TableHeading name="status" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                Status
                            </TableHeading>
                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                Create Date
                            </TableHeading>
                            <TableHeading name="due_date" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChanged={sortChanged}>
                                Due Date
                            </TableHeading>
                            <th className="px-3 py-3">Created By</th>
                            <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            {!hideProjectColumn && <th className="px-3 py-3"></th>}
                            <th className="px-3 py-3">
                                <TextInput className="w-full" defaultValue={queryParams.name} placeholder="Search by name" onBlur={(e) => searchFieldChanged('name', e.target.value)} onKeyPress={(e) => onKeyPress('name', e)} />
                            </th>
                            <th className="px-3 py-3">
                                <SelectInput className="w-full" defaultValue={queryParams.status} onChange={(e) => searchFieldChanged('status', e.target.value)}>
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3">
                                <SelectInput
                                    className="w-full"
                                    defaultValue={queryParams.created_by}
                                    onChange={e => searchFieldChanged('created_by', e.target.value)}
                                >
                                    <option value="">All Users</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </SelectInput>
                            </th>
                            <th className="px-3 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map((task) => (<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                            <td className="px-3 py-2">{task.id}</td>
                            <td className="px-3 py-2">
                                <img src={task.image_path} alt={task.name} style={{ width: 60, objectFit: 'cover' }} />
                            </td>
                            {!hideProjectColumn && <td className="px-3 py-2">{task.project.name}</td>}
                            <td className="px-3 py-2">{task.name}</td>
                            <td className="px-3 py-2">
                                <span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task.status]}>{TASK_STATUS_TEXT_MAP[task.status]}</span>
                            </td>
                            <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                            <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                            <td className="px-3 py-2">{task.createdBy.name}</td>
                            <td className="px-3 py-2 text-nowrap">
                                <Link href={route('tasks.edit', task.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">Edit</Link>
                                <Link href={route('tasks.destroy', task.id)} method="delete" className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">Delete</Link>
                            </td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    )
}