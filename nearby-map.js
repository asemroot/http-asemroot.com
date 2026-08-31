"use strict";

(() => {
  const mount = document.querySelector("#nearby-map");
  if (!mount) return;

  // طبقة لغات عالمية بسيطة
  const messages = {
    ar: {
      locate: "📍 تحديد موقعي",
      allowLocation: "اسمح بالوصول إلى الموقع لعرض موقعك على الخريطة.",
      locating: "جاري تحديد موقعك...",
      noGeo: "المتصفح لا يدعم تحديد الموقع.",
      denied: "لم يتم السماح بالوصول إلى الموقع.",
      located: (lat, lon) => `تم تحديد موقعك: ${lat}, ${lon}`,
      mapError: "تعذر تحميل الخريطة.",
      nearbyError: "تم تحديد الموقع، لكن تعذر تحميل النتائج القريبة.",
      emptyResults: "سيتم عرض الأماكن القريبة هنا بعد تفعيل البحث الجغرافي في الخادم.",
      userLocation: "موقعك الحالي"
    },
    en: {
      locate: "📍 Locate me",
      allowLocation: "Allow location access to show your position on the map.",
      locating: "Locating your position...",
      noGeo: "Your browser does not support geolocation.",
      denied: "Location access was not granted.",
      located: (lat, lon) => `Your location: ${lat}, ${lon}`,
      mapError: "Failed to load the map.",
      nearbyError: "Location detected, but nearby results could not be loaded.",
      emptyResults: "Nearby places will appear here once geospatial search is enabled on the server.",
      userLocation: "Your current location"
    },
    fr: {
      locate: "📍 Me localiser",
      allowLocation: "Autorisez l’accès à la localisation pour afficher votre position sur la carte.",
      locating: "Localisation en cours...",
      noGeo: "Votre navigateur ne supporte pas la géolocalisation.",
      denied: "L’accès à la localisation n’a pas été autorisé.",
      located: (lat, lon) => `Votre position : ${lat}, ${lon}`,
      mapError: "Impossible de charger la carte.",
      nearbyError: "Position détectée, mais les résultats à proximité n’ont pas pu être chargés.",
      emptyResults: "Les lieux à proximité s’afficheront ici une fois la recherche géospatiale activée sur le serveur.",
      userLocation: "Votre position actuelle"
    }
  };

  const userLangRaw = navigator.language || navigator.userLanguage || "en";
  const userLang = userLangRaw.split("-")[0].toLowerCase();
  const t = messages[userLang] || messages.en;

  mount.innerHTML = `
    <div class="nearby-map-toolbar">
      <button id="nearbyLocate" class="btn" type="button">${t.locate}</button>
      <span id="nearbyMapStatus" role="status" aria-live="polite">${t.allowLocation}</span>
    </div>
    <div id="nearbyMapCanvas" class="nearby-map-canvas" aria-label="Interactive nearby map"></div>
    <div id="nearbyResults" class="nearby-results" aria-live="polite"></div>
  `;

  const locateButton = document.querySelector("#nearbyLocate");
  const status = document.querySelector("#nearbyMapStatus");
  const results = document.querySelector("#nearbyResults");
  let map;
  let userMarker;
  let userCoords = null;

  function sanitize(text) {
    return String(text || "")
      .replace(/[&<>\"']/g, "")
      .trim();
  }

  function loadLeaflet() {
    return new Promise((resolve, reject) => {
      if (window.L) return resolve();
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Map library could not be loaded"));
      document.head.appendChild(script);
    });
  }

  async function createMap(latitude = 30.0444, longitude = 31.2357) {
    await loadLeaflet();
    if (!map) {
      map = L.map("nearbyMapCanvas").setView([latitude, longitude], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);
    } else {
      map.setView([latitude, longitude], 14);
    }

    if (userMarker) userMarker.remove();
    userMarker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(t.userLocation)
      .openPopup();

    setTimeout(() => map.invalidateSize(), 100);
  }

  function renderNearby(items) {
    if (!Array.isArray(items) || !items.length) {
      results.innerHTML = `<p>${t.emptyResults}</p>`;
      return;
    }

    results.innerHTML = items
      .map(item => {
        const name = sanitize(item.name || item.title || "Nearby result");
        const category = sanitize(item.type || item.category || "");
        const country = sanitize(item.country || item.countryCode || "");
        const city = sanitize(item.city || item.town || item.village || "");
        const distance = typeof item.distance === "number"
          ? `${item.distance.toFixed(2)} km`
          : "";

        return `
          <article class="nearby-result">
            <strong>${name}</strong>
            <span>${category}</span>
            ${city || country ? `<span>${city}${city && country ? ", " : ""}${country}</span>` : ""}
            ${distance ? `<span>${distance}</span>` : ""}
          </article>
        `;
      })
      .join("");
  }

  async function fetchNearby(latitude, longitude) {
    const payload = {
      latitude,
      longitude,
      radiusMeters: 5000,          // نصف قطر عالمي افتراضي 5 كم
      language: userLang,          // لغة المستخدم
      includeTypes: ["hospital", "pharmacy", "restaurant", "store", "service", "company"],
      includeIndividuals: true,    // أفراد يقدمون خدمات
      includeBusinesses: true      // شركات
    };

    const response = await fetch("/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Location request failed: ${response.status}`);
    }

    const data = await response.json();
    const items = data.nearby || data.results || data.items || [];
    renderNearby(items);
  }

  async function locate() {
    if (!navigator.geolocation) {
      status.textContent = t.noGeo;
      return;
    }

    locateButton.disabled = true;
    status.textContent = t.locating;

    navigator.geolocation.getCurrentPosition(
      async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        userCoords = { latitude, longitude };

        try {
          await createMap(latitude, longitude);
          await fetchNearby(latitude, longitude);
          status.textContent = t.located(latitude.toFixed(4), longitude.toFixed(4));
        } catch (error) {
          console.error("Global nearby map error:", error);
          status.textContent = t.nearbyError;
        } finally {
          locateButton.disabled = false;
        }
      },
      () => {
        status.textContent = t.denied;
        locateButton.disabled = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  locateButton.addEventListener("click", locate);

  createMap()
    .catch(error => {
      console.error(error);
      status.textContent = t.mapError;
    });
})();
