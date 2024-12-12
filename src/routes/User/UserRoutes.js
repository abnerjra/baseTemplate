import ExpressAdapter from '../../helpers/libs/ExpressAdapter.plugin.js';
import UserController from '../../controllers/User/UserController.controller.js';

class UserRoutes {
    constructor() {
        this.expressAdapter = new ExpressAdapter()
        this.router = this.expressAdapter.createRouter()
        this.userController = new UserController();
        this.initializeRoutes();
    }

    initializeRoutes = () => {
        const { index, show, store, update } = this.userController;

        this.router.get('/user', index.bind(this.userController))
        this.router.get('/user/:id', show.bind(this.userController))
        this.router.post('/user', store.bind(this.userController))
        this.router.put('/user/:id', update.bind(this.userController))
    }

    getProtectedRouter = () => {
        return this.router
    }
}

export default UserRoutes;