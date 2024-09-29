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
        type === "Pending"
            ? "bg-orange-300"
            : type === "Current"
            ? "bg-green-300"
            : "bg-red-300";
    return (
        <Link href={route(links[0], type)}>
            <Card className={`border ${borderColor} `}>
                <CardHeader>
                    <CardTitle>{header}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        id="content"
                        className="flex px-2 py gap-10 justify-between"
                    >
                        <span className="text-lg font-extrabold italic">
                            {type}
                        </span>
                        <span className="text-xl font-bold">{content}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default DashboardCard;
