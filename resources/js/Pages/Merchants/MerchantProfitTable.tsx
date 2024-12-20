import Table from "@/Components/Table/Table";
import dayjs from "dayjs";

const MerchantProfitTable = ({ profitList }) => {
    return (
        <div>
            <div className="pt-4">
                {profitList && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Profit Type",
                                    name: "profit_type",
                                    renderCell: (row: any) => (
                                        <>
                                            <>
                                                {row.profit_type === 1
                                                    ? "Percentage"
                                                    : "Fix"}
                                            </>
                                        </>
                                    ),
                                },
                                {
                                    label: "Profit Value",
                                    name: "profit_value",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.profit_value}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Start Date",
                                    name: "start_date",
                                    renderCell: (row) => (
                                        <>
                                            <>
                                                {dayjs(row.start_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </>
                                        </>
                                    ),
                                },
                                {
                                    label: "End Date",
                                    name: "end_date",
                                    renderCell: (row) => (
                                        <>
                                            <>
                                                {dayjs(row.end_date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </>
                                        </>
                                    ),
                                },
                            ]}
                            rows={profitList}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantProfitTable;
