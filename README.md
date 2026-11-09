# SC-502 – Tareas de Programación Web

Repositorio con las tareas individuales del curso **SC-502 Programación Web** (Universidad Fidélitas).

**Estudiante:** Ronald Calderón Mejía
**Cuatrimestre:** III cuatrimestre 2026
**Profesor:** Jose Federico Dittel Araya

---

## Estructura del repositorio

```
SC-502-Tareas/
├── css/                      # Práctica Programada 1 - HTML y CSS
├── js/                       # Práctica Programada 2 y 3 - JavaScript
├── php/                      # Práctica Programada 3 - PHP
├── reportes/                 # Práctica Programada 3 - Ubicacion del archivo txt
├── index.html                # Práctica Programada 1 - HTML y CSS
├── practica1.html            # Práctica Programada 1 - HTML y CSS
├── practica2.html            # Práctica Programada 2 - JavaScript
├── practica3.html            # Práctica Programada 3 – PHP
└── README.md
```

---

## Tareas

| # | Tarea | Tecnología | Carpeta  y archivos|
|---|-------|------------|--------------------|
| 1 | Fundamentos de HTML5 y CSS3 | HTML y CSS | `css/ y archivo practica1.html` |
| 2 | Calculo de Cargas Sociales | JavaScript | `js/ y archivo practica2.html` |
| 3 | Estado de cuenta de tarjeta de crédito | PHP | `php/ y archivo practica3.html` |

---

## Práctica Programada #3 – PHP

### Descripción

Sistema en PHP que registra transacciones realizadas con una tarjeta de crédito y genera un **estado de cuenta detallado**. El estado de cuenta se muestra en pantalla y además se guarda en un archivo de texto (`estado_cuenta.txt`) como referencia permanente.

### Contenido del estado de cuenta

1. Detalle de las transacciones registradas (descripción y monto).
2. Monto total de contado (suma de todas las transacciones).
3. Monto total con interés del **2.6 %**.
4. Cash back correspondiente: **0.1 %** del monto de contado.
5. Monto final a pagar.

### Estructura de datos

Arreglo `$transacciones`, donde cada transacción contiene:

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único de la transacción |
| `descripcion` | Breve descripción de la transacción |
| `monto` | Monto de la transacción |

### Funciones principales

- `registrarTransaccion($id, $descripcion, $monto)`: agrega una nueva transacción al arreglo `$transacciones`.
- `generarEstadoDeCuenta()`: recorre las transacciones, calcula los totales (contado, con interés, cash back y monto final), los muestra en pantalla y genera `estado_cuenta.txt`.

### Fórmulas utilizadas

```
Total de contado   = suma de los montos de todas las transacciones
Total con interés  = Total de contado × 1.026
Cash back          = Total de contado × 0.001
Monto final a pagar = Total con interés − Cash back
```

### Como ejecutar

Guardar el proyecto en la carpeta de htdocs de xampp. Al iniciar el servidor de Apache, ir a la siguiente ruta:
http://localhost/SC-502-Tareas/