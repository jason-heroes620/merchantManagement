import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import Categories from "@/Components/Categories";
import RichTextEditor from "@/Components/RichTextEditor";
import { FiHelpCircle } from "react-icons/fi";
import { useState, FormEventHandler, useEffect } from "react";
import Frequency from "@/Components/Frequency/Frequency";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import dayjs from "dayjs";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useObjectUrls } from "@/utils/getObjectUrls";
import GoogleMapInstruction from "@/Components/GoogleMapInstruction";
import { RangePickerProps } from "antd/es/date-picker";
import { Button } from "@/Components/ui/button";
import Duration from "@/Components/Duration";
import Checkbox from "@/Components/Checkbox";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const CreateProduct = ({
    auth,
    categories,
    frequency,
    filters,
    flash,
}: any) => {
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [mainImage, setMainImage] = useState<File[]>([]);
    const getObjectUrl = useObjectUrls();

    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: "",
        category_id: "",
        product_description: "",
        product_activities: "",
        age_group: "",
        frequency_id: "",
        event_date: dayjs().add(1, "day"),
        event_start_date: "",
        event_end_date: "",
        event_start_time: "",
        event_end_time: "",
        location: "",
        google_location: "",
        google_map_location: "",
        min_quantity: 1,
        max_quantity: 1,
        student_price: "0.00",
        teacher_price: "0.00",
        images: [],
        main_image: [],
        week_time: [
            { index: 0, start_time: "", end_time: "" },
            { index: 1, start_time: "", end_time: "" },
            { index: 2, start_time: "", end_time: "" },
            { index: 3, start_time: "", end_time: "" },
            { index: 4, start_time: "", end_time: "" },
            { index: 5, start_time: "", end_time: "" },
            { index: 6, start_time: "", end_time: "" },
        ],
        hours: 0,
        minutes: 0,
        food_allowed: 0,
        tour_guide: 1,
        product_filter: [],
        tour_guide_price: "0.00",
        max_group: 1,
    });

    useEffect(() => {
        if (flash.message.success) {
            toast({
                description: flash.message.success,
            });
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("product.create"), {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                reset();
            },
        });
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

    const handleMainImageUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 2097152 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setMainImage(files);
            setData("main_image", [...e.target.files]);
        } else {
            alert("Your file exceede the upload limit.");
        }
    };

    const handleFileUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 2097152 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setFiles(files);
            setData("images", [...e.target.files]);
        } else {
            alert("1 or more files exceeded the upload limit.");
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

        setData("week_time", newTime);
    };

    const handleProductFilterChange = (e, filter_id) => {
        if (e.target.checked) {
            setData("product_filter", [
                ...data.product_filter,
                { filter_id: filter_id },
            ]);
        } else {
            setData(
                "product_filter",
                data.product_filter.filter((p) => p.filter_id !== filter_id)
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8 items-center">
                    <div>
                        <Button asChild variant="destructive">
                            <Link href={route("products")}>Back</Link>
                        </Button>
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
                                        maxLength={200}
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
                                        htmlFor="product_activities"
                                        value="Activities"
                                    />
                                    <RichTextEditor
                                        value={data.product_activities}
                                        onChange={setData}
                                        contentFor={"product_activities"}
                                    />
                                    <InputError
                                        message={errors.product_activities}
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
                                        maxLength={50}
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
                                        value="Location"
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
                                        maxLength={150}
                                        required
                                    />
                                    <InputError
                                        message={errors.location}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="event_google_location"
                                        value="Google Place Name"
                                    />
                                    <TextInput
                                        id="event_google_location"
                                        name="event_google_location"
                                        value={data.google_location}
                                        className="mt-1 block w-full"
                                        autoComplete="event_google_location"
                                        onChange={(e) =>
                                            setData(
                                                "google_location",
                                                e.target.value
                                            )
                                        }
                                        maxLength={150}
                                        required
                                    />
                                    <InputError
                                        message={errors.google_location}
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

                                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 py-2">
                                    <div className="py-2">
                                        <InputLabel
                                            htmlFor="min_quantity"
                                            value="Min. Pax"
                                        />
                                        <TextInput
                                            id="min_quantity"
                                            name="min_quantity"
                                            type="number"
                                            maxLength={3}
                                            min={1}
                                            value={data.min_quantity}
                                            className="mt-1 block w-full"
                                            autoComplete="event_min_quantity"
                                            onChange={(e) =>
                                                setData(
                                                    "min_quantity",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.min_quantity}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="py-2">
                                        <InputLabel
                                            htmlFor="event_quantity"
                                            value="Max. Pax"
                                        />
                                        <TextInput
                                            id="max_quantity"
                                            name="max_quantity"
                                            type="number"
                                            maxLength={3}
                                            min={1}
                                            value={data.max_quantity}
                                            className="mt-1 block w-full"
                                            autoComplete="max_quantity"
                                            onChange={(e) =>
                                                setData(
                                                    "max_quantity",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.max_quantity}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="py-3">
                                    <Duration
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </div>
                                <div className="py-2">
                                    <div className="border rounded-md py-4 px-4">
                                        <span className="font-bold">Price</span>
                                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 py-2 px-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="student_price"
                                                    value="student_price"
                                                />
                                                <TextInput
                                                    id="student_price"
                                                    name="student_price"
                                                    value={data.student_price}
                                                    type="number"
                                                    className="mt-1 block w-full"
                                                    autoComplete="student_price"
                                                    onChange={(e) =>
                                                        setData(
                                                            "student_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    maxLength={8}
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.student_price
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="teacher_price"
                                                    value="Teacher Price"
                                                />
                                                <TextInput
                                                    id="teacher_price"
                                                    name="teacher_price"
                                                    value={data.teacher_price}
                                                    type="number"
                                                    className="mt-1 block w-full"
                                                    autoComplete="teacher_price"
                                                    onChange={(e) =>
                                                        setData(
                                                            "teacher_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    maxLength={8}
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.teacher_price
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 mb-2 px-2 py-2 border rounded-md">
                                    <div className="py-2 px-4">
                                        <span className="font-bold">
                                            Filters
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-4 px-8 py-2">
                                        {filters
                                            .sort((a, b) =>
                                                a.filter_description >
                                                b.filter_description
                                                    ? 1
                                                    : -1
                                            )
                                            .map((f): any => {
                                                return (
                                                    <div
                                                        className="flex gap-2 items-center"
                                                        key={f.filter_id}
                                                    >
                                                        <Checkbox
                                                            checked={data.product_filter?.some(
                                                                (p): any =>
                                                                    p.filter_id ===
                                                                    f.filter_id
                                                            )}
                                                            onChange={(e) =>
                                                                handleProductFilterChange(
                                                                    e,
                                                                    f.filter_id
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            {
                                                                f.filter_description
                                                            }
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                <div className="mt-4 mb-4 py-2 px-4 border rounded-md">
                                    <div className="py-2">
                                        <Checkbox
                                            name="foodAllowed"
                                            onChange={(e) => {
                                                setData(
                                                    "food_allowed",
                                                    e.target.checked === true
                                                        ? 0
                                                        : 1
                                                );
                                            }}
                                            defaultChecked
                                        />
                                        <span className="pl-2 font-bold">
                                            Food Allowed
                                        </span>
                                    </div>
                                    <div className="py-4">
                                        <Checkbox
                                            name="tourGuideOption"
                                            onChange={(e) => {
                                                setData(
                                                    "tour_guide",
                                                    e.target.checked === true
                                                        ? 0
                                                        : 1
                                                );
                                            }}
                                            checked={
                                                data.tour_guide === 0
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <span className="pl-2 font-bold">
                                            Tour Guide Provided
                                        </span>
                                        {data.tour_guide === 0 && (
                                            <div className="px-4 py-2">
                                                <InputLabel
                                                    htmlFor="tour_guide_price"
                                                    value="Tour Guide Cost"
                                                />
                                                <div className="flex flex-row w-full md:w-[50%]">
                                                    <TextInput
                                                        id="tour_guide_price"
                                                        name="tour_guide_price"
                                                        value={
                                                            data.tour_guide_price
                                                        }
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        autoComplete="tour_guide_price"
                                                        onChange={(e) => {
                                                            setData(
                                                                "tour_guide_price",
                                                                e.target.value
                                                            );
                                                        }}
                                                        min={0}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <hr />
                                    <div className="py-4">
                                        <InputLabel
                                            htmlFor="max_group"
                                            value="Max Group Allowed Per Day"
                                        />
                                        <div className="flex flex-row w-full md:w-[50%]">
                                            <TextInput
                                                id="max_group"
                                                name="max_group"
                                                defaultValue={data.max_group}
                                                type="number"
                                                className="mt-1 block w-full"
                                                onChange={(e) => {
                                                    setData(
                                                        "max_group",
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                                min={1}
                                                max={5}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="main_image"
                                        value="Main Image (supported formats .png, .jpg. Image should not be more than 2 MB)"
                                        className="pb-2"
                                    />
                                    <input
                                        type="file"
                                        multiple={false}
                                        accept=".png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            handleMainImageUpload(e);
                                        }}
                                    />
                                    {mainImage.length > 0 && (
                                        <div className="flex flex-row gap-4 py-2 border my-2 ">
                                            <div className="flex w-32 h-32 justify-center items-center px-2">
                                                {mainImage.map((file, i) => (
                                                    <div
                                                        className="flex w-32 h-32 justify-center items-center px-2"
                                                        key={i}
                                                    >
                                                        <img
                                                            src={getObjectUrl(
                                                                file
                                                            )}
                                                            alt={file.name}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="py-2">
                                    <InputLabel
                                        htmlFor="images"
                                        value="Additional Images (supported formats .png, .jpg. Each image should not be more than 2 MB)"
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
                                    {files.length > 0 && (
                                        <div className="flex flex-row flex-wrap gap-4 py-2 border my-2">
                                            {files.map((file, i) => (
                                                <div
                                                    className="flex w-32 h-32 justify-center items-center px-2"
                                                    key={i}
                                                >
                                                    <img
                                                        src={getObjectUrl(file)}
                                                        alt={file.name}
                                                        className="object-contain"
                                                    />
                                                </div>
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
