import UserModel from "../../models/UserModel.js"
import RoleModel from "../../models/RoleModel.js"

import { handleCompare } from "../../helpers/libs/Encrypted.plugin.js"
import { tokenSing, verifyToken } from "../../helpers/libs/Token.plugin.js"

import { handleRegisterToken, handleVerifyToken, handleDestroyToken } from "../../helpers/AuthToken.helper.js"
import { convertUnixToDate } from "../../helpers/GeneralFunctions.helper.js"
import { error, errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js"


class Auth {
    login = async (email, password, res) => {
        try {
            // Check that the email exists
            const user = await UserModel.findOne({ email })
            if (!user) return error(res, getMessage("auth.notFoundEmail"))
            
            // Check that the password matches
            const isMatch = await handleCompare(password, user.password);
            if (!isMatch) return error(res, getMessage('auth.notMatchPassword'))

            // remove the password field from the object
            delete user.password;

            // Before creating a new token, validate that there is no previously active one
            const activeToken = await handleVerifyToken(user.id)
            
            // Get the token and its expiration date
            const { token, expires_at } = await this.getTokenData(user, activeToken);
            
            // get roles associated to user
            const { roles } = await UserModel.getUserRelations(user.id)

            let listPermission = null
            for (const rol of roles) {
                const { permissions } = await RoleModel.getRoleRelations(rol.id)
                listPermission = permissions
            }

            // Send response
            const data = {
                id: user.id,
                name: `${user.name} ${user.first_last_name} ${user.second_last_name}`,
                email: user.email,
                acronym: user.acronym,
                roles,
                permission: listPermission,
                token,
                expires_at,
            };

            return success(res, getMessage('auth.login'), data)
        } catch (error) {
            return errorLog(res, 'Ocurrio un error en el inicio de sesión', error)
        }
    }

    logout = async (token, res) => {
        try {
            const revokedToken = await handleDestroyToken(token)

            if (!revokedToken) return error(res, getMessage('auth.invalidToken'))
            
            return success(res, getMessage('auth.logout'), revokedToken)
        } catch (error) {
            return errorLog(res, 'Ocurrio un error al momento de cerrar la sesión', error)
        }
    }

    /**
     * Function to create or retrieve a token
     * @param {object} user user data
     * @param {*} activeToken contains the user's token or a null value
     * @returns 
     */
    getTokenData = async (user, activeToken) => {
        // If there is no active token, generate a new one
        if (!activeToken) {
            const token = tokenSing(user);
            const validateToken = verifyToken(token);

            // Convert dates
            const iat = convertUnixToDate(validateToken.iat).fullDate;
            const exp = convertUnixToDate(validateToken.exp).fullDate;

            // Register the new token in the DB
            const dataToken = {
                token,
                user_id: user.id,
                created_at: iat,
                expires_at: exp,
            };
            await handleRegisterToken(dataToken);

            return { token, expires_at: exp };
        }

        // If an active token already exists, validate it
        const validateToken = await verifyToken(activeToken);

        const exp = convertUnixToDate(validateToken.exp).fullDate;
        const token = activeToken

        return { token, expires_at: exp };
    };
}

export default Auth