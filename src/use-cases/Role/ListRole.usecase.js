import RoleModel from "../../models/RoleModel.js";
import { errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";

class ListRole {
    handleAll = async (req, res) => {
        try {
            const query = req.query
            
            const select = {
                id: true,
                name: true,
                description: true,
                active: true
            }
            const orderBy = {
                name: 'asc'
            }

            const filters = {}
            if (query.name) filters.name = { contains: query.name, mode: 'insensitive' }
            if (query.description) filters.description = { contains: query.description, mode: 'insensitive' }

            const roles = await RoleModel.findAll(select, filters, orderBy)
            const dataRoles = await Promise.all(
                roles.map(async (role) =>{
                    const { permissions } = await RoleModel.getRoleRelations(role.id)
                    // console.log(permissions);
                    return {
                        ...role,
                        permissions
                    }
                })
            )

            const successMessage = getMessage('response.reads')
            return success(res, successMessage, dataRoles)
        } catch (error) {
            // return errorResponse(res, 500, 'Error al obtener el listado de roles', error);
            return errorLog(res, 'Error al obtener el listado de roles', error)
        }
    }
}

export default ListRole