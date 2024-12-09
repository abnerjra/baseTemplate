import AuthTokenModel from "../models/AuthTokenModel.js";
import { handleRebootSequence } from "./ResetSequence.helper.js"
import { verifyToken } from "./libs/Token.plugin.js"

class AuthToken {
    /**
     * Register the token created at login in the database
     * @param {object} data Contains registration information.
     */
    handleRegisterToken = async (data) => {
        try {
            // Ejecutamos la transacción
            const result = await AuthTokenModel.transaction(async (orm) => {
                // Crear el registro dentro de la transacción
                const register = await AuthTokenModel.create(data);

                console.log(`Token registrado...`);
                
                return register;
            });
        } catch (error) {
            console.log(error);
            const tables = ['auth_token']
            await handleRebootSequence(tables)
        }
    }

    /**
     * Checks if the user has an active token, if so, verifies that it is still valid and returns it, otherwise returns null
     * @param {Integer} userId User ID in database
     * @returns null|token
     */
    handleVerifyToken = async (userId) => {
        const authTokenActive = await AuthTokenModel.findOne({
            where: {
                user_id: userId,
                revoked: false
            }
        })

        if (!authTokenActive) return null
        
        const token = authTokenActive.token
        const checkToken = verifyToken(token)
        if (!checkToken) {
            await AuthTokenModel.updateWithoutId({ token }, { revoked: true })
            return null
        }

        return token
    }

    /**
     * Disabled user token on session close
     * @param {String} token Session token
     * @returns 
     */
    handleDestroyToken = async (token) => {
        try {
            const activeToken = await AuthTokenModel.findOne({ where: { token, revoked: false } })
            
            if (!activeToken) return null
            
            await AuthTokenModel.updateWithoutId({ token: token }, { revoked: true });
        
            return true
        } catch (error) {
            return false
        }
    }
}

const authTokenInstance = new AuthToken()
export const { 
    handleRegisterToken,
    handleVerifyToken,
    handleDestroyToken
 } = authTokenInstance