import {
    DatePicker,
    TimePicker,
    DatePickerProps,
    TimePickerProps,
    Space,
} from "antd";
import InputLabel from "../InputLabel";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import type { GetProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

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

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
};

const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
});

const disabledRangeTime: RangePickerProps["disabledTime"] = (_, type) => {
    if (type === "start") {
        return {
            disabledHours: () => range(0, 30).splice(0, 8),
            disabledMinutes: () => [],
            disabledSeconds: () => [],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(0, 8),
        disabledMinutes: () => [],
        disabledSeconds: () => [],
    };
};

const OneTime = ({ onDateTimeChange, values }: any) => {
    return (
        <div className="py-2 border rounded-md">
            <div className="px-6 py-2">
                <div>
                    <InputLabel>
                        Please select your prefered date and time:
                    </InputLabel>
                </div>
                <div className="py-2">
                    <Space direction="vertical" size={12}>
                        <RangePicker
                            onCalendarChange={(v) => onDateTimeChange(v)}
                            disabledDate={disabledDate}
                            disabledTime={disabledRangeTime}
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
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [
                                    dayjs("08:00", "HH:mm"),
                                    dayjs("18:00", "HH:mm"),
                                ],
                            }}
                            format="DD/MM/YYYY HH:mm"
                        />
                    </Space>
                </div>
                {/* <div className="flex flex-row gap-8">
                    <div>
                        <InputLabel
                            htmlFor="event_start_date"
                            value="Start Date"
                        />
                        <DatePicker
                            onChange={onStartDateChange}
                            minDate={dayjs().add(1, "day")}
                            maxDate={dayjs().add(1, "year")}
                            format={dateFormat}
                            defaultValue={
                                values.event_start_date
                                    ? dayjs(
                                          values.event_start_date,
                                          "YYYY-MM-DD"
                                      )
                                    : ""
                            }
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="event_end_date" value="End Date" />
                        <DatePicker
                            onChange={onEndDateChange}
                            minDate={dayjs().add(1, "day")}
                            maxDate={dayjs().add(1, "year")}
                            format={dateFormat}
                            defaultValue={
                                values.event_end_date
                                    ? dayjs(values.event_end_date, "YYYY-MM-DD")
                                    : ""
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-row py-2">
                    <div>
                        <InputLabel
                            htmlFor="event_start_time"
                            value="Start Time"
                        />
                        <TimePicker
                            format={timeFormat}
                            onChange={onStartTimeChange}
                            defaultValue={
                                values.event_start_time
                                    ? dayjs(values.event_start_time, "HH:mm")
                                    : ""
                            }
                        />
                    </div>
                    <div className="pl-6">
                        <InputLabel htmlFor="event_end_time" value="End Time" />
                        <TimePicker
                            format={timeFormat}
                            onChange={onEndTimeChange}
                            defaultValue={
                                values.event_end_time
                                    ? dayjs(values.event_end_time, "HH:mm")
                                    : ""
                            }
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default OneTime;
