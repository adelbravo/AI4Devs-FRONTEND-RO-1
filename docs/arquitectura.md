# Arquitectura del Sistema LTI

## Visión General de la Arquitectura

El sistema LTI implementa una **arquitectura de capas** basada en **Domain-Driven Design (DDD)** con separación clara entre frontend y backend, siguiendo los principios **SOLID** y patrones de diseño modernos.

```mermaid
graph TD
    A[Frontend - React SPA] -->|HTTP/REST| B[Backend API - Express]
    B -->|Prisma ORM| C[PostgreSQL Database]
    B -->|File System| D[Local Storage]
    E[Docker Compose] --> C
    E --> F[Development Environment]
```

## Arquitectura Backend

### Patrón de Capas (Layered Architecture)

La arquitectura backend sigue el patrón de **4 capas** inspirado en DDD:

```mermaid
graph TB
    subgraph "Backend Architecture"
        A[Presentation Layer<br/>Controllers & Routes] 
        B[Application Layer<br/>Services & Use Cases]
        C[Domain Layer<br/>Entities & Business Logic]
        D[Infrastructure Layer<br/>Database & External Services]
    end
    
    A --> B
    B --> C
    B --> D
    C -.-> D
```

#### 1. **Presentation Layer** (`presentation/`, `routes/`)

**Responsabilidades:**
- Manejo de requests HTTP y responses
- Validación de entrada básica
- Formateo de respuestas JSON
- Manejo de errores HTTP

**Componentes:**
```typescript
// Ejemplo: candidateController.ts
export class CandidateController {
    async createCandidate(req: Request, res: Response) {
        try {
            const candidate = await CandidateService.addCandidate(req.body);
            res.status(201).json(candidate);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
```

**Características:**
- **Stateless**: No mantiene estado entre requests
- **Thin Controllers**: Lógica mínima, delegación a servicios
- **Error Boundary**: Captura y formatea errores

#### 2. **Application Layer** (`application/`)

**Responsabilidades:**
- Orquestación de casos de uso
- Validación de reglas de negocio
- Coordinación entre entidades del dominio
- Transacciones y consistencia

**Servicios Principales:**
```typescript
// Ejemplo: candidateService.ts
export class CandidateService {
    static async addCandidate(candidateData: any): Promise<Candidate> {
        // Validación de datos
        Validator.validateCandidateData(candidateData);
        
        // Creación de entidades del dominio
        const candidate = new Candidate(candidateData);
        
        // Persistencia
        return await candidate.save();
    }
}
```

**Patrones Utilizados:**
- **Service Layer**: Encapsulación de casos de uso
- **Transaction Script**: Para operaciones complejas
- **Validator Pattern**: Validación centralizada

#### 3. **Domain Layer** (`domain/models/`)

**Responsabilidades:**
- Definición de entidades y agregados
- Reglas de negocio puras
- Invariantes del dominio
- Lógica central del sistema

**Entidades Principales:**
```typescript
// Ejemplo: Candidate.ts
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    educations: Education[];
    workExperiences: WorkExperience[];
    
    constructor(data: any) {
        this.validateEmail(data.email);
        // Inicialización...
    }
    
    private validateEmail(email: string): void {
        // Reglas de negocio para email
    }
}
```

**Agregados Identificados:**
- **Candidate Aggregate**: Candidate + Education + WorkExperience + Resume
- **Position Aggregate**: Position + Application + Interview
- **Company Aggregate**: Company + Employee

#### 4. **Infrastructure Layer** (`prisma/`)

**Responsabilidades:**
- Persistencia de datos
- Acceso a servicios externos
- Implementación de repositorios
- Configuración de infraestructura

**Componentes:**
- **Prisma Client**: ORM para acceso a datos
- **Database Migrations**: Evolución del esquema
- **File Storage**: Almacenamiento de CVs

### Principios Arquitectónicos Backend

#### **Dependency Inversion**
```mermaid
graph TB
    A[Application Services] -->|depends on| B[Domain Interfaces]
    C[Infrastructure] -->|implements| B
    A -.->|uses| C
```

#### **Separation of Concerns**
- **Domain**: Solo lógica de negocio
- **Application**: Orquestación y casos de uso
- **Infrastructure**: Detalles técnicos
- **Presentation**: Interface externa

## Arquitectura Frontend

### Patrón Component-Based (React)

```mermaid
graph TD
    A[App.tsx<br/>Root Component] --> B[RecruiterDashboard.js<br/>Main Container]
    B --> C[Positions.tsx<br/>Position Management]
    B --> D[AddCandidateForm.js<br/>Candidate Creation]
    D --> E[FileUploader.js<br/>CV Upload]
    
    F[candidateService.js<br/>API Client] --> G[Backend REST API]
    
    B --> F
    C --> F
    D --> F
```

### Arquitectura de Componentes

#### **Container vs Presentational Components**

**Container Components:**
```typescript
// RecruiterDashboard.js - Maneja estado y lógica
const RecruiterDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    
    useEffect(() => {
        // Fetch data logic
    }, []);
    
    return (
        <div>
            <Positions positions={positions} />
            <AddCandidateForm onAdd={handleAddCandidate} />
        </div>
    );
};
```

**Presentational Components:**
```typescript
// Positions.tsx - Solo UI y props
interface PositionsProps {
    positions: Position[];
    onSelect?: (position: Position) => void;
}

const Positions: React.FC<PositionsProps> = ({ positions, onSelect }) => {
    return (
        <div>
            {positions.map(position => (
                <PositionCard key={position.id} position={position} />
            ))}
        </div>
    );
};
```

### State Management Strategy

#### **Local State** (React useState/useReducer)
- **Scope**: Component-level state
- **Use Cases**: Form inputs, UI toggles, local selections

#### **Server State** (Direct API calls)
- **Scope**: Remote data synchronization
- **Use Cases**: CRUD operations, data fetching

#### **Future Considerations**
- **Context API**: Para estado global no complejo
- **React Query/SWR**: Para server state management avanzado
- **Redux Toolkit**: Para estado complejo y predicible

## Comunicación Entre Capas

### Backend Layer Communication

```mermaid
sequenceDiagram
    participant R as REST Route
    participant C as Controller
    participant S as Service
    participant D as Domain Model
    participant DB as Database
    
    R->>C: HTTP Request
    C->>S: Call Service Method
    S->>D: Create/Validate Domain Object
    D->>DB: Persist via Prisma
    DB-->>D: Return Saved Data
    D-->>S: Return Domain Object
    S-->>C: Return Result
    C-->>R: HTTP Response
```

### Frontend-Backend Communication

```mermaid
sequenceDiagram
    participant UI as React Component
    participant S as API Service
    participant BE as Backend API
    participant DB as Database
    
    UI->>S: Call API Method
    S->>BE: HTTP Request (JSON)
    BE->>DB: Database Query
    DB-->>BE: Return Data
    BE-->>S: HTTP Response (JSON)
    S-->>UI: Return Processed Data
    UI->>UI: Update State & Re-render
```

## Gestión de Datos

### Database Design

#### **Modelo Relacional**
```mermaid
erDiagram
    Candidate ||--o{ Education : has
    Candidate ||--o{ WorkExperience : has  
    Candidate ||--o{ Resume : has
    Candidate ||--o{ Application : submits
    
    Company ||--o{ Position : offers
    Company ||--o{ Employee : employs
    
    Position ||--o{ Application : receives
    Application ||--o{ Interview : schedules
    
    InterviewFlow ||--o{ InterviewStep : contains
    InterviewStep ||--o{ Interview : uses
```

#### **Data Access Patterns**

**Repository Pattern (Implícito con Prisma):**
```typescript
// Prisma actúa como Repository
const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
        educations: true,
        workExperiences: true,
        resumes: true
    }
});
```

**Active Record Pattern (Domain Models):**
```typescript
// Domain models with behavior
class Candidate {
    async save(): Promise<Candidate> {
        return await prisma.candidate.create({
            data: this.toCreateData()
        });
    }
}
```

### API Design

#### **RESTful Principles**
- **Resources**: `/candidates`, `/positions`, `/applications`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 404, 500
- **Content Type**: application/json

#### **API Endpoints Structure**
```
POST   /candidates              # Create candidate
GET    /candidates/{id}         # Get candidate by ID
PUT    /candidates/{id}         # Update candidate stage
POST   /upload                  # Upload file
GET    /position/{id}/candidates # Get candidates by position
```

#### **Request/Response Format**
```typescript
// Request
interface CreateCandidateRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations: Education[];
    workExperiences: WorkExperience[];
    cv?: {
        filePath: string;
        fileType: string;
    };
}

// Response
interface CandidateResponse {
    id: number;
    firstName: string;
    lastName: string;
    // ... other fields
    createdAt: string;
    updatedAt: string;
}
```

## Patrones de Diseño Implementados

### Backend Patterns

#### **1. Domain-Driven Design (DDD)**
- **Entities**: Objects with identity (Candidate, Position)
- **Value Objects**: Descriptive objects (Education, WorkExperience)
- **Aggregates**: Consistency boundaries (Candidate + related entities)
- **Services**: Business logic that doesn't belong to entities

#### **2. Service Layer Pattern**
```typescript
export class CandidateService {
    static async addCandidate(data: any): Promise<Candidate> {
        // Use case orchestration
    }
}
```

#### **3. MVC Pattern (Modified)**
- **Model**: Domain entities + Prisma models
- **View**: JSON responses
- **Controller**: HTTP request/response handling

#### **4. Factory Pattern (Implicit)**
```typescript
// Domain object creation
const candidate = new Candidate(candidateData);
const education = candidateData.educations.map(edu => new Education(edu));
```

### Frontend Patterns

#### **1. Component Composition**
```jsx
<RecruiterDashboard>
    <Positions />
    <AddCandidateForm>
        <FileUploader />
    </AddCandidateForm>
</RecruiterDashboard>
```

#### **2. Higher-Order Components (HOC) Potential**
```jsx
// Future implementation for common functionality
const withLoading = (Component) => {
    return (props) => {
        return props.loading ? <Spinner /> : <Component {...props} />;
    };
};
```

#### **3. Custom Hooks Pattern**
```jsx
// Future custom hooks for reusable logic
const useCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchCandidates = async () => {
        // API call logic
    };
    
    return { candidates, loading, fetchCandidates };
};
```

## Seguridad de la Arquitectura

### Backend Security Layers

#### **1. Input Validation**
```typescript
// Validator.ts
export class Validator {
    static validateCandidateData(data: any): void {
        if (!data.firstName || data.firstName.length < 2) {
            throw new Error('First name is required and must be at least 2 characters');
        }
        // More validations...
    }
}
```

#### **2. Type Safety**
- **TypeScript**: Compile-time type checking
- **Prisma**: Runtime type safety for database operations
- **Interface Contracts**: Clear API contracts

#### **3. File Upload Security**
```typescript
// Multer configuration for file uploads
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        cb(null, allowedTypes.includes(file.mimetype));
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
```

### Frontend Security

#### **1. XSS Prevention**
- **React Built-in**: Automatic HTML escaping
- **Validation**: Client-side validation for UX (server validation for security)

#### **2. CORS Configuration**
```typescript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
```

## Escalabilidad y Performance

### Horizontal Scaling Considerations

#### **Database Scaling**
- **Connection Pooling**: Prisma built-in pooling
- **Read Replicas**: Future implementation for read-heavy workloads
- **Database Partitioning**: By company or date ranges

#### **Application Scaling**
- **Stateless Design**: No server-side sessions
- **Load Balancing**: Ready for multiple instances
- **Caching Strategy**: Future Redis implementation

### Performance Optimization

#### **Backend Optimizations**
```typescript
// Efficient queries with includes
const candidateWithDetails = await prisma.candidate.findUnique({
    where: { id },
    include: {
        educations: true,
        workExperiences: true,
        applications: {
            include: {
                position: true,
                interviews: true
            }
        }
    }
});
```

#### **Frontend Optimizations**
- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo() for expensive components
- **Virtual Scrolling**: For large candidate lists (future)

## Monitoreo y Observabilidad

### Logging Strategy

#### **Backend Logging**
```typescript
// Structured logging
console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    action: 'CREATE_CANDIDATE',
    candidateId: candidate.id,
    userId: req.user?.id
}));
```

#### **Error Handling**
```typescript
// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
```

### Health Checks

#### **API Health Endpoint**
```typescript
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(503).json({ status: 'unhealthy', error: error.message });
    }
});
```

## Consideraciones de Deployment

### Environment Configuration

#### **Development Environment**
```bash
# .env.development
DATABASE_URL="postgresql://LTIdbUser:password@localhost:5432/LTIdb"
NODE_ENV=development
PORT=3010
```

#### **Production Considerations**
- **Environment Variables**: Secure secret management
- **Database Security**: Connection encryption, user permissions
- **HTTPS**: SSL/TLS termination
- **Static Assets**: CDN for frontend assets

### CI/CD Pipeline Readiness

#### **Build Process**
```bash
# Backend build
npm run build    # TypeScript compilation
npm run test     # Run tests

# Frontend build  
npm run build    # Create optimized production build
```

#### **Docker Support**
```dockerfile
# Future Dockerfile structure
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3010
CMD ["npm", "start"]
```

---

*Esta arquitectura proporciona una base sólida, escalable y mantenible que sigue las mejores prácticas de la industria y está preparada para evolucionar con las necesidades del negocio.* 