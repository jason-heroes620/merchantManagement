import moment from "moment";

export const timeDisplay = (createdDateTime: any) => {
    const now = moment(new Date());
    const end = moment(createdDateTime);
    if (now.diff(end, "days", true) < 1) {
        return moment(createdDateTime).format("HH:mm");
    } else if (
        now.diff(end, "days", true) > 1 &&
        now.diff(end, "days", true) < 2
    ) {
        return "Yesterday";
    } else {
        return moment(createdDateTime).format("DD/MM//YYYY");
    }
};
