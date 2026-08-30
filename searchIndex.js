function searchData(query) {
    const normalized = String(query || "").trim().toLowerCase();

    if (normalized.length < ASEM_CONFIG.searchMinCharacters) {
        return [];
    }

    return state.searchIndex.filter(item => {
        const searchable = [
            item.title,
            item.description,
            item.category,
            item.country,
            item.city,
            item.type
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchable.includes(normalized);
    });
}
