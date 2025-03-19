import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import MerchantProfitTable from "../Merchants/MerchantProfitTable";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import type { GetProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import {
    DatePicker,
    TimePicker,
    DatePickerProps,
    TimePickerProps,
    Space,
} from "antd";
import { router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { isEmpty } from "lodash";
import Checkbox from "@/Components/Checkbox";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const ProductAdditionalInfoTab = ({
    id,
    profit_info,
    profit_types,
    role,
    isFeatured,
}) => {
    const [profit, setProfit] = useState({
        profit_type: "",
        profit_value: "",
        start_date: dayjs().format("YYYY-MM-DD"),
        end_date: dayjs().add(1, "year").format("YYYY-MM-DD"),
    });
    const [featured, setFeatured] = useState(isFeatured === 0 ? true : false);
    useEffect(() => {}, [profit_info]);

    const onDateTimeChange: RangePickerProps["onCalendarChange"] = (
        date,
        dateString
    ) => {
        const val = {
            start_date: dayjs(date[0]).format("YYYY-MM-DD"),
            end_date: dayjs(date[1]).format("YYYY-MM-DD"),
        };
        setProfit((profit) => ({
            ...profit,
            start_date: val.start_date,
            end_date: val.end_date,
        }));
    };

    const handleAddProfit = (e) => {
        e.preventDefault();

        if (
            !isEmpty(profit.profit_type) &&
            !isEmpty(profit.profit_value) &&
            !isEmpty(profit.start_date) &&
            !isEmpty(profit.end_date)
        ) {
            router.post(`/productprofit/add_profit/${id}`, profit);
            setProfit({ ...profit, ...profit_info });
        }
    };

    const handleSetFeatured = (e: any) => {
        e.preventDefault();
        let f = e.target.checked ? 0 : 1;
        setFeatured(f === 0 ? true : false);
        axios
            .put(route("product.featured", id), {
                is_featured: f,
            })
            .then((resp) => {
                if (resp.status === 200) {
                    toast({
                        variant: "default",
                        description: "Product has been set to featured",
                    });
                }
            });
    };

    return (
        <div className="py-2">
            {/*  merchant profit */}

            <div className="py-2 px-4">
                {role === "admin" ? (
                    <div>
                        <div className="flex flex-row gap-2 items-center py-2">
                            <Checkbox
                                checked={featured}
                                onChange={(e) => handleSetFeatured(e)}
                            />
                            <span>Set as featured</span>
                        </div>
                        <div className="bg-gray-100 px-4 py-2">
                            <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                <div className="flex items-center md:col-span-1 lg:col-span-2">
                                    <InputLabel
                                        htmlFor="Profit / Sales Percentage"
                                        value="Profit Type"
                                    />
                                </div>
                                <div className="flex md:col-span-5 lg:col-span-10">
                                    <SelectInput
                                        options={profit_types}
                                        onChange={(e) => {
                                            setProfit((profit) => ({
                                                ...profit,
                                                profit_type: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                <div className="flex items-center md:col-span-1 lg:col-span-2">
                                    <InputLabel
                                        htmlFor="profit_value"
                                        value="Profit Value"
                                    />
                                </div>
                                <div className="flex md:col-span-5 lg:col-span-10">
                                    <TextInput
                                        id="profit_value"
                                        name="profit_value"
                                        type={"number"}
                                        className="mt-1 block w-full"
                                        autoComplete="profit_value"
                                        onChange={(e) =>
                                            setProfit((profit) => ({
                                                ...profit,
                                                profit_value: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid py-2 grid-flow-row-dense gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
                                <div className="flex items-center md:col-span-1 lg:col-span-2">
                                    <InputLabel
                                        htmlFor="profit_value"
                                        value="Profit Start & End Date"
                                    />
                                </div>
                                <div className="flex md:col-span-5 lg:col-span-10">
                                    <Space direction="vertical" size={12}>
                                        <RangePicker
                                            onCalendarChange={(
                                                date,
                                                dateString,
                                                info
                                            ) =>
                                                onDateTimeChange(
                                                    date,
                                                    dateString,
                                                    info
                                                )
                                            }
                                            defaultValue={[
                                                dayjs(),
                                                dayjs().add(1, "year"),
                                            ]}
                                            format="DD/MM/YYYY"
                                        />
                                    </Space>
                                </div>
                            </div>
                            <div className="flex justify-end py-2">
                                <PrimaryButton onClick={handleAddProfit}>
                                    add
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div>
                <MerchantProfitTable profitList={profit_info} />
            </div>

            {/*  merchant profit */}
        </div>
    );
};

export default ProductAdditionalInfoTab;
