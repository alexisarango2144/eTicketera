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
   * Crea un archivo `.env` en la raíz del proyecto basándote en el archivo .`env.example`.
4. **Ejecutar la aplicación:**
   * En desarrollo: `npm start`

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
* `GET /` - Visualizar estado del servicio.

### Eventos (`/api/events`)
* `GET /` - Listar todos los eventos.

### Sessions (`/api/sessions`)
* `POST /register` - Endpoint para el registro de un nuevo usuario, recibe los parámetros
```javascript
{
    "first_name":"John",      // Con validaciones para campos vacíos
    "last_name":"Doe",        // Con validaciones para campos vacíos   
    "email":"mail@mai.com",   // Con validación Regex robusta
    "password":"Password"     // Con validación de contraseña de al menos 8 caracteres
}
```

