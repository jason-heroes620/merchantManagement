import React from "react";
import SelectInput from "./SelectInput";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

const hours = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
];
const minutes = [
    { label: "00", value: "0" },
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
    { label: "40", value: "40" },
    { label: "45", value: "45" },
    { label: "50", value: "50" },
    { label: "55", value: "55" },
];

const Duration = ({ data, setData, errors }) => {
    return (
        <div className="border rounded-md py-4 px-4">
            <span className="font-bold">Duration</span>
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 py-2 px-4">
                <div className="py-2">
                    <InputLabel htmlFor="hours" value="Hours" />
                    <SelectInput
                        options={hours}
                        onChange={(e) => setData("hours", e.target.value)}
                        selected={data.hours}
                        required
                    />
                    <InputError message={errors.hours} className="mt-2" />
                </div>
                <div className="py-2">
                    <InputLabel htmlFor="minutes" value="Minutes" />
                    <SelectInput
                        options={minutes}
                        onChange={(e) => setData("minutes", e.target.value)}
                        selected={data.minutes}
                    />
                    <InputError message={errors.minutes} className="mt-2" />
                </div>
            </div>
        </div>
    );
};

export default Duration;
