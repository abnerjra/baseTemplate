import ExpressAdapter from "../../helpers/libs/ExpressAdapter.plugin.js"
import CatalogController from "../../controllers/Catalog/CatalogController.contoller.js"

class CatalogRoutes {
    constructor() {
        this.expressAdapter = new ExpressAdapter
        this.protectedRouter = this.expressAdapter.createRouter()
        this.CatalogController = new CatalogController
        this.initializeRoutes()
    }

    initializeRoutes = () => {
        const {
            getModules
        } = this.CatalogController
        this.protectedRouter.get('/catalog/module/', getModules.bind(this.CatalogController))
    }

    getProtectedRouter = () => {
        return this.protectedRouter
    }
}

export default CatalogRoutes