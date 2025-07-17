# Tecnologías Utilizadas - Sistema LTI

## Stack Tecnológico General

El sistema LTI está construido utilizando un stack moderno de tecnologías JavaScript/TypeScript, con enfoque en escalabilidad, mantenibilidad y experiencia de desarrollador.

```
Frontend: React + TypeScript + Bootstrap
Backend: Node.js + Express + TypeScript
Base de Datos: PostgreSQL + Prisma ORM
Infraestructura: Docker + Docker Compose
```

## Frontend Technologies

### Core Framework & Language

#### **React 18.3.1**
- **Propósito**: Biblioteca para construcción de interfaces de usuario
- **Características**:
  - Componentes funcionales con hooks
  - Virtual DOM para rendimiento optimizado
  - Ecosistema maduro y amplia comunidad
- **Uso en el proyecto**: SPA (Single Page Application) para el dashboard de reclutamiento

#### **TypeScript 4.9.5**
- **Propósito**: Superset de JavaScript con tipado estático
- **Beneficios**:
  - Detección temprana de errores
  - Mejor experiencia de desarrollo con IntelliSense
  - Refactoring más seguro
- **Configuración**: Strict mode habilitado

### UI & Styling

#### **Bootstrap 5.3.3**
- **Propósito**: Framework CSS para diseño responsivo
- **Ventajas**:
  - Componentes pre-diseñados
  - Grid system responsivo
  - Consistencia visual

#### **React Bootstrap 2.10.2**
- **Propósito**: Componentes Bootstrap específicos para React
- **Beneficios**:
  - Integración nativa con React
  - Props tipadas con TypeScript
  - Mejor composición de componentes

#### **React Bootstrap Icons 1.11.4**
- **Propósito**: Biblioteca de iconos
- **Características**:
  - Más de 1,800 iconos SVG
  - Optimizados para web
  - Consistencia con el diseño Bootstrap

### Additional Libraries

#### **React Router DOM 6.23.1**
- **Propósito**: Navegación y enrutamiento en SPA
- **Características**:
  - Routing declarativo
  - Navigation guards
  - Lazy loading de rutas

#### **React DatePicker 6.9.0**
- **Propósito**: Selector de fechas interactivo
- **Uso**: Formularios de educación y experiencia laboral

### Development & Build Tools

#### **Create React App (react-scripts 5.0.1)**
- **Propósito**: Configuración de build y desarrollo
- **Incluye**:
  - Webpack para bundling
  - Babel para transpilación
  - ESLint para linting
  - Jest para testing

#### **Testing**
- **@testing-library/react 13.4.0**: Testing de componentes
- **@testing-library/jest-dom 5.17.0**: Matchers adicionales para Jest
- **@testing-library/user-event 13.5.0**: Simulación de interacciones

#### **Performance**
- **web-vitals 2.1.4**: Métricas de rendimiento web

## Backend Technologies

### Core Runtime & Framework

#### **Node.js**
- **Propósito**: Runtime de JavaScript del lado servidor
- **Versión**: Compatible con Node.js 16+
- **Ventajas**:
  - Ecosistema npm extenso
  - Rendimiento alto para I/O
  - Mismo lenguaje frontend/backend

#### **Express.js 4.19.2**
- **Propósito**: Framework web minimalista para Node.js
- **Características**:
  - Middleware system
  - Routing flexible
  - Integración sencilla con ORMs

#### **TypeScript 4.9.5**
- **Configuración**: Strict mode para máxima seguridad de tipos
- **Beneficios adicionales en backend**:
  - Better API documentation
  - Reduced runtime errors
  - Enhanced IDE support

### Database & ORM

#### **PostgreSQL**
- **Versión**: 15+
- **Propósito**: Base de datos relacional principal
- **Características**:
  - ACID compliance
  - JSON support para datos semi-estructurados
  - Rendimiento escalable
  - Extensible con funciones personalizadas

#### **Prisma ORM 5.13.0**
- **Propósito**: ORM moderno para TypeScript/JavaScript
- **Ventajas**:
  - Type-safe database access
  - Automatic migrations
  - Powerful query builder
  - Database introspection
- **Componentes**:
  - **Prisma Client**: Generated type-safe client
  - **Prisma Migrate**: Database migration tool
  - **Prisma Studio**: Database browser GUI

### API & Documentation

#### **CORS 2.8.5**
- **Propósito**: Cross-Origin Resource Sharing
- **Uso**: Habilitar requests desde el frontend

#### **Swagger/OpenAPI**
- **swagger-jsdoc 6.2.8**: Generación de specs desde comentarios
- **swagger-ui-express 5.0.0**: UI interactiva para la API
- **Archivo**: `api-spec.yaml` con especificación completa

### File Handling

#### **Multer 1.4.5-lts.1**
- **Propósito**: Middleware para upload de archivos
- **Uso**: Subida de CVs en formato PDF y DOCX
- **Configuración**: Validación de tipos de archivo y tamaño

### Development Tools

#### **Build & Compilation**
- **tsc (TypeScript Compiler)**: Transpilación TypeScript → JavaScript
- **ts-node 9.1.1**: Ejecución directa de TypeScript en desarrollo
- **ts-node-dev 1.1.6**: Auto-restart en desarrollo

#### **Testing Framework**
- **Jest 29.7.0**: Framework de testing
- **ts-jest 29.1.2**: TypeScript preprocessor para Jest
- **@types/jest 29.5.12**: Tipados para Jest

#### **Code Quality**
- **ESLint 9.2.0**: Linting de código
- **Prettier 3.2.5**: Formateo de código
- **eslint-config-prettier 9.1.0**: Integración ESLint + Prettier

### Environment & Configuration

#### **dotenv 16.4.5**
- **Propósito**: Gestión de variables de entorno
- **Uso**: Configuración de BD, secrets, y configuraciones por entorno

## Infrastructure & DevOps

### Containerization

#### **Docker & Docker Compose**
- **Propósito**: Containerización y orquestación de servicios
- **Configuración en `docker-compose.yml`**:
  ```yaml
  services:
    postgresql:
      image: postgres:15
      environment:
        POSTGRES_DB: LTIdb
        POSTGRES_USER: LTIdbUser
        POSTGRES_PASSWORD: D1ymf8wyQEGthFR1E9xhCq
      ports:
        - "5432:5432"
  ```

### Database Configuration

#### **Connection String**
```
postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb
```

- **Host**: localhost (development)
- **Port**: 5432 (default PostgreSQL)
- **Database**: LTIdb
- **User**: LTIdbUser
- **SSL**: No requerido en desarrollo

## Development Workflow

### Package Managers
- **npm**: Gestor de paquetes principal
- **lock files**: `package-lock.json` para reproducibilidad

### Scripts Principales

#### Backend Scripts
```json
{
  "start": "node dist/index.js",           // Producción
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts", // Desarrollo
  "build": "tsc",                         // Compilación
  "test": "jest",                         // Testing
  "prisma:generate": "npx prisma generate", // Generar cliente
  "start:prod": "npm run build && npm start" // Build + Start
}
```

#### Frontend Scripts
```json
{
  "start": "react-scripts start",         // Desarrollo
  "build": "react-scripts build",        // Producción
  "test": "jest --config jest.config.js", // Testing
  "eject": "react-scripts eject"         // Eject CRA (no recomendado)
}
```

### Development Tools Integration

#### **IDE Support**
- **Configuración TypeScript**: `tsconfig.json` optimizado
- **ESLint integration**: Linting en tiempo real
- **Prettier integration**: Formateo automático

## Version Control & Dependencies

### Dependency Management Strategy

#### **Exact Versions**: Uso de versiones específicas para estabilidad
#### **Security Updates**: Regular dependency auditing
#### **Compatibility**: Mantenimiento de compatibilidad entre frontend/backend

### Browser Compatibility

#### **Frontend Targets (browserslist)**
```json
{
  "production": [">0.2%", "not dead", "not op_mini all"],
  "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
}
```

## Performance Considerations

### Frontend Optimization
- **Bundle Splitting**: Code splitting automático con Create React App
- **Asset Optimization**: Compresión automática de imágenes y CSS
- **Caching**: Service Worker para cache de recursos estáticos

### Backend Optimization
- **Connection Pooling**: Prisma connection pooling automático
- **Query Optimization**: Prisma query optimization
- **Async/Await**: Operaciones no-bloqueantes

## Security Considerations

### Dependencies Security
- **Regular Updates**: Mantenimiento actualizado de dependencias
- **Vulnerability Scanning**: npm audit para detección de vulnerabilidades
- **Type Safety**: TypeScript para prevención de errores comunes

### API Security
- **CORS Configuration**: Configuración restrictiva para producción
- **Input Validation**: Validación comprehensive en backend
- **File Upload Security**: Restricción de tipos y tamaños de archivo

---

*Este stack tecnológico proporciona una base sólida, moderna y escalable para el desarrollo y mantenimiento del sistema LTI.* 