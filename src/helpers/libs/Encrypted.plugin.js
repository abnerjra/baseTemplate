import bcrypt from 'bcryptjs'

class Encrypted {
    /**
     * Metodo encargado de cifrar la contraseña
     * 
     * @param {String} text Contraseña en texto plano
     * @returns Contraseña codificada
     */
    static handlePassword = async (text) => {
        return await bcrypt.hash(text, 12)
    }

    /**
     * Comprueba si la contraseña ingresada coincide con el hash guardado
     * 
     * @param {String} text Contraseña en texto plano
     * @param {String} hash Contraseña con hash, la cual se obtiene de la BD
     * @returns true|false
     */
    static handleCompare = async (text, hash) => {
        return await bcrypt.compare(text, hash);
    }
}

export const { handleCompare, handlePassword } = Encrypted