-- Migration 0003: Tabla favorites

CREATE TABLE IF NOT EXISTS favorites (
  id        UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR(64)  NOT NULL,
  route_id  VARCHAR(5)   NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  saved_at  TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE (device_id, route_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_device ON favorites(device_id);
