import dayjs from "dayjs";
import Table from "../Table/Table";
import Pagination from "../Pagination";
import { formattedNumber } from "@/utils/formatNumber";

const OrderTab = ({ orders }: { orders: any }) => {
    const { data, links, from, to, total } = orders;
    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Order Date",
                                    name: "order_date",
                                    renderCell: (row: any) => (
                                        <>
                                            <>
                                                {dayjs(row.order_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </>
                                        </>
                                    ),
                                },
                                {
                                    label: "Due Date",
                                    name: "due_date",
                                    renderCell: (row: any) => (
                                        <>
                                            <div
                                                className={
                                                    dayjs(row.due_date).diff(
                                                        dayjs(),
                                                        "day"
                                                    ) < 5 &&
                                                    row.order_status !== 2
                                                        ? `bg-red-300 px-2 py-1 rounded-sm`
                                                        : ""
                                                }
                                            >
                                                {dayjs(row.due_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </div>
                                        </>
                                    ),
                                },
                                {
                                    label: "Order No.",
                                    name: "order_no",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-right">
                                                {row.order_no}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "School",
                                    name: "school_name",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.school_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Amount",
                                    name: "order_amount",
                                    renderCell: (row) => (
                                        <>
                                            <>
                                                {formattedNumber(
                                                    row.order_amount
                                                )}
                                            </>
                                        </>
                                    ),
                                },
                                {
                                    label: "Type",
                                    name: "order_type",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.order_type}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Invoice No",
                                    name: "invoice_no",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.invoice_no}</>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("order.view", row.order_id)
                            }
                        />
                        <div className="flex flex-col gap-2 py-4">
                            <Pagination links={links} />
                            {from && (
                                <span className="text-sm">
                                    Showing {from} - {to} of {total} records
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTab;
