import CreateUser from "../../use-cases/User/CreateUser.usecase.js"
import ListUser from "../../use-cases/User/ListUser.usecase.js"
import GetUser from "../../use-cases/User/GetUser.usecase.js"
import UpdateUserUseCase from "../../use-cases/User/UpdateUser.usecase.js"

class UserController {
    constructor() {
        this.listUserUC = new ListUser()
        this.createUserUC = new CreateUser()
        this.getUserUC = new GetUser()
        this.updateUserUC = new UpdateUserUseCase()
    }

    listUsers = async (req, res) => {
        return await this.listUserUC.handleAll(req, res)
    }

    getUserById = async (req, res) => {
        const id = parseInt(req.params.id)
        const response = await this.getUserUC.handleUserById(id, res)
        return response
    }

    createUser = async (req, res) => {
        return await this.createUserUC.handleCreate(req, res)
    }

    updateUser = async (req, res) => {
        const id = parseInt(req.params.id)
        return await this.updateUserUC.handleUpdate(id, req, res)
    }
}

export default UserController;