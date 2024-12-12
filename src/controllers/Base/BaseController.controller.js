import prefixManager from "../../helpers/PrefixManager.helper.js"
import { error, getMessage } from "../../helpers/ResponseHandler.helper.js"
import PermissionModel from "../../models/PermissionModel.js"
import RoleHasPermissionsModel from "../../models/RoleHasPermissionsModel.js"
import UserModel from "../../models/UserModel.js"

class BaseController {
    constructor() {
        
    }

    /**
     * Metodo utilizado para recibir el nombre del permiso
     * @param {string} permission Nombre del permiso
     */
    setPermission = (permission) => {
        this.permission = permission
    }

    /**
     * Retorna el valor que fue asignado en el metodo setPermission
     * @returns {string} - Nombre del permiso
     */
    getPermission = () => {
        return this.permission
    }

    /**
     * Valida si el usuario cuenta con un permiso especifico.
     * @param {Request} req - La solicitud HTTP que contiene la sesión del usuario.
     * @returns {Promise<boolean>} - Devuelve un booleano que indica si el usuario tiene el permiso.
     */
    validatePermission = async (req) => {
        const permission = this.getPermission()
        if (permission) {
            const prefix = this.getPrefix()
            const userSession = req.user
            const { roles } = await UserModel.getUserRelations(userSession.id)
            
            let rolePermission = ""
            for (const role of roles) {
                rolePermission = `${role.key}.${prefix}.${permission}`
            }
            
            const roleIds = roles.map(role => role.id)
            
            const getRolePermissions = await RoleHasPermissionsModel.findAll({
                where: {
                    role_id: { in: roleIds }
                }
            })
            
            const permissionsIds = getRolePermissions.map(permission => permission.permission_id)
            const getPermission = await PermissionModel.findAll({
                select: {
                    name: true
                },
                where: {
                    id: { in: permissionsIds }
                }
            })
            
            const permissionsName = getPermission.map(permission => permission.name)
            if (permissionsName.includes(rolePermission)) {
                // console.log(`*** El usuario cuenta con el permiso: ${rolePermission}`);
                return true
            } else {
                // console.log(`--- El usuario NO cuenta con el permiso: ${rolePermission}`);
                return false
            }
        }
    }

    /**
     * Obtiene el prefijo de la ruta
     * @returns {string} - Prefijo de la ruta
     */
    getPrefix = () => {
        return prefixManager.getPrefix()
    }

    /**
     * Retorna el nombre de una función
     * @returns {string} - El nombre de la función que llama a este método.
     */
    getCurrentFunctionName = () => {
        const stack = new Error().stack;
        const stackLines = stack.split("\n");
        const currentFunctionLine = stackLines[2]; // Cambia el índice si necesitas otra profundidad
        const functionName = currentFunctionLine.match(/at (\S+)/)?.[1] || "anonymous";
        return functionName.split('.')[1];
    }

    /**
     * Verifica si el usuario tiene permisos para realizar una acción específica.
     * @param {Request} req - La solicitud HTTP.
     * @param {string} action - Acción que se desea validar.
     * @returns {Promise<object>} - Un objeto que contiene la validación y un mensaje de error si no tiene permiso.
     */
    checkPermission = async (req, action) => {
        const permissionMap = {
            index: 'read',
            show: 'read',
            store: 'create',
            update: 'update'
        }

        const permission = permissionMap[action] ?? null
        
        const message = getMessage('permission.without_permission')
        if (permission) {
            this.setPermission(permission)
            const validate = await this.validatePermission(req)
            
            if (validate) {
                return {
                    validate: true
                }
            } else {
                return {
                    validate: false,
                    message
                }
            }
        }
        return {
            validate: false,
            message
        }
    }
}

export default BaseController