export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    roles: Array<string>;
}

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;

        links: {
            url: null | string;
            label: string;
            active: boolean;
        }[];
    };
};

export interface Merchant {
    manufacturer_id: number;
    name: string;
    email: string;
    phone: string;
}

export interface Product {
    id: number;
    product_name: string;
    category: string;
    merchant_name: string;
    location: string;
    duration: number;
    min_quantity: number;
    max_quantity: number;
}

export interface Chat {
    id: string;
    user_id: string;
    message: string;
    user: User;
}

export interface School {
    school_id: string;
    school_name: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    postcode: string;
    state: string;
    contact_person: string;
    email: string;
    contact_no: string;
    mobile_no: string;
    school_logo: string;
    google_map_location: string;
    school_status: number;
}

export interface Item {
    item_type: string;
    unit_price: number;
    item_name: string;
}
export interface Quotation {
    quotation_id: string;
    quotation_no: string;
    quotation_date: Date;
    quotation_status: number;
    proposal: Proposal;
    quotation_product: Array<QuotationProduct>;
    quotation_item: Array<QuotationItem>;
    prices: Array<QuotationProductPrices>;
    quotation_discount: QuotationDiscount;
}

export interface QuotationDiscount {
    discount_type: string;
    discount_amount: string;
}
export interface QuotationProduct {
    quotation_product_id: string;
    quotation_id: string;
    product_id: string;
    product: Product;
    prices: Array<QuotationProductPrices>;
}

export interface QuotationProductPrices {
    attribute: string;
    uom: string;
    unit_price: number;
    product_qty: number;
    sales_tax: number;
}
export interface QuotationItem {
    quotation_item_id: string;
    quotation_id: string;
    item_id: string;
    uom: string;
    item_qty: number;
    sales_tax: number;
    unit_price: number;
    item: Item;
}

export interface Proposal {
    proposal_id: string;
    proposal_name: string;
    proposal_date: Date;
    quotation_id: string;
    additional_price: number;
    qty_student: number;
    qty_teacher: number;
    proposal_status: number;
    contact_no: string;
    mobile_no: string;
    city: string;
    school_name: string;
    contact_person: string;
    origin: string;
    travel_duration: number;
    travel_distance: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        message: {
            success: boolean;
        };
    };
};
