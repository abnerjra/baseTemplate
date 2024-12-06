import ExpressAdapter from '../../helpers/libs/ExpressAdapter.plugin.js';
import UserController from '../../controllers/User/UserController.js';

class UserRoutes {
    constructor() {
        this.expressAdapter = new ExpressAdapter()
        this.router = this.expressAdapter.createRouter()
        this.userController = new UserController();
        this.initializeRoutes();
    }

    initializeRoutes = () => {
        const { listUsers, getUserById, createUser, updateUser } = this.userController;

        this.router.get('/users', listUsers.bind(this.userController))
        this.router.get('/users/:id', getUserById.bind(this.userController))
        this.router.post('/users', createUser.bind(this.userController))
        this.router.put('/users/:id', updateUser.bind(this.userController))
    }

    getRouter = () => {
        return this.router
    }
}

export default UserRoutes;