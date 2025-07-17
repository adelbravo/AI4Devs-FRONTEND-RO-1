# Prompt: Creación de Interfaz Kanban para Gestión de Candidatos por Posición

## Contexto del Proyecto

Eres un **Experto Frontend Senior** especializado en **React + TypeScript** trabajando en el sistema **LTI (Talent Tracking System)** - un ATS (Applicant Tracking System) empresarial para gestión de candidatos y procesos de reclutamiento.

### Arquitectura Técnica del Proyecto
- **Frontend**: React 18.3.1 + TypeScript 4.9.5 + Bootstrap 5.3.3 + React Bootstrap 2.10.2
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + PostgreSQL
- **Arquitectura**: Domain-Driven Design (DDD) con capas separadas
- **Styling**: Bootstrap con React Bootstrap Icons para iconografía
- **Build**: Create React App con configuración TypeScript strict

### Estructura Actual del Frontend
```
frontend/src/
├── components/
│   ├── AddCandidateForm.js
│   ├── FileUploader.js  
│   ├── Positions.tsx
│   └── RecruiterDashboard.js
├── services/
│   └── candidateService.js
├── assets/
│   └── lti-logo.png
├── App.tsx
└── index.tsx
```

### APIs Disponibles (Confirmadas)

#### 1. **GET /position/:id/interviewflow**
Obtiene el flujo de entrevistas de una posición específica.

**Respuesta:**
```typescript
{
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: Array<{
      id: number;
      interviewFlowId: number;
      interviewTypeId: number;
      name: string;
      orderIndex: number;
    }>;
  };
}
```

#### 2. **GET /position/:id/candidates** 
Obtiene todos los candidatos en proceso para una posición.

**Respuesta:**
```typescript
Array<{
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  id: number;          // candidate ID
  applicationId: number; // application ID
}>
```

#### 3. **PUT /candidates/:id**
Actualiza la etapa del proceso de un candidato.

**Request Body:**
```typescript
{
  applicationId: number;
  currentInterviewStep: number; // ID del interview step
}
```

**Respuesta:**
```typescript
{
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: Array<{
      interviewDate: string;
      interviewStep: string;
      score: number | null;
    }>;
  };
}
```

---

## Objetivo: Crear Interfaz Kanban para Gestión de Candidatos

### Descripción de la Funcionalidad
Crear una página tipo **kanban board** que permita visualizar y gestionar candidatos de una posición específica mediante **drag & drop** entre diferentes columnas que representan las fases del proceso de contratación.

### Requerimientos Funcionales

#### 1. **Layout y Navegación**
- Mostrar el **título de la posición** en la parte superior como header
- Incluir **flecha de retroceso** (←) a la izquierda del título para volver al listado de posiciones
- Diseño **responsivo** que funcione en móvil (columnas verticales ocupando todo el ancho)

#### 2. **Estructura Kanban**
- **Columnas dinámicas**: Una columna por cada fase del proceso (basado en `interviewSteps`)
- **Orden de columnas**: Según `orderIndex` de los interview steps
- **Headers de columna**: Mostrar el `name` de cada interview step
- **Conteo visual**: Mostrar número de candidatos en cada columna

#### 3. **Tarjetas de Candidatos**
- **Información por tarjeta**:
  - Nombre completo del candidato
  - Puntuación media (con formato visual atractivo)
  - Avatar o iniciales (opcional pero recomendado)
- **Posicionamiento**: Ubicar cada candidato en la columna correspondiente a su `currentInterviewStep`
- **Diseño**: Cards atractivas con estilo Bootstrap

#### 4. **Funcionalidad Drag & Drop**
- **Arrastrar candidatos** entre columnas para cambiar su fase
- **Actualización automática** mediante API al soltar la tarjeta
- **Feedback visual** durante el arrastre (hover states, indicadores)
- **Manejo de errores** si la actualización falla

#### 5. **Estados de Carga y Error**
- **Loading state** al cargar datos iniciales
- **Loading indicators** durante actualizaciones de candidatos
- **Error handling** con mensajes descriptivos
- **Optimistic updates** para mejor UX

### Requerimientos Técnicos

#### 1. **Estructura de Componentes**
```typescript
// Estructura sugerida
PositionKanban.tsx (componente principal)
├── KanbanBoard.tsx (board container)
├── KanbanColumn.tsx (columna individual)
├── CandidateCard.tsx (tarjeta de candidato)
└── PositionHeader.tsx (header con título y navegación)
```

#### 2. **Tipos TypeScript Requeridos**
```typescript
interface InterviewStep {
  id: number;
  name: string;
  orderIndex: number;
}

interface Candidate {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface PositionData {
  positionName: string;
  interviewSteps: InterviewStep[];
  candidates: Candidate[];
}
```

#### 3. **Gestión de Estado**
- Usar **React hooks** (useState, useEffect) para estado local
- **Estado optimista** para updates de drag & drop
- **Error boundaries** para manejo robusto de errores
- **Loading states** granulares por operación

#### 4. **Librería de Drag & Drop: @dnd-kit**
- **Implementar con [@dnd-kit/core](https://docs.dndkit.com/)** - librería moderna y performante
- **Hooks principales**: `useDraggable`, `useDroppable`, `DndContext`
- **Sensores**: PointerSensor, KeyboardSensor para soporte completo de input
- **Collision detection**: `closestCenter` algorithm para detección de columnas
- **Touch support nativo** para dispositivos móviles
- **Accesibilidad built-in** con keyboard navigation y screen reader support

#### 5. **Servicios API**
```typescript
// Crear servicio en services/positionService.ts
class PositionService {
  static async getPositionInterviewFlow(positionId: number): Promise<InterviewFlowResponse>
  static async getPositionCandidates(positionId: number): Promise<Candidate[]>
  static async updateCandidateStage(candidateId: number, applicationId: number, newStepId: number): Promise<void>
}
```

#### 6. **Implementación @dnd-kit Específica**
```typescript
// Instalación requerida
npm install @dnd-kit/core @dnd-kit/utilities

// Estructura de implementación
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Configuración de sensores
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

// Handler para drag end
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // Actualizar candidato vía API
    await PositionService.updateCandidateStage(
      active.data.current.candidateId,
      active.data.current.applicationId,
      over.data.current.stepId
    );
  }
};
```

### Requerimientos de UX/UI

#### 1. **Responsive Design**
- **Desktop**: Columnas horizontales con scroll horizontal si es necesario
- **Tablet**: 2-3 columnas por fila con scroll vertical
- **Mobile**: 1 columna por fila, scroll vertical, cards ocupando ancho completo

#### 2. **Styling Bootstrap**
- Usar **clases Bootstrap** para layout y componentes
- **Cards** con estilo `card` y `card-body`
- **Badges** para mostrar puntuaciones
- **Buttons** para navegación
- **Spinners** para loading states

#### 3. **Accesibilidad**
- **ARIA labels** para drag & drop
- **Keyboard navigation** funcional
- **Screen reader support**
- **Color contrast** adecuado

#### 4. **Micro-interacciones**
- **Hover effects** en tarjetas y botones
- **Smooth transitions** durante drag & drop
- **Visual feedback** para acciones exitosas/fallidas
- **Skeleton loading** para mejor perceived performance

### Consideraciones de Implementación

#### 1. **Routing**
- Asumir que la página se accede via `/position/:id/kanban`
- Usar **React Router** para obtener el `positionId` de los parámetros
- Implementar navegación de retorno a la lista de posiciones

#### 2. **Error Handling**
- **Try-catch** en todas las llamadas API
- **User-friendly error messages** en español
- **Retry mechanisms** para failures transitorios
- **Fallback UI** cuando los datos no cargan

#### 3. **Performance**
- **Memoización** de componentes con React.memo cuando apropiado
- **Debouncing** si es necesario para updates
- **Virtual scrolling** si hay muchos candidatos (opcional)

#### 4. **Testing**
- **Unit tests** para componentes principales
- **Integration tests** para drag & drop functionality
- **Mock services** para tests

### Entregables Esperados

1. **Componentes React** completamente funcionales con TypeScript
2. **Servicios API** configurados y tipados
3. **Estilos responsivos** usando Bootstrap
4. **Funcionalidad drag & drop** completamente implementada
5. **Manejo robusto de errores** y loading states
6. **Documentación** de componentes y decisiones técnicas

### Criterios de Aceptación

✅ **Funcionalidad**: Drag & drop actualiza correctamente las fases de candidatos via API
✅ **UI/UX**: Interfaz intuitiva y responsive que funciona en todos los dispositivos
✅ **Performance**: Carga rápida y interacciones fluidas sin lag
✅ **Código**: TypeScript strict, componentes reutilizables, código limpio
✅ **Error Handling**: Manejo elegante de errores de red y estados edge
✅ **Accesibilidad**: Cumple estándares WCAG básicos

---

## Instrucciones Específicas

1. **Comienza** creando la estructura de componentes y tipos TypeScript
2. **Implementa** primero la carga de datos sin drag & drop
3. **Añade** la funcionalidad de drag & drop incrementalmente  
4. **Testa** cada funcionalidad antes de proceder a la siguiente
5. **Documenta** decisiones técnicas importantes en comentarios

### Ejemplo de Implementación con @dnd-kit

#### Componente Principal (PositionKanban.tsx)
```typescript
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import KanbanBoard from './KanbanBoard';
import PositionHeader from './PositionHeader';

const PositionKanban: React.FC = () => {
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Optimistic update
      updateCandidateLocally(active.id, over.id);
      
      try {
        await PositionService.updateCandidateStage(
          active.data.current.candidateId,
          active.data.current.applicationId,
          over.data.current.stepId
        );
      } catch (error) {
        // Revert optimistic update on error
        revertCandidateUpdate(active.id);
        showErrorMessage('Error al actualizar candidato');
      }
    }
  };

  return (
    <div className="position-kanban">
      <PositionHeader 
        title={positionData?.positionName} 
        onBack={() => navigate('/positions')} 
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard 
          steps={positionData?.interviewSteps} 
          candidates={positionData?.candidates}
        />
      </DndContext>
    </div>
  );
};
```

#### Tarjeta Draggable (CandidateCard.tsx)
```typescript
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `candidate-${candidate.id}`,
    data: {
      candidateId: candidate.id,
      applicationId: candidate.applicationId,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`card candidate-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="card-body">
        <h6 className="card-title">{candidate.fullName}</h6>
        <span className="badge bg-primary">
          ⭐ {candidate.averageScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
};
```

**¡Prioriza la calidad del código, la experiencia de usuario y el cumplimiento de todos los requerimientos técnicos especificados!** 