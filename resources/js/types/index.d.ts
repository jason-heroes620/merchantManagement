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

export interface Event {
    id: number;
    product_name: string;
    category: string;
    merchant_name: string;
}

export interface Chat {
    id: string;
    user_id: string;
    message: string;
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
