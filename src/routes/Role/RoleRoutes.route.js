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
        const { listRoles, getRoleById, createRole, updateRole } = this.roleController
        this.protectedRouter.get('/role/', listRoles.bind(this.roleController))
        this.protectedRouter.get('/role/:id', getRoleById.bind(this.roleController))
        this.protectedRouter.post('/role', createRole.bind(this.roleController))
        this.protectedRouter.put('/role/:id', updateRole.bind(this.roleController))
    }


    getProtectedRouter = () => {
        return this.protectedRouter
    }
}

export default RoleRoutes