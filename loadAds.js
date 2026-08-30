async function loadAds() {
    try {
        const ads = await loadJSON("./ads/ads.json");
        return ads.filter(ad => ad.active);
    } catch (error) {
        console.error("Unable to load advertisements:", error);
        return [];
    }
}
