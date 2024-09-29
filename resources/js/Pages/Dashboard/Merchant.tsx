import React from "react";
import DashboardCard from "@/Components/Dashboard/DashboardCard";

const Merchant = ({ product }) => {
    return (
        <div className="flex px-4 py-4">
            <div id="header" className="flex flex-row gap-6">
                <div className="">
                    <DashboardCard
                        header={"Product"}
                        content={product[0]?.count}
                        type={"New"}
                        links={["products", 0]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Product"}
                        content={product[1]?.count}
                        type={"Current"}
                        links={["products", 1]}
                    />
                </div>
                <div>
                    <DashboardCard
                        header={"Product"}
                        content={product[2]?.count}
                        type={"Rejected"}
                        links={["products", 2]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Merchant;
