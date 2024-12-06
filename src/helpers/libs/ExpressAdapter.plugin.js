import express from "express"
import PrismaInstance from "../../middleware/Prisma.middleware.js";

class ExpressAdapter {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3002
    }

    createExpress = () => {
        return express;
    }

    /**
     * Middleware load
     * @param {Array} middlewares
     */
    useMiddlewares = (middlewares) => {
        middlewares.forEach((middleware) => {
            this.app.use(middleware)
        });
    }

    /**
     * Register routes with or without middlewares
     * @param {Array} routes
     */
    useRoutes = (routes = []) => {
        const prefix = '/api'
        routes.forEach(({ router, middlewares = [] }) => {
            if (middlewares.length > 0) {
                this.app.use(prefix, middlewares, router);
            } else {
                this.app.use(prefix, router);
            }
        });
    }

    /**
     * Create a new router instance
     * @returns {Router}
     */
    createRouter = () => {
        return express.Router();
    }

    /**
     * Start server
     */
    start = () => {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutándose en el puerto ${this.port}`);
        });
    }
}

export default ExpressAdapter