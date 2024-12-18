import ModuleModel from "../../models/ModuleModel.js"
import { error, errorLog, getMessage, success } from "../../helpers/ResponseHandler.helper.js"

class Module {
    handleModule = async (req, res) => {
        try {
            const options = {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    active: true
                }
            }
            const modules = await ModuleModel.findAll(options)
            if (!modules.length) return error(res, getMessage("response.empty"))

            const getModules = await Promise.all(
                modules.map(async (module) => {
                    const { listPermissions } = await ModuleModel.getRelations(module.id)
                    return {
                        ...module,
                        permissions: listPermissions
                    }
                })
            )

            return success(res, getMessage("response.reads"), getModules)
        } catch (error) {
            if (error.isCustomError) {
                return error(res, error.mesagge, error)
            } else {
                return errorLog(res, 'Error al crear el rol', error)
            }
        }
    }
}

export default Module