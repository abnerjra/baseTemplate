import ExpressAdapter from './helpers/libs/ExpressAdapter.plugin.js';
import cors from 'cors'
import 'dotenv/config'

// Import middleware
import {
    authMiddleware
} from './middleware/index.js'

// import routes
import {
    authRoute,
    userRoute,
    roleRoute,
    catalogRoute
} from './routes/index.js';

const app = new ExpressAdapter()

// Middlewares globales
app.useMiddlewares([
    cors(),
    app.createExpress().json(), // Recibir información en formato JSON
    app.createExpress().urlencoded({ extended: true }), // Recibir información de un formData
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
    { router: userRoute.getRouter(), middlewares },
    { router: roleRoute.getProtectedRouter(), middlewares },
    { router: catalogRoute.getProtectedRouter(), middlewares }
]);

// Iniciar el servidor
app.start();