# American Dream English — Plataforma Educativa y Administrativa

Plataforma integral bilingüe de **American Dream English** desarrollada para la gestión académica de estudiantes de la región de Urabá y Medellín, panel directivo administrativo, portal de docentes titulares y portal de donaciones.

---

## 🏛️ Reglas Estrictas de Arquitectura (Anti-Regresión)

> [!IMPORTANT]
> **PROHIBICIÓN PERMANENTE DE MIDDLEWARE EDGE (`middleware.ts` / `src/middleware.ts`)**
> 
> En entornos serverless/edge como **Vercel**, el límite de cabeceras HTTP es de **16 KB**. La utilización de middleware de Supabase SSR para redirecciones automáticas y verificación de roles generaba bucles HTTP 307 y fragmentación de cookies de autenticación (`sb-*-auth-token.0`, `sb-*-auth-token.1`, etc.), provocando el error `494 REQUEST_HEADER_TOO_LARGE`.

### 1. Cero Middleware en Edge Runtime
- **NUNCA** volver a crear `middleware.ts` en la raíz ni `src/middleware.ts`. El proyecto opera y operará permanentemente **sin middleware**.
- Las rutas del layout en Next.js (`src/app/dashboard/*/layout.tsx`) son **pass-through shells** que entregan `{children}` sin interceptar ni mutar cabeceras en el servidor.

### 2. Control de Acceso y RBAC Exclusivo en Cliente
- La verificación de sesión, roles (`admin`, `teacher`, `student`) y la protección de vistas se realiza en el cliente (`'use client'`), en componentes dedicados y mediante `useEffect()` con el cliente oficial de Supabase (`createClient` de `@/utils/supabase/client`).
- Si un usuario no autenticado o con rol no autorizado accede a una vista restringida, la interfaz renderiza componentes de acceso controlado amigables o navega con `router.push()`, evitando rebotes 307 en cascada.

### 3. Consultas Directas con Supabase SDK
- Los componentes cliente realizan consultas directas al SDK de Supabase con `Promise.all` para resolución paralela limpia.
- No se deben realizar llamadas `fetch('/api/...')` relativas internas en componentes que reenvíen cookies innecesarias al servidor.

### 4. Caché y Service Worker
- Las rutas dinámicas (`/dashboard/*`, `/campus/*`, `/admin/*`, `/login/*`) cuentan con cabeceras `Cache-Control: no-store, no-cache, must-revalidate` en `next.config.mjs` y `vercel.json` para evitar que los Edge Proxies retengan cookies fragmentadas.
- El Service Worker (`public/sw.js`) ignora explícitamente cualquier petición a Supabase y rutas de autenticación.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Base de Datos & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Estilos**: Tailwind CSS & Lucide React
- **Despliegue**: Vercel
