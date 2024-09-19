import React from "react";
import OneTime from "./OneTime";
import dayjs from "dayjs";

const Frequency = ({
    frequency,
    onStartDateChange,
    onEndDateChange,
    dateFormat,
    timeFormat,
    onStartTimeChange,
    onEndTimeChange,
    values,
}: any) => {
    console.log("values => ", values[2]);
    return (
        <div className="py">
            {frequency == "4" ? (
                <OneTime
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    onStartTimeChange={onStartTimeChange}
                    onEndTimeChange={onEndTimeChange}
                    values={values}
                />
            ) : (
                ""
            )}
        </div>
    );
};

export default Frequency;
