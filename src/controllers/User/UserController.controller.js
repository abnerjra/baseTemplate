import BaseController from "../Base/BaseController.controller.js"

import CreateUser from "../../use-cases/User/CreateUser.usecase.js"
import ListUser from "../../use-cases/User/ListUser.usecase.js"
import GetUser from "../../use-cases/User/GetUser.usecase.js"
import UpdateUserUseCase from "../../use-cases/User/UpdateUser.usecase.js"

import { error } from "../../helpers/ResponseHandler.helper.js"

class UserController extends BaseController {
    constructor() {
        super()

        this.listUserUC = new ListUser()
        this.createUserUC = new CreateUser()
        this.getUserUC = new GetUser()
        this.updateUserUC = new UpdateUserUseCase()
    }

    index = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)
        
        return await this.listUserUC.handleAll(req, res)
    }

    show = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)
        
        const id = parseInt(req.params.id)
        const response = await this.getUserUC.handleUserById(id, res)
        return response
    }

    store = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)
        
        return await this.createUserUC.handleCreate(req, res)
    }

    update = async (req, res) => {
        const responsePermission = await this.checkPermission(req, this.getCurrentFunctionName())
        if (!responsePermission.validate) return error(res, responsePermission.message)
        
        const id = parseInt(req.params.id)
        return await this.updateUserUC.handleUpdate(id, req, res)
    }
}

export default UserController;