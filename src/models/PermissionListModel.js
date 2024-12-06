import BaseModel from "./Base/BaseModel.js";

class PermissionListModel extends BaseModel {
    constructor() {
        super("catPermissionList")
    }
}

export default new PermissionListModel()