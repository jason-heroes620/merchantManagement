import Pagination from "@/Components/Pagination";
import Table from "@/Components/Table/Table";
import { formattedNumber } from "@/utils/formatNumber";
import dayjs from "dayjs";

const ProposalTab = ({ proposals }: any) => {
    const { data, links, from, to, total } = proposals;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "School",
                                    name: "school_name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.school?.school_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Proposal Name",
                                    name: "proposal_name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.proposal_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Proposed Visitation Date",
                                    name: "proposal_date",
                                    renderCell: (row: any) => (
                                        <>
                                            <>
                                                {row.proposal_date
                                                    ? dayjs(
                                                          row.proposal_date
                                                      ).format("DD/MM/YYYY")
                                                    : "NA"}
                                            </>
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
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("proposal.view", row.proposal_id)
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

export default ProposalTab;
