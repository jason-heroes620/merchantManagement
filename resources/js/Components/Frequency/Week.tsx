import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import InputLabel from "../InputLabel";
import { TimePicker, TimePickerProps, DatePicker, DatePickerProps } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import Checkbox from "../Checkbox";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const disabledTime: TimePickerProps["disabledTime"] = () => {
    return {
        disabledHours: () => range(0, 60).splice(0, 8),
        disabledMinutes: () => [],
    };
};

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
};

const days = [
    {
        index: 0,
        short: "sunday",
        day: "Sunday",
    },
    {
        index: 1,
        short: "monday",
        day: "Monday",
    },
    {
        index: 2,
        short: "tuesday",
        day: "Tuesday",
    },
    {
        index: 3,
        short: "wednesday",
        day: "Wednesday",
    },
    {
        index: 4,
        short: "thursday",
        day: "Thursday",
    },
    {
        index: 5,
        short: "friday",
        day: "Friday",
    },
    {
        index: 6,
        short: "saturday",
        day: "Saturday",
    },
];

const Week = ({
    onDateTimeChange,
    onWeekStartTimeChange,
    onWeekEndTimeChange,
    values,
    frequency,
}) => {
    const [sameTime, setSameTime] = useState(false);

    const onStartTimeChange = (e) => {
        days.map((d) => {
            onWeekStartTimeChange(d.index, e);
        });
    };

    const onEndTimeChange = (e) => {
        days.map((d) => {
            onWeekEndTimeChange(d.index, e);
        });
    };
    return (
        <div className="border rounded-sm py-4 px-4">
            <div className="flex flex-row gap-6">
                <div>
                    <RangePicker
                        disabledDate={disabledDate}
                        format="DD/MM/YYYY"
                        onCalendarChange={(v) => onDateTimeChange(v)}
                        defaultValue={
                            values.event_start_date
                                ? [
                                      dayjs(
                                          values.event_start_date +
                                              " " +
                                              values.event_start_time
                                      ),
                                      dayjs(
                                          values.event_end_date +
                                              " " +
                                              values.event_end_time
                                      ),
                                  ]
                                : [null, null]
                        }
                    />
                </div>
                <div className="flex items-center">
                    {frequency === "1" && (
                        <div className="flex flex-row items-center gap-2">
                            <Checkbox
                                name="sametime"
                                checked={sameTime}
                                onChange={() => setSameTime(!sameTime)}
                            />

                            <span>Same time for everyday</span>
                        </div>
                    )}
                </div>
            </div>
            {sameTime ? (
                <div className="flex flex-row gap-6 px-4 py-2">
                    <div>
                        <InputLabel>Start Time</InputLabel>
                        <TimePicker
                            format={"HH:mm"}
                            disabledTime={disabledTime}
                            onChange={(e) => onStartTimeChange(e)}
                        />
                    </div>
                    <div>
                        <InputLabel>End Time</InputLabel>
                        <TimePicker
                            format={"HH:mm"}
                            disabledTime={disabledTime}
                            onChange={(e) => onEndTimeChange(e)}
                        />
                    </div>
                </div>
            ) : (
                <Accordion type="multiple" className="w-full py-4">
                    {days.map((d) => {
                        return (
                            <AccordionItem value={d.short} key={d.short}>
                                <AccordionTrigger
                                    style={{
                                        backgroundColor: "lightgray",
                                        padding: 10,
                                    }}
                                >
                                    {d.day}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-row gap-6 px-4 py-2">
                                        <div>
                                            <InputLabel>Start Time</InputLabel>
                                            <TimePicker
                                                format={"HH:mm"}
                                                disabledTime={disabledTime}
                                                onChange={(e) =>
                                                    onWeekStartTimeChange(
                                                        d.index,
                                                        e
                                                    )
                                                }
                                                defaultValue={
                                                    values.week_time[d.index]
                                                        .start_time
                                                        ? dayjs(
                                                              values.event_start_date +
                                                                  " " +
                                                                  values
                                                                      .week_time[
                                                                      d.index
                                                                  ].start_time
                                                          )
                                                        : null
                                                }
                                            ></TimePicker>
                                        </div>
                                        <div>
                                            <InputLabel>End Time</InputLabel>
                                            <TimePicker
                                                format={"HH:mm"}
                                                disabledTime={disabledTime}
                                                onChange={(e) =>
                                                    onWeekEndTimeChange(
                                                        d.index,
                                                        e
                                                    )
                                                }
                                                defaultValue={
                                                    values.week_time[d.index]
                                                        .end_time
                                                        ? dayjs(
                                                              values.event_start_date +
                                                                  " " +
                                                                  values
                                                                      .week_time[
                                                                      d.index
                                                                  ].end_time
                                                          )
                                                        : null
                                                }
                                            ></TimePicker>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
};

export default Week;
