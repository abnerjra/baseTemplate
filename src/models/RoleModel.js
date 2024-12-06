import { handleRebootSequence } from "../helpers/ResetSequence.helper.js"
import BaseModel from "./Base/BaseModel.js"
import ModuleModel from "./ModuleModel.js"
import PermissionModel from "./PermissionModel.js"
import RoleHasPermissionsModel from "./RoleHasPermissionsModel.js"

class RoleModel extends BaseModel{
    constructor() {
        super('roles')
    }

    /**
     * Gestiona la asignación de permisos a un rol específico
     * 
     * @param {number} roleId - Identificador único del rol.
     * @param {Array<string>} modulesToAssign - Lista de módulos con los permisos que serán asignados o removidos del rol.
     * @param {string} modulesToAssign[].moduleKey - Clave única del módulo (por ejemplo: "user", "role").
     * @param {Array<string>} modulesToAssign[].permissions - Lista de permisos (acciones) a asignar dentro del módulo.
     * 
     * @returns {void}
     * 
     * @example
     * const roleId = 1; // ID del rol
     * const modulesToAssign = [
     *   {
     *     moduleKey: "user",
     *     permissions: ["read", "create", "update"]
     *   },
     *   {
     *     moduleKey: "role",
     *     permissions: ["read", "delete"]
     *   }
     * ];
     * 
     * await handlePermissionsAssignment(roleId, modulesToAssign);
     * 
     * // Resultado esperado:
     * // El rol con ID 1 tendrá asignados los permisos "read", "create", y "update" en el módulo "user",
     * // y los permisos "read" y "delete" en el módulo "role".
     */
    handlePermissionsAssignment = async (roleId, modulesToAssign, orm = this.orm) => {
        try {
            const currentRole = await this.findById(roleId)
            
            const currentPermits = await orm.roleHasPermissions.findMany({
                where: { role_id: roleId }
            })
            const currentPermitsIds = currentPermits.map((element) => element.permission_id)

            const permissionsInBD = await orm.permissions.findMany({
                select: {
                    action: true,
                    module_id: true
                },
                where: {
                    id: { in: currentPermitsIds }, is_deleted: false
                }
            })

            const requestPermissions = []
            for (const module of modulesToAssign) {
                for (const key of module.permissions) {
                    requestPermissions.push({ action: key, module_id: module.module })
                }
            }

            const isEqual = (permissionsInBD, requestPermissions) =>
                permissionsInBD.action === requestPermissions.action &&
                permissionsInBD.module_id === requestPermissions.module_id

            const newPermits = requestPermissions.filter(
                (item2) => !permissionsInBD.some((item1) => isEqual(item1, item2))
            )

            const removedPermits = permissionsInBD.filter(
                (item1) => !requestPermissions.some((item2) => isEqual(item1, item2))
            )
            
            if (newPermits.length) {
                for (const permit of newPermits) {
                    const moduleName = await orm.catModule.findFirst({
                        where: {
                            id: permit.module_id
                        }
                    })
                    const permission = {
                        ...permit,
                        name:`${currentRole.key}.${moduleName.key}.${permit.action}`
                    }
                    
                    const existPermission = await orm.permissions.findFirst({
                        where: permission
                    })
                    if (existPermission) {
                        await orm.permissions.update({
                            where: { id: existPermission.id },
                            data: { is_deleted: false }
                        })
                    } else {
                        const newPermission = await orm.permissions.create({
                            data: permission
                        })
                        
                        await orm.roleHasPermissions.create({
                            data: {
                                role_id: roleId,
                                permission_id: newPermission.id
                            }
                        })
                    }
                }
            }

            if (removedPermits.length) {
                for (const permission of removedPermits) {
                    const moduleName = await orm.catModule.findFirst({
                        where: { id: permission.module_id }
                    })
                    
                    const checkPermission = await orm.permissions.findFirst({
                        where: {
                            ...permission,
                            name: `${currentRole.key}.${moduleName.key}.${permission.action}`,
                        }
                    })

                    if (checkPermission) {
                        await orm.permissions.update({
                            where: { id: checkPermission.id },
                            data: { is_deleted: true }
                        })
                    }
                }
            }

            return {
                error: false
            }
        } catch (error) {
            await handleRebootSequence(['permissions'])
            return {
                error: true,
                message: error.message,
            }
        }
    }

    // Llamada de los metodos de relacion
    /**
     * Contiene las relacioones asociadas el modelo de roles
     * @param {number} roleId Identificador del rol
     * @returns {void}
     * 
     * - Listado de relaciones
     * - permissions    =>  Permisos asociados al rol
     */
    getRoleRelations = async (roleId) => {
        const [
            permissions
        ] = await Promise.all([
            this.hasPermission(roleId)
        ])

        return {
            permissions
        }
    }
    
    // Agregar metodos de relacion
    /**
     * Devuelve los permisos asociados al rol, indicando el modulo y sus permisos
     * @param {number} roleId Identificador unico del rol
     * @returns {object}
     * 
     * @example
     * Estructura de la respuesta
     * 
     * {
     *  role: [
     *      { description: 'Crear', action: 'create' },
     *      { description: 'Leer', action: 'read' },
     *      { description: 'Actualizar', action: 'update' },
     *      { description: 'Eliminar', action: 'delete' }
     *  ],
     *  user: [
     *      { description: 'Crear', action: 'create' },
     *      { description: 'Leer', action: 'read' },
     *      { description: 'Actualizar', action: 'update' },
     *      { description: 'Eliminar', action: 'delete' }
     *  ]
     * }
     * 
     */
    hasPermission = async (roleId) => {
        const activePermissions = await PermissionModel.findAll({
            name: true,
            action: true,
            module: {
                select: {
                    key: true,
                    permissionsModule: {
                        select: {
                            permissionList: {
                                select: {
                                    name: true,
                                    key: true
                                },
                            },
                        },
                    },
                },
            },
        }, {
            is_deleted: false, // Solo permisos activos
            roleHasPermission: {
                some: { role_id: roleId }, // Relación con RoleHasPermissions
            },
        })
        
        const result = activePermissions.map(permission => {
            const matchingPermission = permission.module.permissionsModule.find(pm =>
                pm.permissionList.key.includes(permission.action) // Coincidencia con el `action`
            )

            return {
                action: permission.action,
                moduleKey: permission.module.key,
                description: matchingPermission.permissionList.name // Nombre del permiso coincidente
            }
        })

        const associatedPermissions = {}
        for (const element of result) {
            if (!associatedPermissions[element.moduleKey]) {
                associatedPermissions[element.moduleKey] = []
            }

            associatedPermissions[element.moduleKey].push({
                description: element.description,
                action: element.action
            })
        }
        
        return associatedPermissions
    }
}

export default new RoleModel()