import RoleModel from "../../models/RoleModel.js"
import { error, errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js"

class UpdateRole {
    handleUpdate = async (id, req, res) => {
        try {
            const checkRole = await RoleModel.findById(id)
            if (!checkRole) return error(res, getMessage('response.empty'))
            
            const data = req.body
            const modules = data.modules

            const updateData = {
                name: data.name,
                description: data.description,
                active: data.active
            }

            const updateRole = await RoleModel.update(id, updateData)

            // Asignar roles al usuario
            const assignRoleResponse = await RoleModel.handlePermissionsAssignment(updateRole.id, modules);

            if (assignRoleResponse.error) {
                const customError = new Error(assignRoleResponse.message);
                customError.isCustomError = true
                throw customError
            }

            return success(res, getMessage('response.update'), updateRole.id)
        } catch (error) {
            return errorLog(res, 'Error al actualizar el rol', error)
        }
    }
}

export default UpdateRole