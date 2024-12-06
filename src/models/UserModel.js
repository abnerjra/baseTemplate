import BaseModel from "./Base/BaseModel.js"

class UserModel extends BaseModel {
    constructor() {
        super('user') // nombre del modelo en prisma
    }

    /**
     * Get roles assigned to user
     * @param {Int} userId 
     * @returns 
     */
    hasRole = async (userId) => {
        const userRoles = await this.orm.userHasRole.findMany({
            where: { user_id: userId },
            select: {
                role: {
                    select: { id: true, name: true }
                }
            }
        })

        return userRoles.map(roleRelation => roleRelation.role)
    }

    getUserRelations = async (userId) => {
        const [
            roles
        ] = await Promise.all([
            this.hasRole(userId)
        ]);

        return {
            roles
        }
    }

    // Función para asignar o retirar roles de un usuario
    handleRoleAssignment = async (userId, rolesToAssign, orm = this.orm) => {
        // Paso 1: Validar nuevos roles
        // Paso 1.1: Validar que el objecto de no este vacio
        if (!rolesToAssign.length) {
            return {
                error: true,
                message: 'Validación: Es necesario proporcionar los roles'
            };
        }
        
        // Paso 1.2: Validar que los roles existen
        const rolesExist = await orm.roles.findMany({
            where: {
                id: { in: rolesToAssign }
            }
        });
    
        if (rolesExist.length !== rolesToAssign.length) {
            return {
                error: true,
                message: 'Validación: Los roles proporcionados, no pertenecen al catálogo de roles del sistema'
            };
        }

        // Paso 2: Obtener los roles actuales del usuario
        const currentRoles = await orm.userHasRole.findMany({
            where: { user_id: userId },
            select: { role_id: true }
        });
        
        const currentRoleIds = currentRoles.map(role => role.role_id);

        // Paso 3: Identificar los roles a eliminar y a agregar
        const rolesToRemove = currentRoleIds.filter(roleId => !rolesToAssign.includes(roleId));  // Roles que ya no deben estar
        const rolesToAdd = rolesToAssign.filter(roleId => !currentRoleIds.includes(roleId));     // Nuevos roles a agregar

        // Paso 4: Eliminar los roles que ya no deben estar asignados
        if (rolesToRemove.length) {
            await orm.userHasRole.deleteMany({
                where: {
                    user_id: userId,
                    role_id: { in: rolesToRemove }
                }
            });
        }

        // Paso 5: Agregar los nuevos roles
        if (rolesToAdd.length) {
            const userRolesToAdd = rolesToAdd.map(roleId => ({
                user_id: userId,
                role_id: roleId
            }));
            await orm.userHasRole.createMany({
                data: userRolesToAdd
            });
        }

        return {
            error: false,
            data: { rolesToAdd, rolesToRemove }
        };
    };
}

export default new UserModel()