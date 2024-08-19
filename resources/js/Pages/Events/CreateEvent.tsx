import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import Categories from "@/Components/Categories";
import RichTextEditor from "@/Components/RichTextEditor";
import { FiHelpCircle } from "react-icons/fi";
import { useState } from "react";
import { DatePickerProps, TimePickerProps } from "antd";
import Frequency from "@/Components/Frequency/Frequency";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const CreateEvent = ({ auth, categories, frequency }: any) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        event_name: "",
        category_id: "",
        event_description: "",
        frequency_id: "",
        event_date: "",
        event_start_date: "",
        event_end_date: "",
        event_start_time: "",
        event_end_time: "",
        event_location: "",
        event_map_location: "",
        event_quantity: "",
        event_price: "",
    });

    const [selectedFrequency, setSelectedFrequency] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
        setData("event_date", dateString as string);
    };

    const onStartTimeChange: TimePickerProps["onChange"] = (
        time,
        timeString
    ) => {
        setData("event_start_time", timeString as string);
    };

    const onEndTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
        setData("event_end_time", timeString as string);
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
                        Create Event
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
                                        selected={""}
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
                                        onChange={(e: any) => setData}
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
                                />
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="event_location"
                                        value="Event Location"
                                    />
                                    <TextInput
                                        id="event_location"
                                        name="event_location"
                                        value={data.event_location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_location"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "event_location",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. City, State"
                                        required
                                    />
                                    <InputError
                                        message={errors.event_location}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <div className="flex flex-grow align-center">
                                        <InputLabel
                                            htmlFor="event_map_location"
                                            value="Google Location"
                                        />
                                        <div className="pl-4">
                                            <FiHelpCircle size={15} />
                                        </div>
                                    </div>
                                    <TextInput
                                        id="event_map_location"
                                        name="event_map_location"
                                        value={data.event_map_location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_map_location"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "event_map_location",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.event_map_location}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="event_quantity"
                                        value="Quantity"
                                    />
                                    <TextInput
                                        id="event_quantity"
                                        name="event_quantity"
                                        type="number"
                                        maxLength={3}
                                        defaultValue={1}
                                        min={1}
                                        value={data.event_quantity}
                                        className="mt-1 block w-full"
                                        autoComplete="event_quantity"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "event_quantity",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.event_quantity}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="event_price"
                                        value="Price"
                                    />
                                    <TextInput
                                        id="event_price"
                                        name="event_price"
                                        value={data.event_price}
                                        className="mt-1 block w-full"
                                        autoComplete="event_price"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "event_price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.event_price}
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

export default CreateEvent;
