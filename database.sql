=========================
-- Places
-- =========================

CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    city_id UUID NOT NULL,

    type VARCHAR(100),

    names JSONB NOT NULL,

    description JSONB,

    location JSONB,

    images JSONB,

    opening_hours JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_place_city
    FOREIGN KEY(city_id)
    REFERENCES cities(id)
);


-- =========================
-- Tourism
-- =========================

CREATE TABLE tourism (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    place_id UUID,

    category VARCHAR(100),

    names JSONB NOT NULL,

    description JSONB,

    activities JSONB,

    season JSONB,

    price_info JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tourism_place
    FOREIGN KEY(place_id)
    REFERENCES places(id)
);


-- =========================
-- Products
-- =========================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    business_id UUID,

    country_id UUID,

    category VARCHAR(100),

    names JSONB NOT NULL,

    description JSONB,

    images JSONB,

    price_info JSONB,

    origin JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_business
    FOREIGN KEY(business_id)
    REFERENCES businesses(id),

    CONSTRAINT fk_product_country
    FOREIGN KEY(country_id)
    REFERENCES countries(id)
);


-- =========================
-- Cultures
-- =========================

CREATE TABLE cultures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    country_id UUID,

    city_id UUID,

    category VARCHAR(100),

    names JSONB NOT NULL,

    description JSONB,

    media JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_culture_country
    FOREIGN KEY(country_id)
    REFERENCES countries(id),

    CONSTRAINT fk_culture_city
    FOREIGN KEY(city_id)
    REFERENCES cities(id)
);
