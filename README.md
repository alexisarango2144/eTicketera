# eTicketera: Solución digital para tus eventos

## Tecnologías

- Node.js
- Express
- DotEnv
- Mongoose

## Instalación

### Requisitos previos

- Node.js (versión 16 o superior)
- MongoDB (local o clúster en MongoDB Atlas)

### Pasos para instalar y ejecutar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/alexisarango2144/eTicketera
   cd eTicketera
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto basándote en el archivo .`env.example`.
4. **Ejecutar la aplicación:**
   - En desarrollo: `npm start`

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:

```ini
PORT=8080
```

---

## Estructura de carpetas

```text

eTicketera/
├── src/
│   ├── app.js                # configura Express (NO levanta el server)
│   ├── server.js             # levanta el servidor
│   ├── config/
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/          # Lógica de las rutas (controladores)
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── User.js           # campos mínimos
│   │   └── Event.js          # campos mínimos
│   ├── middlewares/
│   └── utils/
├── .env.example              # PORT, NODE_ENV, MONGO_URL, JWT_SECRET
├── .gitignore                # excluye .env y node_modules
├── package.json
└── README.md
```

---

## Rutas disponibles para pruebas

### Estado (`/api/health`)

- `GET /` - Visualizar estado del servicio.

### Events (`/api/events`)

- `GET /` - Retorna todos los eventos

- `POST /create` - Endpoint para la creación de un nuevo evento, recibe los parámetros

```javascript
{
    "titulo":"IX Simposio de enfermería",               // Con validaciones para campos vacíos
    "descripcion":"Simposio nacional de enfermería",    // Con validaciones para campos vacíos
    "categoria":"Enfermería",
    "capacidad_maxima":300
}
```

### Sessions (`/api/sessions`)

- `POST /register` - Endpoint para el registro de un nuevo usuario, recibe los parámetros

```javascript
{
   "first_name":"John",      // Con validaciones para campos vacíos
    "last_name":"Doe",        // Con validaciones para campos vacíos
    "email":"mail@mai.com",   // Con validación Regex robusta
    "password":"Password"     // Con validación de contraseña de al menos 8 caracteres
}
```

Si el registro es exitoso, se retorna la información básica del usuario sin exponer contraseñas
 
```javascript
{
    "status": "success",
    "payload": {
        "id": "6a926937127b8b46228994e9",
        "first_name": "Alexis",
        "last_name": "Herrera Arango",
        "email": "alexisarango2144@gmail.co",
        "role": "user"
    }
}
```

- `POST /login` - Endpoint para el inicio de sesión, crea el JWT y lo almacena en la cookie `currentUser`, espera los valores

```javascript
{
   "email":"mail@mai.com",
   "password":"Password"
}
```

- `GET /current` - Ruta protegida, si la sesión es válida, retorna el usuario actual.

- `POST /logout` - Solicita el cierre de sesión eliminando la cookie del navegador.
