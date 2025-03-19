import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import { Toaster } from "@/Components/ui/toaster";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formattedNumber } from "@/utils/formatNumber";
import { Head, Link } from "@inertiajs/react";
import moment from "moment";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import TextInput from "@/Components/TextInput";
import { useState } from "react";
import axios from "axios";

const View = ({
    auth,
    order,
    proposal,
    proposalProduct,
    proposalItems,
    school,
    orderTotal,
    payment,
    invoice,
}) => {
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceId, setInvoiceId] = useState("");

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        axios
            .post(route("invoice.create"), {
                invoice_no: invoiceNo,
                order_id: order.order_id,
            })
            .then((resp) => {
                if (resp.status === 200) {
                    setInvoiceId(resp.data.data.invoice_id);
                }
            });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8 items-center">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("orders")}>Back</Link>
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Order
                    </h2>
                </div>
            }
        >
            <Head title="order" />
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-4 md:px-10 lg:px-20">
                            <div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="order_no"
                                            value="Order No."
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {order.order_no}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="order_date"
                                            value="Order Date"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {moment(order.order_date).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="school"
                                            value="School"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {school.school_name}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="order_no"
                                            value="Due Date"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {moment(order.due_date).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="proposal_name"
                                            value="Proposal Name"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {proposal.proposal_name}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="proposal_date"
                                            value="Proposed Visitation Date"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {moment(
                                                proposal.proposal_date
                                            ).format("DD/MM/YYYY")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="qty"
                                            value="No. of Students / No. of Teachers"
                                            className="py-2 font-bold"
                                        />
                                        <span className="py-4">
                                            {proposal.qty_student} /{" "}
                                            {proposal.qty_teacher}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <div className="flex flex-col border-b-2 py-4 md:grid md:grid-cols-6">
                                    <div className="flex md:grid md:col-span-3">
                                        <span className="flex font-bold">
                                            Item
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between md:col-span-3">
                                        <div className="justify-end">
                                            <span className="font-bold">
                                                Quantity
                                            </span>
                                        </div>
                                        <div className="justify-end">
                                            <span className="font-bold">
                                                Unit Price (RM)
                                            </span>
                                        </div>
                                        <div className="justify-end ">
                                            <span className="font-bold">
                                                Amount (RM)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {order.order_type === "D" && (
                                    <div className="flex flex-col py-4 md:grid md:grid-cols-6">
                                        <div className="flex md:grid md:col-span-3">
                                            <span>Deposit</span>
                                        </div>
                                        <div className="flex flex-row justify-between md:col-span-3">
                                            <div className="justify-end">
                                                <span>1</span>
                                            </div>
                                            <div className="justify-end">
                                                <span>
                                                    {order.order_amount}
                                                </span>
                                            </div>
                                            <div className="justify-end">
                                                <span>
                                                    {order.order_amount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {order.order_type !== "D" &&
                                    proposalProduct.map(
                                        (product: any, index: any) => {
                                            return (
                                                <div
                                                    className="flex flex-col py-4 md:grid md:grid-cols-6"
                                                    key={index}
                                                >
                                                    <div className="flex md:col-span-3 md:row-span-2">
                                                        {
                                                            product.product
                                                                .product_name
                                                        }
                                                    </div>

                                                    {product.product_price.map(
                                                        (p: any) => {
                                                            return (
                                                                <div
                                                                    className="flex flex-row justify-between md:col-span-3"
                                                                    key={
                                                                        p.product_price_id
                                                                    }
                                                                >
                                                                    <div className="flex md:col-span-1 justify-end">
                                                                        {p.qty}
                                                                    </div>
                                                                    <div className="flex justify-end md:col-span-1">
                                                                        {
                                                                            p.unit_price
                                                                        }
                                                                    </div>
                                                                    <div className="flex justify-end md:col-span-1">
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
                                        }
                                    )}

                                {order.order_type !== "D" &&
                                    proposalItems.map(
                                        (item: any, index: any) => {
                                            return (
                                                <div
                                                    className="flex flex-col py-4 md:grid md:grid-cols-6"
                                                    key={index}
                                                >
                                                    <div className="flex md:col-span-3">
                                                        {item.item_name}
                                                    </div>

                                                    <div className="flex flex-row justify-between md:col-span-3">
                                                        <div className="flex justify-end md:col-span-1 md:grid">
                                                            {item.item_qty}
                                                        </div>
                                                        <div className="flex justify-end md:col-span-1 md:grid">
                                                            {item.unit_price}
                                                        </div>
                                                        <div className="flex md:col-span-1 md:grid">
                                                            {(
                                                                item.item_qty *
                                                                item.unit_price
                                                            ).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                            <hr />

                            <div>
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
                            {(order.order_status === 0 ||
                                order.order_status === 1) &&
                                order.order_type === "B" && (
                                    <div className="flex justify-end py-4">
                                        <Button asChild variant="default">
                                            <Link
                                                href={route(
                                                    "order.edit",
                                                    order.order_id
                                                )}
                                            >
                                                Edit Order
                                            </Link>
                                        </Button>
                                    </div>
                                )}

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
                                        <div className="py-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="primary"
                                                        disabled={
                                                            payment &&
                                                            invoice.length === 0
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        Issue Invoice
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Issue Invoice
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Please enter Invoice
                                                            No.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="grid flex-1 gap-2">
                                                            <TextInput
                                                                id="invoice_no"
                                                                name="invoice_no"
                                                                className="mt-1 block w-full"
                                                                autoComplete="invoice_no"
                                                                onChange={(e) =>
                                                                    setInvoiceNo(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <Button
                                                            type="submit"
                                                            className="px-3"
                                                            onClick={(e) =>
                                                                handleCreateInvoice(
                                                                    e
                                                                )
                                                            }
                                                            disabled={
                                                                invoiceNo === ""
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <span>Create</span>
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        {invoiceId && (
                                                            <span>
                                                                Invoice
                                                                generated. You
                                                                can click on
                                                                this{" "}
                                                                <u>
                                                                    <Link
                                                                        href={route(
                                                                            "invoice.view",
                                                                            invoiceId
                                                                        )}
                                                                    >
                                                                        link
                                                                    </Link>
                                                                </u>{" "}
                                                                to view the
                                                                invoice.
                                                            </span>
                                                        )}
                                                    </div>
                                                    <DialogFooter className="sm:justify-start">
                                                        <DialogClose asChild>
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                            >
                                                                Close
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
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
