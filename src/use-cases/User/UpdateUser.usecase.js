import UserModel from "../../models/UserModel.js";
import { error, errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";

class UpdateUser {
    handleUpdate = async (id, req, res) => {
        try {
            const getUserById = await UserModel.findById(id)
            if (!getUserById) return error(res, getMessage('validate.notExists'))

            const data = req.body
            const fields = {
                name: data.name,
                first_last_name: data.firstLastName,
                second_last_name: data.secondLastName,
                email: data.email,
                acronym: data.acronym
            }

            const user = await UserModel.update(id, fields);
            
            // Asignar roles al usuario
            const assignRoleResponse = await UserModel.handleRoleAssignment(user.id, data.roles);

            if (assignRoleResponse.error) {
                const customError = new Error(assignRoleResponse.message);
                customError.isCustomError = true
                throw customError
            }
        
            return success(res, getMessage('response.update'), user.id)
        } catch (error) {
            if (error.isCustomError) {
                // Manejar errores personalizados
                return errorLog(res, error.message, error);
            } else {
                // Manejar errores generales (de ejecución)
                return errorLog(res, 'Error al crear el usuario', error);
            }
        }
    }
}

export default UpdateUser