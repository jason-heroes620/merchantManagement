import { useEffect, useState, FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import LoadingButton from "@/Components/Button/LoadingButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Tabs from "@/Components/Tabs/Tabs";
import Tab from "@/Components/Tabs/Tab";
import ProductDetailTab from "./ProductDetailTab";
import ProductAdditionalInfoTab from "./ProductAdditionalInfoTab";
import { Button } from "@/Components/ui/button";

const View = ({
    auth,
    product,
    product_description,
    product_activities,
    categories,
    frequency,
    images,
    product_main_image,
    profit_types,
    profit_info,
    tour_guide_price,
    filters,
    product_filter,
    flash,
    previousUrl,
}: any) => {
    const { toast } = useToast();
    const [dark, setDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [rejectText, setRejectText] = useState("");

    const onSelectMode = (mode: string) => {
        setDark(mode === "dark" ? true : false);
        if (mode === "dark") document.body.classList.add("dark-mode");
        else document.body.classList.remove("dark-mode");
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
        product_activities: product_activities,
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
        location: product?.location ? product.location : "",
        google_location: product?.google_location
            ? product.google_location
            : "",
        google_map_location: product.product_detail?.google_map_location
            ? product.product_detail.google_map_location
            : "",
        min_quantity: product.min_quantity,
        max_quantity: product.max_quantity,
        student_price: product?.student_price,
        teacher_price: product?.teacher_price,
        main_image: [],
        images: [],
        existing_main_image: product_main_image,
        existing_images: images,
        week_time: product.week_time,
        hours: product.hours,
        minutes: product.minutes,
        food_allowed: product.food_allowed,
        tour_guide: product.tour_guide,
        tour_guide_price: tour_guide_price,
        max_group: product.max_group,
        product_filter: product_filter ?? [],
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
            preserveState: false,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row gap-8 items-center">
                    <div>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                router.visit(route("products"));
                            }}
                        >
                            Back
                        </Button>
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Product
                    </h2>
                </div>
            }
        >
            <Head title="Product" />
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
                            {/* <form onSubmit={submit}> */}
                            <form>
                                <div>
                                    <Tabs>
                                        <Tab title="Data">
                                            <ProductDetailTab
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                categories={categories}
                                                frequency={frequency}
                                                filters={filters}
                                                destroy={destroy}
                                                setSelectedImage={
                                                    setSelectedImage
                                                }
                                                setShowImageModal={
                                                    setShowImageModal
                                                }
                                            />
                                        </Tab>

                                        <Tab title="Additional Info">
                                            <ProductAdditionalInfoTab
                                                id={product.id}
                                                profit_types={profit_types}
                                                profit_info={profit_info}
                                                role={auth.user.roles[0]}
                                            />
                                        </Tab>
                                    </Tabs>
                                </div>

                                <div className="py-4">
                                    <div className="flex justify-end flex-col md:flex-row">
                                        <div className="flex items-center px-4 py-2 bborder-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
                                            <LoadingButton
                                                loading={processing}
                                                type="submit"
                                                onClick={submit}
                                                className="ml-auto border py-2 px-4 rounded-md text-sm"
                                            >
                                                Update
                                            </LoadingButton>
                                        </div>
                                        {product.status === 1 ? (
                                            <div className="flex justify-end md:flex-row">
                                                <div className="flex items-center px-6 py-4 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-800 border-gray-200">
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
