import BaseController from "../Base/BaseController.controller.js"

import CreateRole from "../../use-cases/Role/CreateRole.usecase.js"
import GetRole from "../../use-cases/Role/GetRole.usecase.js"
import ListRole from "../../use-cases/Role/ListRole.usecase.js"
import UpdateRole from "../../use-cases/Role/UpdateRole.usecase.js"

import { error } from "../../helpers/ResponseHandler.helper.js"

class RoleController extends BaseController {
    constructor() {
        super()

        this.listRoleUC = new ListRole
        this.getRoleUC = new GetRole
        this.createRoleUC = new CreateRole
        this.updateRoleUC = new UpdateRole
    }

    index = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)

        return await this.listRoleUC.handleAll(req, res)
    }

    show = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)

        const id = parseInt(req.params.id)
        return await this.getRoleUC.handleGetRoleById(id, res)
    }

    create = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)

        return await this.createRoleUC.handleCreate(req, res)
    }

    update = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)

        const id = parseInt(req.params.id)
        return await this.updateRoleUC.handleUpdate(id, req, res)
    }
}

export default RoleController