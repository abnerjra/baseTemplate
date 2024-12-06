/**
 * Concentrado de middlewares
 */

import Auth from "./Auth.middleware.js";

const authMiddleware = new Auth();

export {
    authMiddleware
}