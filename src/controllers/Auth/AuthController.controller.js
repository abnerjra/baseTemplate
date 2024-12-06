import Auth from "../../use-cases/Auth/Auth.usecase.js";

class AuthController {
    constructor() {
        this.auth = new Auth()
    }

    login = async (req, res) => {
        const { email, password } = req.body
        return await this.auth.login(email, password, res)
    }

    logout = async (req, res) => {
        const token = req.headers.authorization.split(' ').pop()
        return await this.auth.logout(token, res)
    }
}

export default AuthController