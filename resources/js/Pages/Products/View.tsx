import { useEffect, useState, FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import SelectInput from "@/Components/SelectInput";
import LoadingButton from "@/Components/Button/LoadingButton";
import DangerButton from "@/Components/DangerButton";
import Categories from "@/Components/Categories";
import { FiHelpCircle, FiDelete } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import Frequency from "@/Components/Frequency/Frequency";
import { DatePickerProps, TimePickerProps } from "antd";
import Modal from "@/Components/Modal";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import GoogleMapInstruction from "@/Components/GoogleMapInstruction";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useObjectUrls } from "@/utils/getObjectUrls";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const View = ({
    auth,
    product,
    product_description,
    categories,
    frequency,
    images,
    flash,
}: any) => {
    const { toast } = useToast();
    const [dark, setDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [rejectText, setRejectText] = useState("");

    const [files, setFiles] = useState<File[]>([]);
    const getObjectUrl = useObjectUrls();

    const onSelectMode = (mode: string) => {
        setDark(mode === "dark" ? true : false);
        if (mode === "dark") document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
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

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        product_id: product.id,
        merchant_id: product.merchant_id,
        merchant_name: product.merchant.merchant_name,
        product_name: product.product_name,
        category_id: product.category_id,
        age_group: product.age_group,
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
        quantity: product.product_detail?.quantity,
        price: product.product_detail?.price,
        images: images,
        week_time: product.week_time,
    });

    useEffect(() => {
        if (flash.message.success) {
            toast({
                description: flash.message.success,
            });
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) =>
                onSelectMode(e.matches ? "dark" : "light")
            );
    }, [dark, flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("product.update", product.id), {
            forceFormData: true,
            method: "put",
        });
        setFiles([]);
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

    const handleDeleteImage = (id) => {
        if (confirm("Confirm to delete image?")) {
            destroy(route("product_image.delete", id), {
                preserveState: false,
                preserveScroll: true,
            });
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
                        Product
                    </h2>
                </div>
            }
        >
            <Head title="Create Product" />
            <Toaster />
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
                                `/product/reject/${product.id}`,
                                {
                                    rejectText: rejectText,
                                },
                                {
                                    onBefore: () =>
                                        confirm("Confirm to reject product?"),
                                    onSuccess: () => {
                                        setShowModal(false);
                                    },
                                }
                            );
                        }}
                    >
                        Confirm
                    </LoadingButton>
                </div>
            </Modal>
            <Modal
                maxWidth="md"
                show={showImageModal}
                closeable={true}
                onClose={() => setShowImageModal(false)}
            >
                <img src={selectedImage} alt="" />
            </Modal>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="merchant_name"
                                        value="Merchant"
                                    />
                                    <TextInput
                                        id="merchant_name"
                                        name="merchant_name"
                                        value={data.merchant_name}
                                        className="mt-1 block w-full"
                                        disabled
                                    />
                                </div>
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
                                    onStartDateChange={onStartDateChange}
                                    onEndDateChange={onEndDateChange}
                                    dateFormat={dateFormat}
                                    timeFormat={timeFormat}
                                    onWeekStartTimeChange={
                                        onWeekStartTimeChange
                                    }
                                    onWeekEndTimeChange={onWeekEndTimeChange}
                                    onDateTimeChange={onDateTimeChange}
                                    values={data}
                                />
                                <div className="py-4">
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

                                    <div
                                        className="flex justify-center py-2"
                                        dangerouslySetInnerHTML={{
                                            __html: data.google_map_location,
                                        }}
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
                                {images?.length > 0 ? (
                                    <div className="py-2">
                                        <InputLabel>Product Images</InputLabel>
                                        <div className="flex border py-2 px-4 gap-4">
                                            {images.map((f) => {
                                                return (
                                                    <div
                                                        className="border rounded-md "
                                                        key={f.id}
                                                    >
                                                        <div className="flex flex-row px-2 py-2">
                                                            <img
                                                                src={f.url}
                                                                alt={f.name}
                                                                width={80}
                                                                height={"auto"}
                                                                onClick={() => {
                                                                    setSelectedImage(
                                                                        f.url
                                                                    );
                                                                    setShowImageModal(
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                            <MdDeleteForever
                                                                size={20}
                                                                color="red"
                                                                onClick={() =>
                                                                    handleDeleteImage(
                                                                        f.id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        No image available
                                    </div>
                                )}

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
                                                                    `/product/approve/${product.id}`
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
