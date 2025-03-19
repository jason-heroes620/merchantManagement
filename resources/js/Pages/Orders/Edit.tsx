import AccordionProposalItem from "@/Components/AccordionItem";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { ProposalItem } from "@/types";
import { formattedNumber } from "@/utils/formatNumber";
import { renderHTML } from "@/utils/renderHtml";
import { secondsToHms } from "@/utils/secondsToHms";
import useDisabledDates from "@/utils/useDisabledDates";
import useDisabledDays from "@/utils/useDisabledDays";
import { Link, Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { isSameDay } from "date-fns";
import {
    CalendarIcon,
    Hourglass,
    MapPin,
    Trash2,
    UsersRound,
    Utensils,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Toaster } from "@/Components/ui/toaster";

const Edit = ({
    auth,
    flash,
    order,
    proposal,
    proposal_product,
    product_prices,
    items,
    proposal_item,
    proposal_fees,
    product_end_date,
    order_total,
}: any) => {
    const { toast } = useToast();
    const { props } = usePage();
    const previousUrl = props.previousUrl || "/";

    const { data, setData, errors, processing } = useForm({
        proposal_id: proposal.proposal_id,
        proposal_name: proposal.proposal_name,
        proposal_date: proposal.proposal_date,
        quotation_id: proposal.quotation_id,
        additional_price: proposal.additional_price,
        qty_student: proposal.qty_student,
        qty_teacher: proposal.qty_teacher,
        proposal_status: proposal.proposal_status,
        special_request: proposal.special_request,
    });

    const products = proposal_product.map((p: any) => {
        return p.product_id;
    });

    const { disabledDays } = useDisabledDays(proposal.proposal_id);
    const { disabledDates } = useDisabledDates(proposal.proposal_id, products);

    const [travelInfo, setTravelInfo] = useState({
        travelDuration:
            proposal.travel_duration !== 0 ? proposal.travel_duration : 0,
        travelDistance:
            proposal.travel_distance > 0 ? proposal.travel_distance : 0,
    });

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(
        data.proposal_date ? moment(data.proposal_date).toDate() : undefined
    );

    const [transportationItem] = useState(
        items.filter((i: any) => i.item_type === "TRANSPORTATION")
    );
    const [mealsItem] = useState(
        items.filter((i: any) => i.item_type === "FOOD")
    );
    const [insuranceItem] = useState(
        items.filter((i: any) => i.item_type === "INSURANCE")
    );

    const [guideItem] = useState(
        items.filter(
            (i: any) =>
                i.item_type === "GUIDE" &&
                proposal_product.some((p: any) => p.product_id === i.product_id)
        )
    );

    const [proposalItems, setProposalItems] = useState(proposal_item);
    const calculateTrasportationFormula = proposalItems?.some(
        (p: any) => p.item_type === "TRANSPORTATION"
    )
        ? false
        : true;
    const [locations, setLocations] = useState([]);
    const [orderTotal, setOrderTotal] = useState(order_total);

    const handleProposalItemChanged = (
        e: React.ChangeEvent<HTMLInputElement>,
        m: ProposalItem
    ) => {
        let newItem = proposalItems;
        const item = {
            item_id: m.item_id,
            unit_price: m.unit_price,
            uom: m.uom,
            item_qty:
                m.item_type === "TRANSPORTATION" || m.item_type === "GUIDE"
                    ? 1
                    : data.qty_student,
            type: m.item_type,
            sales_tax: m.sales_tax,
            additional_unit_cost: m.additional_unit_cost,
            additional: m.additional,
            distance: travelInfo.travelDistance,
        };

        if (proposalItems.length > 0) {
            if (newItem.find((n: ProposalItem) => n.item_id === m.item_id)) {
                newItem = proposalItems.filter((n: ProposalItem) => {
                    return n.item_id !== m.item_id;
                });
                setProposalItems(newItem);
                calculateTotal(newItem, data.qty_student, data.qty_teacher);
            } else {
                setProposalItems([...newItem, item]);
                calculateTotal(
                    [...newItem, item],
                    data.qty_student,
                    data.qty_teacher
                );
            }
        } else {
            setProposalItems([item]);
            calculateTotal([item], data.qty_student, data.qty_teacher);
        }
    };

    const handleItemQtyChange = (item_id: string, formula: string) => {
        let item = [];
        if (formula === "add") {
            item = proposalItems.map((i: ProposalItem) => {
                if (i.item_id === item_id) {
                    return { ...i, item_qty: i.item_qty + 1 };
                } else {
                    return i;
                }
            });
        } else {
            item = proposalItems.map((i: ProposalItem) => {
                if (i.item_id === item_id)
                    return {
                        ...i,
                        item_qty: i.item_qty - 1 > 0 ? i.item_qty - 1 : 1,
                    };
                else {
                    return i;
                }
            });
        }
        setProposalItems(item);
        calculateTotal(item, data.qty_student, data.qty_teacher);
    };

    const handleQtyChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        attribute: string,
        qty: number
    ) => {
        e.preventDefault();
        let student = 0;
        let teacher = 0;

        if (attribute === "student") {
            setData("qty_student", parseInt(e.target.value));
            student = parseInt(e.target.value);
            teacher = data.qty_teacher;
        } else {
            setData("qty_teacher", parseInt(e.target.value));
            teacher = parseInt(e.target.value);
            student = data.qty_student;
        }

        calculateTotal(proposalItems, student, teacher);
    };

    let fee = order_total.filter((o: any) => {
        return o.code === "fee";
    });
    const [orderFee, setOrderFee] = useState(parseFloat(fee[0].value) || 0.0);
    let discount = order_total.filter((o: any) => {
        return o.code === "discount";
    });
    const [orderDiscount, setOrderDiscount] = useState(
        parseFloat(discount[0].value) || 0.0
    );
    let deposit = order_total.filter((o: any) => {
        return o.code === "deposit";
    });
    const [orderDeposit, setOrderDeposit] = useState(
        parseFloat(deposit[0].value) || 0.0
    );
    let balance = order_total.filter((o: any) => {
        return o.code === "balance";
    });
    const [orderBalance, setOrderBalance] = useState(
        parseFloat(balance[0].value) || 0.0
    );

    const [productTotal, setProductTotal] = useState(0);
    const [optionTotal, setOptionTotal] = useState(0);
    const [total, setTotal] = useState(0);

    const calculateTotal = (i: any, student: number, teacher: number) => {
        let product = product_prices.reduce(
            (sum: number, p: any) =>
                p.attribute === "student"
                    ? sum + student * parseFloat(p.unit_price)
                    : sum + teacher * parseFloat(p.unit_price),
            0.0
        );

        let option = i.reduce(
            (sum: number, p: any) =>
                sum +
                (p.item_type === "TRANSPORTATION" &&
                calculateTrasportationFormula
                    ? parseFloat(p.item_qty) *
                      (parseFloat(p.unit_price) +
                          parseFloat(p.additional_unit_cost) *
                              Math.round(travelInfo.travelDistance / 1000))
                    : parseFloat(p.item_qty) * parseFloat(p.unit_price)),
            0.0
        );

        let fee = proposal_fees.reduce(
            (sum: number, p: any) =>
                sum +
                (p.fee_type === "P"
                    ? ((product + option) * p.fee_amount) / 100
                    : p.fee_amount),
            0.0
        );

        let t = product + option + fee - orderDiscount;
        let bal = product + option + fee - orderDiscount + orderDeposit;

        let newOrderTotal = orderTotal.map((o: any) => {
            if (o.code === "fee") return { ...o, value: fee };
            else if (o.code === "sub_total") {
                return { ...o, value: product + option };
            } else if (o.code === "total") {
                return { ...o, value: t };
            } else if (o.code === "balance") {
                return { ...o, value: bal };
            } else {
                return o;
            }
        });

        setOrderTotal(newOrderTotal);
        setProductTotal(product);
        setOptionTotal(option);
        setOrderFee(fee);
        setOrderBalance(bal);
        setTotal(t);
    };

    useEffect(() => {
        let travelLocations = proposal_product.map((p: any) => {
            return { location: p.location.google_location, stopover: true };
        });
        setLocations(travelLocations);

        calculateTotal(proposal_item, data.qty_student, data.qty_teacher);
    }, [travelInfo.travelDistance]);

    const checkMinAndMaxQty = async () => {
        let qualify = true;
        proposal_product.map((p: any) => {
            if (
                p.location.min_quantity > data.qty_student ||
                p.location.max_quantity < data.qty_student
            )
                qualify = false;
        });
        if (!qualify) {
            toast({
                variant: "destructive",
                title: "Min / Max pax limit!",
                description:
                    "There is a min & max pax limit to your location and you might not have meet the requirements. ",
            });
        }
    };

    const handleSaveDraft = async (e: any) => {
        e.preventDefault();
        await checkMinAndMaxQty();
        const draft = {
            proposal_id: data.proposal_id,
            proposal_date: data.proposal_date,
            qty_student: data.qty_student,
            qty_teacher: data.qty_teacher,
            proposal_items: proposalItems,
            order_total: orderTotal,
        };

        axios.put(route("order.update", order.order_id), draft).then((resp) => {
            if (resp.status === 200) {
                toast({
                    description: resp.data.success,
                });
            } else {
                toast({
                    variant: "destructive",
                    description: resp.data.error,
                });
            }
            setOpen(false);
        });
    };

    const isDateDisabled = (dateToCheck: Date) => {
        const dayOfWeek = moment(dateToCheck).day();
        if (disabledDays.includes(dayOfWeek)) {
            return true;
        }

        return disabledDates.some((disabledDate: Date) =>
            isSameDay(dateToCheck, disabledDate)
        );
    };

    // const handleDeleteLocation = (locationId: number) => {
    //     axios
    //         .delete(route("proposal_location.delete", proposal.proposal_id), {
    //             params: {
    //                 location_id: locationId,
    //             },
    //         })
    //         .then((resp) => {
    //             if (resp.status === 200) {
    //                 window.location.reload();
    //             }
    //         });
    // };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8 items-center">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("order.view", order.order_id)}>
                                Back
                            </Link>
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Order
                    </h2>
                </div>
            }
        >
            <Head title="order" />
            <Toaster />
            <div className="py-8">
                <div className="max-w-7xl mx-auto lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="py-4 px-4 md:px-10 lg:px-20">
                            <div className="py-2 pb-6">
                                <form className="flex flex-col gap-4 md:grid md:grid-cols-2">
                                    <div>
                                        <InputLabel>Proposal Name</InputLabel>
                                        <TextInput
                                            id="proposal_name"
                                            name="proposal_name"
                                            value={data.proposal_name}
                                            className="mt-1 block w-full"
                                            autoComplete="proposal_name"
                                            onChange={(e) =>
                                                setData(
                                                    "proposal_name",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={200}
                                            required
                                            disabled={
                                                proposal.proposal_status > 1
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className="flex flex-row">
                                            <InputLabel>
                                                Proposed Visitation Date
                                            </InputLabel>
                                            <span className="text-red-500">
                                                {" "}
                                                *
                                            </span>
                                        </div>
                                        <Popover>
                                            <PopoverTrigger
                                                asChild
                                                className="mt-1"
                                            >
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <div className="flex flex-row items-center gap-2">
                                                        <CalendarIcon />
                                                        <span>
                                                            {date ? (
                                                                moment(
                                                                    date
                                                                ).format(
                                                                    "DD/MM/YYYY"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    fromDate={moment()
                                                        .add(10, "days")
                                                        .toDate()}
                                                    toDate={product_end_date}
                                                    onSelect={(date) => {
                                                        setDate(date);
                                                        setData(
                                                            "proposal_date",
                                                            date?.toLocaleDateString()
                                                        );
                                                    }}
                                                    disabled={isDateDisabled}
                                                    defaultMonth={date}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <InputLabel>No. of Students</InputLabel>
                                        <TextInput
                                            id="qty_student"
                                            name="qty_student"
                                            value={data.qty_student}
                                            className="mt-1 block w-full"
                                            onChange={(e) => {
                                                handleQtyChange(
                                                    e,
                                                    "student",
                                                    data.qty_student
                                                );
                                            }}
                                            min={1}
                                            maxLength={4}
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel>No. of Teachers</InputLabel>
                                        <TextInput
                                            id="qty_teacher"
                                            name="qty_teacher"
                                            value={data.qty_teacher}
                                            className="mt-1 block w-full"
                                            onChange={(e) => {
                                                handleQtyChange(
                                                    e,
                                                    "teacher",
                                                    data.qty_teacher
                                                );
                                            }}
                                            min={1}
                                            maxLength={4}
                                            type="number"
                                        />
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <div className="py-2">
                                <div className="py-2">
                                    <span className="text-lg font-bold">
                                        Location
                                    </span>
                                </div>
                                {proposal_product.map((p: any, i: number) => {
                                    return (
                                        <div
                                            className="py-4 md:px-10 lg:px-20"
                                            key={i}
                                        >
                                            <div className="flex justify-end"></div>
                                            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6">
                                                <div className="flex flex-col md:flex-row px-4">
                                                    {/* <div className="flex justify-between gap-4 py-2">
                                                        <div>
                                                            <Dialog>
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            20
                                                                        }
                                                                        color="red"
                                                                        className="hover:cursor-pointer"
                                                                    />
                                                                </DialogTrigger>
                                                                <DialogContent className="max-h-screen max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle></DialogTitle>
                                                                        <DialogDescription>
                                                                            Confirm
                                                                            to
                                                                            delete
                                                                            this
                                                                            location
                                                                            from
                                                                            proposal?
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <DialogFooter className="justify-end">
                                                                        <DialogClose
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                type="button"
                                                                                variant="secondary"
                                                                            >
                                                                                Close
                                                                            </Button>
                                                                        </DialogClose>
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleDeleteLocation(
                                                                                    p
                                                                                        .location
                                                                                        .id
                                                                                )
                                                                            }
                                                                        >
                                                                            Confirm
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div> */}
                                                    <div>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <MapPin
                                                                    size={16}
                                                                    color={
                                                                        "red"
                                                                    }
                                                                />
                                                                <small className="line-clamp-1 md:line-clamp-3">
                                                                    {
                                                                        p
                                                                            .location
                                                                            .location
                                                                    }
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 py-2">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <UsersRound
                                                                    size={16}
                                                                    color="red"
                                                                />
                                                                <span className="text-sm">
                                                                    {
                                                                        p
                                                                            .location
                                                                            .age_group
                                                                    }
                                                                </span>
                                                            </div>
                                                            {p.location
                                                                .duration ? (
                                                                <div className="flex flex-row items-center gap-2">
                                                                    <Hourglass
                                                                        size={
                                                                            16
                                                                        }
                                                                        color="red"
                                                                    />
                                                                    <span className="text-sm">
                                                                        {secondsToHms(
                                                                            p
                                                                                .location
                                                                                .duration
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        <div className="py grid grid-cols-2">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <Utensils
                                                                    size={16}
                                                                    color="red"
                                                                />
                                                                <span className="text-sm">
                                                                    {p.location
                                                                        .food_allowed ===
                                                                    0
                                                                        ? "Allowed"
                                                                        : "Not Allowed"}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-row items-center gap-2">
                                                                <span className="text-sm text-red-500">
                                                                    Min/Max
                                                                </span>
                                                                <span className="text-sm">
                                                                    {
                                                                        p
                                                                            .location
                                                                            .min_quantity
                                                                    }
                                                                    /
                                                                    {
                                                                        p
                                                                            .location
                                                                            .max_quantity
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="py-2">
                                                            <Dialog>
                                                                <DialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button variant="link">
                                                                        Show
                                                                        More..
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-h-screen max-w-[425px] overflow-y-scroll md:max-w-[620px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle></DialogTitle>
                                                                        <DialogDescription></DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="py-4">
                                                                        <span className="font-bold underline">
                                                                            Description
                                                                        </span>
                                                                        <div className="ulDescription py-2 text-justify">
                                                                            {renderHTML(
                                                                                p
                                                                                    .location
                                                                                    .product_description
                                                                            )}
                                                                        </div>
                                                                        <div className="pt-4">
                                                                            <span className="font-bold underline">
                                                                                Activities
                                                                            </span>
                                                                        </div>
                                                                        <div className="ulDescription py-2 text-justify">
                                                                            {renderHTML(
                                                                                p
                                                                                    .location
                                                                                    .product_activities
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter className="justify-end">
                                                                        <DialogClose
                                                                            asChild
                                                                        >
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
                                                </div>
                                                <div>
                                                    <div className="flex flex-col py-2">
                                                        <div className="flex flex-row justify-end">
                                                            <span className="text-left font-bold">
                                                                (student){" "}
                                                                {formattedNumber(
                                                                    product_prices.filter(
                                                                        (
                                                                            price: any
                                                                        ) => {
                                                                            return (
                                                                                price.product_id ===
                                                                                    p
                                                                                        .location
                                                                                        .id &&
                                                                                price.attribute ===
                                                                                    "student"
                                                                            );
                                                                        }
                                                                    )[0]
                                                                        .unit_price
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-row justify-end">
                                                            <span className="text-left font-bold">
                                                                (teacher){" "}
                                                                {formattedNumber(
                                                                    product_prices.filter(
                                                                        (
                                                                            price: any
                                                                        ) => {
                                                                            return (
                                                                                price.product_id ===
                                                                                    p
                                                                                        .location
                                                                                        .id &&
                                                                                price.attribute ===
                                                                                    "teacher"
                                                                            );
                                                                        }
                                                                    )[0]
                                                                        .unit_price
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="flex flex-col py-4">
                                    <span className="font-bold">
                                        Estimated Travel Distance (Round Trip):{" "}
                                        {Math.round(
                                            travelInfo.travelDistance / 1000
                                        )}{" "}
                                        KM
                                    </span>
                                    <span className="font-bold">
                                        Estimated Travel Duration:{" "}
                                        {secondsToHms(
                                            travelInfo.travelDuration
                                        )}
                                    </span>
                                </div>
                                <div className="py-2">
                                    <div className="flex justify-end">
                                        <span className="text-lg font-bold">
                                            {formattedNumber(productTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="py-2">
                                <div className="py-2">
                                    <span className="text-lg font-bold">
                                        Add on (optional)
                                    </span>
                                </div>
                                <div className="py-2">
                                    <Accordion
                                        type="multiple"
                                        className="w-full"
                                    >
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>
                                                <span>Transportation</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="py-2">
                                                    <span className="text-justify">
                                                        Price inclusive of bus
                                                        rental and round trip
                                                        from your school address
                                                        to selected destinations
                                                    </span>
                                                    <br />
                                                    <span>
                                                        * This is only
                                                        estimation. The final
                                                        transportation cost will
                                                        be provided in
                                                        quotation.
                                                    </span>
                                                </div>
                                                <AccordionProposalItem
                                                    productItems={
                                                        transportationItem
                                                    }
                                                    proposalItems={
                                                        proposalItems
                                                    }
                                                    handleProposalItemChanged={
                                                        handleProposalItemChanged
                                                    }
                                                    handleItemQtyChange={
                                                        handleItemQtyChange
                                                    }
                                                    distance={
                                                        travelInfo.travelDistance
                                                    }
                                                    proposalStatus={
                                                        data.proposal_status
                                                    }
                                                    calculate={
                                                        calculateTrasportationFormula
                                                    }
                                                />
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>
                                                Meals
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div>
                                                    <span>
                                                        Please choose (optional)
                                                    </span>
                                                </div>
                                                <AccordionProposalItem
                                                    productItems={mealsItem}
                                                    proposalItems={
                                                        proposalItems
                                                    }
                                                    handleProposalItemChanged={
                                                        handleProposalItemChanged
                                                    }
                                                    handleItemQtyChange={
                                                        handleItemQtyChange
                                                    }
                                                    distance={0}
                                                    proposalStatus={
                                                        data.proposal_status
                                                    }
                                                    calculate={false}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>
                                                Insurance
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <AccordionProposalItem
                                                    productItems={insuranceItem}
                                                    proposalItems={
                                                        proposalItems
                                                    }
                                                    handleProposalItemChanged={
                                                        handleProposalItemChanged
                                                    }
                                                    handleItemQtyChange={
                                                        handleItemQtyChange
                                                    }
                                                    distance={0}
                                                    proposalStatus={
                                                        data.proposal_status
                                                    }
                                                    calculate={false}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                        {guideItem.length > 0 && (
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>
                                                    Guide
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <AccordionProposalItem
                                                        productItems={guideItem}
                                                        proposalItems={
                                                            proposalItems
                                                        }
                                                        handleProposalItemChanged={
                                                            handleProposalItemChanged
                                                        }
                                                        handleItemQtyChange={
                                                            handleItemQtyChange
                                                        }
                                                        distance={0}
                                                        proposalStatus={
                                                            data.proposal_status
                                                        }
                                                        calculate={false}
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>
                                        )}
                                    </Accordion>
                                </div>
                            </div>

                            <div className="py-4 pb-8">
                                <span className="font-bold">
                                    Special Request
                                </span>
                                <textarea
                                    id="special_request"
                                    name="special_request"
                                    value={data.special_request ?? ""}
                                    className="mt-1 block w-full border-1 px-2 py-2"
                                    onChange={(e) => {
                                        setData(
                                            "special_request",
                                            e.target.value
                                        );
                                    }}
                                    rows={4}
                                    disabled={
                                        proposal.proposal_status > 1
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div>
                                <span className="text-sm">
                                    * All orders are subject to 10%
                                    administration fee.
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-end gap-4 py-2">
                                <span className="text-lg font-bold">
                                    Sub Total
                                </span>
                                <span className="text-lg font-bold">
                                    {formattedNumber(
                                        productTotal + optionTotal
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-end">
                                {proposal_fees?.map((f: any) => {
                                    return (
                                        <div
                                            className="flex gap-4"
                                            key={f.fee_id}
                                        >
                                            <span className="text-lg font-bold">
                                                {f.fee_description} (
                                                {parseInt(f.fee_amount)}%)
                                            </span>
                                            <span className="text-lg font-bold">
                                                {f.fee_type === "P"
                                                    ? formattedNumber(
                                                          ((productTotal +
                                                              optionTotal) *
                                                              f.fee_amount) /
                                                              100
                                                      )
                                                    : formattedNumber(
                                                          f.fee_amount
                                                      )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="py-1">
                                <div className="flex justify-end gap-4">
                                    <span className="text-lg font-bold text-red-600">
                                        Discount
                                    </span>
                                    <span className="text-lg font-bold text-red-600">
                                        - {formattedNumber(orderDiscount)}
                                    </span>
                                </div>
                            </div>

                            <div className="py-1">
                                <div className="flex justify-end">
                                    <span className="text-lg font-bold">
                                        Total{"  "}
                                        {formattedNumber(total)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-lg font-bold text-red-600">
                                    Deposit
                                </span>
                                <span className="text-lg font-bold text-red-600">
                                    {formattedNumber(orderDeposit)}
                                </span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-lg font-bold">
                                    Balance
                                </span>
                                <span className="text-lg font-bold">
                                    {formattedNumber(orderBalance)}
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 py-2">
                                <AlertDialog open={open} onOpenChange={setOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="default">
                                            Save Changes
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle></AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Confirm to save changes?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={(e) =>
                                                    handleSaveDraft(e)
                                                }
                                                disabled={processing}
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
