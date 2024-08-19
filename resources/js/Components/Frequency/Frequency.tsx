import React from "react";
import OneTime from "./OneTime";

const Frequency = ({
    frequency,
    onDateChange,
    dateFormat,
    timeFormat,
    onStartTimeChange,
    onEndTimeChange,
    values,
}: any) => {
    return (
        <div className="py-2">
            {frequency == "4" ? (
                <OneTime
                    onDateChange={onDateChange}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    onStartTimeChange={onStartTimeChange}
                    onEndTimeChange={onEndTimeChange}
                    values={[
                        values.event_date,
                        values.event_start_time,
                        values.event_end_time,
                    ]}
                />
            ) : (
                ""
            )}
        </div>
    );
};

export default Frequency;
