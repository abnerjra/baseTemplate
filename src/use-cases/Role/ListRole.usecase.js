import RoleModel from "../../models/RoleModel.js";
import { errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js";

class ListRole {
    handleAll = async (req, res) => {
        try {
            const query = req.query
            
            const filters = {}
            if (query.name) filters.name = { contains: query.name, mode: 'insensitive' }
            if (query.description) filters.description = { contains: query.description, mode: 'insensitive' }

            const options = {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    active: true
                },
                where: filters,
                orderBy: { name: 'asc' }
            }

            const roles = await RoleModel.findAll(options)
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
            return errorLog(res, 'Error al obtener el listado de roles', error)
        }
    }
}

export default ListRole