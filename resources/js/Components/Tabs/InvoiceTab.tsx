import Pagination from "@/Components/Pagination";
import Table from "@/Components/Table/Table";
import { formattedNumber } from "@/utils/formatNumber";
import dayjs from "dayjs";

const InvoiceTab = ({ invoices }: any) => {
    const { data, links, from, to, total } = invoices;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Invoice Date",
                                    name: "invoice_date",
                                    renderCell: (row: any) => (
                                        <>
                                            <span className="text-sm">
                                                {dayjs(row.invoice_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "School",
                                    name: "school_name",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-ellipsis">
                                                {row.school.school_name}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "Invoice No.",
                                    name: "invoice_no",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-sm">
                                                {row.invoice_no}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "Due Date",
                                    name: "due_date",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-sm">
                                                {dayjs(row.due_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "Amount",
                                    name: "invoice_amount",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-right">
                                                {formattedNumber(
                                                    row.invoice_amount
                                                )}
                                            </span>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("invoice.view", row.invoice_id)
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

export default InvoiceTab;
