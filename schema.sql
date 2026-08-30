-- ASEM Global Platform Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =========================
-- Countries
-- =========================

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    code VARCHAR(10) UNIQUE NOT NULL,

    continent VARCHAR(100),

    currency_code VARCHAR(10),

    timezone VARCHAR(100),

    names JSONB NOT NULL,

    official_languages JSONB,

    flag_url TEXT,

    description JSONB,

    data_source VARCHAR(100),

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- Cities
-- =========================

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    country_id UUID NOT NULL,

    names JSONB NOT NULL,

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    population BIGINT,

    description JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_city_country
    FOREIGN KEY(country_id)
    REFERENCES countries(id)
);


-- =========================
-- Businesses
-- =========================

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    city_id UUID,

    type VARCHAR(50),

    names JSONB NOT NULL,

    description JSONB,

    address JSONB,

    contact JSONB,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_business_city
    FOREIGN KEY(city_id)
    REFERENCES cities(id)
);
