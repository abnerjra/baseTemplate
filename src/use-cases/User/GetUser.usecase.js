import UserModel from "../../models/UserModel.js";
import { errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";

class GetUser {
    handleUserById = async (id, res) => {
        try {
            const options = {
                select: {
                    id: true,
                    name: true,
                    first_last_name: true,
                    second_last_name: true,
                    email: true
                },
                where: { id }
            }
            const user = await UserModel.findById(id)
            if (!user) return success(res, getMessage('response.empty'))

            const { roles } = await UserModel.getUserRelations(user.id)
            const { is_deleted, created_at, updated_at, ...filterUser } = user

            const getUser = {
                ...filterUser,
                roles
            }
            
            return success(res, getMessage('response.read'), getUser)
        } catch (error) {
            return errorLog(res, 'Error al obtener el usuario', error)
        }
    }
}

export default GetUser