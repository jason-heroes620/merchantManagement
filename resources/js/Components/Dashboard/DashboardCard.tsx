import React from "react";
import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

const DashboardCard = ({ header, content, type, links }) => {
    const borderColor =
        type === "pending"
            ? "bg-orange-300"
            : type === "current" || type === "accepted" || type === "paid"
            ? "bg-green-300"
            : "bg-red-300";
    return (
        <Link href={route(links[0], type)}>
            <Card className={`border ${borderColor} `}>
                <CardContent className="py-4">
                    <div>
                        <span className="font-bold">{header}</span>
                    </div>
                    <div
                        id="content"
                        className="flex px-2 py py gap-10 justify-between"
                    >
                        <span className="text-sm font-semibold italic capitalize">
                            {type}
                        </span>
                        <span className="text-sm font-bold">{content}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default DashboardCard;
