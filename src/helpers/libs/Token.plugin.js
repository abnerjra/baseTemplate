import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

class Token {
    /**
     * Objeto del usuario
     * @param {object} user 
     */
    static tokenSing = (user) => {
        

        const sing = jwt.sign(
            {
                id: user.id,
                name: `${user.name} ${user.first_last_name}`,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        return sing
    }

    /**
     * Recibe el JWT de la sesion
     * @param {string} token Token de la sesion
     * @returns {Boolean}
     */
    static verifyToken = (token) => {
        try {
            return jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return null
        }
    }
}

export const { tokenSing, verifyToken } = Token