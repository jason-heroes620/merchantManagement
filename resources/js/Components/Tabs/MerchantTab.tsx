import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";
import { Merchant, PaginatedData } from "@/types";

const MerchantTab = ({ merchants }: any) => {
    const { data, links, from, to, total } = merchants;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Name",
                                    name: "name",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.merchant_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "PIC",
                                    name: "pic",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.person_in_charge}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Email",
                                    name: "email",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.merchant_email}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Contact No.",
                                    name: "phone",
                                    colSpan: 2,
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.merchant_phone}</>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("merchant.view", row.id)
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

export default MerchantTab;
