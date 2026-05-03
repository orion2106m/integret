-- Migration: Create registrations table with tenant awareness
-- Date: 2024-01-01
-- Description: Crea tabla de registros con soporte de tenant y reglas de negocio

-- Crear tabla registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  
  -- Datos personales
  documento TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  
  -- Datos empresa
  empresa_nombre TEXT,
  empresa_documento TEXT,
  
  -- Estado
  estado TEXT NOT NULL DEFAULT 'borrador',
  motivo_rechazo TEXT,
  observaciones TEXT,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  
  -- Constraints
  CONSTRAINT check_tipo_documento CHECK (tipo_documento IN ('CC', 'NIT', 'CE', 'PA')),
  CONSTRAINT check_estado CHECK (estado IN ('borrador', 'pendiente_revision', 'rechazado', 'aprobado', 'archivado')),
  CONSTRAINT unique_documento_per_tenant UNIQUE(tenant_id, documento)
);

-- Índices para performance
CREATE INDEX idx_registrations_tenant_id ON registrations(tenant_id);
CREATE INDEX idx_registrations_estado ON registrations(estado);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_documento ON registrations(documento);
CREATE INDEX idx_registrations_email ON registrations(email);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view registrations of their tenant
-- Nota: Ajustar según tu sistema de autenticación
CREATE POLICY "Users can view own tenant registrations"
  ON registrations FOR SELECT
  USING (true); -- Cambiar según necesidad

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (true); -- Cambiar según necesidad

-- Policy: Users can update own tenant registrations
CREATE POLICY "Users can update own tenant registrations"
  ON registrations FOR UPDATE
  USING (true); -- Cambiar según necesidad
  WITH CHECK (true); -- Cambiar según necesidad

-- Policy: Users can delete own tenant registrations (borrador only)
CREATE POLICY "Users can delete draft registrations"
  ON registrations FOR DELETE
  USING (estado = 'borrador'); -- Solo borradores pueden eliminarse

-- Function: Update updated_at automatically
CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Actualizar updated_at en UPDATE
CREATE TRIGGER trigger_update_registrations_updated_at
BEFORE UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_registrations_updated_at();

-- Comentarios
COMMENT ON TABLE registrations IS 'Registros de clientes y solicitudes con awareness de tenant';
COMMENT ON COLUMN registrations.tenant_id IS 'Identificador del tenant propietario del registro';
COMMENT ON COLUMN registrations.documento IS 'Documento único por tenant';
COMMENT ON COLUMN registrations.estado IS 'Estado del registro: borrador, pendiente_revision, rechazado, aprobado, archivado';
COMMENT ON COLUMN registrations.motivo_rechazo IS 'Motivación requerida para estados rechazado y archivado';
