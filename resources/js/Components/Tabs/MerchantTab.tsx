import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";
import { Merchant, PaginatedData } from "@/types";

const MerchantTab = ({ merchants }: any) => {
    const { data, links } = merchants;

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
                                            {/* {row.deleted_at && (
                                                <Trash2
                                                    size={16}
                                                    className="ml-2 text-gray-400"
                                                />
                                            )} */}
                                        </>
                                    ),
                                },
                                // {
                                //     label: "Type",
                                //     name: "type",
                                //     renderCell: (row) => (
                                //         <>
                                //             <>{row.merchant_type}</>
                                //             {row.deleted_at && (
                                //                 <Trash2
                                //                     size={16}
                                //                     className="ml-2 text-gray-400"
                                //                 />
                                //             )}
                                //         </>
                                //     ),
                                // },
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
                        <Pagination links={links} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantTab;
