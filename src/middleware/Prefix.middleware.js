import prefixManager from "../helpers/PrefixManager.helper.js";

class Prefix {
    handle = (req, res, next) => {
        // Obtenemos la ruta completa del request
        const path = req.path
        // regex que captura el prefijo después de api/
        const match = path.match(/^\/api\/([^/]+)/)
        req.apiPrefix = match ? match[1] : null
        
        prefixManager.setPrefix(req.apiPrefix)
        next()
    }
}

export default Prefix