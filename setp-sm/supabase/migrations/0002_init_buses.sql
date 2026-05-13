-- Migration 0002: Tabla buses

CREATE TABLE IF NOT EXISTS buses (
  id                       VARCHAR(10)   PRIMARY KEY,
  route_id                 VARCHAR(5)    NOT NULL REFERENCES routes(id),
  current_stop_index       INTEGER       NOT NULL DEFAULT 0,
  eta_to_next_stop_seconds INTEGER       NOT NULL DEFAULT 300 CHECK (eta_to_next_stop_seconds >= 0),
  status                   VARCHAR(20)   NOT NULL DEFAULT 'en_ruta'
                           CHECK (status IN ('en_ruta', 'demorado', 'fuera_de_servicio')),
  -- Coordenadas calculadas (interpoladas) — actualizadas por el cron
  current_lat              DECIMAL(10,7),
  current_lng              DECIMAL(10,7),
  updated_at               TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buses_route ON buses(route_id, status);
