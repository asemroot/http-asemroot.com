import { PublicAPI } from "./api.js";

PublicAPI.getData().then(data => {
    console.log("Real Data:", data);
});
