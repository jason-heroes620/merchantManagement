import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import SelectInput from "@/Components/SelectInput";
import Categories from "@/Components/Categories";
import { FiHelpCircle } from "react-icons/fi";
import Frequency from "@/Components/Frequency/Frequency";
import { DatePicker, TimePicker, DatePickerProps, TimePickerProps } from "antd";
import dayjs from "dayjs";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const View = ({
    auth,
    event,
    event_description,
    categories,
    frequency,
}: any) => {
    const [dark, setDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const onSelectMode = (mode: string) => {
        setDark(mode === "dark" ? true : false);
        if (mode === "dark") document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
    };

    useEffect(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) =>
                onSelectMode(e.matches ? "dark" : "light")
            );
    }, [dark]);

    const { data, setData, post, processing, errors, reset } = useForm({
        event_name: event.event_name,
        category_id: event.category_id,
        event_description: event_description,
        frequency_id: event.event_detail.frequency_id,
        event_date: event.event_detail.event_date,
        event_start_date: event.event_detail.event_start_date,
        event_end_date: event.event_detail.event_end_date,
        event_start_time: event.event_detail.event_start_time,
        event_end_time: event.event_detail.event_end_time,
        location: event.event_detail.location,
        google_map_location: event.event_detail.google_map_location,
        quantity: event.event_detail.event_quantity,
        price: event.event_detail.price,
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8">
                    <div>
                        <Link
                            href={route("events")}
                            className="text-indigo-600 hover:text-white border rounded-md hover:bg-red-800 py-2 px-4"
                        >
                            Back
                        </Link>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Event
                    </h2>
                </div>
            }
        >
            <Head title="Create Event" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form action="">
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="event_name"
                                        value="Event Name"
                                    />
                                    <TextInput
                                        id="event_name"
                                        name="event_name"
                                        value={data.event_name}
                                        className="mt-1 block w-full"
                                        autoComplete="event_name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "event_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.event_name}
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
                                        htmlFor="event_description"
                                        value="Description"
                                    />
                                    <RichTextEditor
                                        value={data.event_description}
                                        onChange={setData}
                                        contentFor={"event_description"}
                                    />
                                    <InputError
                                        message={errors.event_description}
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
                                        selected={data.frequency_id}
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
                                        data.event_date,
                                        data.event_start_date,
                                        data.event_end_date,
                                        data.event_start_time,
                                        data.event_end_time,
                                    ]}
                                />
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="location"
                                        value="Event Location"
                                    />
                                    <TextInput
                                        id="location"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        autoComplete="location"
                                        isFocused={true}
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
                                        isFocused={true}
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
                                        isFocused={true}
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
                                        isFocused={true}
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;
