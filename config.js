const CONFIG = {
    api: {
        development: "http://localhost:3001/api",
        production: "https://api.asem.digital/api"
    },

    timeout: 15000
};

const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

CONFIG.api.real = isLocalhost
    ? CONFIG.api.development
    : CONFIG.api.production;

CONFIG.api.location =
    `${CONFIG.api.real}/location`;

export { CONFIG };
export default CONFIG;
