import React from "react";

type Props = {
    title: string;
    children: any;
};

const Tab: React.FC<Props> = ({ children }: any) => {
    return <div>{children}</div>;
};

export default Tab;
