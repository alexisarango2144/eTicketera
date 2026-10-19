# eTicketera API

API backend para la gestión de eventos, autenticación de usuarios y emisión de tickets.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Passport
- GitHub OAuth
- Cookie parser
- Nodemailer (si corresponde a tu flujo de email)

---

## Requisitos previos

- Node.js 18 o superior
- MongoDB local o Atlas
- Un cliente HTTP para pruebas (Postman, Insomnia o curl)

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/alexisarango2144/eTicketera
   cd eTicketera
    ```

2. Instalar dependencias:
    ```bash
    npm install
    ```

3. Crear archivo .env en la raíz del proyecto con las variables necesarias según la plantilla de .env.example

4. Iniciar la aplicación:
    ```bash
    npm start
    ```
    > Si estás en desarrollo, también podés usar npm run dev si configuraste ese script en tu package.json.

---

## Estructura del proyecto
```text
eTicketera/

├─ app.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ server.js
└─ src
   ├─ config
   │  ├─ database.js
   │  ├─ mailer.config.js
   │  └─ passport.config.js
   ├─ controllers
   │  ├─ event.controller.js
   │  ├─ session.controller.js
   │  └─ ticket.controller.js
   ├─ dao
   │  ├─ event.dao.js
   │  ├─ ticket.dao.js
   │  └─ users.dao.js
   ├─ dto
   │  ├─ event.dto.js
   │  ├─ tickets.dto.js
   │  └─ user.dto.js
   ├─ middlewares
   │  ├─ auth.mid.js
   │  ├─ authorization.mid.js
   │  └─ error-handler.mid.js
   ├─ models
   │  ├─ event.model.js
   │  ├─ ticket.model.js
   │  └─ user.model.js
   ├─ repositories
   │  ├─ event.repository.js
   │  ├─ ticket.repository.js
   │  └─ user.repository.js
   ├─ routes
   │  ├─ event.router.js
   │  ├─ health.router.js
   │  ├─ index.js
   │  ├─ session.router.js
   │  └─ ticket.router.js
   ├─ seed
   │  └─ seedUsers.js
   ├─ services
   │  ├─ auth.service.js
   │  ├─ email.service.js
   │  ├─ event.service.js
   │  └─ ticket.service.js
   └─ utils
      ├─ custom-error.js
      ├─ hash.js
      ├─ jwt.js
      ├─ ticketCode.js
      └─ utils.js

```

---

## Base URL

La API corre bajo el prefijo:

```text
/api
```

Ejemplo:

```text
http://localhost:8080/api/events
```

---

## Endpoints

### 1) Health

#### GET /api/health
Verifica que el servidor esté activo.

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

### 2) Sessions / autenticación

#### POST /api/sessions/register
Registra un nuevo usuario.

**Body:**
```json
{
  "first_name": "Alexis",
  "last_name": "Herrera",
  "email": "alexis@mail.com",
  "password": "Password123"
}
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "payload": {
    "id": "64d2c...",
    "first_name": "Alexis",
    "last_name": "Herrera",
    "email": "alexis@mail.com",
    "role": "user"
  }
}
```

---

#### POST /api/sessions/login
Inicia sesión y crea el JWT, guardándolo en cookie.

**Body:**
```json
{
  "email": "alexis@mail.com",
  "password": "Password123"
}
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Autenticación exitosa"
}
```

---

#### GET /api/sessions/github
Redirige al flujo de autenticación con GitHub.

---

#### GET /api/sessions/github/callback
Callback de autenticación OAuth de GitHub.

---

#### GET /api/sessions/current
Devuelve el usuario autenticado actual.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "payload": {
    "id": "64d2c...",
    "email": "alexis@mail.com",
    "role": "user"
  }
}
```

**Si no está autenticado:**
```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

#### POST /api/sessions/logout
Cierra la sesión del usuario.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Logout exitoso"
}
```

---

### 3) Events

#### GET /api/events
Obtiene todos los eventos.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "payload": []
}
```

---

#### GET /api/events/:eventId
Obtiene un evento por su ID.

---

#### POST /api/events
Crea un nuevo evento. Requiere autenticación con rol `organizer` o `admin`.

**Body ejemplo:**
```json
{
  "title": "IX Simposio de Enfermería",
  "description": "Simposio nacional de enfermería",
  "category": "Enfermería",
  "capacity": 300
}
```

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Evento creado exitosamente",
  "payload": {
    "_id": "event_id",
    "title": "IX Simposio de Enfermería",
    "description": "Simposio nacional de enfermería",
    "category": "Enfermería",
    "capacity": 300
  }
}
```

---

#### PUT /api/events/:eventId
Actualiza un evento existente. Requiere autenticación con rol `organizer` o `admin`.

---

#### PATCH /api/events/:eventId/status
Cambia el estado del evento. Requiere autenticación con rol `organizer` o `admin`.

---

### 4) Tickets

#### POST /api/tickets/event/:eventId/tickets
Registra al usuario en un evento.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Inscripción realizada con éxito",
  "data": {
    "id": "ticket_id",
    "event": "event_id",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "TK-XYZ123"
  }
}
```

---

#### GET /api/tickets/my-tickets
Devuelve los tickets del usuario autenticado.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Tickets para el usuario obtenidos con éxito",
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

#### GET /api/tickets/event/:eventId/tickets
Obtiene todos los tickets asociados a un evento. Requiere rol `organizer` o `admin`.

---

#### PATCH /api/tickets/:ticketId/cancel
Cancela la inscripción de un ticket.

---

## Roles

Los roles más comunes en esta API son:

- `user`
- `organizer`
- `admin`

Algunas rutas están protegidas según el rol, por ejemplo:

- Crear/actualizar/cambiar estado de eventos: `organizer` o `admin`
- Ver tickets de un evento: `organizer` o `admin`

---

## Ejemplo de uso con curl

### Registro
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alexis",
    "last_name": "Herrera",
    "email": "alexis@mail.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alexis@mail.com",
    "password": "Password123"
  }'
```

### Obtener eventos
```bash
curl http://localhost:8080/api/events
```

---

## Notas

- La autenticación se maneja con Passport y JWT en cookies.
- Los endpoints públicos y protegidos están separados por middleware.
- Si usás OAuth con GitHub, necesitás configurar correctamente las variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y la URL de callback.

---

## Licencia

Este proyecto es un ejercicio académico / desarrollo backend y puede adaptarse según los requerimientos del curso o del cliente.