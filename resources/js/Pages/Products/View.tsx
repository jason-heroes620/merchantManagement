import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import SelectInput from "@/Components/SelectInput";
import LoadingButton from "@/Components/Button/LoadingButton";
import DangerButton from "@/Components/DangerButton";
import Categories from "@/Components/Categories";
import { FiHelpCircle } from "react-icons/fi";
import Frequency from "@/Components/Frequency/Frequency";
import { DatePicker, TimePicker, DatePickerProps, TimePickerProps } from "antd";
import Modal from "@/Components/Modal";
import dayjs from "dayjs";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const View = ({
    auth,
    product,
    product_description,
    categories,
    frequency,
}: any) => {
    const [dark, setDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [showModal, setShowModal] = useState(false);
    const [rejectText, setRejectText] = useState("");

    const onSelectMode = (mode: string) => {
        setDark(mode === "dark" ? true : false);
        if (mode === "dark") document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
    };

    useEffect(() => {
        console.log("product -> ", product);
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) =>
                onSelectMode(e.matches ? "dark" : "light")
            );
    }, [dark]);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: product.product_name,
        category_id: product.category_id,
        product_description: product_description,
        frequency_id: product.product_detail?.frequency_id
            ? product.product_detail.frequency_id
            : "",
        event_date: product.product_detail?.event_date
            ? product.product_detail.event_date
            : "",
        event_start_date: product.product_detail?.event_start_date
            ? product.product_detail.event_start_date
            : "",
        event_end_date: product.product_detail?.event_end_date
            ? product.product_detail.event_end_date
            : "",
        event_start_time: product.product_detail?.event_start_time
            ? product.product_detail.event_start_time
            : "",
        event_end_time: product.product_detail?.event_end_time
            ? product.product_detail.event_end_time
            : "",
        location: product.product_detail?.location
            ? product.product_detail.location
            : "",
        google_map_location: product.product_detail?.google_map_location
            ? product.product_detail.google_map_location
            : "",
        quantity: product.product_detail?.event_quantity,
        price: product.product_detail?.price,
    });

    const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
        setData("event_date", dateString as string);
    };

    const onStartTimeChange: TimePickerProps["onChange"] = (
        time,
        timeString
    ) => {
        setData("event_start_date", timeString as string);
    };

    const onEndTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
        setData("event_end_date", timeString as string);
    };

    const handleReject = () => {
        alert(rejectText);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Link
                            href={route("products")}
                            className="text-indigo-600 hover:text-white border rounded-md hover:bg-red-800 py-2 px-4"
                        >
                            Back
                        </Link>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Product
                    </h2>
                </div>
            }
        >
            <Head title="Create Product" />
            <Modal
                maxWidth="md"
                show={showModal}
                closeable={true}
                onClose={() => setShowModal(false)}
            >
                <div>
                    <InputLabel>Please provide reject comment:</InputLabel>
                    <div className="py-2">
                        <TextArea
                            onChange={(e) => setRejectText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-end py-4">
                    <DangerButton
                        type="button"
                        className="ml-auto border py-2 px-4 rounded-md text-sm"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </DangerButton>
                    <LoadingButton
                        loading={processing}
                        type="button"
                        className="ml-4 border py-2 px-4 rounded-md text-sm"
                        onClick={() => {
                            router.put(
                                `/products/reject/${product.id}`,
                                {
                                    rejectText: rejectText,
                                },
                                {
                                    onBefore: () =>
                                        confirm("Confirm to reject product?"),
                                    onSuccess: () => {
                                        setShowModal(false);
                                        alert("Product is rejected.");
                                    },
                                }
                            );
                        }}
                    >
                        Confirm
                    </LoadingButton>
                </div>
            </Modal>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form action="">
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="product_name"
                                        value="Product Name"
                                    />
                                    <TextInput
                                        id="product_name"
                                        name="product_name"
                                        value={data.product_name}
                                        className="mt-1 block w-full"
                                        autoComplete="product_name"
                                        onChange={(e) =>
                                            setData(
                                                "product_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.product_name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <Categories
                                        categories={categories}
                                        selected={data.category_id}
                                        onChange={(e: any) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="product_description"
                                        value="Description"
                                    />
                                    <RichTextEditor
                                        value={data.product_description}
                                        onChange={(e) =>
                                            setData(
                                                "product_description",
                                                e.target.value
                                            )
                                        }
                                        contentFor={"product_description"}
                                    />
                                    <InputError
                                        message={errors.product_description}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="frequency"
                                        value="Frequency"
                                    />
                                    <SelectInput
                                        options={frequency}
                                        selected={
                                            data.frequency_id
                                                ? data.frequency_id
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setData(
                                                "frequency_id",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>

                                <Frequency
                                    frequency={data.frequency_id}
                                    onDateChange={onDateChange}
                                    dateFormat={dateFormat}
                                    timeFormat={timeFormat}
                                    onStartTimeChange={onStartTimeChange}
                                    onEndTimeChange={onEndTimeChange}
                                    values={[
                                        data.event_start_date,
                                        data.event_end_date,
                                        data.event_start_time,
                                        data.event_end_time,
                                    ]}
                                />
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="location"
                                        value="Location"
                                    />
                                    <TextInput
                                        id="location"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        autoComplete="location"
                                        onChange={(e) =>
                                            setData("location", e.target.value)
                                        }
                                        placeholder="e.g. City, State"
                                        required
                                    />
                                    <InputError
                                        message={errors.location}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <div className="flex flex-grow align-center">
                                        <InputLabel
                                            htmlFor="google_map_location"
                                            value="Google Location"
                                        />
                                        <div className="pl-4">
                                            <FiHelpCircle
                                                size={15}
                                                color={dark ? "white" : "black"}
                                            />
                                        </div>
                                    </div>
                                    <TextInput
                                        id="google_map_location"
                                        name="google_map_location"
                                        value={data.google_map_location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_map_location"
                                        onChange={(e) =>
                                            setData(
                                                "google_map_location",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.google_map_location}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="quantity"
                                        value="Quantity"
                                    />
                                    <TextInput
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        maxLength={3}
                                        defaultValue={1}
                                        min={1}
                                        value={data.quantity}
                                        className="mt-1 block w-full"
                                        autoComplete="equantity"
                                        onChange={(e) =>
                                            setData("quantity", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.quantity}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel htmlFor="price" value="Price" />
                                    <TextInput
                                        id="price"
                                        name="price"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        autoComplete="price"
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.price}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="py-4">
                                    <div className="flex justify-end flex-col md:flex-row">
                                        <div className="flex items-center px-4 py-2 bborder-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                            <LoadingButton
                                                loading={processing}
                                                type="submit"
                                                className="ml-auto border py-2 px-4 rounded-md text-sm"
                                            >
                                                Update
                                            </LoadingButton>
                                        </div>
                                        {product.status === 1 ? (
                                            <div className="flex justify-end flex-col md:flex-row">
                                                <div className="flex items-center px-4 py-2 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                    <DangerButton
                                                        type="button"
                                                        className="ml-auto border py-2 px-4 rounded-md text-sm"
                                                        onClick={() =>
                                                            setShowModal(true)
                                                        }
                                                    >
                                                        Reject
                                                    </DangerButton>
                                                </div>
                                                <div className="flex items-center px-4 py-2 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                                    <LoadingButton
                                                        loading={processing}
                                                        type="button"
                                                        className="ml-auto border py-2 px-4 rounded-md text-sm"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Confirm to approve product?"
                                                                )
                                                            ) {
                                                                router.put(
                                                                    `/products/approve/${product.id}`,
                                                                    {},
                                                                    {
                                                                        onSuccess:
                                                                            () =>
                                                                                alert(
                                                                                    "Product has been approved."
                                                                                ),
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Approve
                                                    </LoadingButton>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
