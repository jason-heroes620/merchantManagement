import React, { useState, useEffect } from "react";
import DashboardCard from "@/Components/Dashboard/DashboardCard";
import { usePage } from "@inertiajs/react";

const Admin = ({ product, merchant }) => {
    return (
        <div className="flex px-4 py-4">
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
        </div>
    );
};

export default Admin;
