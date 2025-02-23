import dayjs from "dayjs";
import Table from "../Table/Table";
import Pagination from "../Pagination";
import { formattedNumber } from "@/utils/formatNumber";

const OrderTab = ({ orders }: { orders: any }) => {
    const { data, links } = orders;

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
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("order.view", row.order_id)
                            }
                        />
                        <Pagination links={links} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTab;
