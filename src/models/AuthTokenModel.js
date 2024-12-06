import BaseModel from "./Base/BaseModel.js";

class AuthTokenModel extends BaseModel {
    constructor() {
        super("AuthToken")
    }
}

export default new AuthTokenModel()