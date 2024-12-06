import BaseModel from "./Base/BaseModel.js";

class PermissionModel extends BaseModel {
    constructor() {
        super("permissions")
    }
}

export default new PermissionModel()