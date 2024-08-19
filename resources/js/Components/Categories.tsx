import React, { useEffect, useState } from "react";
import SelectInput from "./SelectInput";
import InputLabel from "./InputLabel";

type Category = {
    value: string;
    label: string;
};

const Categories = ({ categories, onChange, selected }: any) => {
    return (
        <div>
            <InputLabel htmlFor="category" value="Category" />
            <SelectInput
                options={categories}
                onChange={onChange}
                selected={selected}
            />
        </div>
    );
};

export default Categories;
