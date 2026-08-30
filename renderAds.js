function renderAds(ads, placement) {
    const containers = $$(`[data-ad-placement="${placement}"]`);

    if (!containers.length) {
        return;
    }

    const matchingAds = ads.filter(ad => ad.placement === placement);

    containers.forEach(container => {
        container.innerHTML = "";

        matchingAds.forEach(ad => {
            const element = document.createElement("article");
            element.className = "advertisement";

            element.innerHTML = `
                <span class="ad-label">Advertisement</span>

                ${
                    ad.image
                        ? `
                            <img
                                src="${escapeHTML(ad.image)}"
                                alt="${escapeHTML(ad.title)}"
                                loading="lazy"
                            >
                        `
                        : ""
                }

                <h3>${escapeHTML(ad.title)}</h3>

                <p>${escapeHTML(ad.description)}</p>

                <a href="${escapeHTML(ad.url)}" class="btn">
                    Learn More
                </a>
            `;

            container.appendChild(element);
        });
    });
}
