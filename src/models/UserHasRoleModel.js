import BaseModel from "./Base/BaseModel.js"

class UserHasRole extends BaseModel{
    constructor() {
        super("userHasRole")
    }
}

export default new UserHasRole()