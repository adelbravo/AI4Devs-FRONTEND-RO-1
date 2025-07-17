# Requirements Document

## Introduction

La interfaz "Position Kanban View" es una página que permite visualizar y gestionar los diferentes candidatos de una posición específica utilizando un diseño tipo kanban. Esta interfaz mostrará los candidatos como tarjetas en diferentes columnas que representan las fases del proceso de contratación, permitiendo actualizar la fase de un candidato simplemente arrastrando su tarjeta de una columna a otra.

## Requirements

### Requirement 1: Visualización de la posición

**User Story:** Como reclutador, quiero ver el título de la posición en la parte superior de la página, para tener contexto sobre qué posición estoy gestionando.

#### Acceptance Criteria

1. WHEN el usuario accede a la página de una posición específica THEN el sistema SHALL mostrar el título de la posición en la parte superior de la página.
2. WHEN el usuario visualiza el título de la posición THEN el sistema SHALL mostrar una flecha a la izquierda del título que permita volver al listado de posiciones.
3. WHEN el usuario hace clic en la flecha THEN el sistema SHALL redirigir al usuario a la página de listado de posiciones.

### Requirement 2: Visualización de columnas kanban

**User Story:** Como reclutador, quiero ver columnas que representen cada fase del proceso de contratación, para poder visualizar el progreso de los candidatos.

#### Acceptance Criteria

1. WHEN el usuario accede a la página de una posición específica THEN el sistema SHALL mostrar tantas columnas como fases haya en el proceso de contratación.
2. WHEN el sistema muestra las columnas THEN el sistema SHALL mostrar el nombre de cada fase como título de la columna.
3. WHEN el usuario visualiza las columnas en un dispositivo móvil THEN el sistema SHALL mostrar las fases en vertical ocupando todo el ancho de la pantalla.

### Requirement 3: Visualización de candidatos

**User Story:** Como reclutador, quiero ver tarjetas que representen a cada candidato en la columna correspondiente a su fase actual, para poder identificar rápidamente en qué fase se encuentra cada candidato.

#### Acceptance Criteria

1. WHEN el usuario accede a la página de una posición específica THEN el sistema SHALL mostrar una tarjeta por cada candidato en la columna correspondiente a su fase actual.
2. WHEN el sistema muestra una tarjeta de candidato THEN el sistema SHALL mostrar el nombre completo del candidato.
3. WHEN el sistema muestra una tarjeta de candidato THEN el sistema SHALL mostrar la puntuación media del candidato.
4. IF un candidato no tiene puntuación THEN el sistema SHALL mostrar un valor de 0 o indicar que no tiene puntuación.

### Requirement 4: Actualización de fase de candidato

**User Story:** Como reclutador, quiero poder arrastrar la tarjeta de un candidato de una columna a otra, para actualizar fácilmente la fase en la que se encuentra.

#### Acceptance Criteria

1. WHEN el usuario arrastra la tarjeta de un candidato de una columna a otra THEN el sistema SHALL actualizar la fase del candidato en el backend.
2. WHEN el sistema actualiza la fase del candidato THEN el sistema SHALL mostrar una confirmación visual de que la actualización se ha realizado correctamente.
3. IF ocurre un error durante la actualización THEN el sistema SHALL mostrar un mensaje de error y devolver la tarjeta a su posición original.
4. WHEN el usuario arrastra una tarjeta THEN el sistema SHALL proporcionar una indicación visual de que la tarjeta está siendo arrastrada.

### Requirement 5: Diseño responsive

**User Story:** Como reclutador, quiero poder utilizar la interfaz kanban tanto en dispositivos de escritorio como en dispositivos móviles, para poder gestionar candidatos desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN el usuario accede a la página desde un dispositivo móvil THEN el sistema SHALL adaptar el diseño para mostrar las columnas en vertical.
2. WHEN el usuario accede a la página desde un dispositivo de escritorio THEN el sistema SHALL mostrar las columnas en horizontal.
3. WHEN el usuario arrastra tarjetas en un dispositivo móvil THEN el sistema SHALL proporcionar una experiencia de usuario adecuada para la interacción táctil.