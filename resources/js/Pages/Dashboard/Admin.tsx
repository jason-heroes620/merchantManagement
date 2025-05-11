import React, { useState, useEffect } from "react";
import DashboardCard from "@/Components/Dashboard/DashboardCard";
import { usePage } from "@inertiajs/react";

const Admin = ({ merchant, product, schools, proposals, orders }: any) => {
    return (
        <div className="flex flex-col px-4 py-4 gap-4">
            <div id="header" className="flex flex-row gap-4 overflow-x-auto">
                <div>
                    <DashboardCard
                        header={"Merchant"}
                        content={merchant[0].count}
                        type={"pending"}
                        links={["merchants", 0]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Merchant"}
                        content={merchant[1].count}
                        type={"current"}
                        links={["merchants", 1]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Merchant"}
                        content={merchant[2].count}
                        type={"rejected"}
                        links={["merchants", 2]}
                    />
                </div>
                <div className="">
                    <DashboardCard
                        header={"Product"}
                        content={product[0].count}
                        type={"pending"}
                        links={["products", 0]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Product"}
                        content={product[1].count}
                        type={"current"}
                        links={["products", 1]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Product"}
                        content={product[2].count}
                        type={"rejected"}
                        links={["products", 2]}
                    />
                </div>
            </div>
            <div id="header" className="flex flex-row gap-4 overflow-x-auto">
                <div>
                    <DashboardCard
                        header={"School"}
                        content={schools[0].count}
                        type={"pending"}
                        links={["schools", 1]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Proposal"}
                        content={proposals.count}
                        type={"requestingOrder"}
                        links={["proposals", 1]}
                    />
                </div>
                {/* <div>
                    <DashboardCard
                        header={"Quotations"}
                        content={quotations[1].count}
                        type={"accepted"}
                        links={["quotations", 2]}
                    />
                </div> */}
                <div>
                    <DashboardCard
                        header={"Orders"}
                        content={orders[0].count}
                        type={"pending"}
                        links={["orders", 1]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Orders"}
                        content={orders[1].count}
                        type={"paid"}
                        links={["orders", 2]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin;
