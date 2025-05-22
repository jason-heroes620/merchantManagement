import {
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/Components/ui/table";
import {
    BarChart,
    PieChart,
    Pie,
    Cell,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function UserActivityDashboard() {
    const [activities, setActivities] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [inactiveProposalUsers, setInactiveProposalUsers] = useState([]);

    useEffect(() => {
        axios.get(route("dashboard.activity")).then((response) => {
            setHeatmapData(response.data.heatmapData);
            setTopProducts(response.data.topProducts);
            setInactiveUsers(response.data.inactiveUsers);
            setInactiveProposalUsers(response.data.inactiveProposalUsers);
        });
    }, []);
    const COLORS = ["#6050DC", "#D52DB7", "#FF2E7E", "#FF6B45", "FFAB05"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const renderLegend = (props) => {
        const { payload } = props;

        return (
            <ul className=" text-ellipsis line-clamp-1 w-2">
                {payload.map((entry, index) => ({
                    id: entry.name,
                    type: "square",
                    value: `${entry.name} (${entry.value}%)`,
                    color: COLORS[index % COLORS.length],
                }))}
            </ul>
        );
    };

    return (
        <div className="flex flex-col gap-4 py-4 px-4">
            <div className="flex flex-col py-4 items-center border">
                <div className="py-2">
                    <span className="font-bold">Top Usage Time</span>
                </div>
                <ResponsiveContainer width="90%" height={250}>
                    <BarChart data={heatmapData}>
                        <XAxis dataKey="hour" label={"Hour"} className="py-2" />
                        <YAxis />
                        <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col py-4 items-center border">
                <div>
                    <span className="font-bold">Top 5 Products</span>
                </div>
                <PieChart width={400} height={400}>
                    <Pie
                        data={topProducts}
                        dataKey="views"
                        nameKey="product_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#4f46e5"
                        labelLine={false}
                        label={renderCustomizedLabel}
                    >
                        {topProducts.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Legend />
                </PieChart>
            </div>
            <div className="py-4">
                <div className="py-2">
                    <span className="font-bold">Inactive Users</span>
                </div>
                <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Contact No.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inactiveUsers.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        {activity.contact_person}
                                    </TableCell>
                                    <TableCell>
                                        {activity.school_name}
                                    </TableCell>
                                    <TableCell>
                                        {activity.contact_no} /{" "}
                                        {activity.mobile_no}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            <div className="py-4">
                <div className="py-2">
                    <span className="font-bold">
                        Users With Proposal, No Order
                    </span>
                </div>
                <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Contact No.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inactiveProposalUsers.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        {activity.contact_person}
                                    </TableCell>
                                    <TableCell>
                                        {activity.school_name}
                                    </TableCell>
                                    <TableCell>
                                        {activity.contact_no} /{" "}
                                        {activity.mobile_no}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
