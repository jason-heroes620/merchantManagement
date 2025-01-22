import React from "react";
import OneTime from "./OneTime";
import Week from "./Week";

const Frequency = ({
    frequency,
    // onStartDateChange,
    // onEndDateChange,
    dateFormat,
    timeFormat,
    onWeekStartTimeChange,
    onWeekEndTimeChange,
    onDateTimeChange,
    values,
}: any) => {
    return (
        <>
            {frequency == "4" ? (
                <div className="py-2">
                    <OneTime
                        dateFormat={dateFormat}
                        timeFormat={timeFormat}
                        onDateTimeChange={onDateTimeChange}
                        values={values}
                    />
                </div>
            ) : frequency === "" ? (
                ""
            ) : (
                <div className="py-2">
                    <Week
                        onDateTimeChange={onDateTimeChange}
                        onWeekStartTimeChange={onWeekStartTimeChange}
                        onWeekEndTimeChange={onWeekEndTimeChange}
                        values={values}
                        frequency={frequency}
                    />
                </div>
            )}
        </>
    );
};

export default Frequency;
