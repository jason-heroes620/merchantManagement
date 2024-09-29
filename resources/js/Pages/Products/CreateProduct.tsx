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
import { useObjectUrls } from "@/utils/getObjectUrls";
import GoogleMapInstruction from "@/Components/GoogleMapInstruction";
import { RangePickerProps } from "antd/es/date-picker";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const CreateProduct = ({ auth, categories, frequency, flash }: any) => {
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const getObjectUrl = useObjectUrls();

    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: "",
        category_id: "",
        product_description: "",
        age_group: "",
        frequency_id: "",
        event_date: dayjs().add(1, "day"),
        event_start_date: "",
        event_end_date: "",
        event_start_time: "",
        event_end_time: "",
        location: "",
        google_map_location: "",
        quantity: 1,
        price: "0.00",
        images: [],
        week_time: [
            { index: 0, start_time: "", end_time: "" },
            { index: 1, start_time: "", end_time: "" },
            { index: 2, start_time: "", end_time: "" },
            { index: 3, start_time: "", end_time: "" },
            { index: 4, start_time: "", end_time: "" },
            { index: 5, start_time: "", end_time: "" },
            { index: 6, start_time: "", end_time: "" },
        ],
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
        console.log("values =>", data);
        post(route("product.create"), {
            forceFormData: true,
            preserveState: false,
        });
        reset();
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

    const onDateTimeChange: RangePickerProps["onCalendarChange"] = (
        date,
        dateString
    ) => {
        const val = {
            event_start_date: dayjs(date[0]).format("YYYY-MM-DD"),
            event_start_time: dayjs(date[0]).format("HH:mm"),
            event_end_date: dayjs(date[1]).format("YYYY-MM-DD"),
            event_end_time: dayjs(date[1]).format("HH:mm"),
        };
        setData({ ...data, ...val });
    };

    const handleFileUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 1048576 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setFiles(files);
            setData("images", [...e.target.files]);
        } else {
            alert("1 or more files exceed the upload limit.");
        }
    };

    const onWeekStartTimeChange = (i, val) => {
        const newTime = [...data.week_time];
        const time = newTime.find((t) => t.index === i);
        time.start_time = dayjs(val).format("HH:mm");

        setData("week_time", newTime);
    };

    const onWeekEndTimeChange = (i, val) => {
        const newTime = [...data.week_time];
        const time = newTime.find((t) => t.index === i);
        time.end_time = dayjs(val).format("HH:mm");
        console.log("times => ", newTime);
        setData("week_time", newTime);
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
                                    dateFormat={dateFormat}
                                    timeFormat={timeFormat}
                                    onWeekStartTimeChange={
                                        onWeekStartTimeChange
                                    }
                                    onWeekEndTimeChange={onWeekEndTimeChange}
                                    onDateTimeChange={onDateTimeChange}
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
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_location"
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
                                                    <GoogleMapInstruction />
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                    </div>
                                    <TextInput
                                        id="event_map_location"
                                        name="event_map_location"
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
                                        htmlFor="event_quantity"
                                        value="Max Pax"
                                    />
                                    <TextInput
                                        id="event_quantity"
                                        name="event_quantity"
                                        type="number"
                                        maxLength={3}
                                        min={1}
                                        value={data.quantity}
                                        className="mt-1 block w-full"
                                        autoComplete="event_quantity"
                                        onChange={(e) =>
                                            setData(
                                                "quantity",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.quantity}
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
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        autoComplete="event_price"
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
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="images"
                                        value="Images (.png, .jpg not more than 1 MB)"
                                        className="pb-2"
                                    />
                                    <input
                                        type="file"
                                        multiple
                                        accept=".png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            handleFileUpload(e);
                                        }}
                                    />
                                    {files && (
                                        <div className="flex flex-row gap-4 py-2">
                                            {files.map((file) => (
                                                <img
                                                    key={file.name}
                                                    src={getObjectUrl(file)}
                                                    alt={file.name}
                                                    width={80}
                                                    height={"auto"}
                                                />
                                            ))}
                                        </div>
                                    )}
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
