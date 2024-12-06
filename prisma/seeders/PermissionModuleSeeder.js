import ModuleModel from "../../src/models/ModuleModel.js"
import PermissionListModel from "../../src/models/PermissionListModel.js"
import PermissionModuleModel from "../../src/models/PermissionModuleModel.js"

class PermissionModuleSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const modules = await ModuleModel.findAll(null, { active: true })
        const permissionList = await PermissionListModel.findAll(null, { active: true })

        let permissionModule = []
        for (const module of modules) {
            for (const permission of permissionList) {
                permissionModule.push({
                    module_id: module.id,
                    permission_list_id: permission.id
                })
            }
        }

        let cont = 0
        for (const content of permissionModule) {
            const checkPermission = await PermissionModuleModel.findOne({
                module_id: content.module_id,
                permission_list_id: content.permission_list_id
            })
            
            if (!checkPermission) {
                await PermissionModuleModel.create({
                    module_id: content.module_id,
                    permission_list_id: content.permission_list_id
                })
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${permissionModule.length}`);
    }
}

export default PermissionModuleSeeder