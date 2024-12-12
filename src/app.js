import ExpressAdapter from './helpers/libs/ExpressAdapter.plugin.js';
import cors from 'cors'
import 'dotenv/config'
import multer from "multer";

// Import middleware
import {
    authMiddleware,
    prefixMiddleware
} from './middleware/index.js'

// import routes
import {
    authRoute,
    userRoute,
    roleRoute,
    catalogRoute
} from './routes/index.js';

const app = new ExpressAdapter()
const upload = new multer()

// Middlewares globales
app.useMiddlewares([
    cors(),
    app.createExpress().json(), // Recibir información en formato JSON
    app.createExpress().urlencoded({ extended: true }), // Recibir información de un formData
    upload.none(),
    prefixMiddleware.handle
]);

const middlewares = [
    authMiddleware.handle
]

// Configuración de rutas
app.useRoutes([
    // Rutas sin middleware
    { router: authRoute.getPublicRouter() },
    
    
    // Rutas con middleware
    { router: authRoute.getProtectedRouter(), middlewares },
    { router: userRoute.getProtectedRouter(), middlewares },
    { router: roleRoute.getProtectedRouter(), middlewares },
    { router: catalogRoute.getProtectedRouter(), middlewares }
]);

// Iniciar el servidor
app.start();