import Module from "../../use-cases/Catalogs/Module.usecase.js"

class CatalogController {
    constructor() {
        this.moduleUC = new Module
    }
    
    getModules = async (req, res) => {
        return await this.moduleUC.handleModule(req, res)
    }
}


export default CatalogController