import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage, Head } from "@inertiajs/react";
import { Quotation } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import InputLabel from "@/Components/InputLabel";
import moment from "moment";
import { formattedNumber } from "../../utils/formatNumber";
import { MapPin, Hourglass } from "lucide-react";
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
import { Minus, Plus } from "lucide-react";
import SelectInput from "@/Components/SelectInput";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
} from "@react-google-maps/api";

import "react-toastify/dist/ReactToastify.css";
import { secondsToHms } from "@/utils/secondsToHms";

const discountType = [
    { label: "Fix Amount", value: "F" },
    { label: "Percentage %", value: "P" },
];

let subTotal = 0.0;
let optionTotal = 0.0;
let total = 0.0;

const View = ({ auth }) => {
    const { quotation } = usePage<{
        quotation: Quotation;
    }>().props;

    const [quotationProduct, setQuotationProduct] = useState(
        quotation.quotation_product
    );
    const [quotationItem, setQuotationItem] = useState(
        quotation.quotation_item
    );

    const [discount, setDiscount] = useState({
        discounttype: quotation.quotation_discount?.discount_type,
        discountamount: quotation.quotation_discount?.discount_amount,
    });

    const [travelInfo, setTravelInfo] = useState({
        travelDuration:
            quotation.proposal.travel_duration !== 0
                ? quotation.proposal.travel_duration
                : 0,
        travelDistance:
            quotation.proposal.travel_distance > 0
                ? quotation.proposal.travel_distance
                : 0,
    });

    const calculateTotal = (newQuotationItem, newDiscount) => {
        const item =
            newQuotationItem === null ? quotationItem : newQuotationItem;
        const disc = newDiscount === null ? discount : newDiscount;

        subTotal = quotation.prices.reduce(
            (sum: number, p: any) => sum + parseFloat(p.unit_price) * p.qty,
            0.0
        );

        optionTotal = item.reduce(
            (sum: number, p: any) =>
                sum + parseFloat(p.unit_price) * p.item_qty,
            0.0
        );

        total =
            subTotal +
            optionTotal -
            (parseFloat(disc.discountamount) > 0
                ? disc.discounttype === "P"
                    ? ((subTotal + optionTotal) *
                          parseFloat(disc.discountamount)) /
                      100
                    : parseFloat(disc.discountamount)
                : 0);
    };

    calculateTotal(null, null);

    const handleUpdateTransportationPrice = (e) => {
        e.preventDefault();
        const data = {
            transportation: quotationItem.filter((q) => {
                return q.item.item_type === "TRANSPORTATION";
            }),
        };

        axios
            .put(
                route(
                    "quotation.transportation.update",
                    quotation.quotation_id
                ),
                data
            )
            .then((resp) => {
                if (resp.data.success) {
                    toast.success("Transportation price updated");
                }
            });
    };

    const handleItemQtyChange = (itemId, formula) => {
        let newItem = quotationItem.map((q) => {
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

        setQuotationItem(newItem);
        calculateTotal(newItem, null);
    };

    const handleTransportationPriceChange = (e, itemId, quotationItemId) => {
        let newItem = quotationItem.map((q) => {
            if (q.quotation_item_id === quotationItemId) {
                return { ...q, unit_price: e.target.value };
            } else {
                return q;
            }
        });

        setQuotationItem(newItem);
        calculateTotal(newItem, null);
    };

    const handleConfirmQuotation = (e) => {
        e.preventDefault();

        axios
            .put(route("quotation.update", quotation.quotation_id))
            .then((resp) => {
                if (resp.data.success) {
                    toast.success(resp.data.success);
                } else {
                    toast.error(resp.data.error);
                }
                setOpen(false);
            });
    };

    const [open, setOpen] = useState(false);
    const confirmDialog = () => {
        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="default"
                        disabled={
                            quotation.quotation_status > 0 ? false : false
                        }
                    >
                        Confirm Quotation
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle></AlertDialogTitle>
                        <AlertDialogDescription>
                            Ready to confirm quotation? Once confirmed, a
                            notification will be sent to the user email to
                            notify them.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => handleConfirmQuotation(e)}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };

    const handleDiscountChange = (type, value) => {
        let newDiscount = discount;
        if (type === "type") {
            newDiscount = { ...newDiscount, discounttype: value };
        } else {
            newDiscount = { ...newDiscount, discountamount: value };
        }

        setDiscount(newDiscount);
        calculateTotal(null, newDiscount);
    };

    const handleUpdateDiscount = () => {
        const data = {
            quotation_id: quotation.quotation_id,
            discount_type: discount.discounttype,
            discount_amount: discount.discountamount,
        };
        axios.post(route("discount.create"), data).then((resp) => {
            if (resp.data.success) {
                toast.success("Discount updated");
            } else {
                toast.error("Discount update failed");
            }
        });
    };

    const libraries = useMemo(() => ["places"], []);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_KEY, // Replace with your API key
        libraries: libraries as any,
    });

    const [results, setResults] = useState(null);

    const calculateDistances = async (locations) => {
        const service = new google.maps.DirectionsService();

        const origin = quotation.proposal.origin; // Replace with your origin
        const destinations = quotation.proposal.origin; // Replace with your destinations
        const waypoints = locations; // Replace with your destinations

        await service.route(
            {
                origin: origin,
                destination: destinations,
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
        let travelLocations = quotation.quotation_product.map((p: any) => {
            return { location: p.product.location, stopover: true };
        });

        calculateDistances(travelLocations);
    }, []);
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("quotations")}>Back</Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="School" />
            <ToastContainer limit={3} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 md:px-10 lg:px-20">
                            <div className="flex flex-col md:grid md:grid-cols-2 py-4">
                                <div className="px-2">
                                    <InputLabel
                                        htmlFor="quotation_no"
                                        value="Quotation No."
                                        className="py-2"
                                    />
                                    <span className="py-4">
                                        {quotation.quotation_no}
                                    </span>
                                </div>
                                <div className="px-2">
                                    <InputLabel
                                        htmlFor="quotation_date"
                                        value="Quotation Date"
                                        className="py-2"
                                    />
                                    <span className="py-4">
                                        {moment(
                                            quotation.quotation_date
                                        ).format("DD/MM/YYYY")}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="py-4">
                                {/* school info */}
                                <div className="px-2">
                                    <InputLabel
                                        htmlFor="school_name"
                                        value="School"
                                        className="py-2"
                                    />
                                    <span className="py-4">
                                        {quotation.proposal.school_name}
                                    </span>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-2 py-2">
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="contact_person"
                                            value="Contact Person"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {quotation.proposal.contact_person}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="contact_no"
                                            value="Contact No. / Mobile No."
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {quotation.proposal.contact_no} /{" "}
                                            {quotation.proposal.mobile_no}
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
                                            {quotation.proposal.city}
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
                                            {quotation.proposal.qty_student}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <InputLabel
                                            htmlFor="qty_teacher"
                                            value="No. of Teachers"
                                            className="py-2"
                                        />
                                        <span className="py-4">
                                            {quotation.proposal.qty_teacher}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="py-4">
                                {/* quotation product */}
                                <div>
                                    {quotationProduct.map((p, index) => {
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
                                                    {p.product.duration && (
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <Hourglass
                                                                size={16}
                                                            />
                                                            <small>
                                                                {secondsToHms(
                                                                    p.product
                                                                        .duration
                                                                )}
                                                            </small>
                                                        </div>
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
                                        Sub Total: {formattedNumber(subTotal)}
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
                                {/* quotation item */}
                                <div className="py-4">
                                    <span className="text-lg font-bold">
                                        Transportation
                                    </span>
                                    {quotationItem
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
                                                    <div className="mr-2 flex flex-row items-center gap-2 py-2">
                                                        <div>
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
                                                        </div>
                                                        <span className="px-2 text-lg font-bold">
                                                            {p.item_qty}
                                                        </span>
                                                        <div>
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
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        <div className="flex flex-row md:items-center gap-2">
                                                            <span className="flex items-center text-lg font-bold">
                                                                RM{" "}
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
                                                                maxLength={10}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleTransportationPriceChange(
                                                                        e,
                                                                        p.item_id,
                                                                        p.quotation_item_id
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
                                                                onClick={(e) =>
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
                                            );
                                        })}
                                </div>
                                <div className="py-4">
                                    <span className="text-lg font-bold">
                                        Meals
                                    </span>
                                    {quotationItem
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
                                    {quotationItem
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
                            </div>
                            <hr />
                            <div className="px-4 py-4">
                                <div>
                                    <span className="font-bold text-lg">
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
                                    <div className="flex items-center">
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleUpdateDiscount()
                                            }
                                        >
                                            Save Discount
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <span className="font-bold text-lg text-red-600">
                                        {parseFloat(discount?.discountamount) >
                                        0
                                            ? discount.discounttype === "P"
                                                ? formattedNumber(
                                                      ((subTotal +
                                                          optionTotal) *
                                                          parseFloat(
                                                              discount.discountamount
                                                          )) /
                                                          100
                                                  )
                                                : formattedNumber(
                                                      parseFloat(
                                                          discount.discountamount
                                                      )
                                                  )
                                            : "RM 0.00"}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-col py-4 px-4">
                                <div className="flex justify-end ">
                                    <span className="text-lg font-bold">
                                        Total: {formattedNumber(total)}
                                    </span>
                                </div>
                                {/* <div className="flex justify-end">
                                        <span>
                                            price per pax{" "}
                                            {formattedNumber(
                                                total /
                                                    quotation.proposal
                                                        .qty_student
                                            )}
                                        </span>
                                    </div> */}
                            </div>
                            <hr />
                            <div className="flex flex-row-reverse  py-4">
                                <div className="">{confirmDialog()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
