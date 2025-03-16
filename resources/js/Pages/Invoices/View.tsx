import { useForm, Link, Head } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import InputLabel from "@/Components/InputLabel";
import moment from "moment";
import { formattedNumber } from "@/utils/formatNumber";

const View = ({
    auth,
    invoice,
    order,
    proposal,
    proposalProduct,
    proposalItems,
    school,
    orderTotal,
    payment,
}) => {
    const toast = useToast();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8 items-center">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("invoices")}>Back</Link>
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Invoice
                    </h2>
                </div>
            }
        >
            <Head title="Invoice" />
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-4 md:px-10 lg:px-20">
                            <div className="">
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="invoice_no"
                                            value="Invoice No."
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {invoice.invoice_no}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="invoice_date"
                                            value="Invoice Date"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {moment(
                                                invoice.invoice_date
                                            ).format("DD/MM/YYYY")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="payment_date"
                                            value="Payment Date"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {moment(payment.created).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </span>
                                    </div>
                                    {/* <div className="px-2">
                                    <InputLabel
                                        htmlFor="invoice_date"
                                        value="Invoice Date"
                                        className="py-2"
                                    />
                                    <span className="py-4">
                                        {moment(invoice.due_date).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </span>
                                </div> */}
                                </div>
                            </div>
                            <hr />
                            <div className="">
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="school_name"
                                            value="School"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {school.school_name}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="proposal_name"
                                            value="Proposal Name"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.proposal_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:grid md:grid-cols-2 py-4">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="proposal_date"
                                            value="Proposed Visitation Date"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {moment(
                                                proposal.proposal_date
                                            ).format("DD/MM/YYYY")}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="No. of Students / No. of Teachers"
                                            value="No. of Students / No. of Teachers"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.qty_student} /{" "}
                                            {proposal.qty_teacher}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="px-2">
                                <div className="flex flex-col md:grid md:grid-cols-6 py-4 border-b-2">
                                    <span className="flex md:grid md:col-span-3 md:row-span-2 font-bold">
                                        Item
                                    </span>
                                    <div className="flex flex-row justify-between md:col-span-3">
                                        <span className="flex md:grid md:col-span-1 justify-end font-bold">
                                            Quantity
                                        </span>
                                        <span className="flex md:grid md:col-span-1 justify-end font-bold">
                                            Unit Price (RM)
                                        </span>
                                        <span className="flex md:grid md:col-span-1 justify-end font-bold">
                                            Amount (RM)
                                        </span>
                                    </div>
                                </div>
                                {order.order_type === "D" && (
                                    <div className="flex flex-col md:grid md:grid-cols-6 py-4">
                                        <div className="flex md:col-span-3">
                                            <span>Deposit</span>
                                        </div>

                                        <div className="flex flex-row justify-between md:col-span-3">
                                            <div className="flex md:grid md:col-span-1 justify-end">
                                                <span>1</span>
                                            </div>
                                            <div className="flex md:grid md:col-span-1 justify-end">
                                                <span>
                                                    {order.order_amount}
                                                </span>
                                            </div>
                                            <div className="flex md:grid md:col-span-1">
                                                <span>
                                                    {order.order_amount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {order.order_type !== "D" &&
                                    proposalProduct.map((product, index) => {
                                        return (
                                            <div className="flex flex-col md:grid md:grid-cols-6 py-4">
                                                <div className="flex md:col-span-3 md:row-span-2">
                                                    {
                                                        product.product
                                                            .product_name
                                                    }
                                                </div>

                                                {product.product_price.map(
                                                    (p) => {
                                                        return (
                                                            <div
                                                                className="flex flex-row justify-between md:col-span-3"
                                                                key={
                                                                    p.product_id
                                                                }
                                                            >
                                                                <div className="flex md:col-span-1 md:justify-end">
                                                                    {p.qty}
                                                                </div>
                                                                <div className="flex md:col-span-1 justify-end">
                                                                    {
                                                                        p.unit_price
                                                                    }
                                                                </div>
                                                                <div className="flex md:col-span-1 justify-end">
                                                                    {(
                                                                        p.qty *
                                                                        p.unit_price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        );
                                    })}

                                {order.order_type !== "D" &&
                                    proposalItems.map((item, index) => {
                                        return (
                                            <div
                                                className="flex flex-col md:grid md:grid-cols-6 py-4"
                                                key={index}
                                            >
                                                <div className="flex md:col-span-3">
                                                    {item.item_name}
                                                </div>

                                                <div className="flex flex-row justify-between md:col-span-3">
                                                    <div className="flex md:grid md:col-span-1 justify-end">
                                                        {item.item_qty}
                                                    </div>
                                                    <div className="flex md:grid md:col-span-1 justify-end">
                                                        {item.unit_price}
                                                    </div>
                                                    <div className="flex md:grid md:col-span-1">
                                                        {(
                                                            item.item_qty *
                                                            item.unit_price
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <hr />
                            <div className="">
                                <div className="flex flex-col gap-2 py-4">
                                    {orderTotal.map((o: any, index: number) => {
                                        return (
                                            <div
                                                className="flex justify-end gap-4"
                                                key={index}
                                            >
                                                <span className="font-bold">
                                                    {o.title}
                                                </span>
                                                <span className="font-bold">
                                                    {formattedNumber(o.value)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-col px-4 py-4">
                                {payment && (
                                    <div>
                                        <div className="flex flex-row gap-4">
                                            <span>Payment Date: </span>
                                            <span>
                                                {moment(payment.created).format(
                                                    "DD MMM YYYY"
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <span>Payment Ref: </span>
                                            <span>{payment.payment_ref}</span>
                                        </div>

                                        <div className="flex flex-row gap-4">
                                            <span>Bank Ref.: </span>
                                            <span>{payment.bank_ref}</span>
                                        </div>
                                        <div className="flex flex-row gap-4">
                                            <span>Payment Method: </span>
                                            <span>
                                                {payment.payment_method}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
