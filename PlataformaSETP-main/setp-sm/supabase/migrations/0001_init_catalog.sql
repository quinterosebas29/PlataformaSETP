-- Migration 0001: Catálogo base (routes, stops, route_stops) + tabla de control de migrations

CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL       PRIMARY KEY,
  filename   VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id    VARCHAR(5)   PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  color VARCHAR(7)   NOT NULL
);

CREATE TABLE IF NOT EXISTS stops (
  id        VARCHAR(10)   PRIMARY KEY,
  name      VARCHAR(150)  NOT NULL,
  latitude  DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL
);

CREATE TABLE IF NOT EXISTS route_stops (
  route_id   VARCHAR(5)  REFERENCES routes(id) ON DELETE CASCADE,
  stop_id    VARCHAR(10) REFERENCES stops(id) ON DELETE CASCADE,
  stop_order INTEGER     NOT NULL,
  PRIMARY KEY (route_id, stop_id)
);

CREATE INDEX IF NOT EXISTS idx_route_stops_order ON route_stops(route_id, stop_order);
