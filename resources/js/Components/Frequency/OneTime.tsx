import { DatePicker, TimePicker, DatePickerProps, TimePickerProps } from "antd";
import InputLabel from "../InputLabel";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

const OneTime = ({
    onStartDateChange,
    onEndDateChange,
    dateFormat,
    timeFormat,
    onStartTimeChange,
    onEndTimeChange,
    values,
}: any) => {
    return (
        <div className="py-2 border rounded-md">
            <div className="px-6 py-2">
                <div className="flex flex-row gap-8">
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
                            value={dayjs(values[0])}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="event_end_date" value="End Date" />
                        <DatePicker
                            onChange={onEndDateChange}
                            minDate={dayjs().add(1, "day")}
                            maxDate={dayjs().add(1, "year")}
                            format={dateFormat}
                            value={dayjs(values[1])}
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
                            value={dayjs(values[0] + " " + values[2])}
                        />
                    </div>
                    <div className="pl-6">
                        <InputLabel htmlFor="event_end_time" value="End Time" />
                        <TimePicker
                            format={timeFormat}
                            onChange={onEndTimeChange}
                            value={dayjs(values[1] + " " + values[3])}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneTime;
