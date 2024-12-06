import ExpressAdapter from "../../helpers/libs/ExpressAdapter.plugin.js";
import AuthController from "../../controllers/Auth/AuthController.controller.js";

class AuthRoutes {
    constructor() {
        this.expressAdapter = new ExpressAdapter()
        this.publicRouter = this.expressAdapter.createRouter(); // Rutas públicas
        this.protectedRouter = this.expressAdapter.createRouter(); // Rutas protegidas
        this.authController = new AuthController()
        this.initializeRoutes()
    }
    
    initializeRoutes = () => {
        const { login, logout } = this.authController

        this.publicRouter.post('/auth/login', login.bind(this.auth))
        this.protectedRouter.put('/auth/logout', logout.bind(this.auth))
    }

    getPublicRouter = () => {
        return this.publicRouter;
    }

    getProtectedRouter = () => {
        return this.protectedRouter;
    }
}

export default AuthRoutes