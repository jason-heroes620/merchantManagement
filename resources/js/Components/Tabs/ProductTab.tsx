import Pagination from "@/Components/Pagination";
import { Hand, Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";
import dayjs from "dayjs";

const ProductTab = ({ products, type }: any) => {
    const { data, links, from, to, total } = products;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Product Name",
                                    name: "name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.product_name}</>
                                            {row.deleted_at && (
                                                <Trash2
                                                    size={16}
                                                    className="ml-2 text-gray-400"
                                                />
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    label: "Merchant Name",
                                    name: "merchant",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.merchant?.merchant_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Date Submitted",
                                    name: "date",
                                    colSpan: 1,
                                    renderCell: (row) => (
                                        <>
                                            <>
                                                {dayjs(row.created).format(
                                                    "DD/MM/YYYY HH:mm"
                                                )}
                                            </>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("product.view", row.id)
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

export default ProductTab;
