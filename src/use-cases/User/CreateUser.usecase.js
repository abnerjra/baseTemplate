import UserModel from '../../models/UserModel.js';
import { handlePassword } from '../../helpers/libs/Encrypted.plugin.js';
import { handleRebootSequence } from '../../helpers/ResetSequence.helper.js';
import { error, errorLog, getMessage, success } from '../../helpers/ResponseHandler.helper.js';

class CreateUser {
    handleCreate = async (req, res) => {
        const tables = ['user'];
        try {
            const data = req.body;

            // Verificar si el correo ya existe
            const checkEmail = await UserModel.findAll(null, { email: data.email });
            if (checkEmail.length) return error(res, getMessage('validate.existsEmail'));
            // return res.status(200).json({ data })

            // Ejecutamos la transacción
            const result = await UserModel.transaction(async () => {
                const hashedPassword = await handlePassword(data.password);

                // Crear el usuario dentro de la transacción
                const user = await UserModel.create({
                    name: data.name,
                    first_last_name: data.firstLastName,
                    second_last_name: data.secondLastName,
                    email: data.email,
                    password: hashedPassword,
                    acronym: data.acronym
                });
                
                // Asignar roles al usuario
                const assignRoleResponse = await UserModel.handleRoleAssignment(user.id, data.roles);

                // Si hay un error en la asignación de roles, lanza un error para cancelar la transacción
                if (assignRoleResponse.error) {
                    const customError = new Error(assignRoleResponse.message);
                    customError.isCustomError = true
                    throw customError
                }
                
                return user; // Retorna el usuario creado si todo es exitoso
            });

            return success(res, getMessage('response.create'), result.id);
        } catch (error) {
            // Reiniciar las secuencias en caso de error
            await handleRebootSequence(tables);

            if (error.isCustomError) {
                // Manejar errores personalizados
                return errorLog(res, error.message, error);
            } else {
                // Manejar errores generales (de ejecución)
                return errorLog(res, 'Error al crear el usuario', error);
            }
        }
    };
}

export default CreateUser;
