async function initializeASEM() {
    try {
        console.log("ASEM Digital Solutions initializing...");

        testLocalStorage();
        initializeErrorHandling();
        initializeTheme();
        initializeLanguage();

        const data = await loadPlatformData();

        ASEM.data.tourism = data.tourism;
        ASEM.data.businesses = data.businesses;
        ASEM.data.products = data.products;
        ASEM.data.projects = data.projects;
        ASEM.data.portfolio = data.portfolio;

        renderAllCollections();

        initializePlatformCards();
        initializeSearch();
        initializeScrollTop();
        initializeHashNavigation();
        initializeProjectActions();
        initializeAccessibility();
        secureExternalLinks();
        initializeConnectionStatus();
        initializeLazyBehavior();
        initializeKeyboardShortcuts();
        initializeVisibilityHandling();

        updateFooterYear();
        handleInitialHash();

        console.log("ASEM Digital Solutions initialized successfully.");

    } catch (error) {
        console.error("ASEM initialization failed:", error);
    }
}
