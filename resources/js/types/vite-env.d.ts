/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_API_URL: string;
    readonly VITE_RESTADMIN_KEY: string;
    readonly VITE_REVERB_APP_KEY: string;
    readonly VITE_REVERB_HOST: string;
    readonly VITE_REVERB_PORT: number;

    readonly VITE_PUSHER_APP_KEY: string;
    readonly VITE_PUSHER_APP_CLUSTER: string;

    readonly VITE_ABLY_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
