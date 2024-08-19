import { Link } from "@inertiajs/react";
import get from "lodash/get";
import { ChevronRight } from "lucide-react";

interface TableProps<T> {
    columns: {
        name: string;
        label: string;
        colSpan?: number;
        renderCell?: (row: T) => React.ReactNode;
    }[];
    rows: T[];
    getRowDetailsUrl?: (row: T) => string;
}

export default function Table<T>({
    columns = [],
    rows = [],
    getRowDetailsUrl,
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full whitespace-nowrap">
                <thead>
                    <tr className="font-bold text-left">
                        {columns?.map((column) => (
                            <th
                                key={column.label}
                                colSpan={column.colSpan ?? 1}
                                className="bg-white dark:bg-gray-800 dark:text-white px-6 pt-5 pb-4"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Empty state */}
                    {rows?.length === 0 && (
                        <tr>
                            <td
                                className="px-6 py-24 dark:bg-gray-800 border-t text-center dark:text-white"
                                colSpan={columns.length}
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                    {rows?.map((row, index) => {
                        return (
                            <tr
                                key={index}
                                className="bg-white dark:bg-gray-800 hover:bg-gray-400 focus-within:bg-black-100"
                            >
                                {columns.map((column) => {
                                    return (
                                        <td
                                            key={column.name}
                                            className="border-t dark:text-white"
                                        >
                                            <Link
                                                tabIndex={-1}
                                                href={
                                                    getRowDetailsUrl?.(
                                                        row
                                                    ) as string
                                                }
                                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none text-ellipsis"
                                            >
                                                {column.renderCell?.(row) ??
                                                    get(row, column.name) ??
                                                    "N/A"}
                                            </Link>
                                        </td>
                                    );
                                })}
                                <td className="w-px border-t">
                                    <Link
                                        href={getRowDetailsUrl?.(row)!}
                                        className="flex items-center px-4 focus:outline-none"
                                    >
                                        <ChevronRight
                                            size={24}
                                            className="text-gray-400"
                                        />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
