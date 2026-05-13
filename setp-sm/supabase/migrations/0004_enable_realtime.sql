-- Migration 0004: Habilitar Supabase Realtime para la tabla buses
-- Cualquier cliente suscrito recibirá los cambios automáticamente.

ALTER PUBLICATION supabase_realtime ADD TABLE buses;
