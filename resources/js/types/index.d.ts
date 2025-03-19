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
    total: number;
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
    age_group: string;
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
    google_place_name: string;
    school_status: number;
}

export interface Item {
    item_type: string;
    unit_price: number;
    item_name: string;
    additional_unit_cost: number;
    additional: number;
}
export interface Proposal {
    proposal_id: string;
    proposal_no: string;
    proposal_date: Date;
    proposal_status: number;
    proposal: Proposal;
    proposal_product: Array<ProposalProduct>;
    proposal_item: Array<ProposalItem>;
    prices: Array<ProposalProductPrices>;
    proposal_discount: ProposalDiscount;
    fees: Array<Fees>;
}

export interface ProposalDiscount {
    discount_type: string;
    discount_amount: string;
}
export interface ProposalProduct {
    product_id: string;
    product: Product;
    prices: Array<ProposalProductPrices>;
}

export interface ProposalProductPrices {
    attribute: string;
    uom: string;
    unit_price: number;
    product_qty: number;
    sales_tax: number;
}
export interface ProposalItem {
    proposal_item_id: number;
    proposal_id: string;
    item_id: string;
    uom: string;
    item_qty: number;
    sales_tax: number;
    unit_price: number;
    item: Item;
    item_type: string;
    additional_unit_cost: string;
    additional: string;
}

export interface ProposalFees {
    proposal_fee_id: number;
    proposal_id: string;
    fee_id: number;
    fee_type: string;
    proposal_fee: number;
}

export interface Proposal {
    proposal_id: string;
    proposal_name: string;
    proposal_date: Date;
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
    special_request: string;
}

export interface Order {
    order_id: string;
    order_no: string;
    order_date: Date;
    due_date: Date;
    order_status: number;
    proposal_id: string;
}

export interface Invoice {
    proposal_id: string;
    invoice_no: string;
    invoice_date: Date;
    due_date: Date;
    invoice_status: number;
    proposal: Proposal;
    proposal_product: Array<ProposalProduct>;
    proposal_item: Array<ProposalItem>;
    prices: Array<ProposalProductPrices>;
}

export interface Fees {
    fee_id: number;
    fee_type: string;
    fee_amount: number;
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
