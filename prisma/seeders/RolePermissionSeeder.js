import ModuleModel from "../../src/models/ModuleModel.js"
import PermissionModel from "../../src/models/PermissionModel.js"
import PermissionListModel from "../../src/models/PermissionListModel.js"
import RoleModel from "../../src/models/RoleModel.js"
import RoleHasPermissionsModel from "../../src/models/RoleHasPermissionsModel.js"

class RolePermissionSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const permissionList = await PermissionListModel.findAll({ where : { active: true } })
        const moduleRoot = await ModuleModel.findAll()
        const moduleAdmin = await ModuleModel.findAll({ where : { key: 'user' } })
        const roleRoot = await RoleModel.findOne({ where: { key: 'root' } })
        const roleAdmin = await RoleModel.findOne({ where: { key: 'admin' } })

        // build permissions array by role
        // ROLE ROOT
        let permissions = []
        for (const module of moduleRoot) {
            for (const permission of permissionList) {
                permissions.push({
                    name: `${roleRoot.key}.${module.key}.${permission.key}`,
                    action: permission.key,
                    module_id: module.id,
                    role_id: roleRoot.id
                })
            }
        }
        // console.log(permissions);

        // ROLE ADMIN
        for (const module of moduleAdmin) {
            for (const permission of permissionList) {
                permissions.push({
                    name: `${roleAdmin.key}.${module.key}.${permission.key}`,
                    action: permission.key,
                    module_id: module.id,
                    role_id: roleAdmin.id
                })
            }
        }
        // console.log(permissions, `\nTotal de registros: ${permissions.length}`);

        // Save DB
        let cont = 0
        for (const permission of permissions) {
            const checkPermission = await PermissionModel.findOne({ where: { name: permission.name } })
            // console.log(checkPermission);

            if (!checkPermission) {
                const createdPermission = await PermissionModel.create({
                    name: permission.name,
                    action: permission.action,
                    module_id: permission.module_id
                })

                const existsRelation = await RoleHasPermissionsModel.findOne({
                    where: {
                        role_id: permission.role_id,
                        permission_id: createdPermission.id
                    }
                })

                if (!existsRelation) {
                    await RoleHasPermissionsModel.create({
                        role_id: permission.role_id,
                        permission_id: createdPermission.id
                    })
                }
                cont ++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${permissions.length}`);
    }
}

export default RolePermissionSeeder