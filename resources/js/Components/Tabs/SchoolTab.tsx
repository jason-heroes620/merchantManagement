import Pagination from "@/Components/Pagination";
import { Trash2 } from "lucide-react";
import Table from "@/Components/Table/Table";

const SchoolTab = ({ schools }: any) => {
    const { data, links } = schools;

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "School Name",
                                    name: "name",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.school_name}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Contact Person",
                                    name: "contact_person",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.contact_person}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Email",
                                    name: "email",
                                    renderCell: (row) => (
                                        <>
                                            <>{row.email}</>
                                        </>
                                    ),
                                },
                                {
                                    label: "Contact No",
                                    name: "contact_no",
                                    colSpan: 2,
                                    renderCell: (row) => (
                                        <>
                                            <>{row.contact_no}</>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                            getRowDetailsUrl={(row) =>
                                route("school.view", row.school_id)
                            }
                        />
                        <Pagination links={links} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolTab;
