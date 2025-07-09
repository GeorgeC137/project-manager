import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

export default function TableHeading({ name, sort_field = null, sort_direction = null, children, sortable = true, sortChanged = () => {} }) {
    return (
        <th onClick={(e) => sortChanged(name)}>
            <div className="cursor-pointer px-3 py-3 items-center justify-between gap-1">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon className={"w-4 " + (sort_field === name && sort_direction === 'asc' ? 'text-white font-bold' : '')} />
                        <ChevronDownIcon className={"w-4 -mt-2 " + (sort_field === name && sort_direction === 'desc' ? 'text-white font-bold' : '')} />
                    </div>
                )}
            </div>
        </th>
    );
}