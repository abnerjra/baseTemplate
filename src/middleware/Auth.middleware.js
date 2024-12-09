import UserModel from '../models/UserModel.js'

import { verifyToken } from '../helpers/libs/Token.plugin.js'
import { handleVerifyToken } from '../helpers/AuthToken.helper.js'
import { error, errorLog, getMessage } from '../helpers/ResponseHandler.helper.js'

class Auth {
    handle = async (req, res, next) => {
        try {
            if (!req.headers.authorization) return error(res, getMessage('auth.requiredToken'))
            
            // Obtener el token del header
            const token = req.headers.authorization.split(' ').pop()
            
            // Obtener el payload del token
            const dataToken = verifyToken(token)
    
            if (!dataToken.id) return error(res, getMessage('auth.invalidToken'))
            
            // Comprobar el usuario de la sesion
            const user = await UserModel.findById(dataToken.id)
            
            // validar que el token del usuario continue activo
            const activeToken = await handleVerifyToken(user.id)
            if (!activeToken)  return error(res, getMessage('auth.invalidToken'))

            const { is_deleted, created_at, updated_at, ...filterUser } = user
            
            req.user = filterUser
            next()
        } catch (exception) {
            return error(res, getMessage('auth.sessionExpire'), exception)
        }
    }
}

export default Auth