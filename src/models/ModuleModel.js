import BaseModel from "./Base/BaseModel.js";
import PermissionModuleModel from "./PermissionModuleModel.js";

class ModuleModel extends BaseModel {
    constructor() {
        super('catModule')
    }

    hasPermission = async (moduleId) => {
        const select = {
            permissionList: {
                select: {
                    name: true, key: true
                }
            }
        }
        const listPermissions = await PermissionModuleModel.findAll(select, { module_id: moduleId })
        
        return listPermissions.map(list => list.permissionList)
    }

    getRelations = async (moduleId) => {
        const [ 
            listPermissions
         ] = await Promise.all([
            this.hasPermission(moduleId)
        ])

        return {
            listPermissions
        }
    }
}

export default new ModuleModel()