import BaseModel from "./Base/BaseModel.js";

class RoleHasPermissionsModel extends BaseModel {
    constructor() {
        super('roleHasPermissions')
    }
}

export default new RoleHasPermissionsModel()