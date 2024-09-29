import React, { FC } from "react";
import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";
import { Merchant, PaginatedData } from "@/types";

const ApprovedMerchants = ({ merchants }: any) => {
    const { data, links } = merchants;

    return (
        <div>
            <div className="pt-4">
                <div>
                    <h2 className="text-lg dark:text-white font-semibold">
                        Merchant List
                    </h2>
                </div>
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Name",
                                    name: "name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.merchant_name}</>
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
                            getRowDetailsUrl={(row: any) =>
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

export default ApprovedMerchants;
