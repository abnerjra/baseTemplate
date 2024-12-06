import UserModel from "../../models/UserModel.js";
import { errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";

class GetUser {
    handleUserById = async (id, res) => {
        try {
            const select = {
                id: true,
                name: true,
                first_last_name: true,
                second_last_name: true,
                email: true
            }
            const user = await UserModel.findById(id, select)
            if (!user) return success(res, getMessage('response.empty'))

            const { roles } = await UserModel.getUserRelations(user.id)

            const getUser = {
                ...user,
                roles
            }
            
            return success(res, getMessage('response.read'), getUser)
        } catch (error) {
            return errorLog(res, 'Error al obtener el usuario', error)
        }
    }
}

export default GetUser