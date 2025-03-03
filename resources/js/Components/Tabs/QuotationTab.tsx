import Pagination from "@/Components/Pagination";
import Table from "@/Components/Table/Table";
import { formattedNumber } from "@/utils/formatNumber";
import dayjs from "dayjs";

const QuotationTab = ({ quotations }: any) => {
    const { data, links, from, to, total } = quotations;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Quotation Date",
                                    name: "quotation_date",
                                    renderCell: (row: any) => (
                                        <>
                                            <>
                                                {dayjs(
                                                    row.quotation_date
                                                ).format("DD/MM/YYYY")}
                                            </>
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
                                    label: "No. of Students",
                                    name: "qty_student",
                                    renderCell: (row) => (
                                        <>
                                            <span className="text-right">
                                                {row.qty_student}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: "Amount",
                                    name: "amount",
                                    renderCell: (row) => (
                                        <>
                                            <>{formattedNumber(row.amount)}</>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("quotation.view", row.quotation_id)
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

export default QuotationTab;
