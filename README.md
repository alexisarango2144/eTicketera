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

- Node.js 20.19 o superior
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
   │  ├─ reference.dto.js
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
      ├─ api-response.js
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

## Decisiones sobre DTOs y respuestas

### `reference.dto.js`

Las relaciones de MongoDB pueden llegar como un `ObjectId`, como una referencia sin poblar o como un documento poblado. `reference.dto.js` centraliza la obtención del identificador y permite que los DTOs manejen esos formatos sin exponer directamente objetos de Mongoose.

Cuando una relación está poblada, el DTO correspondiente selecciona los campos que la API expone. Cuando no lo está, se devuelve únicamente su identificador. Esto mantiene las respuestas controladas y evita incluir accidentalmente propiedades internas del modelo.

### `api-response.js`

`api-response.js` centraliza la estructura de las respuestas exitosas para que los endpoints compartan el formato:

```json
{
  "status": "success",
  "message": "Descripción de la operación",
  "data": {}
}
```

## Respuestas
Las respuestas exitosas usan `{ status, message, data }`. Según el endpoint, los datos se devuelven en `data` o junto con la información de paginación. Los errores se entregan al middleware de Express.

## Endpoints

### Health

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Comprueba que el servidor esté activo. |

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### Sesiones

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/sessions/register` | Registra un usuario local. |
| `POST` | `/api/sessions/login` | Inicia sesión local. |
| `GET` | `/api/sessions/github` | Inicia autenticación con GitHub. |
| `GET` | `/api/sessions/github/callback` | Callback OAuth de GitHub. |
| `GET` | `/api/sessions/current` | Devuelve el usuario de la sesión actual. |
| `POST` | `/api/sessions/logout` | Limpia la cookie de sesión. |

Registro, `POST /api/sessions/register`:

```json
{
  "first_name": "Ada",
  "last_name": "Ejemplo",
  "email": "ada@example.com",
  "password": "ClaveDePrueba123"
}
```

Registro exitoso, `201 Created`:

```json
{
  "status": "success",
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": "ID_DEL_USUARIO",
      "email": "usuario@example.com",
      "role": "user"
    },
    "token": "JWT"
  }
}
```

Login, `POST /api/sessions/login`:

```json
{
  "email": "ada@example.com",
  "password": "ClaveDePrueba123"
}
```

Una autenticación exitosa establece la cookie HTTP-only `currentUser` y devuelve los datos de usuario y el token en `data`.

```json
{
  "status": "success",
  "message": "Usuario autenticado",
  "data": {
    "user": {
      "id": "ID_DEL_USUARIO",
      "email": "usuario@example.com",
      "role": "user"
    },
    "token": "JWT"
  }
}
```

`GET /api/sessions/current` requiere autenticación. Su respuesta usa `data`:

```json
{
  "status": "success",
  "message": "Sesión activa para el usuario",
  "data": {
    "id": "ID_DEL_USUARIO",
    "email": "ada@example.com",
    "role": "user",
    "first_name": "Ada",
    "last_name": "Ejemplo"
  }
}
```

Sin autenticación, la colección registra 401 Unauthorized:

```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "No autenticado"
}
```

### Eventos

| Método | Ruta | Acceso |
| --- | --- | --- |
| `GET` | `/api/events` | Público |
| `GET` | `/api/events/:eventId` | Público |
| `POST` | `/api/events` | `organizer` o `admin` |
| `PUT` | `/api/events/:eventId` | `organizer` o `admin`; solo organizador propietario o admin |
| `PATCH` | `/api/events/:eventId/status` | `organizer` o `admin`; solo organizador propietario o admin |

La lista admite filtros y paginación mediante query parameters como `status`, `page` y `limit`.

Ejemplo de creación, `POST /api/events`:

```json
{
  "title": "Encuentro de ejemplo",
  "description": "Descripción del evento",
  "category": "Comunidad",
  "date": "2026-11-15",
  "location": "Auditorio central",
  "capacity": 100,
  "price": 0
}
```

Para cambiar el estado, `PATCH /api/events/:eventId/status`:

```json
{
  "status": "published"
}
```

Los estados permitidos son `draft`, `published`, `cancelled` y `finished`.

Las respuestas de eventos devuelven el recurso en `data`. La lista devuelve además los metadatos de paginación con la siguiente estructura:

```json
{
  "status": "success",
  "message": "Eventos obtenidos con éxito",
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Tickets

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/tickets/event/:eventId/tickets` | Usuario autenticado |
| `GET` | `/api/tickets/my-tickets` | Usuario autenticado |
| `GET` | `/api/tickets/event/:eventId/tickets` | `organizer` o `admin` |
| `PATCH` | `/api/tickets/:ticketId/cancel` | Usuario autenticado; sujeto a permisos sobre el ticket |

Ejemplo de inscripción:

```json
{
  "quantity": 2
}
```

La inscripción devuelve el ticket en `data`. La ruta `GET /api/tickets/my-tickets` acepta parámetros de paginación y devuelve los resultados junto con sus metadatos. La ruta para consultar tickets de un evento devuelve los tickets en `data`.

## Roles

- `user`: usuario estándar.
- `organizer`: puede crear eventos y gestionar los propios.
- `admin`: puede gestionar eventos y consultar tickets de eventos.

## Ejemplo con curl

```bash
curl http://localhost:8080/api/health
```

Para endpoints protegidos, enviar el token de autenticación según la configuración del cliente. El login también entrega la cookie `currentUser`.


---

## Notas

- La autenticación se maneja con Passport y JWT en cookies.
- Los endpoints públicos y protegidos están separados por middleware.
- Si usás OAuth con GitHub, necesitás configurar correctamente las variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y la URL de callback.

---

## Licencia

Este proyecto es un ejercicio académico / desarrollo backend y puede adaptarse según los requerimientos del curso o del cliente.