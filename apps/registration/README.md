# 🎯 Módulo de Registro - Documentación Completa

## Visión General

El módulo de **Registro** es un sistema de gestión de clientes y solicitudes **tenant-aware** que se integra con Supabase para persistencia segura de datos.

### Características Principales

✅ **Tenant-aware**: Cada tenant tiene sus propios registros aislados  
✅ **Validación fuerte**: Esquemas Zod para validación en tiempo de compilación y runtime  
✅ **Reglas de negocio**: Documento único por tenant, documento inmutable, motivos obligatorios  
✅ **TypeScript puro**: Sin tipos `any`, completamente tipado  
✅ **Supabase Integration**: Almacenamiento seguro en PostgreSQL  
✅ **Manejo de errores robusto**: Mensajes de error descriptivos

---

## 🏗️ Arquitectura

```
apps/registration/
├── src/
│   ├── components/shared/
│   │   ├── RegistrationForm.tsx       # Formulario de entrada con validación
│   │   ├── RegistrationList.tsx       # Tabla de listado de registros
│   │   └── RegistrationForm.tsx       # Formulario compartido
│   ├── pages/
│   │   └── RegistrationPage.tsx       # Página principal del módulo
│   ├── services/
│   │   └── registrationService.ts     # Lógica de negocio + BD
│   ├── schemas/
│   │   └── registrationSchema.ts      # Validaciones Zod
│   ├── store/
│   │   └── registrationStore.ts       # Estado global (Zustand)
│   ├── types/
│   │   └── registration.types.ts      # Tipos TypeScript
```

---

## 📋 Tipos Principales

### `RegistrationRecord`

Representa un registro persistido en la base de datos:

```typescript
interface RegistrationRecord {
  id: string;
  tenant_id: string;
  documento: string;
  tipo_documento: "CC" | "NIT" | "CE" | "PA";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa_nombre?: string;
  empresa_documento?: string;
  estado: RegistrationStatus;
  motivo_rechazo?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
```

### Estados (`RegistrationStatus`)

- **borrador**: Registro no completado, editable y eliminable
- **pendiente_revision**: Enviado para revisión
- **rechazado**: Denegado (requiere motivo)
- **aprobado**: Aceptado
- **archivado**: Inactivo (requiere motivo)

---

## 🔒 Reglas de Negocio

### 1. Unicidad de Documento por Tenant

Cada documento es único dentro de un tenant:

```typescript
// ❌ Esto fallará si el documento ya existe
await registrationService.createRegistration(tenantId, {
  documento: "1023456789", // Ya existe para este tenant
  ...
});
```

### 2. Documento Inmutable

Una vez creado, el documento no puede modificarse:

```typescript
// ❌ Esto lanzará error
await registrationService.updateRegistration(tenantId, recordId, {
  documento: "9876543210", // ¡Error! No se puede cambiar
  ...
});
```

### 3. Motivo Obligatorio para Estados Restringidos

Cambiar a `rechazado` o `archivado` requiere explicación:

```typescript
// ❌ Error - sin motivo
await registrationService.changeStatus(tenantId, recordId, "rechazado");

// ✅ Correcto
await registrationService.changeStatus(
  tenantId,
  recordId,
  "rechazado",
  "Documento inválido",
);
```

---

## 🛠️ API del Servicio

### `registrationService.createRegistration(tenantId, data, userId)`

Crear un nuevo registro:

```typescript
const newRecord = await registrationService.createRegistration(
  "tenant-123",
  {
    documento: "1023456789",
    tipo_documento: "CC",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    telefono: "+573001234567",
  },
  "user-001",
);
```

### `registrationService.listRegistrationsByTenant(tenantId, filters)`

Obtener registros con filtros opcionales:

```typescript
const { data, count } = await registrationService.listRegistrationsByTenant(
  "tenant-123",
  {
    estado: "borrador",
    limit: 10,
    offset: 0,
  },
);
```

### `registrationService.updateRegistration(tenantId, recordId, updates, userId)`

Actualizar un registro:

```typescript
const updated = await registrationService.updateRegistration(
  "tenant-123",
  "rec-001",
  {
    nombre: "Juan Carlos",
    email: "juancarlos@example.com",
  },
  "user-001",
);
```

### `registrationService.changeStatus(tenantId, recordId, newStatus, motivo, userId)`

Cambiar el estado:

```typescript
const updated = await registrationService.changeStatus(
  "tenant-123",
  "rec-001",
  "aprobado",
  undefined,
  "user-001",
);
```

### `registrationService.deleteRegistration(tenantId, recordId)`

Eliminar un registro (solo borrador):

```typescript
const deleted = await registrationService.deleteRegistration(
  "tenant-123",
  "rec-001",
);
```

---

## 🧪 Validación (Zod)

Las validaciones se definen en `registrationSchema.ts`:

```typescript
const formData = {
  documento: "1023456789",
  tipo_documento: "CC",
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@example.com",
  telefono: "+573001234567",
};

const { valid, errors } = validateRegistrationForm(formData);

if (!valid) {
  console.log(errors);
  // {
  //   email: "Email inválido",
  //   telefono: "Teléfono inválido"
  // }
}
```

---

## 🌐 Integración Supabase

### Configuración Inicial

1. **Variables de entorno** (`.env.local`):

```env
VITE_SUPABASE_URL=https://wszemokqxhavaytcfkfk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_K9icw77vHwYRqFa8FHb3Ng_JFFZegbV
```

2. **Cliente Supabase** (`src/utils/supabase.ts`):

```typescript
import { supabase } from "../utils/supabase";

// El cliente está listo para usar
const { data, error } = await supabase.from("registrations").select("*");
```

### Esquema Supabase Recomendado

```sql
-- Tabla de registros
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL,

  -- Datos personales
  documento TEXT NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('CC', 'NIT', 'CE', 'PA')),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,

  -- Datos empresa
  empresa_nombre TEXT,
  empresa_documento TEXT,

  -- Estado
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'pendiente_revision', 'rechazado', 'aprobado', 'archivado')),
  motivo_rechazo TEXT,
  observaciones TEXT,

  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,

  -- Índices
  UNIQUE(tenant_id, documento),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_estado (estado),
  INDEX idx_created_at (created_at)
);

-- RLS: Permitir acceso solo al tenant y rol correcto
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver registros de su tenant"
  ON registrations FOR SELECT
  USING (auth.jwt() ->> 'tenant_id' = tenant_id);
```

---

## 🎯 Resolutión de Configuración por Tenant

El servicio detecta automáticamente dónde persistir datos:

```typescript
const config = registrationService.resolveFormConfig("client-empresa-123");
// Para tenants client-*:
// {
//   origin: "tenant-isolated-db",
//   schema: "tenant_client_empresa_123",
//   tableName: "registrations"
// }

const config = registrationService.resolveFormConfig("zenith-main");
// Para otros tenants:
// {
//   origin: "zenith-main-db",
//   schema: "public",
//   tableName: "registrations"
// }
```

---

## 🚀 Uso en Componentes React

### Página Principal

```tsx
import RegistrationPage from "../pages/RegistrationPage";

export default function App() {
  return <RegistrationPage tenantId="tenant-123" userId="user-001" />;
}
```

### Componente de Formulario

```tsx
import RegistrationForm from "../components/shared/RegistrationForm";

function MyComponent() {
  const handleSubmit = async (data) => {
    await registrationService.createRegistration(tenantId, data, userId);
  };

  return <RegistrationForm onSubmit={handleSubmit} mode="create" />;
}
```

---

## 📦 Estado Global (Zustand)

El store centraliza el estado de la aplicación:

```typescript
import { useRegistrationStore } from "../store/registrationStore";

function MyComponent() {
  const {
    records,
    isLoading,
    error,
    showForm,
    formMode,
    setShowForm,
    setFormMode,
  } = useRegistrationStore();

  return (
    <div>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {records.map(record => <div key={record.id}>{record.nombre}</div>)}
    </div>
  );
}
```

---

## ❌ Manejo de Errores

El servicio proporciona mensajes descriptivos:

```typescript
try {
  await registrationService.createRegistration(tenantId, data, userId);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // "El documento 1023456789 ya está registrado en este tenant"
    // "Error checking document uniqueness: ..."
  }
}
```

---

## 🔧 Configuración TypeScript

El proyecto usa TypeScript stricto sin tipos `any`:

```typescript
// ✅ Bueno
interface Props {
  data: RegistrationRecord;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}

// ❌ Evitar
interface Props {
  data: any; // ¡NUNCA!
}
```

---

## 📚 Próximos Pasos

1. **Migración BD**: Ejecutar script SQL para crear tabla en Supabase
2. **RLS Policies**: Configurar Row Level Security en Supabase
3. **Tests**: Agregar tests unitarios para servicios
4. **UI Mejora**: Pulir componentes con Tailwind avanzado
5. **Reportes**: Agregar estadísticas y análisis de registros

---

## 🤝 Convenciones

- **Nombres**: camelCase en código TS, snake_case en BD
- **Errores**: Siempre lanzar Error con mensaje descriptivo
- **Validación**: Usar Zod para todo input externo
- **Async/Await**: Preferir async/await sobre promises
- **Tipado**: Siempre definir tipos explícitos

---

## 📞 Soporte

Para preguntas o problemas, revisa:

- `/memories/repo/registration-bootstrap.md`
- Supabase docs: https://supabase.com/docs
- TypeScript docs: https://www.typescriptlang.org/docs
