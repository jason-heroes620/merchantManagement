import Echo from "laravel-echo";
import Pusher from "pusher-js";
// import Echo from "@ably/laravel-echo";
import * as Ably from "ably";

window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     secret: import.meta.env.VITE_PUSHER_APP_SECRET,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     forceTLS: true,
// });

window.Ably = Ably;

// Create new echo client instance using ably-js client driver.
window.Echo = new Echo({
    broadcaster: "pusher",
    // key: import.meta.env.VITE_ABLY_KEY,
    key: import.meta.env.VITE_ABLY_KEY,
    wsHost: "realtime-pusher.ably.io",
    wsPort: 443,
    disableStats: true,
    encrypted: true,
    cluster: "ap1",
});

// Register a callback for listing to connection state change
// window.Echo.connector.ably.connection.on((stateChange) => {
//     console.log("LOGGER:: Connection event :: ", stateChange);
//     if (
//         stateChange.current === "disconnected" &&
//         stateChange.reason?.code === 40142
//     ) {
//         // key/token status expired
//         console.log(
//             "LOGGER:: Connection token expired https://help.ably.io/error/40142"
//         );
//     }
// });
