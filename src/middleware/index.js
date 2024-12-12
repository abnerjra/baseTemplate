/**
 * Concentrado de middlewares
 */

import Auth from "./Auth.middleware.js";
import Prefix from "./Prefix.middleware.js";

const authMiddleware = new Auth();
const prefixMiddleware = new Prefix()

export {
    authMiddleware,
    prefixMiddleware
}