import React, { useState, useEffect } from "react";
import DashboardCard from "@/Components/Dashboard/DashboardCard";
import { usePage } from "@inertiajs/react";

const Admin = ({ product, merchant }) => {
    console.log("event= >", product);
    return (
        <div className="flex px-4 py-4">
            <div id="header" className="flex flex-row gap-6">
                <div>
                    <DashboardCard
                        header={"Merchant"}
                        content={merchant[0].count}
                        type={"New"}
                        links={["merchants", 0]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Merchant"}
                        content={merchant[1].count}
                        type={"Current"}
                        links={["merchants", 1]}
                    />
                </div>
                <div className="">
                    <DashboardCard
                        header={"Product"}
                        content={product[0].count}
                        type={"New"}
                        links={["products", 0]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Product"}
                        content={product[1].count}
                        type={"Current"}
                        links={["products", 1]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin;
