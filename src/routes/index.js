/**
 * Concentrado de rutas
 */

import AuthRoutes from "./Auth/auth.route.js";
import CatalogRoutes from "./Catalogs/CatalogRoutes.route.js";
import RoleRoutes from "./Role/RoleRoutes.route.js";
import UserRoutes from "./User/UserRoutes.js";

const authRoute = new AuthRoutes
const userRoute = new UserRoutes
const roleRoute = new RoleRoutes
const catalogRoute = new CatalogRoutes

export {
    authRoute,
    userRoute,
    roleRoute,
    catalogRoute
}