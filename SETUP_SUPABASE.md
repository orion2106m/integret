# 🚀 Setup Supabase - Guía Paso a Paso

Esta guía te ayudará a configurar Supabase para el módulo de Registro.

---

## ✅ Requisitos Previos

- Proyecto Supabase existente: https://supabase.com/wszemokqxhavaytcfkfk
- Acceso a la consola de Supabase
- Credenciales ya configuradas en `.env.local`

---

## 🔧 Pasos de Configuración

### 1. Crear la Tabla en Supabase

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Selecciona "SQL Editor" en el menú lateral
3. Haz click en "+ New Query"
4. Copia todo el contenido de:
   ```
   apps/registration/migrations/001_create_registrations_table.sql
   ```
5. Pégalo en el editor SQL
6. Haz click en "Run" (o presiona Ctrl+Enter)

**Resultado esperado:**

```
Executing query...
✓ Success
```

---

### 2. Verificar la Tabla

En el mismo SQL Editor, ejecuta:

```sql
SELECT * FROM registrations LIMIT 1;
```

Deberías ver que la tabla está vacía pero existe.

---

### 3. Verificar RLS (Row Level Security)

En "Authentication" → "Policies", deberías ver:

- ✅ "Users can view own tenant registrations"
- ✅ "Authenticated users can insert registrations"
- ✅ "Users can update own tenant registrations"
- ✅ "Users can delete draft registrations"

Si falta alguna, ejecuta nuevamente el SQL.

---

### 4. Verificar Índices

En "SQL Editor", ejecuta:

```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'registrations';
```

Deberías ver:

```
idx_registrations_tenant_id
idx_registrations_estado
idx_registrations_created_at
idx_registrations_documento
idx_registrations_email
```

---

## 🧪 Prueba Rápida

### 1. Instala la app en modo desarrollo:

```bash
npm run dev
```

### 2. Navega a `/registration`

### 3. Intenta crear un registro con:

```
Documento: 1023456789
Tipo: CC
Nombre: Juan
Apellido: Prueba
Email: juan@test.com
Teléfono: +573001234567
```

### 4. Verifica en Supabase

Ve a "Table Editor" → "registrations" y deberías ver el registro que creaste.

---

## 🔐 Configurar RLS Correctamente (Avanzado)

Las policies actuales permiten acceso abierto. Para producción, personaliza:

```sql
-- Permitir solo lectura del tenant propio
CREATE OR REPLACE POLICY "Users can only view their tenant"
  ON registrations FOR SELECT
  USING (
    tenant_id = auth.jwt() ->> 'tenant_id'
  );

-- Permitir inserción solo en tenant propio
CREATE OR REPLACE POLICY "Users can insert in their tenant"
  ON registrations FOR INSERT
  WITH CHECK (
    tenant_id = auth.jwt() ->> 'tenant_id'
    AND auth.uid() IS NOT NULL
  );
```

---

## 🐛 Solución de Problemas

### Error: "relation 'registrations' does not exist"

- ✅ Ejecuta nuevamente el SQL de migración
- ✅ Verifica que ejecutaste sin errores

### Error: "permission denied"

- ✅ Verifica RLS policies
- ✅ Asegúrate de estar autenticado

### No aparecen registros en la tabla

- ✅ Verifica que `tenant_id` sea correcto
- ✅ Revisa los logs de la consola del navegador

---

## 📊 Queries Útiles para Testing

```sql
-- Ver todos los registros
SELECT id, tenant_id, nombre, estado FROM registrations;

-- Ver solo borradores
SELECT * FROM registrations WHERE estado = 'borrador';

-- Ver por tenant
SELECT * FROM registrations WHERE tenant_id = 'tenant-123';

-- Contar registros por estado
SELECT estado, COUNT(*) FROM registrations GROUP BY estado;

-- Eliminar todos los registros (¡CUIDADO!)
DELETE FROM registrations WHERE true;
```

---

## ✨ Funcionalidades Enabled

Después de completar el setup:

✅ Crear registros  
✅ Listar registros por tenant  
✅ Editar registros (sin cambiar documento)  
✅ Cambiar estado  
✅ Eliminar borradores  
✅ Validación automática  
✅ Auditoría (created_by, updated_by)

---

## 📚 Próximos Pasos

1. **Autenticación**: Integrar con auth de Supabase
2. **Tenant Management**: Crear endpoints para gestionar tenants
3. **Reportes**: Agregar dashboards de análisis
4. **Tests**: Escribir tests E2E
5. **Deployment**: Configurar en producción

---

## 🆘 Ayuda

Si algo no funciona:

1. Revisa los logs de Supabase: https://supabase.com/dashboard/project/wszemokqxhavaytcfkfk/logs
2. Verifica la consola del navegador (F12 → Console)
3. Ejecuta las queries SQL una por una para identificar el problema
4. Revisa `apps/registration/README.md` para más contexto
