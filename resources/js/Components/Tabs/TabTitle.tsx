import React, { useCallback } from "react";

import styles from "./tabTitle.module.css";

export type Props = {
    title: string;
    index: number;
    setSelectedTab: (index: number) => void;
    isActive?: boolean;
    disabled?: boolean;
};

const TabTitle = (props: Props): JSX.Element => {
    const { title, setSelectedTab, index, isActive, disabled } = props;

    const handleOnClick = useCallback(
        (e) => {
            e.preventDefault();
            setSelectedTab(index);
        },
        [setSelectedTab, index]
    );

    return (
        <li
            className={`bg-gray-100 text-black  outline-none
  px-4 py-2 rounded-t-md
  ${isActive ? `border-b-2 border-black opacity-100` : `opacity-40`}
`}
        >
            <button onClick={handleOnClick} disabled={disabled}>
                {title}
            </button>
        </li>
    );
};

export default TabTitle;
