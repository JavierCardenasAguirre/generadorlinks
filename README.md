# Links Platform (refactor funcional)

Proyecto web tipo Linktree con Next.js + Supabase.

## Funcionalidades implementadas

- Registro/login de usuarios con contraseña hasheada (`bcrypt`).
- El **primer usuario registrado** queda como `admin`.
- Aprobación/rechazo de usuarios por parte del administrador.
- URL pública única por usuario (`/{slug}`) con generación automática única.
- Gestión de enlaces por usuario (crear/eliminar/listar).
- Redirección rastreable de enlaces (`/r/{linkId}`) para contabilizar clicks.
- Estadísticas de clicks por usuario (total y por día en dashboard).
- Sistema de plantillas visuales (Aurora, Sunset, Minimal).
- Suscripción freemium:
  - 30 días de prueba gratis (`trial`)
  - Luego plan de `$3/mes` (`active`/`past_due`)
- Panel de administración para:
  - aprobar usuarios
  - activar suscripción mensual manualmente

## Problemas detectados y corregidos

1. **Autenticación insegura**: login anterior validaba contraseña fija (`admin123`) para cualquiera.
   - Corregido: validación real con `password_hash` + sesión persistente en DB (`user_sessions`).

2. **Sesión inválida por cookie hardcodeada** (`admin_token=valid`).
   - Corregido: token único por sesión, expiración y revocación al logout.

3. **Flujo admin y permisos incompleto**.
   - Corregido: APIs protegidas con `requireAdmin()` y aprobación de usuarios.

4. **Modelo de datos inconsistente** (`clientes`, `cliente_id`) vs usuarios reales.
   - Corregido: estandarizado a `usuarios`/`usuario_id` en flujos nuevos.

5. **Sin tracking real de clicks**.
   - Corregido: endpoint de redirección `/r/[linkId]` que guarda cada click en `click_stats`.

6. **Sin sistema freemium operativo**.
   - Corregido: creación automática de trial 30 días y activación mensual de plan de $3.

## Estructura principal

- `app/api/auth/*`: registro, login, logout
- `app/api/me`: carga de dashboard (perfil, enlaces, suscripción, estadísticas)
- `app/api/profile`: actualización de perfil y plantilla
- `app/api/links/*`: CRUD de enlaces por usuario
- `app/api/admin/*`: gestión de usuarios/aprobaciones/suscripciones por admin
- `app/[slug]/page.js`: perfil público
- `app/r/[linkId]/route.js`: redirección + tracking de click
- `components/dashboard/UserDashboard.js`: dashboard de usuario
- `components/admin/AdminPanel.js`: panel admin

## Requisitos

- Node.js 18+
- Cuenta/proyecto Supabase

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env.local` (puedes copiar `.env.example`):

```bash
cp .env.example .env.local
```

3. Completar variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (ej. `http://localhost:3000`)

4. Ejecutar el SQL de `supabase-schema.sql` en Supabase SQL Editor.

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm run start
```

## Flujo esperado

1. Usuario se registra en `/register`.
2. Si es el primero: queda admin y aprobado automáticamente.
3. Si no: queda pendiente de aprobación.
4. Admin entra a `/admin` y aprueba usuarios.
5. Usuario aprobado inicia sesión en `/login` y administra su página en `/dashboard`.
6. Comparte su URL pública `/{slug}`.
7. Clicks se contabilizan vía `/r/{linkId}`.

## Notas técnicas

- El backend usa `SUPABASE_SERVICE_ROLE_KEY` para operaciones seguras en servidor.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.
- Las rutas API ya tienen validación de sesión/roles para operaciones sensibles.
