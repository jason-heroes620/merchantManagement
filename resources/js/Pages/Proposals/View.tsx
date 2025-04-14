import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage, Head } from "@inertiajs/react";
import {
    Proposal,
    ProposalDiscount,
    ProposalItem,
    ProposalProductPrices,
    ProposalProduct,
} from "@/types";
import { toast, ToastContainer } from "react-toastify";
import InputLabel from "@/Components/InputLabel";
import moment from "moment";
import { formattedNumber } from "../../utils/formatNumber";
import { MapPin, Hourglass, UsersRound, CalendarIcon } from "lucide-react";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import axios from "axios";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Minus, Plus } from "lucide-react";
import SelectInput from "@/Components/SelectInput";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
} from "@react-google-maps/api";
import "react-toastify/dist/ReactToastify.css";
import { secondsToHms } from "@/utils/secondsToHms";
import { router } from "@inertiajs/react";
import { Calendar } from "@/Components/ui/calendar";
import dayjs from "dayjs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import Checkbox from "@/Components/Checkbox";

const discountType = [
    { label: "Fix Amount", value: "F" },
    { label: "Percentage %", value: "P" },
];

let productTotal = 0.0;
let optionTotal = 0.0;
let feeTotal = 0.0;
let discountTotal = 0.0;
let total = 0.0;

const mapKey = import.meta.env.VITE_GOOGLE_KEY;
const libraries = ["places"];

const View = ({ auth }) => {
    // const libraries = useMemo(() => ["places"], []);
    const {
        proposal,
        proposal_product,
        proposal_item,
        prices,
        proposal_discount,
        proposal_fees,
    } = usePage<{
        proposal: Proposal;
        proposal_product: Array<ProposalProduct>;
        proposal_item: Array<ProposalItem>;
        prices: Array<ProposalProductPrices>;
        proposal_discount: ProposalDiscount;
        proposal_fees: any;
    }>().props;

    const [proposalProduct, setProposalProduct] = useState(proposal_product);
    const [proposalItem, setProposalItem] = useState(proposal_item);

    const [discount, setDiscount] = useState({
        discounttype: proposal_discount?.discount_type ?? "",
        discountamount: proposal_discount?.discount_amount ?? 0,
    });

    const [travelInfo, setTravelInfo] = useState({
        travelDuration:
            proposal.travel_duration !== 0 ? proposal.travel_duration : 0,
        travelDistance:
            proposal.travel_distance > 0 ? proposal.travel_distance : 0,
    });

    const [proposalFees, setProposalFees] = useState(proposal_fees);
    const [loading, setLoading] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [balance, setBalance] = useState(0);

    const calculateTotal = (newProposalItem, newDiscount) => {
        const item = newProposalItem === null ? proposalItem : newProposalItem;
        const disc = newDiscount === null ? discount : newDiscount;

        productTotal = prices.reduce(
            (sum: number, p: any) => sum + parseFloat(p.unit_price) * p.qty,
            0.0
        );

        optionTotal = item.reduce(
            (sum: number, p: any) =>
                sum + parseFloat(p.unit_price) * p.item_qty,
            0.0
        );

        // feeTotal = proposalFees.reduce(
        //     (sum: number, p: any) =>
        //         sum +
        //         (p.fee_type === "P"
        //             ? ((productTotal + optionTotal) *
        //                   parseFloat(p.fee_amount)) /
        //               100
        //             : parseFloat(p.fee_amount)),
        //     0.0
        // );
        feeTotal = parseInt(proposalFees.fee_charges);
        discountTotal =
            parseFloat(disc.discountamount) > 0
                ? disc.discounttype === "P"
                    ? ((productTotal + optionTotal + feeTotal) *
                          parseFloat(disc.discountamount)) /
                      100
                    : parseFloat(disc.discountamount)
                : 0;
        total = productTotal + optionTotal + feeTotal - discountTotal;

        setDepositAmount((total * 50) / 100);
        setBalance(total - (total * 50) / 100);
    };

    const handleUpdateTransportationPrice = (e) => {
        e.preventDefault();
        const data = {
            transportation: proposalItem.filter((q) => {
                return q.item.item_type === "TRANSPORTATION";
            }),
        };

        axios
            .put(
                route("proposal.transportation.update", proposal.proposal_id),
                data
            )
            .then((resp) => {
                if (resp.data.success) {
                    toast.success("Transportation price updated");
                }
            });
    };

    const handleItemQtyChange = (itemId, formula) => {
        let newItem = proposalItem.map((q) => {
            if (q.item_id === itemId) {
                if (formula === "add")
                    return { ...q, item_qty: q.item_qty + 1 };
                else
                    return {
                        ...q,
                        item_qty: q.item_qty > 1 ? q.item_qty - 1 : 1,
                    };
            } else {
                return q;
            }
        });

        setProposalItem(newItem);
        calculateTotal(newItem, null);
    };

    const handleTransportationPriceChange = (e, itemId, proposalItemId) => {
        let newItem = proposalItem.map((q) => {
            if (q.item_id === itemId) {
                return { ...q, unit_price: e.target.value };
            } else {
                return q;
            }
        });
        setProposalItem(newItem);
        calculateTotal(newItem, null);
    };

    // const handleConfirmQuotation = (e) => {
    //     e.preventDefault();

    //     axios
    //         .put(route("proposal.confirm", proposal.proposal_id), {
    //             fees: proposalFees,
    //         })
    //         .then((resp) => {
    //             if (resp.data.success) {
    //                 toast.success(resp.data.success);
    //                 router.visit(
    //                     route("proposal.view", proposal.proposal_id)
    //                 );
    //             } else {
    //                 toast.error(resp.data.error);
    //             }
    //             setOpen(false);
    //         });
    // };

    const handleGenerateOrder = (e) => {
        e.preventDefault();

        axios
            .post(route("order.create"), {
                proposal_id: proposal.proposal_id,
                proposal_amount: total,
                order_type: orderType,
                deposit: depositAmount,
                balance: balance,
                subTotal: productTotal + optionTotal,
                discount_amount: discount.discountamount,
                discount_type: discount.discounttype,
                feeTotal: feeTotal,
                depositDueDate: depositDueDate,
                balanceDueDate: balanceDueDate,
                fees: proposalFees,
            })
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Order created!");
                    router.visit(route("orders"));
                } else if (resp.status === 202) {
                    toast.error(
                        "There might be an issue with visitation date. Please check if there could be duplicates."
                    );
                } else {
                    toast.error(resp.data.error);
                }
                setOpenConfirm(false);
                setOpen(false);
                setLoading(false);
            });
    };

    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    // const confirmDialog = () => {
    //     return (
    //         <AlertDialog open={open} onOpenChange={setOpen}>
    //             <AlertDialogTrigger asChild>
    //                 <Button
    //                     variant="default"
    //                     disabled={
    //                         proposal.proposal_status === 1 ? true : false
    //                     }
    //                 >
    //                     Confirm Quotation
    //                 </Button>
    //             </AlertDialogTrigger>
    //             <AlertDialogContent>
    //                 <AlertDialogHeader>
    //                     <AlertDialogTitle></AlertDialogTitle>
    //                     <AlertDialogDescription>
    //                         Ready to confirm proposal? Once confirmed, a
    //                         notification will be sent to the user email to
    //                         notify them.
    //                     </AlertDialogDescription>
    //                 </AlertDialogHeader>
    //                 <AlertDialogFooter>
    //                     <AlertDialogCancel>Cancel</AlertDialogCancel>
    //                     <AlertDialogAction
    //                         onClick={(e) => handleConfirmQuotation(e)}
    //                     >
    //                         Continue
    //                     </AlertDialogAction>
    //                 </AlertDialogFooter>
    //             </AlertDialogContent>
    //         </AlertDialog>
    //     );
    // };

    const [orderType, setOrderType] = useState("");

    const calculateBalance = (deposit: number) => {
        setBalance(total - deposit);
    };

    const handleCalculateBalance = (deposit: number) => {
        if (deposit < total) {
            setDepositAmount(deposit);
            calculateBalance(deposit);
        } else {
            setDepositAmount(total);
        }
    };

    const [depositDueDate, setDepositDueDate] = useState(
        dayjs().add(14, "days").isBefore(proposal.proposal_date)
            ? dayjs().add(14, "days").toDate()
            : dayjs().toDate()
    );
    const [balanceDueDate, setBalanceDueDate] = useState(
        dayjs(proposal.proposal_date).add(-14, "days").isAfter(dayjs()) &&
            dayjs(proposal.proposal_date)
                .add(-14, "days")
                .isAfter(depositDueDate)
            ? dayjs(proposal.proposal_date).add(-14, "days").toDate()
            : depositDueDate
    );

    const [visitionDate, setVisitationDate] = useState<Date | undefined>(
        moment(proposal.proposal_date).toDate()
    );

    const generateOrder = () => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="primary"
                        disabled={proposal.proposal_status < 3 ? false : true}
                    >
                        Create Order
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[425px]"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Create Order</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Select
                                onValueChange={(value) => setOrderType(value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Choose your order type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deposit">
                                        Deposit & Balance
                                    </SelectItem>
                                    <SelectItem value="single">
                                        Single Order
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {orderType === "deposit" ? (
                            <div>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <InputLabel>Deposit Amount</InputLabel>
                                        <TextInput
                                            type={"number"}
                                            placeholder="Deposit Amount"
                                            onChange={(e) =>
                                                handleCalculateBalance(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            max={total}
                                            min={0}
                                            step={10}
                                            defaultValue={depositAmount.toFixed(
                                                2
                                            )}
                                            className="w-[193px]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel>
                                            Deposit Due Date
                                        </InputLabel>
                                        <Popover modal={true}>
                                            <PopoverTrigger
                                                asChild
                                                className="flex items-center h-[42px]"
                                            >
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon
                                                        size={14}
                                                        className="pr-1"
                                                    />
                                                    {depositDueDate ? (
                                                        moment(
                                                            depositDueDate
                                                        ).format("DD/MM/YYYY")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={depositDueDate}
                                                    onSelect={(date) =>
                                                        setDepositDueDate(date)
                                                    }
                                                    fromDate={moment().toDate()}
                                                    className="rounded-md border"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="py-4">
                                        <InputLabel>Balance</InputLabel>
                                        <TextInput
                                            type={"number"}
                                            placeholder="Balance Amount"
                                            disabled
                                            value={balance.toFixed(2)}
                                        />
                                    </div>
                                    <div className="py-4">
                                        <InputLabel>
                                            Balance Due Date
                                        </InputLabel>
                                        <Popover modal={true}>
                                            <PopoverTrigger
                                                asChild
                                                className="flex items-center h-[42px]"
                                            >
                                                <Button variant={"outline"}>
                                                    <CalendarIcon
                                                        size={14}
                                                        className="pr-1"
                                                    />
                                                    {balanceDueDate ? (
                                                        moment(
                                                            balanceDueDate
                                                        ).format("DD/MM/YYYY")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={balanceDueDate}
                                                    onSelect={(date) => {
                                                        setBalanceDueDate(date);
                                                    }}
                                                    fromDate={moment().toDate()}
                                                    className="rounded-md border"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-4">
                                <div className="py-4">
                                    <InputLabel>Balance</InputLabel>
                                    <TextInput
                                        type={"number"}
                                        placeholder="Balance Amount"
                                        disabled
                                        value={total.toFixed(2)}
                                    />
                                </div>
                                <div className="py-4">
                                    <InputLabel>Balance Due Date</InputLabel>
                                    <Popover modal={true}>
                                        <PopoverTrigger
                                            asChild
                                            className="flex items-center h-[42px]"
                                        >
                                            <Button variant={"outline"}>
                                                <CalendarIcon
                                                    size={14}
                                                    className="pr-1"
                                                />
                                                {balanceDueDate ? (
                                                    moment(
                                                        balanceDueDate
                                                    ).format("DD/MM/YYYY")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={balanceDueDate}
                                                onSelect={(date) =>
                                                    setBalanceDueDate(date)
                                                }
                                                fromDate={moment().toDate()}
                                                className="rounded-md border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <AlertDialog
                            open={openConfirm}
                            onOpenChange={setOpenConfirm}
                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="default">Confirm</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle></AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ready to create order? Once confirmed, a
                                        notification will be sent to the user
                                        email to notify them.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    {/* <AlertDialogAction
                                        onClick={(e) => handleGenerateOrder(e)}
                                    >
                                        Continue
                                    </AlertDialogAction> */}
                                    <Button
                                        variant="default"
                                        onClick={(e) => {
                                            setLoading(true);
                                            handleGenerateOrder(e);
                                        }}
                                    >
                                        {loading ? "Please wait.." : "Continue"}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const handleDiscountChange = (type, value) => {
        let newDiscount = discount;
        if (type === "type") {
            newDiscount = { ...newDiscount, discounttype: value };
        } else {
            newDiscount = { ...newDiscount, discountamount: value };
        }

        calculateTotal(null, newDiscount);
        setDiscount(newDiscount);
    };

    // const handleUpdateDiscount = () => {
    //     const data = {
    //         proposal_id: proposal.proposal_id,
    //         discount_type: discount.discounttype,
    //         discount_amount: discount.discountamount,
    //     };
    //     axios.post(route("discount.create"), data).then((resp) => {
    //         if (resp.data.success) {
    //             toast.success("Discount updated");
    //         } else {
    //             toast.error("Discount update failed");
    //         }
    //     });
    // };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: mapKey, // Replace with your API key
        libraries: libraries as any,
    });

    const [results, setResults] = useState(null);

    const calculateDistances = async (locations: any) => {
        const service = new google.maps.DirectionsService();

        const origin = proposal.origin; // Replace with your origin
        const destination = proposal.origin; // Replace with your destinations
        const waypoints = locations; // Replace with your destinations

        await service.route(
            {
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC, // Use METRIC for kilometers
            },
            (response, status) => {
                if (status === "OK") {
                    setResults(response);
                } else {
                    console.error("Error with Distance Matrix API:", status);
                }
            }
        );
    };

    useEffect(() => {
        calculateTotal(null, null);
        let travelLocations = proposal_product.map((p: any) => {
            return { location: p.product.location, stopover: true };
        });

        if (isLoaded) {
            calculateDistances(travelLocations);
        }
    }, [isLoaded]);

    if (!isLoaded) return <div>Loading...</div>;

    const handleUpdateVisitationDate = (e) => {
        //e.preventDefault();

        axios
            .put(route("proposal.visitation_date", proposal.proposal_id), {
                date: moment(visitionDate).format("YYYY-MM-DD"),
            })
            .then((resp) => {
                if (resp.data.success) {
                    toast.success("Visitation Date Updated");
                } else {
                    toast.error("Issue updating date.");
                }
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("proposals")}>Back</Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="School" />
            <ToastContainer limit={3} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 md:px-10 lg:px-20">
                            <div className="py-2">
                                {/* school info */}
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="school_name"
                                            value="School"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.school_name}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            value="Proposed Visitation Date"
                                            className="py-2"
                                        />
                                        <div className="flex items-center gap-4">
                                            <Popover>
                                                <PopoverTrigger
                                                    asChild
                                                    className="mt-1"
                                                >
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-[50%] justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="pr-2" />
                                                        {visitionDate ? (
                                                            moment(
                                                                visitionDate
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={visitionDate}
                                                        fromDate={moment()
                                                            .add(5, "days")
                                                            .toDate()}
                                                        onSelect={(date) => {
                                                            setVisitationDate(
                                                                date
                                                            );
                                                        }}
                                                        defaultMonth={
                                                            visitionDate
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="primary">
                                                        Update
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle></AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Confirm to update
                                                            visitation date?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={(e) =>
                                                                handleUpdateVisitationDate(
                                                                    3
                                                                )
                                                            }
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="proposal_name"
                                            value="proposal"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.proposal_name}
                                        </span>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="contact_person"
                                            value="Contact Person"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.contact_person}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="contact_no"
                                            value="Contact No. / Mobile No."
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.contact_no} /{" "}
                                            {proposal.mobile_no}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="city"
                                            value="City"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.city}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="qty_student"
                                            value="No. of Students"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.qty_student}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="qty_teacher"
                                            value="No. of Teachers"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {proposal.qty_teacher}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="py-4">
                                {/* proposal product */}
                                <div>
                                    {proposalProduct.map((p, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="px-4 py-4"
                                            >
                                                <div className="flex flex-col md:grid md:grid-cols-2">
                                                    <div className="flex flex-row gap-4">
                                                        <span>
                                                            {index + 1}.
                                                        </span>
                                                        <span className="font-bold">
                                                            {
                                                                p.product
                                                                    .product_name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row py-2 gap-2 md:gap-8">
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <MapPin
                                                            size={16}
                                                            color="red"
                                                        />
                                                        <small>
                                                            {p.product.location}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 py-2">
                                                    <div className="flex flex-row items-center gap-2">
                                                        <UsersRound size={16} />
                                                        <span className="text-sm">
                                                            {
                                                                p.product
                                                                    .age_group
                                                            }
                                                        </span>
                                                    </div>
                                                    {p.product.duration ? (
                                                        <div className="flex flex-row items-center gap-2">
                                                            <Hourglass
                                                                size={16}
                                                            />
                                                            <span className="text-sm">
                                                                {secondsToHms(
                                                                    p.product
                                                                        .duration
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>

                                                <div className="flex flex-col md:flex-row py-2 gap-2 md:gap-8">
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <small>Min. Pax</small>
                                                        <small>
                                                            {
                                                                p.product
                                                                    .min_quantity
                                                            }
                                                        </small>
                                                    </div>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <small>Max. Pax</small>
                                                        <small>
                                                            {
                                                                p.product
                                                                    .max_quantity
                                                            }
                                                        </small>
                                                    </div>
                                                </div>
                                                <div>
                                                    {p.prices?.map((q) => {
                                                        return (
                                                            <span
                                                                className="flex justify-end"
                                                                key={
                                                                    q.attribute
                                                                }
                                                            >
                                                                ({q.attribute}){" "}
                                                                {formattedNumber(
                                                                    q.unit_price
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-end px-4">
                                    <span className="font-bold text-lg">
                                        {formattedNumber(productTotal)}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            {results && (
                                <div className="py-2">
                                    <h2>Route Details:</h2>
                                    <p>
                                        <strong>Total Distance:</strong>{" "}
                                        {Math.round(
                                            travelInfo.travelDistance / 1000
                                        )}{" "}
                                        KM
                                    </p>
                                    <p>
                                        <strong>Total Duration:</strong>{" "}
                                        {secondsToHms(
                                            travelInfo.travelDuration
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-center py-2 pb-4">
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "800px",
                                        height: "400px",
                                    }}
                                    center={{ lat: 3.1385, lng: 101.60458 }}
                                    zoom={12}
                                >
                                    {results && (
                                        <DirectionsRenderer
                                            directions={results}
                                            options={{
                                                suppressMarkers: false,
                                                polylineOptions: {
                                                    strokeColor: "#FF0000",
                                                },
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            </div>
                            <hr />
                            <div className="px-4 py-4">
                                {/* proposal item */}
                                <div className="py-4">
                                    <span className="text-lg font-bold">
                                        Transportation
                                    </span>
                                    {proposalItem
                                        .filter((p) => {
                                            return (
                                                p.item.item_type ===
                                                "TRANSPORTATION"
                                            );
                                        })
                                        .map((p) => {
                                            return (
                                                <div
                                                    key={p.item_id}
                                                    className="flex flex-col md:flex-row md:justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <span>
                                                            {p.item.item_name}
                                                        </span>
                                                    </div>
                                                    {proposal.proposal_status <
                                                    1 ? (
                                                        <div className="flex flex-row gap-2">
                                                            <div className="mr-2 flex flex-row items-center gap-2 py-2">
                                                                <button
                                                                    className="rounded-md bg-gray-200 px-2 py-2"
                                                                    onClick={() =>
                                                                        handleItemQtyChange(
                                                                            p.item_id,
                                                                            "minus"
                                                                        )
                                                                    }
                                                                >
                                                                    <Minus />
                                                                </button>

                                                                <span className="px-2 text-lg font-bold">
                                                                    {p.item_qty}
                                                                </span>

                                                                <button
                                                                    className="rounded-md bg-gray-200 px-2 py-2"
                                                                    onClick={() =>
                                                                        handleItemQtyChange(
                                                                            p.item_id,
                                                                            "add"
                                                                        )
                                                                    }
                                                                >
                                                                    <Plus />
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                                <div className="flex flex-row md:items-center gap-2">
                                                                    <span className="flex items-center text-lg font-bold">
                                                                        RM
                                                                    </span>
                                                                    <TextInput
                                                                        id="transportation"
                                                                        name="transportation"
                                                                        type="number"
                                                                        defaultValue={
                                                                            p.unit_price
                                                                        }
                                                                        className="mt-1 block w-full"
                                                                        autoComplete="transportation"
                                                                        maxLength={
                                                                            10
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handleTransportationPriceChange(
                                                                                e,
                                                                                p.item_id,
                                                                                p.proposal_item_id
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        variant={
                                                                            "primary"
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleUpdateTransportationPrice(
                                                                                e
                                                                            )
                                                                        }
                                                                    >
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <span className="font-bold text-lg">
                                                                        {formattedNumber(
                                                                            p.item_qty *
                                                                                p.unit_price
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                                <span>
                                                                    (
                                                                    {p.item_qty}{" "}
                                                                    X RM{" "}
                                                                    {
                                                                        p.unit_price
                                                                    }{" "}
                                                                    / {p.uom})
                                                                </span>
                                                                <div className="flex flex-row md:items-center gap-2 justify-end">
                                                                    <span className="flex items-center text-lg font-bold">
                                                                        {formattedNumber(
                                                                            p.unit_price *
                                                                                p.item_qty
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="py-4">
                                    <span className="text-lg font-bold">
                                        Meals
                                    </span>
                                    {proposalItem
                                        .filter((p) => {
                                            return p.item.item_type === "FOOD";
                                        })
                                        .map((p) => {
                                            return (
                                                <div
                                                    key={p.item_id}
                                                    className="flex flex-col md:flex-row md:justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <span>
                                                            {p.item.item_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        <span>
                                                            ({p.item_qty} X RM{" "}
                                                            {p.unit_price} /{" "}
                                                            {p.uom})
                                                        </span>
                                                        <div className="flex flex-row md:items-center gap-2 justify-end">
                                                            <span className="flex items-center text-lg font-bold">
                                                                {formattedNumber(
                                                                    p.unit_price *
                                                                        p.item_qty
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="py-4">
                                    <span className="text-lg font-bold">
                                        Insurance
                                    </span>
                                    {proposalItem
                                        .filter((p) => {
                                            return (
                                                p.item.item_type === "INSURANCE"
                                            );
                                        })
                                        .map((p) => {
                                            return (
                                                <div
                                                    key={p.item_id}
                                                    className="flex flex-col md:flex-row md:justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <span>
                                                            {p.item.item_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        <span>
                                                            ({p.item_qty} X RM{" "}
                                                            {p.unit_price} /{" "}
                                                            {p.uom})
                                                        </span>
                                                        <div className="flex flex-row md:items-center gap-2 justify-end">
                                                            <span className="flex items-center text-lg font-bold">
                                                                {formattedNumber(
                                                                    p.unit_price *
                                                                        p.item_qty
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                {proposalItem.some(
                                    (q: any) => q.item.item_type === "GUIDE"
                                ) && (
                                    <div className="py-4">
                                        <span className="text-lg font-bold">
                                            GUIDE
                                        </span>
                                        {proposalItem
                                            .filter((p) => {
                                                return (
                                                    p.item.item_type === "GUIDE"
                                                );
                                            })
                                            .map((p) => {
                                                return (
                                                    <div
                                                        key={p.item_id}
                                                        className="flex flex-col md:flex-row md:justify-between"
                                                    >
                                                        <div className="flex items-center">
                                                            <span>
                                                                {
                                                                    p.item
                                                                        .item_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                            <span>
                                                                ({p.item_qty} X
                                                                RM{" "}
                                                                {p.unit_price} /{" "}
                                                                {p.uom})
                                                            </span>
                                                            <div className="flex flex-row md:items-center gap-2 justify-end">
                                                                <span className="flex items-center text-lg font-bold">
                                                                    {formattedNumber(
                                                                        p.unit_price *
                                                                            p.item_qty
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span>Special Request</span>
                                <textarea
                                    name="special_request"
                                    id=""
                                    defaultValue={proposal?.special_request}
                                    disabled={true}
                                    rows={4}
                                />
                            </div>
                            <hr />
                            <div className="px-4 py-4">
                                <div className="flex justify-end gap-4">
                                    <span className="text-lg font-bold">
                                        Sub Total
                                    </span>
                                    <span className="text-lg font-bold">
                                        {formattedNumber(
                                            productTotal + optionTotal
                                        )}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="px-4 py-4">
                                <div className="text-lg font-bold">Fees</div>
                                <div className="py-2">
                                    {/* {proposalFees.map((f: any) => {
                                        return (
                                            <div
                                                className="flex flex-row justify-between items-center"
                                                key={f.fee_id}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Checkbox
                                                        name="checkbox"
                                                        defaultChecked
                                                        className=""
                                                    />
                                                    <span>
                                                        {f.fee_description}{" "}
                                                        {f.fee_type === "P"
                                                            ? "(" +
                                                              parseInt(
                                                                  f.fee_amount
                                                              ) +
                                                              "%)"
                                                            : formattedNumber(
                                                                  f.fee_amount
                                                              )}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold">
                                                    {f.fee_type === "P"
                                                        ? formattedNumber(
                                                              ((productTotal +
                                                                  optionTotal) *
                                                                  f.fee_amount) /
                                                                  100
                                                          )
                                                        : f.fee_amount}
                                                </span>
                                            </div>
                                        );
                                    })} */}

                                    <div className="flex flex-row justify-end items-center gap-4">
                                        <span className="font-bold text-lg">
                                            {proposalFees.fee_description}{" "}
                                            {proposalFees.fee_type === "P"
                                                ? `(${parseInt(
                                                      proposalFees.fee_amount
                                                  )}%)`
                                                : ""}
                                            {"  "}
                                        </span>
                                        <span className="font-bold text-lg">
                                            {" "}
                                            {formattedNumber(
                                                proposalFees.fee_charges
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />

                            <div className="px-4 py-4">
                                <div>
                                    <span className="text-lg font-bold">
                                        Discount
                                    </span>
                                </div>

                                <div className="flex flex-col  md:flex-row md:justify-end py-4 gap-4">
                                    <div>
                                        <SelectInput
                                            options={discountType}
                                            defaultValue={
                                                discount.discounttype
                                                    ? discount.discounttype
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleDiscountChange(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                        ></SelectInput>
                                    </div>
                                    <div>
                                        <TextInput
                                            name="discount_amount"
                                            type="number"
                                            defaultValue={
                                                discount.discountamount
                                            }
                                            onChange={(e) =>
                                                handleDiscountChange(
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            maxLength={6}
                                            min={0}
                                            className=""
                                        />
                                    </div>
                                    {/* <div className="flex items-center">
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleUpdateDiscount()
                                            }
                                        >
                                            Save Discount
                                        </Button>
                                    </div> */}
                                </div>

                                <div className="flex flex-row gap-4 justify-end">
                                    <span className="font-bold text-lg text-red-600">
                                        Discount
                                    </span>
                                    <span className="font-bold text-lg text-red-600">
                                        -{formattedNumber(discountTotal)}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-col py-4 px-4">
                                <div className="flex justify-end gap-4">
                                    <span className="text-lg font-bold">
                                        Total
                                    </span>
                                    <span className="font-bold text-lg">
                                        {formattedNumber(total)}
                                    </span>
                                </div>
                                {/* <div className="flex justify-end">
                                        <span>
                                            price per pax{" "}
                                            {formattedNumber(
                                                total /
                                                    proposal.proposal
                                                        .qty_student
                                            )}
                                        </span>
                                    </div> */}
                            </div>
                            <hr />
                            <div className="flex flex-row-reverse  py-4">
                                <div className="">{generateOrder()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
