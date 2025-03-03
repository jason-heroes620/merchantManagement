import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import RichTextEditor from "@/Components/RichTextEditor";
import SelectInput from "@/Components/SelectInput";
import Categories from "@/Components/Categories";
import { FiHelpCircle, FiDelete } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import Frequency from "@/Components/Frequency/Frequency";
import { DatePickerProps } from "antd";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import GoogleMapInstruction from "@/Components/GoogleMapInstruction";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useObjectUrls } from "@/utils/getObjectUrls";
import Duration from "@/Components/Duration";
import Checkbox from "@/Components/Checkbox";

const dateFormat = "DD/MM/YYYY";
const timeFormat = "HH:mm";

const ProductDetailTab = ({
    data,
    setData,
    errors,
    categories,
    frequency,
    destroy,
    setSelectedImage,
    setShowImageModal,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [main_image, setMainImage] = useState<File[]>([]);
    const [allowed, setAllowed] = useState(
        data.food_allowed === 0 ? true : false
    );
    const [tourGuideOption, setTourGuideOption] = useState(
        data.tour_guide === 0 ? true : false
    );
    const [tourGuidePrice, setTourGuidePrice] = useState(data.tour_guide_price);
    const getObjectUrl = useObjectUrls();

    const onStartDateChange: DatePickerProps["onChange"] = (
        date,
        dateString
    ) => {
        setData("event_start_date", dateString as string);
    };

    const onEndDateChange: DatePickerProps["onChange"] = (date, dateString) => {
        setData("event_end_date", dateString as string);
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

    const onWeekStartTimeChange = (i, val) => {
        const newTime = [...data.week_time];
        const time = newTime.find((t) => t.index === i);
        time.start_time = val !== null ? dayjs(val).format("HH:mm") : null;
        setData("week_time", newTime);
    };

    const onWeekEndTimeChange = (i, val) => {
        const newTime = [...data.week_time];
        const time = newTime.find((t) => t.index === i);
        time.end_time = val !== null ? dayjs(val).format("HH:mm") : null;
        setData("week_time", newTime);
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
            alert("1 or more files exceed the upload limit.");
        }
    };

    const handleMainFileUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 2097152 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setMainImage(files);
            setData("main_image", [...e.target.files]);
        } else {
            alert("1 or more files exceed the upload limit.");
        }
    };

    const handleDeleteImage = (id) => {
        if (confirm("Confirm to delete image?")) {
            destroy(route("product_image.delete", id), {
                preserveState: false,
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="py-4">
            <div className="py-2">
                <InputLabel htmlFor="merchant_name" value="Merchant" />
                <TextInput
                    id="merchant_name"
                    name="merchant_name"
                    defaultValue={data.merchant_name}
                    className="mt-1 block w-full"
                    disabled
                />
            </div>
            <div className="py-2">
                <InputLabel htmlFor="product_name" value="Product Name" />
                <TextInput
                    id="product_name"
                    name="product_name"
                    value={data.product_name}
                    className="mt-1 block w-full"
                    autoComplete="product_name"
                    onChange={(e) => setData("product_name", e.target.value)}
                    required
                />
                <InputError message={errors.product_name} className="mt-2" />
            </div>
            <div className="py-2">
                <Categories
                    categories={categories}
                    selected={data.category_id}
                    onChange={(e: any) =>
                        setData("category_id", e.target.value)
                    }
                />
            </div>
            <div className="py-2">
                <InputLabel htmlFor="age_group" value="Age Group" />
                <TextInput
                    id="age_group"
                    name="age_group"
                    value={data.age_group}
                    className="mt-1 block w-full"
                    autoComplete="age_group"
                    onChange={(e) => setData("age_group", e.target.value)}
                    placeholder="e.g. 6-12"
                    required
                />
                <InputError message={errors.age_group} className="mt-2" />
            </div>
            <div className="py-2">
                <InputLabel htmlFor="product_description" value="Description" />
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
                <InputLabel htmlFor="product_activities" value="Activitites" />
                <RichTextEditor
                    value={data.product_activities}
                    onChange={setData}
                    contentFor={"product_activities"}
                />
                <InputError message={errors.activities} className="mt-2" />
            </div>
            <div className="py-2">
                <InputLabel htmlFor="frequency" value="Frequency" />
                <SelectInput
                    options={frequency}
                    selected={data.frequency_id ? data.frequency_id : ""}
                    onChange={(e) => {
                        setData("frequency_id", e.target.value);
                    }}
                />
            </div>

            <Frequency
                frequency={data.frequency_id}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
                dateFormat={dateFormat}
                timeFormat={timeFormat}
                onWeekStartTimeChange={onWeekStartTimeChange}
                onWeekEndTimeChange={onWeekEndTimeChange}
                onDateTimeChange={onDateTimeChange}
                values={data}
            />
            <div className="py-4">
                <InputLabel htmlFor="location" value="Location" />
                <TextInput
                    id="location"
                    name="location"
                    value={data.location}
                    className="mt-1 block w-full"
                    autoComplete="location"
                    onChange={(e) => setData("location", e.target.value)}
                    placeholder="e.g. City, State"
                    required
                />
                <InputError message={errors.location} className="mt-2" />
            </div>
            <div className="py-4">
                <InputLabel
                    htmlFor="google_location"
                    value="Google Place Name"
                />
                <TextInput
                    id="google_location"
                    name="google_location"
                    value={data.google_location}
                    className="mt-1 block w-full"
                    autoComplete="google_location"
                    onChange={(e) => setData("google_location", e.target.value)}
                    required
                />
                <InputError message={errors.google_location} className="mt-2" />
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
                        setData("google_map_location", e.target.value)
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

            <div className="flex flex-1 flex-col md:grid md:grid-cols-2 md:gap-6 py-2">
                <div className=" py-2">
                    <InputLabel htmlFor="min_quantity" value="Min. Pax" />
                    <TextInput
                        id="min_quantity"
                        name="min_quantity"
                        type="number"
                        maxLength={3}
                        min={1}
                        value={data.min_quantity}
                        className="mt-1 block w-full"
                        autoComplete="min_quantity"
                        onChange={(e) =>
                            setData("min_quantity", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.min_quantity}
                        className="mt-2"
                    />
                </div>
                <div className=" py-2">
                    <InputLabel htmlFor="quantity" value="Max. Pax" />
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
                            setData("max_quantity", e.target.value)
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
                <Duration data={data} setData={setData} errors={errors} />
            </div>
            <div className="py-2 border rounded-md mt-2 mb-2">
                <div className="px-4">
                    <span className="font-bold">Price</span>
                </div>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:justify-between md:gap-10 px-4 py-4 ">
                    <div>
                        <InputLabel htmlFor="price" value="Student" />
                        <TextInput
                            id="student_price"
                            name="student_price"
                            value={data.student_price}
                            type="number"
                            className="mt-1 block w-full"
                            autoComplete="student_price"
                            onChange={(e) =>
                                setData("student_price", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.student_price}
                            className="mt-2"
                        />
                    </div>
                    <div className="">
                        <InputLabel htmlFor="price" value="Teacher" />
                        <TextInput
                            id="teacher_price"
                            name="teacher_price"
                            value={data.teacher_price}
                            type="number"
                            className="mt-1 block w-full"
                            autoComplete="teacher_price"
                            onChange={(e) =>
                                setData("teacher_price", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.teacher_price}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            <div className="py-2 px-2 border rounded-md">
                <div className="py-2">
                    <Checkbox
                        name="foodAllowed"
                        onChange={(e) => {
                            setData("food_allowed", !e.target.checked);
                            setAllowed(e.target.checked);
                        }}
                        checked={allowed}
                    />
                    <span className="pl-2 font-bold">Food Allowed</span>
                </div>
                <div>
                    <Checkbox
                        name="tourGuideOption"
                        onChange={(e) => {
                            setData("tour_guide", !e.target.checked);
                            setTourGuideOption(e.target.checked);
                        }}
                        checked={tourGuideOption}
                    />
                    <span className="pl-2 font-bold">Tour Guide Provided</span>
                    {tourGuideOption && (
                        <div className="px-4 py-2">
                            <InputLabel
                                htmlFor="tour_guide_price"
                                value="Tour Guide Cost"
                            />
                            <div className="flex flex-row w-full md:w-[50%]">
                                <TextInput
                                    id="tour_guide_price"
                                    name="tour_guide_price"
                                    value={data.tour_guide_price}
                                    type="number"
                                    className="mt-1 block w-full"
                                    autoComplete="tour_guide_price"
                                    onChange={(e) => {
                                        setTourGuidePrice(e.target.value);
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
            </div>

            <div className="py-2">
                <InputLabel
                    htmlFor="images"
                    value="Main Image (supported formats .png, .jpg. Image should not be more than 2 MB)"
                    className="pb-2"
                />
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                        handleMainFileUpload(e);
                    }}
                />
                {main_image && (
                    <div className="flex flex-row gap-4 py-2">
                        {main_image.map((file) => (
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
            {data.existing_main_image ? (
                <div className="py-2">
                    <InputLabel>Main Image</InputLabel>
                    <div className="flex border py-2 px-4 gap-4">
                        <div className="flex flex-row border w-32 h-32 rounded-md ">
                            <div className="relative">
                                <div className="flex h-full w-full px-2 py-2">
                                    <img
                                        src={data.existing_main_image}
                                        className="object-contain"
                                        onClick={() => {
                                            setSelectedImage(
                                                data.existing_main_image
                                            );
                                            setShowImageModal(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-4">No image available</div>
            )}

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
            {data.existing_images?.length > 0 ? (
                <div className="py-2">
                    <InputLabel>Additional Images</InputLabel>
                    <div className="flex border py-2 px-4 gap-4">
                        {data.existing_images.map((f) => {
                            return (
                                <div
                                    className="flex flex-row border w-32 h-32 rounded-md "
                                    key={f.id}
                                >
                                    <div className="relative">
                                        <div className="flex h-full w-full px-2 py-2">
                                            <img
                                                src={f.url}
                                                alt={f.name}
                                                className="object-contain"
                                                onClick={() => {
                                                    setSelectedImage(f.url);
                                                    setShowImageModal(true);
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: "4px",
                                                top: "20%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <MdDeleteForever
                                                size={20}
                                                color="red"
                                                onClick={() =>
                                                    handleDeleteImage(f.id)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="py-4">No image available</div>
            )}
        </div>
    );
};

export default ProductDetailTab;
