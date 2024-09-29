import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";
import dayjs from "dayjs";

const ProductTab = ({ products }: any) => {
    const { data, links } = products;
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
                                    colSpan: 2,
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
                        <Pagination links={links} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTab;
