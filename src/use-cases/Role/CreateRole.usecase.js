import RoleModel from "../../models/RoleModel.js";
import { error, errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";
import { handleRebootSequence } from "../../helpers/ResetSequence.helper.js";

class CreateRole {
    handleCreate = async (req, res) => {
        const tables = ['roles']
        try {
            const data = req.body
            const modules = data.modules
            delete data.modules
            // return success(res, getMessage('response.create'), modules)
            
            const uniqueKey = await RoleModel.findAll(null, { key: data.key })
            if (uniqueKey.length) return error(res, getMessage('fails.duplicate'))
                
            const result = await RoleModel.transaction(async () => {
                const role = await RoleModel.create(data)
                
                const assingPermissionResponse = await RoleModel.handlePermissionsAssignment(role.id, modules)
                // Si hay un error en la asignación de permisosn, lanza un error para cancelar la transacción
                if (assingPermissionResponse.error) {
                    const customError = new Error(assingPermissionResponse.message);
                    customError.isCustomError = true
                    throw customError
                }
                return role
            })
            
            return success(res, getMessage('response.create'), result.id)
        } catch (error) {
            await handleRebootSequence(tables)
            if (error.isCustomError) {
                return errorLog(res, error.mesagge, error)
            } else {
                return errorLog(res, 'Error al crear el rol', error)
            }
        }
    }
}

export default CreateRole