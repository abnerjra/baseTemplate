import CreateRole from "../../use-cases/Role/CreateRole.usecase.js"
import GetRole from "../../use-cases/Role/GetRole.usecase.js"
import ListRole from "../../use-cases/Role/ListRole.usecase.js"
import UpdateRole from "../../use-cases/Role/UpdateRole.usecase.js"

class RoleController {
    constructor() {
        this.listRoleUC = new ListRole
        this.getRoleUC = new GetRole
        this.createRoleUC = new CreateRole
        this.updateRoleUC = new UpdateRole
    }

    listRoles = async (req, res) => {
        return await this.listRoleUC.handleAll(req, res)
    }

    getRoleById = async (req, res) => {
        const id = parseInt(req.params.id)
        
        return await this.getRoleUC.handleGetRoleById(id, res)
    }

    createRole = async (req, res) => {
        return await this.createRoleUC.handleCreate(req, res)
    }

    updateRole = async (req, res) => {
        const id = parseInt(req.params.id)
        return await this.updateRoleUC.handleUpdate(id, req, res)
    }
    
}

export default RoleController