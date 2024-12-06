import RoleModel from "../../models/RoleModel.js"
import { errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js"

class GetRole {
    handleGetRoleById = async (id, res) => {
        try {
            const select = {
                id: true,
                name: true,
                description: true,
                active: true
            }
            
            const role = await RoleModel.findById(id, select)
            
            if (!role) return success(res, getMessage('response.empty'))

            const { permissions } = await RoleModel.getRoleRelations(role.id)
            const dataRole = {
                ...role,
                permissions
            }

            return success(res, getMessage('response.read'), dataRole)
        } catch (error) {
            return errorLog(res, 'Ocurrio un problema en la consulta del rol', error)
        }
    }
}

export default GetRole