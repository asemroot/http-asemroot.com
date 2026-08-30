"use strict";

import { CONFIG } from "./config.js";

const API_BASE =
    CONFIG?.api?.real || "";

console.log(
    "ASEM: app.js STARTED"
);


/* ========================================================
   ASEM GLOBAL PLATFORM
   Main Frontend Controller
======================================================== */

const ASEM = {


    selectors: {

        search:
            "#searchBox",

        language:
            "#langSwitch",

        theme:
            "#themeToggle",

        scrollTop:
            "#scrollTop",

        locationStatus:
            "#locationStatus",

        tourismGrid:
            "#tourismGrid",

        businessesGrid:
            "#businessesGrid",

        productsGrid:
            "#productsGrid",

        projectsGrid:
            "#projectsGrid",

        portfolioGrid:
            "#portfolioGrid"
    },

    api: {

        tourism:
            `${API_BASE}/tourism`,

        businesses:
            `${API_BASE}/businesses`,

        products:
            `${API_BASE}/products`,

        projects:
            `${API_BASE}/projects`,

        location:
            CONFIG?.api?.location ||
            `${API_BASE}/location`
    },

    storage: {

        theme:
            "asem-theme",

        language:
            "asem-language"
    },

    requestTimeout:
        CONFIG?.timeout || 15000
};


/* ========================================================
   DOM HELPERS
======================================================== */

const $ = (
    selector,
    root = document
) =>
    root.querySelector(selector);


const $$ = (
    selector,
    root = document
) =>
    Array.from(
        root.querySelectorAll(selector)
    );


const DOM = {

    get search() {
        return $(
            ASEM.selectors.search
        );
    },

    get language() {
        return $(
            ASEM.selectors.language
        );
    },

    get theme() {
        return $(
            ASEM.selectors.theme
        );
    },

    get scrollTop() {
        return $(
            ASEM.selectors.scrollTop
        );
    },

    get locationStatus() {
        return $(
            ASEM.selectors.locationStatus
        );
    }
};


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function normalizeArray(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (
        !data ||
        typeof data !== "object"
    ) {
        return [];
    }

    const keys = [

        "data",
        "items",
        "results",
        "tourism",
        "businesses",
        "products",
        "projects"
    ];

    for (const key of keys) {

        if (
            Array.isArray(
                data[key]
            )
        ) {
            return data[key];
        }
    }

    return [];
}


/* ========================================================
   NAVIGATION
======================================================== */

function openPageSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {

        console.warn(
            `ASEM: section #${id} not found`
        );

        return false;
    }

    section.hidden = false;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    return true;
}


function handleSection(
    sectionId,
    loader
) {

    const opened =
        openPageSection(
            sectionId
        );

    if (!opened) {
        return false;
    }

    if (
        typeof loader ===
        "function"
    ) {
        Promise.resolve(
            loader()
        ).catch(
            error => {
                console.error(
                    "ASEM section loader:",
                    error
                );
            }
        );
    }

    return true;
}


function openExternalPage(page) {

    if (!page) {
        return;
    }

    window.location.href =
        page;
}


/* ========================================================
   API
======================================================== */

async function apiRequest(
    endpoint,
    options = {}
) {

    const controller =
        new AbortController();

    const timer =
        window.setTimeout(
            () =>
                controller.abort(),
            ASEM.requestTimeout
        );

    const requestOptions = {

        method:
            options.method ||
            "GET",

        headers: {

            Accept:
                "application/json",

            ...(options.headers || {})
        },

        cache:
            options.cache ||
            "no-store",

        signal:
            controller.signal
    };

    if (
        options.body !==
        undefined
    ) {
        requestOptions.body =
            options.body;
    }

    try {

        const response =
            await fetch(
                endpoint,
                requestOptions
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        if (
            contentType &&
            !contentType.includes(
                "application/json"
            )
        ) {

            throw new Error(
                "API did not return JSON"
            );
        }

        return await response.json();

    } finally {

        window.clearTimeout(
            timer
        );
    }
}


/* ========================================================
   GRID STATES
======================================================== */

function setGridLoading(
    grid,
    message
) {

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <article
            class="card platform-state loading-state">

            <div
                class="loading-spinner"
                aria-hidden="true">
            </div>

            <h3>
                ${escapeHTML(
                    message ||
                    "Loading..."
                )}
            </h3>

            <p>
                Please wait...
            </p>

        </article>
    `;

    grid.setAttribute(
        "aria-busy",
        "true"
    );
}


function setGridEmpty(
    grid,
    title,
    message
) {

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <article
            class="card platform-state empty-state">

            <span
                class="platform-state-icon"
                aria-hidden="true">
                🌐
            </span>

            <h3>
                ${escapeHTML(
                    title ||
                    "No data available"
                )}
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    "No items available."
                )}
            </p>

        </article>
    `;

    grid.setAttribute(
        "aria-busy",
        "false"
    );
}


function setGridError(
    grid,
    title,
    message
) {

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <article
            class="card platform-state error-state">

            <span
                class="platform-state-icon"
                aria-hidden="true">
                ⚠️
            </span>

            <h3>
                ${escapeHTML(
                    title ||
                    "Unable to load data"
                )}
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    "Please try again later."
                )}
            </p>

            <button
                type="button"
                class="btn"
                data-retry-grid="${escapeHTML(
                    grid.id
                )}">
                Retry
            </button>

        </article>
    `;

    grid.setAttribute(
        "aria-busy",
        "false"
    );
}


function finishGrid(grid) {

    if (grid) {

        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }
}


/* ========================================================
   CARD BUILDERS
======================================================== */

function buildTourismCard(item) {

    const name =
        item.name ||
        item.title ||
        "Tourism Destination";

    const category =
        item.category ||
        "Tourism";

    const description =
        item.description ||
        "Discover this destination.";

    const image =
        item.image || "";

    return `
        <article
            class="card platform-result-card"
            data-type="tourism"
            data-id="${escapeHTML(
                item.id || ""
            )}">

            ${
                image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                            class="platform-card-image"
                            onerror="this.style.display='none'">
                      `
                    : `
                        <div
                            class="platform-card-icon"
                            aria-hidden="true">
                            🏝️
                        </div>
                      `
            }

            <div class="platform-card-content">

                <span
                    class="platform-card-category">
                    ${escapeHTML(category)}
                </span>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                ${
                    item.rating !== undefined
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(
                                    item.rating
                                )}
                            </div>
                          `
                        : ""
                }

                <button
                    type="button"
                    class="btn copy-card-btn"
                    data-copy="${escapeHTML(
                        `${name}\n${category}\n${description}`
                    )}">
                    Copy
                </button>

            </div>

        </article>
    `;
}


function buildBusinessCard(item) {

    const name =
        item.name ||
        item.title ||
        "Global Business";

    const category =
        item.category ||
        "Business";

    const description =
        item.description ||
        "Discover this business.";

    const image =
        item.logo ||
        item.cover_image ||
        item.image ||
        "";

    const address =
        item.address || "";

    return `
        <article
            class="card platform-result-card"
            data-type="business"
            data-id="${escapeHTML(
                item.id || ""
            )}">

            ${
                image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                            class="platform-card-image"
                            onerror="this.style.display='none'">
                      `
                    : `
                        <div
                            class="platform-card-icon"
                            aria-hidden="true">
                            🌍
                        </div>
                      `
            }

            <div class="platform-card-content">

                <span
                    class="platform-card-category">
                    ${escapeHTML(category)}
                </span>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                ${
                    address
                        ? `
                            <small>
                                📍 ${escapeHTML(address)}
                            </small>
                          `
                        : ""
                }

                ${
                    item.rating !== undefined
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(
                                    item.rating
                                )}
                            </div>
                          `
                        : ""
                }

                <button
                    type="button"
                    class="btn copy-card-btn"
                    data-copy="${escapeHTML(
                        `${name}\n${category}\n${description}${address ? `\n${address}` : ""}`
                    )}">
                    Copy
                </button>

            </div>

        </article>
    `;
}


function buildProductCard(item) {

    const name =
        item.name ||
        item.title ||
        "Global Product";

    const category =
        item.category ||
        "Product";

    const description =
        item.description ||
        "Discover this product.";

    const image =
        item.image || "";

    return `
        <article
            class="card platform-result-card"
            data-type="product"
            data-id="${escapeHTML(
                item.id || ""
            )}">

            ${
                image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                            class="platform-card-image"
                            onerror="this.style.display='none'">
                      `
                    : `
                        <div
                            class="platform-card-icon"
                            aria-hidden="true">
                            🛒
                        </div>
                      `
            }

            <div class="platform-card-content">

                <span
                    class="platform-card-category">
                    ${escapeHTML(category)}
                </span>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                ${
                    item.price !== undefined
                        ? `
                            <strong class="product-price">
                                ${escapeHTML(
                                    item.price
                                )}
                                ${escapeHTML(
                                    item.currency ||
                                    "USD"
                                )}
                            </strong>
                          `
                        : ""
                }

                ${
                    item.rating !== undefined
                        ? `
                            <div class="platform-rating">
                                ⭐ ${escapeHTML(
                                    item.rating
                                )}
                            </div>
                          `
                        : ""
                }

                <button
                    type="button"
                    class="btn copy-card-btn"
                    data-copy="${escapeHTML(
                        `${name}\n${category}\n${description}${item.price !== undefined ? `\n${item.price} ${item.currency || "USD"}` : ""}`
                    )}">
                    Copy
                </button>

            </div>

        </article>
    `;
}


function buildProjectCard(item) {

    const name =
        item.name ||
        item.title ||
        "ASEM Project";

    const description =
        item.description ||
        "ASEM Digital Solutions project.";

    const image =
        item.image || "";

    return `
        <article
            class="card project-card"
            data-type="project"
            data-id="${escapeHTML(
                item.id || ""
            )}">

            ${
                image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                            class="platform-card-image"
                            onerror="this.style.display='none'">
                      `
                    : `
                        <div
                            class="platform-card-icon"
                            aria-hidden="true">
                            🚀
                        </div>
                      `
            }

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

            <button
                type="button"
                class="btn copy-card-btn"
                data-copy="${escapeHTML(
                    `${name}\n${description}`
                )}">
                Copy
            </button>

        </article>
    `;
}


function renderGrid(
    grid,
    items,
    builder,
    emptyTitle,
    emptyMessage
) {

    if (!grid) {
        return;
    }

    if (!items.length) {

        setGridEmpty(
            grid,
            emptyTitle,
            emptyMessage
        );

        return;
    }

    grid.innerHTML =
        items
            .map(builder)
            .join("");

    finishGrid(grid);
}


/* ========================================================
   LOADERS
======================================================== */

async function loadTourism() {

    const grid =
        $(
            ASEM.selectors.tourismGrid
        );

    if (!grid) {

        console.warn(
            "ASEM: tourismGrid not found"
        );

        return;
    }

    setGridLoading(
        grid,
        "Loading Global Tourism..."
    );

    try {

        const data =
            await apiRequest(
                ASEM.api.tourism
            );

        renderGrid(
            grid,
            normalizeArray(data),
            buildTourismCard,
            "No tourism data yet",
            "Tourism destinations will appear here."
        );

    } catch (error) {

        console.error(
            "ASEM Tourism:",
            error
        );

        setGridError(
            grid,
            "Tourism is temporarily unavailable",
            "The tourism service could not be reached."
        );
    }
}


async function loadBusinesses() {

    const grid =
        $(
            ASEM.selectors.businessesGrid
        );

    if (!grid) {

        console.warn(
            "ASEM: businessesGrid not found"
        );

        return;
    }

    setGridLoading(
        grid,
        "Loading Global Businesses..."
    );

    try {

        const data =
            await apiRequest(
                ASEM.api.businesses
            );

        renderGrid(
            grid,
            normalizeArray(data),
            buildBusinessCard,
            "No businesses yet",
            "Businesses will appear here."
        );

    } catch (error) {

        console.error(
            "ASEM Businesses:",
            error
        );

        setGridError(
            grid,
            "Businesses are temporarily unavailable",
            "The business service could not be reached."
        );
    }
}


async function loadProducts() {

    const grid =
        $(
            ASEM.selectors.productsGrid
        );

    if (!grid) {

        console.warn(
            "ASEM: productsGrid not found"
        );

        return;
    }

    setGridLoading(
        grid,
        "Loading Global Products..."
    );

    try {

        const data =
            await apiRequest(
                ASEM.api.products
            );

        renderGrid(
            grid,
            normalizeArray(data),
            buildProductCard,
            "No products yet",
            "Products will appear here."
        );

    } catch (error) {

        console.error(
            "ASEM Products:",
            error
        );

        setGridError(
            grid,
            "Products are temporarily unavailable",
            "The products service could not be reached."
        );
    }
}


async function loadProjects() {

    const grid =
        $(
            ASEM.selectors.projectsGrid
        );

    if (!grid) {

        console.warn(
            "ASEM: projectsGrid not found"
        );

        return;
    }

    setGridLoading(
        grid,
        "Loading ASEM Projects..."
    );

    try {

        const data =
            await apiRequest(
                ASEM.api.projects
            );

        renderGrid(
            grid,
            normalizeArray(data),
            buildProjectCard,
            "ASEM Projects",
            "Our projects will appear here."
        );

    } catch (error) {

        console.warn(
            "ASEM Projects:",
            error
        );

        setGridEmpty(
            grid,
            "ASEM Projects",
            "Our project showcase will appear here."
        );
    }
}
/* ========================================================
   PORTFOLIO / WORK
======================================================== */

function openPortfolio() {

    openPageSection(
        "portfolio"
    );

    const grid =
        $(
            ASEM.selectors.portfolioGrid
        );

    if (!grid) {
        return;
    }

    if (!grid.children.length) {

        grid.innerHTML = `
            <article
                class="card portfolio-card">

                <div
                    class="platform-card-icon"
                    aria-hidden="true">
                    💻
                </div>

                <h3>
                    ASEM Digital Solutions
                </h3>

                <p>
                    Global digital solutions,
                    software platforms and
                    modern technology services.
                </p>

            </article>
        `;
    }
}


/*
 * "Work" is kept as a separate action because the
 * frontend icon may use data-platform-action="work".
* It intentionally opens the existing portfolio section.
 */ 
function openWork() {

    return openPortfolio();
}


/* ========================================================
   RESTAURANTS
======================================================== */

/*
 * Restaurants are currently represented by the
 * businesses API. This keeps the existing backend
 * unchanged while allowing a Restaurants icon to work.
 */
function openRestaurants() {

    return handleSection(
        "businesses-section",
        loadBusinesses
    );
}


/* ========================================================
   AI
======================================================== */

/*
 * The previous initializeAI() function only contained
 * comments, so the AI action had no actual frontend
 * behavior.
 *
 * The function below first looks for a dedicated AI
 * section. It supports both:
 *
 *     #ai
 *     #ai-section
 *
 * If neither exists, it looks for a dedicated AI page.
 */
function openAI() {

    const aiSection =
        document.getElementById("ai") ||
        document.getElementById("ai-section");

    if (aiSection) {

        aiSection.hidden = false;

        aiSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        document.dispatchEvent(
            new CustomEvent(
                "asem:ai:open"
            )
        );

        return true;
    }

    /*
     * If another AI module is installed on the page,
     * give it an event to initialize/open itself.
     */
    const aiEvent =
        new CustomEvent(
            "asem:ai:open"
        );

    document.dispatchEvent(
        aiEvent
    );

    /*
     * If an AI page exists in the project,
     * this provides a final navigation fallback.
     */
    const aiLink =
        document.querySelector(
            'a[href="ai.html"], a[href="./ai.html"]'
        );

    if (aiLink) {

        openExternalPage(
            aiLink.getAttribute("href")
        );

        return true;
    }

    console.warn(
        "ASEM: AI section or AI page not found"
    );

    return false;
}


function initializeAI() {

    /*
     * The AI runtime can listen for this event:
     *
     * document.addEventListener(
     *     "asem:ai:open",
     *     () => {
     *         // open AI interface
     *     }
     * );
     *
     * No external AI service is called here.
     * This keeps the frontend stable until the
     * actual AI interface/runtime is connected.
     */

    document.addEventListener(
        "asem:ai:open",
        () => {

            console.log(
                "ASEM AI: open request received"
            );
        }
    );
}


/* ========================================================
   SEARCH
======================================================== */

function focusSearch() {

    const input =
        $(
            ASEM.selectors.search
        );

    if (!input) {
        return;
    }

    input.focus();

    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function search(value) {

    const query =
        String(value || "")
            .toLowerCase()
            .trim();

    const cards =
        $$(
            ".platform-result-card, .project-card"
        );

    if (!query) {

        cards.forEach(
            card => {
                card.hidden = false;
            }
        );

        return;
    }

    cards.forEach(
        card => {

            card.hidden =
                !card.textContent
                    .toLowerCase()
                    .includes(query);
        }
    );
}


/* ========================================================
   THEME
======================================================== */

function applyTheme(theme) {

    const valid =
        theme === "dark"
            ? "dark"
            : "light";

    document.documentElement
        .setAttribute(
            "data-theme",
            valid
        );

    const button =
        $(
            ASEM.selectors.theme
        );

    if (button) {

        button.textContent =
            valid === "dark"
                ? "☀️"
                : "🌙";

        button.setAttribute(
            "aria-label",
            valid === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        button.setAttribute(
            "title",
            valid === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }

    try {

        localStorage.setItem(
            ASEM.storage.theme,
            valid
        );

    } catch (error) {

        console.warn(
            "ASEM theme storage unavailable"
        );
    }

    return valid;
}


function initializeTheme() {

    let saved = null;

    try {

        saved =
            localStorage.getItem(
                ASEM.storage.theme
            );

    } catch (error) {}

    if (
        saved === "dark" ||
        saved === "light"
    ) {

        applyTheme(saved);

        return;
    }

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    applyTheme(
        prefersDark
            ? "dark"
            : "light"
    );
}


function toggleTheme() {

    const current =
        document.documentElement
            .getAttribute(
                "data-theme"
            );

    applyTheme(
        current === "dark"
            ? "light"
            : "dark"
    );
}


/* ========================================================
   GPS / GEOLOCATION
======================================================== */

function showLocationStatus(message) {

    const status =
        DOM.locationStatus;

    if (status) {
        status.textContent = message;
    }

    console.log(
        `ASEM GPS: ${message}`
    );
}


async function sendLocationToBackend(location) {

    if (!ASEM.api.location) {
        return null;
    }

    try {

        return await apiRequest(
            ASEM.api.location,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(location)
            }
        );

    } catch (error) {

        console.warn(
            "ASEM: location backend unavailable",
            error
        );

        return null;
    }
}


function requestGPS() {

    if (!navigator.geolocation) {

        showLocationStatus(
            "GPS / Geolocation is not supported by this browser."
        );

        return;
    }

    showLocationStatus(
        "Requesting your location..."
    );

    navigator.geolocation.getCurrentPosition(
        async position => {

            const location = {

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude,

                accuracy:
                    position.coords.accuracy,

                timestamp:
                    position.timestamp
            };

            window.ASEMLocation =
                location;

            showLocationStatus(
                `Location detected: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
            );

            await sendLocationToBackend(
                location
            );
        },

        error => {

            let message =
                "Unable to get location.";

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Location permission was denied.";

                    break;

                case error.POSITION_UNAVAILABLE:

                    message =
                        "Location information is unavailable.";

                    break;

                case error.TIMEOUT:

                    message =
                        "Location request timed out.";

                    break;
            }

            showLocationStatus(
                message
            );

            console.warn(
                "ASEM GPS:",
                error
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/*
 * Kept for compatibility.
 * GPS clicks are handled by initializeActionRouter().
 */
function initializeGPS() {
    return true;
}


/* ========================================================
   PLATFORM ACTIONS
======================================================== */

const actions = {

    tourism: () =>
        handleSection(
            "tourism-section",
            loadTourism
        ),

    businesses: () =>
        handleSection(
            "businesses-section",
            loadBusinesses
        ),

    /*
     * Restaurant aliases.
     * Restaurants currently use the businesses backend.
     */
    restaurant: () =>
        openRestaurants(),

    restaurants: () =>
        openRestaurants(),

    /*
     * Product aliases.
     */
    product: () =>
        handleSection(
            "products-section",
            loadProducts
        ),

    products: () =>
        handleSection(
            "products-section",
            loadProducts
        ),

    /*
     * Project aliases.
     */
    project: () =>
        handleSection(
            "projects",
            loadProjects
        ),

    projects: () =>
        handleSection(
            "projects",
            loadProjects
        ),

    /*
     * Work / Portfolio aliases.
     */
    work: () =>
        openWork(),

    portfolio: () =>
        openPortfolio(),

    /*
     * AI aliases.
     */
    ai: () =>
        openAI(),

    assistant: () =>
        openAI(),

    artificialintelligence: () =>
        openAI(),

    services: () =>
        openPageSection(
            "services"
        ),

    contact: () =>
        openExternalPage(
            "contact.html"
        ),

    about: () =>
        openExternalPage(
            "about.html"
        ),

    search: () =>
        focusSearch(),

    gps: () =>
        requestGPS(),

    location: () =>
        requestGPS(),

    nearby: () =>
        requestGPS(),

    top: () =>
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
};


/* ========================================================
   LANGUAGE
======================================================== */

const I18N = {

    ar: {

        platform:
            "المنصة العالمية",

        services:
            "الخدمات",

        services_desc:
            "استكشف خدمات تطوير الويب والذكاء الاصطناعي والأتمتة والحلول السحابية.",

        projects:
            "المشروعات",

        portfolio:
            "معرض الأعمال",

        about:
            "عن ASEM",

        contact:
            "اتصل بنا",

        contact_desc:
            "تواصل مع ASEM Digital Solutions.",

        hero_title:
            "حلول ASEM الرقمية",

        hero_desc:
            "مشروعات رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم.",

        start_project:
            "ابدأ مشروعك مجانًا",

        global_platform:
            "منصة ASEM العالمية 🌏",

        global_platform_desc:
            "استكشف الوجهات السياحية والشركات والمنتجات والخدمات الرقمية من خلال منصة موحدة.",

        tourism:
            "السياحة العالمية",

        tourism_desc:
            "اكتشف الوجهات والمعالم السياحية حول العالم.",

        businesses:
            "الشركات العالمية",

        businesses_desc:
            "استكشف الشركات والمطاعم والخدمات والمؤسسات حول العالم.",

        products:
            "المنتجات العالمية",

        products_desc:
            "اكتشف المنتجات والعروض من الشركات حول العالم.",

        projects_desc:
            "استكشف مشروعات ASEM الرقمية وحلول البرمجيات.",

        portfolio_desc:
            "مجموعة مختارة من حلول ASEM الرقمية.",

        global_search:
            "البحث العالمي",

        global_search_desc:
            "ابحث داخل منصة ASEM.",

        web_dev:
            "تطوير الويب",

        web_dev_desc:
            "مواقع ومنصات رقمية حديثة وسريعة وآمنة.",

        ai_auto:
            "الذكاء الاصطناعي والأتمتة",

        ai_auto_desc:
            "حلول ذكية تعتمد على الذكاء الاصطناعي والأتمتة الحديثة.",

        cloud:
            "الحلول السحابية",

        cloud_desc:
            "بنية سحابية موثوقة وقابلة للتوسع للمؤسسات الحديثة.",

        why_asem:
            "لماذا تختار ASEM",

        secure:
            "أمان بمستوى المؤسسات",

        modern_tech:
            "تقنيات حديثة",

        full_solutions:
            "حلول رقمية متكاملة",

        trusted_world:
            "منصة رقمية عالمية",

        trusted_desc:
            "تعمل ASEM على بناء منظومة رقمية عالمية تربط الأشخاص والشركات والخدمات والسياحة والتكنولوجيا."
    },

    en: {

        platform:
            "Global Platform",

        services:
            "Services",

        services_desc:
            "Explore web development, AI, automation and cloud services.",

        projects:
            "Projects",

        portfolio:
            "Portfolio",

        about:
            "About",

        contact:
            "Contact",

        contact_desc:
            "Contact ASEM Digital Solutions.",

        hero_title:
            "ASEM Digital Solutions",

        hero_desc:
            "Free digital projects and custom software solutions for individuals and companies worldwide.",

        start_project:
            "Start Your Free Project",

        global_platform:
            "ASEM Global Platform 🌏",

        global_platform_desc:
            "Explore tourism destinations, global businesses, products and digital services through one unified platform.",

        tourism:
            "Global Tourism",

        tourism_desc:
            "Discover destinations and attractions around the world.",

        businesses:
            "Global Businesses",

        businesses_desc:
            "Explore businesses, restaurants, services and organizations worldwide.",

        products:
            "Global Products",

        products_desc:
            "Discover products and offerings from businesses around the world.",

        projects_desc:
            "Explore ASEM digital projects and software solutions.",

        portfolio_desc:
            "A selection of our global digital solutions.",

        global_search:
            "Global Search",

        global_search_desc:
            "Search across the ASEM platform.",

        web_dev:
            "Web Development",

        web_dev_desc:
            "Modern, fast, secure websites and digital platforms.",

        ai_auto:
            "AI & Automation",

        ai_auto_desc:
            "Smart solutions powered by modern artificial intelligence and automation.",

        cloud:
            "Cloud Solutions",

        cloud_desc:
            "Scalable and reliable cloud infrastructure for modern organizations.",

        why_asem:
            "Why Choose ASEM",

        secure:
            "Enterprise-grade security",

        modern_tech:
            "Modern technologies",

        full_solutions:
            "Complete digital solutions",

        trusted_world:
            "Global digital platform",

        trusted_desc:
            "ASEM is building a global digital ecosystem connecting people, businesses, services, tourism and technology."
    },

    fr: {

        platform:
            "Plateforme mondiale",

        services:
            "Services",

        services_desc:
            "Découvrez nos services de développement web, d’IA, d’automatisation et de cloud.",

        projects:
            "Projets",

        portfolio:
            "Portfolio",

        about:
            "À propos",

        contact:
            "Contact",

        contact_desc:
            "Contactez ASEM Digital Solutions.",

        hero_title:
            "Solutions numériques ASEM",

        hero_desc:
            "Projets numériques gratuits et solutions logicielles personnalisées pour les particuliers et les entreprises du monde entier.",

        start_project:
            "Démarrer votre projet gratuitement",

        global_platform:
            "Plateforme mondiale ASEM 🌏",

        global_platform_desc:
            "Découvrez les destinations touristiques, les entreprises, les produits et les services numériques sur une plateforme unifiée.",

        tourism:
            "Tourisme mondial",

        tourism_desc:
            "Découvrez les destinations et attractions du monde entier.",

        businesses:
            "Entreprises mondiales",

        businesses_desc:
            "Découvrez les entreprises, restaurants, services et organisations du monde entier.",

        products:
            "Produits mondiaux",

        products_desc:
            "Découvrez les produits et offres des entreprises du monde entier.",

        projects_desc:
            "Découvrez les projets numériques et solutions logicielles ASEM.",

        portfolio_desc:
            "Une sélection des solutions numériques ASEM.",

        global_search:
            "Recherche mondiale",

        global_search_desc:
            "Recherchez sur la plateforme ASEM.",

        web_dev:
            "Développement web",

        web_dev_desc:
            "Sites web et plateformes numériques modernes, rapides et sécurisés.",

        ai_auto:
            "IA et automatisation",

        ai_auto_desc:
            "Solutions intelligentes basées sur l'intelligence artificielle et l'automatisation.",

        cloud:
            "Solutions cloud",

        cloud_desc:
            "Infrastructure cloud fiable et évolutive.",

        why_asem:
            "Pourquoi choisir ASEM",

        secure:
            "Sécurité de niveau entreprise",

        modern_tech:
            "Technologies modernes",

        full_solutions:
            "Solutions numériques complètes",

        trusted_world:
            "Plateforme numérique mondiale",

        trusted_desc:
            "ASEM construit un écosystème numérique mondial reliant les personnes, entreprises, services, tourisme et technologies."
    },

    de: {

        platform:
            "Globale Plattform",

        services:
            "Dienstleistungen",

        services_desc:
            "Entdecken Sie Webentwicklung, KI, Automatisierung und Cloud-Dienste.",

        projects:
            "Projekte",

        portfolio:
            "Portfolio",

        about:
            "Über uns",

        contact:
            "Kontakt",

        contact_desc:
            "Kontaktieren Sie ASEM Digital Solutions.",

        hero_title:
            "ASEM Digitale Lösungen",

        hero_desc:
            "Kostenlose digitale Projekte und individuelle Softwarelösungen für Menschen und Unternehmen weltweit.",

        start_project:
            "Kostenloses Projekt starten",

        global_platform:
            "ASEM Globale Plattform 🌏",

        global_platform_desc:
            "Entdecken Sie Tourismusziele, Unternehmen, Produkte und digitale Dienstleistungen auf einer Plattform.",

        tourism:
            "Globaler Tourismus",

        tourism_desc:
            "Entdecken Sie Reiseziele und Sehenswürdigkeiten weltweit.",

        businesses:
            "Globale Unternehmen",

        businesses_desc:
            "Entdecken Sie Unternehmen, Restaurants, Dienstleistungen und Organisationen weltweit.",

        products:
            "Globale Produkte",

        products_desc:
            "Entdecken Sie Produkte und Angebote von Unternehmen weltweit.",

        projects_desc:
            "Entdecken Sie digitale ASEM-Projekte und Softwarelösungen.",

        portfolio_desc:
            "Eine Auswahl unserer digitalen Lösungen.",

        global_search:
            "Globale Suche",

        global_search_desc:
            "Durchsuchen Sie die ASEM-Plattform.",

        web_dev:
            "Webentwicklung",

        web_dev_desc:
            "Moderne, schnelle und sichere Websites und digitale Plattformen.",

        ai_auto:
            "KI und Automatisierung",

        ai_auto_desc:
            "Intelligente Lösungen mit moderner künstlicher Intelligenz und Automatisierung.",

        cloud:
            "Cloud-Lösungen",

        cloud_desc:
            "Skalierbare und zuverlässige Cloud-Infrastruktur.",

        why_asem:
            "Warum ASEM",

        secure:
            "Sicherheit auf Unternehmensniveau",

        modern_tech:
            "Moderne Technologien",

        full_solutions:
            "Komplette digitale Lösungen",

        trusted_world:
            "Globale digitale Plattform",

        trusted_desc:
            "ASEM entwickelt ein globales digitales Ökosystem für Menschen, Unternehmen, Dienstleistungen, Tourismus und Technologie."
    },

    it: {

        platform:
            "Piattaforma globale",

        services:
            "Servizi",

        services_desc:
            "Scopri i servizi di sviluppo web, IA, automazione e cloud.",

        projects:
            "Progetti",

        portfolio:
            "Portfolio",

        about:
            "Chi siamo",

        contact:
            "Contatti",

        contact_desc:
            "Contatta ASEM Digital Solutions.",

        hero_title:
            "Soluzioni digitali ASEM",

        hero_desc:
            "Progetti digitali gratuiti e soluzioni software personalizzate per persone e aziende in tutto il mondo.",

        start_project:
            "Inizia il tuo progetto gratuitamente",

        global_platform:
            "Piattaforma globale ASEM 🌏",

        global_platform_desc:
            "Esplora destinazioni turistiche, aziende, prodotti e servizi digitali attraverso un'unica piattaforma.",

        tourism:
            "Turismo globale",

        tourism_desc:
            "Scopri destinazioni e attrazioni in tutto il mondo.",

        businesses:
            "Aziende globali",

        businesses_desc:
            "Esplora aziende, ristoranti, servizi e organizzazioni in tutto il mondo.",

        products:
            "Prodotti globali",

        products_desc:
            "Scopri prodotti e offerte di aziende di tutto il mondo.",

        projects_desc:
            "Scopri i progetti digitali e le soluzioni software ASEM.",

        portfolio_desc:
            "Una selezione delle nostre soluzioni digitali.",

        global_search:
            "Ricerca globale",

        global_search_desc:
            "Cerca nella piattaforma ASEM.",

        web_dev:
            "Sviluppo web",

        web_dev_desc:
            "Siti web e piattaforme digitali moderne, veloci e sicure.",

        ai_auto:
            "IA e automazione",

        ai_auto_desc:
            "Soluzioni intelligenti basate sull'intelligenza artificiale e sull'automazione.",

        cloud:
            "Soluzioni cloud",

        cloud_desc:
            "Infrastruttura cloud affidabile e scalabile.",

        why_asem:
            "Perché scegliere ASEM",

        secure:
            "Sicurezza di livello aziendale",

        modern_tech:
            "Tecnologie moderne",

        full_solutions:
            "Soluzioni digitali complete",

        trusted_world:
            "Piattaforma digitale globale",

        trusted_desc:
            "ASEM sta costruendo un ecosistema digitale globale che collega persone, aziende, servizi, turismo e tecnologia."
    },

    es: {

        platform:
            "Plataforma global",

        services:
            "Servicios",

        services_desc:
            "Explora servicios de desarrollo web, IA, automatización y soluciones cloud.",

        projects:
            "Proyectos",

        portfolio:
            "Portafolio",

        about:
            "Acerca de",

        contact:
            "Contacto",

        contact_desc:
            "Contacta con ASEM Digital Solutions.",

        hero_title:
            "Soluciones digitales ASEM",

        hero_desc:
            "Proyectos digitales gratuitos y soluciones de software personalizadas para personas y empresas de todo el mundo.",

        start_project:
            "Inicia tu proyecto gratis",

        global_platform:
            "Plataforma global ASEM 🌏",

        global_platform_desc:
            "Explora destinos turísticos, empresas, productos y servicios digitales en una plataforma unificada.",

        tourism:
            "Turismo global",

        tourism_desc:
            "Descubre destinos y atracciones de todo el mundo.",

        businesses:
            "Empresas globales",

        businesses_desc:
            "Explora empresas, restaurantes, servicios y organizaciones de todo el mundo.",

        products:
            "Productos globales",

        products_desc:
            "Descubre productos y ofertas de empresas de todo el mundo.",

        projects_desc:
            "Explora proyectos digitales y soluciones de software de ASEM.",

        portfolio_desc:
            "Una selección de nuestras soluciones digitales.",

        global_search:
            "Búsqueda global",

        global_search_desc:
            "Busca en la plataforma ASEM.",

        web_dev:
            "Desarrollo web",

        web_dev_desc:
            "Sitios web y plataformas digitales modernas, rápidas y seguras.",

        ai_auto:
            "IA y automatización",

        ai_auto_desc:
            "Soluciones inteligentes basadas en inteligencia artificial y automatización.",

        cloud:
            "Soluciones en la nube",

        cloud_desc:
            "Infraestructura cloud escalable y fiable.",

        why_asem:
            "Por qué elegir ASEM",

        secure:
            "Seguridad de nivel empresarial",

        modern_tech:
            "Tecnologías modernas",

        full_solutions:
            "Soluciones digitales completas",

        trusted_world:
            "Plataforma digital global",

        trusted_desc:
            "ASEM está construyendo un ecosistema digital global que conecta personas, empresas, servicios, turismo y tecnología."
    },

    nl: {

        platform:
            "Wereldwijd platform",

        services:
            "Diensten",

        services_desc:
            "Ontdek webontwikkeling, AI, automatisering en clouddiensten.",

        projects:
            "Projecten",

        portfolio:
            "Portfolio",

        about:
            "Over ons",

        contact:
            "Contact",

        contact_desc:
            "Neem contact op met ASEM Digital Solutions.",

        hero_title:
            "ASEM Digitale oplossingen",

        hero_desc:
            "Gratis digitale projecten en aangepaste softwareoplossingen voor particulieren en bedrijven wereldwijd.",

        start_project:
            "Start gratis je project",

        global_platform:
            "ASEM Wereldwijd platform 🌏",

        global_platform_desc:
            "Ontdek toeristische bestemmingen, bedrijven, producten en digitale diensten via één platform.",

        tourism:
            "Wereldwijd toerisme",

        tourism_desc:
            "Ontdek bestemmingen en attracties over de hele wereld.",

        businesses:
            "Wereldwijde bedrijven",

        businesses_desc:
            "Ontdek bedrijven, restaurants, diensten en organisaties wereldwijd.",

        products:
            "Wereldwijde producten",

        products_desc:
            "Ontdek producten en aanbiedingen van bedrijven wereldwijd.",

        projects_desc:
            "Ontdek digitale ASEM-projecten en softwareoplossingen.",

        portfolio_desc:
            "Een selectie van onze digitale oplossingen.",

        global_search:
            "Wereldwijd zoeken",

        global_search_desc:
            "Zoek binnen het ASEM-platform.",

        web_dev:
            "Webontwikkeling",

        web_dev_desc:
            "Moderne, snelle en veilige websites en digitale platforms.",

        ai_auto:
            "AI en automatisering",

        ai_auto_desc:
            "Slimme oplossingen met moderne kunstmatige intelligentie en automatisering.",

        cloud:
            "Cloudoplossingen",

        cloud_desc:
            "Schaalbare en betrouwbare cloudinfrastructuur.",

        why_asem:
            "Waarom ASEM",

        secure:
            "Beveiliging op bedrijfsniveau",

        modern_tech:
            "Moderne technologieën",

        full_solutions:
            "Complete digitale oplossingen",

        trusted_world:
            "Wereldwijd digitaal platform",

        trusted_desc:
            "ASEM bouwt aan een wereldwijd digitaal ecosysteem dat mensen, bedrijven, diensten, toerisme en technologie verbindt."
    }
};


function detectLanguage() {

    const language =
        navigator.language || "en";

    const normalized =
        language.toLowerCase();

    const supported = [
        "ar",
        "en",
        "fr",
        "de",
        "it",
        "es",
        "nl"
    ];

    const detected =
        supported.find(
            code =>
                normalized === code ||
                normalized.startsWith(
                    `${code}-`
                )
        );

    return detected || "en";
}


function applyTranslations(language) {

    const dictionary =
        I18N[language] || I18N.en;

    $$("[data-i18n]").forEach(
        element => {

            const key =
                element.dataset.i18n;

            if (
                Object.prototype.hasOwnProperty.call(
                    dictionary,
                    key
                )
            ) {
                element.textContent =
                    dictionary[key];
            }
        }
    );
}


function applyLanguage(language) {

    const selected =
        language === "auto"
            ? detectLanguage()
            : (
                I18N[language]
                    ? language
                    : "en"
            );

    document.documentElement
        .setAttribute(
            "lang",
            selected
        );

    document.documentElement
        .setAttribute(
            "dir",
            selected === "ar"
                ? "rtl"
                : "ltr"
        );

    applyTranslations(
        selected
    );

    try {

        localStorage.setItem(
            ASEM.storage.language,
            language || selected
        );

    } catch (error) {}

    document.dispatchEvent(
        new CustomEvent(
            "asem:languagechange",
            {
                detail: {
                    language: selected
                }
            }
        )
    );

    return selected;
}


function initializeLanguage() {

    const selector =
        $(ASEM.selectors.language);

    let saved = "auto";

    try {

        saved =
            localStorage.getItem(
                ASEM.storage.language
            ) || "auto";

    } catch (error) {}

    if (selector) {

        const exists =
            Array.from(
                selector.options
            ).some(
                option =>
                    option.value === saved
            );

        if (exists) {
            selector.value = saved;
        }

        applyLanguage(
            selector.value || "auto"
        );

    } else {

        applyLanguage(saved);
    }
}


/* ========================================================
   EVENTS
======================================================== */

function initializeThemeEvents() {

    const button =
        $(
            ASEM.selectors.theme
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        toggleTheme
    );
}


function initializeLanguageEvents() {

    const selector =
        $(
            ASEM.selectors.language
        );

    if (!selector) {
        return;
    }

    selector.addEventListener(
        "change",
        event => {

            applyLanguage(
                event.target.value
            );
        }
    );
}


function initializeSearch() {

    const input =
        $(
            ASEM.selectors.search
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        event => {

            search(
                event.target.value
            );
        }
    );

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                input.value = "";

                search("");

                input.blur();
            }
        }
    );
}


function initializeScrollTop() {

    const button =
        $(
            ASEM.selectors.scrollTop
        );

    if (!button) {
        return;
    }

    const update =
        () => {

            const visible =
                window.scrollY > 400;

            button.classList.toggle(
                "visible",
                visible
            );
        };

    window.addEventListener(
        "scroll",
        update,
        {
            passive: true
        }
    );

    update();

    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* ========================================================
   ACTION ROUTER
======================================================== */

function initializeActionRouter() {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;

            if (
                !target ||
                typeof target.closest !==
                    "function"
            ) {
                return;
            }

            const element =
                target.closest(
                    "[data-platform-action], [data-gps]"
                );

            if (!element) {
                return;
            }

            event.preventDefault();

            let action =
                element.dataset.platformAction;

            if (
                !action &&
                element.matches("[data-gps]")
            ) {
                action = "gps";
            }

            if (!action) {
                return;
            }

            /*
             * Normalize action names so small differences
             * in the HTML do not break the buttons.
             */
            action =
                String(action)
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[\s_-]+/g,
                        ""
                    );

            const handler =
                actions[action];

            if (
                typeof handler !==
                "function"
            ) {

                console.warn(
                    `ASEM: unknown action ${action}`
                );

                return;
            }

            try {

                const result =
                    handler();

                if (
                    result &&
                    typeof result.then ===
                    "function"
                ) {

                    result.catch(
                        error => {

                            console.error(
                                "ASEM action:",
                                error
                            );
                        }
                    );
                }

            } catch (error) {

                console.error(
                    `ASEM action "${action}" failed:`,
                    error
                );
            }
        }
    );
}


/* ========================================================
   KEYBOARD
======================================================== */

function initializeKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            const active =
                document.activeElement;

            const isInput =
                active &&
                (
                    active.tagName ===
                        "INPUT" ||
                    active.tagName ===
                        "TEXTAREA" ||
                    active.tagName ===
                        "SELECT" ||
                    active.isContentEditable
                );

            if (
                event.key === "/" &&
                !isInput
            ) {

                event.preventDefault();

                focusSearch();

                return;
            }

            if (
                event.key ===
                "Escape"
            ) {

                const input =
                    DOM.search;

                if (input) {
                    input.blur();
                }

                return;
            }

            if (
                event.key !==
                    "Enter" &&
                event.key !==
                    " "
            ) {
                return;
            }

            const target =
                event.target;

            if (
                !target ||
                typeof target.closest !==
                    "function"
            ) {
                return;
            }

            const element =
                target.closest(
                    "[data-platform-action]"
                );

            if (!element) {
                return;
            }

            if (
                isInput &&
                target !== element
            ) {
                return;
            }

            let action =
                element.dataset
                    .platformAction;

            if (!action) {
                return;
            }

            action =
                String(action)
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[\s_-]+/g,
                        ""
                    );

            const handler =
                actions[action];

            if (
                typeof handler !==
                "function"
            ) {
                return;
            }

            event.preventDefault();

            try {

                const result =
                    handler();

                if (
                    result &&
                    typeof result.then ===
                    "function"
                ) {

                    result.catch(
                        error => {

                            console.error(
                                "ASEM keyboard action:",
                                error
                            );
                        }
                    );
                }

            } catch (error) {

                console.error(
                    "ASEM keyboard action:",
                    error
                );
            }
        }
    );
}


/* ========================================================
   ANCHOR NAVIGATION
======================================================== */

function initializeNavigation() {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target;

            if (
                !target ||
                typeof target.closest !==
                    "function"
            ) {
                return;
            }

            const link =
                target.closest(
                    'a[href^="#"]'
                );

            if (!link) {
                return;
            }

            const href =
                link.getAttribute(
                    "href"
                );

            if (!href) {
                return;
            }

            const id =
                href.substring(1);

            if (!id) {
                return;
            }

            const section =
                document.getElementById(
                    id
                );

            if (!section) {
                return;
            }

            event.preventDefault();

            openPageSection(id);
        }
    );
}


/* ========================================================
   COPY ACTIONS
======================================================== */

function initializeCopyActions() {

    document.addEventListener(
        "click",
        async event => {

            const target =
                event.target;

            if (
                !target ||
                typeof target.closest !==
                    "function"
            ) {
                return;
            }

            const button =
                target.closest(
                    "[data-copy]"
                );

            if (!button) {
                return;
            }

            event.preventDefault();

            const value =
                button.dataset.copy ||
                "";

            if (!value) {
                return;
            }

            try {

                if (
                    navigator.clipboard &&
                    typeof navigator.clipboard
                        .writeText ===
                        "function"
                ) {

                    await navigator.clipboard
                        .writeText(value);

                } else {

                    window.prompt(
