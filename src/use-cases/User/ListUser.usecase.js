import UserModel from '../../models/UserModel.js';
import { errorLog, getMessage, success } from '../../helpers/ResponseHandler.helper.js';

class ListUser {
    handleAll = async (req, res) => {
        try {
            const data = req.query;
            
            const select = {
                id: true,
                name: true,
                first_last_name: true,
                second_last_name: true,
                email: true,
            }
            
            const filters = {};
            if (data.name) filters.name = { contains: data.name, mode: 'insensitive' };
            if (data.email) filters.email = { contains: data.email, mode: 'insensitive' };
            if (data.active) filters.active = data.active === 'true' || data.active == 1 ? true : false;
            console.log(filters);            
    
            const orderBy = {
                name: 'asc',
            }

            const users = await UserModel.findAll(select, filters, orderBy);
    
            if (!users.length) return success(res, getMessage('response.empty'));
    
            // Mandar a llamar las relaciones que sean necesarias
            const dataUsers = await Promise.all(
                users.map(async user => {
                    const { roles } = await UserModel.getUserRelations(user.id);
                    return {
                        ...user,
                        roles
                    };
                })
            );

            return success(res, getMessage('response.reads'), dataUsers);
        } catch (error) {
            return errorLog(res, 'Error al obtener el listado de usuarios', error);
        }
    };
}

export default ListUser