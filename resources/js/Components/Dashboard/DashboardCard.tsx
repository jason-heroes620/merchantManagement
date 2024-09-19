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
    return (
        <Link href={route(links[0])}>
            {/* <div className="flex px-2 py-4 border-black border rounded-md bg-blue-400">
                <div className="flex flex-col justify-between px-2">
                    <div id="header" className="flex border-b px-10 py-2">
                        <span className="text-left text-xl font-bold italic">
                            {header}
                        </span>
                    </div>
                    <div
                        id="content"
                        className="flex px-2 py-2 justify-between"
                    >
                        <span className="text-xl font-bold text-white">
                            {type}
                        </span>
                        <span className="text-2xl font-bold text-white">
                            {content}
                        </span>
                    </div>
                </div>
            </div> */}
            <Card className="border border-blue-400">
                <CardHeader>
                    <CardTitle>{header}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        id="content"
                        className="flex px-2 py-2 gap-10 justify-between"
                    >
                        <span className="text-xl font-bold ">{type}</span>
                        <span className="text-2xl font-bold">{content}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default DashboardCard;
