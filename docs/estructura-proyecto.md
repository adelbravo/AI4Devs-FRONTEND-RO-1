# Estructura del Proyecto LTI

## Arquitectura General

El proyecto LTI está organizado como una aplicación **full-stack** con separación clara entre **frontend** y **backend**, siguiendo principios de arquitectura limpia y Domain-Driven Design.

```
AI4Devs-FRONTEND-RO-1/
├── backend/                    # Aplicación servidor (API REST)
├── frontend/                   # Aplicación cliente (React SPA)
├── docs/                      # Documentación del proyecto
├── docker-compose.yml         # Configuración de servicios
├── package.json              # Configuración raíz del workspace
└── README.md                 # Documentación principal
```

## Backend - Estructura Detallada

### Organización por Capas (DDD)

```
backend/
├── src/                           # Código fuente principal
│   ├── application/               # Capa de Aplicación
│   │   ├── services/              # Servicios de aplicación
│   │   │   ├── candidateService.ts
│   │   │   ├── candidateService.test.ts
│   │   │   ├── positionService.ts
│   │   │   ├── positionService.test.ts
│   │   │   └── fileUploadService.ts
│   │   └── validator.ts           # Validadores de entrada
│   │
│   ├── domain/                    # Capa de Dominio
│   │   └── models/                # Modelos de dominio (Entidades)
│   │       ├── Application.ts     # Solicitudes de candidatos
│   │       ├── Candidate.ts       # Información de candidatos
│   │       ├── Company.ts         # Empresas
│   │       ├── Education.ts       # Educación de candidatos
│   │       ├── Employee.ts        # Empleados de empresas
│   │       ├── Interview.ts       # Entrevistas realizadas
│   │       ├── InterviewFlow.ts   # Flujos de entrevista
│   │       ├── InterviewStep.ts   # Pasos de entrevista
│   │       ├── InterviewType.ts   # Tipos de entrevista
│   │       ├── Position.ts        # Posiciones laborales
│   │       ├── Resume.ts          # CVs de candidatos
│   │       └── WorkExperience.ts  # Experiencia laboral
│   │
│   ├── presentation/              # Capa de Presentación
│   │   └── controllers/           # Controladores REST
│   │       ├── candidateController.ts
│   │       ├── candidateController.test.ts
│   │       ├── positionController.ts
│   │       └── positionController.test.ts
│   │
│   ├── routes/                    # Definición de rutas API
│   │   ├── candidateRoutes.ts
│   │   └── positionRoutes.ts
│   │
│   ├── prompts/                   # Documentación de desarrollo
│   │   └── CreateNewRoute.md
│   │
│   └── index.ts                   # Punto de entrada de la aplicación
│
├── prisma/                        # ORM y Base de Datos
│   ├── migrations/                # Migraciones de BD
│   │   ├── 20240528082702_/
│   │   ├── 20240528085016_/
│   │   ├── 20240528110522_/
│   │   ├── 20240528140846_/
│   │   └── migration_lock.toml
│   ├── schema.prisma             # Esquema de base de datos
│   └── seed.ts                   # Datos iniciales de desarrollo
│
├── api-spec.yaml                 # Especificación OpenAPI 3.0
├── ModeloDatos.md                # Documentación del modelo de datos
├── ManifestoBuenasPracticas.md   # Guía de arquitectura y patrones
├── package.json                  # Dependencias y scripts del backend
├── tsconfig.json                # Configuración de TypeScript
└── jest.config.js               # Configuración de testing
```

### Explicación de Capas

#### 1. **Capa de Dominio** (`domain/`)
- **Propósito**: Contiene la lógica de negocio pura
- **Responsabilidades**:
  - Definir entidades del dominio
  - Implementar reglas de negocio
  - Mantener la integridad de los datos
- **Independencias**: No depende de frameworks externos

#### 2. **Capa de Aplicación** (`application/`)
- **Propósito**: Orquesta las operaciones de dominio
- **Responsabilidades**:
  - Casos de uso específicos
  - Validación de entrada
  - Coordinación entre entidades
- **Dependencias**: Solo del dominio

#### 3. **Capa de Presentación** (`presentation/`)
- **Propósito**: Interfaz con el mundo exterior
- **Responsabilidades**:
  - Controladores REST
  - Formateo de respuestas
  - Manejo de errores HTTP
- **Dependencias**: Aplicación y frameworks web

#### 4. **Capa de Infraestructura** (`prisma/`)
- **Propósito**: Detalles técnicos de persistencia
- **Responsabilidades**:
  - Acceso a base de datos
  - Migraciones
  - Configuración de ORM

## Frontend - Estructura Detallada

```
frontend/
├── public/                        # Archivos estáticos
│   ├── favicon.ico
│   ├── index.html                # Template HTML principal
│   ├── logo192.png
│   ├── manifest.json             # PWA manifest
│   └── robots.txt
│
├── src/                          # Código fuente React
│   ├── components/               # Componentes reutilizables
│   │   ├── AddCandidateForm.js   # Formulario de agregar candidato
│   │   ├── FileUploader.js       # Componente de subida de archivos
│   │   ├── Positions.tsx         # Lista y gestión de posiciones
│   │   └── RecruiterDashboard.js # Dashboard principal del reclutador
│   │
│   ├── services/                 # Servicios de API
│   │   └── candidateService.js   # Cliente HTTP para candidatos
│   │
│   ├── assets/                   # Recursos estáticos
│   │   └── lti-logo.png         # Logo de la aplicación
│   │
│   ├── __tests__/               # Tests de componentes
│   │
│   ├── App.tsx                  # Componente raíz de la aplicación
│   ├── App.css                  # Estilos principales
│   ├── index.tsx                # Punto de entrada React
│   ├── index.css                # Estilos globales
│   ├── logo.svg                 # Logo SVG
│   ├── react-app-env.d.ts       # Tipos de TypeScript para React
│   └── reportWebVitals.ts       # Métricas de rendimiento
│
├── package.json                  # Dependencias y scripts del frontend
├── tsconfig.json                # Configuración TypeScript
└── README.md                    # Documentación específica del frontend
```

### Organización de Componentes

#### **Estrategia de Componentes**
- **Componentes de Presentación**: UI pura sin lógica de negocio
- **Componentes Contenedores**: Manejan estado y lógica de aplicación
- **Servicios**: Abstraen comunicación con API

#### **Patrones Utilizados**
- **Composición sobre Herencia**: Reutilización mediante composición
- **Props Drilling**: Paso de datos a través de props (pequeña escala)
- **Estado Local**: Manejo de estado con React hooks

## Archivos de Configuración

### Root Level

```
├── docker-compose.yml            # Orquestación de servicios
│   └── PostgreSQL Database       # Base de datos en contenedor
│   └── Variables de entorno      # Configuración de BD
│
├── package.json                  # Workspace configuration
│   └── Scripts de desarrollo     # Comandos útiles para el desarrollo
│   └── Dependencias compartidas  # dotenv para variables de entorno
│
├── LICENSE.md                    # Licencia del proyecto
├── VERSION                       # Control de versiones
└── README.md                     # Documentación principal
```

### Configuraciones Backend

- **`tsconfig.json`**: Configuración de TypeScript para Node.js
- **`jest.config.js`**: Configuración de testing con Jest
- **`api-spec.yaml`**: Especificación OpenAPI para documentación de API

### Configuraciones Frontend

- **`tsconfig.json`**: Configuración de TypeScript para React
- **`package.json`**: Create React App scripts y dependencias

## Flujo de Datos

### Arquitectura de Comunicación

```
Frontend (React)
    ↓ HTTP Requests
Backend API (Express)
    ↓ ORM Queries
Database (PostgreSQL)
```

### Principios de Organización

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Inversión de Dependencias**: Las capas superiores no conocen detalles de implementación
3. **Modularidad**: Código organizado en módulos cohesivos y loosely coupled
4. **Testabilidad**: Estructura que facilita testing unitario e integración

## Convenciones de Nomenclatura

### Backend
- **Archivos**: camelCase para servicios, PascalCase para modelos
- **Clases**: PascalCase
- **Métodos**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### Frontend
- **Componentes**: PascalCase (ej: `AddCandidateForm.js`)
- **Archivos de servicio**: camelCase (ej: `candidateService.js`)
- **Hooks personalizados**: `use` + PascalCase

## Escalabilidad de la Estructura

### Crecimiento Vertical (Más Funcionalidades)
- Nuevos modelos en `domain/models/`
- Nuevos servicios en `application/services/`
- Nuevos controladores en `presentation/controllers/`
- Nuevas rutas en `routes/`

### Crecimiento Horizontal (Más Complejidad)
- Subdirectorios por módulo de negocio
- Separación de concerns por bounded contexts
- Posible migración a microservicios

---

*Esta estructura garantiza mantenibilidad, escalabilidad y facilita la incorporación de nuevos desarrolladores al proyecto.* 