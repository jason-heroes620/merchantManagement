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
import { useState, FormEventHandler, useEffect } from "react";
import { DatePickerProps, TimePickerProps } from "antd";
import Frequency from "@/Components/Frequency/Frequency";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Button } from "@/Components/ui/button";
import dayjs from "dayjs";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const CreateProduct = ({ auth, categories, frequency, flash }: any) => {
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: "",
        category_id: "",
        product_description: "",
        age_group: "",
        frequency_id: "",
        event_date: dayjs(new Date()).add(1, "day"),
        event_start_date: dayjs(new Date()).add(1, "day").toString(),
        event_end_date: dayjs(new Date()).add(1, "day").toString(),
        event_start_time: dayjs().toString(),
        event_end_time: dayjs().toString(),
        event_location: "",
        event_map_location: "",
        event_quantity: 1,
        event_price: "0.00",
    });

    useEffect(() => {
        if (flash.message.success) {
            toast({
                description: flash.message.success,
            });
        }
    }, [flash]);

    const [selectedFrequency, setSelectedFrequency] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("data => ", data);
        post(route("products.create"));
        reset();
    };

    const onStartDateChange: DatePickerProps["onChange"] = (
        date,
        dateString
    ) => {
        setData("event_start_date", dateString as string);
    };

    const onEndDateChange: DatePickerProps["onChange"] = (date, dateString) => {
        setData("event_end_date", dateString as string);
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
                            href={route("products")}
                            className="text-indigo-600 hover:text-white border rounded-md hover:bg-red-800 py-2 px-4"
                        >
                            Back
                        </Link>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Product
                    </h2>
                </div>
            }
        >
            <Head title="Create Product" />
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
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
                                        isFocused={true}
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
                                        htmlFor="age_group"
                                        value="Age Group"
                                    />
                                    <TextInput
                                        id="age_group"
                                        name="age_group"
                                        value={data.age_group}
                                        className="mt-1 block w-full"
                                        autoComplete="age_group"
                                        onChange={(e) =>
                                            setData("age_group", e.target.value)
                                        }
                                        placeholder="e.g. 6-12"
                                        required
                                    />
                                    <InputError
                                        message={errors.age_group}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="product_description"
                                        value="Description"
                                    />
                                    <RichTextEditor
                                        value={data.product_description}
                                        onChange={setData}
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
                                    onStartDateChange={onStartDateChange}
                                    onEndDateChange={onEndDateChange}
                                    dateFormat={dateFormat}
                                    timeFormat={timeFormat}
                                    onStartTimeChange={onStartTimeChange}
                                    onEndTimeChange={onEndTimeChange}
                                    values={data}
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
                                    <div className="flex flex-row">
                                        <div className="flex items-end pb-1">
                                            <InputLabel
                                                htmlFor="event_map_location"
                                                value="Google Location"
                                            />
                                        </div>
                                        <div className="pl-2">
                                            <HoverCard>
                                                <HoverCardTrigger>
                                                    <FiHelpCircle size={15} />
                                                </HoverCardTrigger>
                                                <HoverCardContent
                                                    side="right"
                                                    updatePositionStrategy="always"
                                                    className="w-100"
                                                >
                                                    <div className="">
                                                        <div>
                                                            1. Go to Google Maps
                                                            Open your web
                                                            browser and visit
                                                            Google Maps.
                                                        </div>
                                                        <div>
                                                            2. Search for a
                                                            Location In the
                                                            search bar, type the
                                                            address, location,
                                                            or business name you
                                                            want to embed on
                                                            your website. Hit
                                                            Enter to search.
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                3. Click on the
                                                                Location After
                                                                searching, click
                                                                on the specific
                                                                location in the
                                                                map view that
                                                                you want to
                                                                share.
                                                            </span>{" "}
                                                            <span>
                                                                This step
                                                                highlights the
                                                                location and
                                                                shows more
                                                                details.
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className=" ">
                                                                4. Click the
                                                                "Share" Button
                                                                Once the
                                                                location is
                                                                selected, click
                                                                the "Share"
                                                                button. You can
                                                                find this
                                                                button:
                                                            </span>
                                                            <span>
                                                                On the left
                                                                sidebar, under
                                                                the location
                                                                details. On the
                                                                map view, near
                                                                the location’s
                                                                name (a small
                                                                icon with a
                                                                share arrow).
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                5. Choose the
                                                                "Embed a Map"
                                                                Tab A popup
                                                                window will
                                                                appear. At the
                                                                top, you’ll see
                                                                two options:
                                                                Send a Link and
                                                                Embed a Map.
                                                            </span>
                                                            <span>
                                                                Click on the
                                                                "Embed a Map"
                                                                tab to generate
                                                                the iFrame link.
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                6. Copy the
                                                                iFrame Code
                                                                Below the map,
                                                                you’ll see a box
                                                                with the iFrame
                                                                code. The code
                                                                looks like this:
                                                                html Copy code.
                                                            </span>
                                                            <span>
                                                                Click on "Copy
                                                                HTML" to copy
                                                                the entire
                                                                iFrame code.
                                                            </span>
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                    </div>
                                    <TextInput
                                        id="event_map_location"
                                        name="event_map_location"
                                        value={data.event_map_location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_map_location"
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
                                        value="Max Pax"
                                    />
                                    <TextInput
                                        id="event_quantity"
                                        name="event_quantity"
                                        type="number"
                                        maxLength={3}
                                        min={1}
                                        value={data.event_quantity}
                                        className="mt-1 block w-full"
                                        autoComplete="event_quantity"
                                        onChange={(e) =>
                                            setData(
                                                "event_quantity",
                                                parseInt(e.target.value)
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
                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Submit
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateProduct;
