import RoleController from "../../controllers/Role/RoleController.controller.js"
import ExpressAdapter from "../../helpers/libs/ExpressAdapter.plugin.js"

class RoleRoutes {
    constructor() {
        this.expressAdapter = new ExpressAdapter
        this.protectedRouter = this.expressAdapter.createRouter()
        this.roleController = new RoleController
        this.initializeRoutes()
    }

    initializeRoutes = () => {
        const { index, show, create, update } = this.roleController
        this.protectedRouter.get('/role/', index.bind(this.roleController))
        this.protectedRouter.get('/role/:id', show.bind(this.roleController))
        this.protectedRouter.post('/role', create.bind(this.roleController))
        this.protectedRouter.put('/role/:id', update.bind(this.roleController))
    }


    getProtectedRouter = () => {
        return this.protectedRouter
    }
}

export default RoleRoutes