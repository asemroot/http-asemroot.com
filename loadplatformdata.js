async function loadPlatformData() {
    const [
        tourism,
        businesses,
        products,
        projects,
        portfolio
    ] = await Promise.all([
        loadJSON("./data/tourism.json"),
        loadJSON("./data/businesses.json"),
        loadJSON("./data/products.json"),
        loadJSON("./data/projects.json"),
        loadJSON("./data/portfolio.json")
    ]);

    return {
        tourism,
        businesses,
        products,
        projects,
        portfolio
    };
}
