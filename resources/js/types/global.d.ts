import { AxiosInstance } from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { route as ziggyRoute } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: Echo;
        Pusher: Pusher;
    }

    var route: typeof ziggyRoute;
}
