import React from "react";
import { Event, PaginatedData } from "@/types";
import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";

const EventTab = ({ events }: any) => {
    const { data, links } = events;
    return (
        <div>
            <div className="pt-4">
                {/* <div>
                    <h2 className="text-lg dark:text-white font-semibold">
                        Merchant List
                    </h2>
                </div> */}
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "Event Name",
                                    name: "name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.event_name}</>
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
                                            <>{row.merchant.merchant_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Date Submitted",
                                    name: "date",
                                    colSpan: 2,
                                    renderCell: (row) => (
                                        <>
                                            <>{row.created}</>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("event.view", row.id)
                            }
                        />
                        <Pagination links={links} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventTab;
