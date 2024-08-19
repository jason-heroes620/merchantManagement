import { DatePicker, TimePicker, DatePickerProps, TimePickerProps } from "antd";
import InputLabel from "../InputLabel";
import dayjs from "dayjs";

const OneTime = ({
    onDateChange,
    dateFormat,
    timeFormat,
    onStartTimeChange,
    onEndTimeChange,
    values,
}: any) => {
    console.log("valuess => ", values);
    return (
        <div className="py-2 border rounded-md">
            <div className="px-6 py-2">
                <div>
                    <InputLabel htmlFor="event_date" value="Event Date" />
                    <DatePicker
                        onChange={onDateChange}
                        minDate={dayjs()}
                        maxDate={dayjs().add(1, "year")}
                        format={dateFormat}
                        defaultValue={dayjs(values["event_date"])}
                    />
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
                            defaultValue={dayjs(values["event_start_time"])}
                        />
                    </div>
                    <div className="pl-6">
                        <InputLabel htmlFor="event_end_time" value="End Time" />
                        <TimePicker
                            format={timeFormat}
                            onChange={onEndTimeChange}
                            defaultValue={dayjs(values["event_end_time"])}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneTime;
