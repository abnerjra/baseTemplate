import RoleModel from "../../src/models/RoleModel.js"
import UserHasRoleModel from "../../src/models/UserHasRoleModel.js"
import UserModel from "../../src/models/UserModel.js"

class AssignRoleUserSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async() => {
        const roleRoot = await RoleModel.findOne({ where: { key: 'root' } })
        const roleAdmin = await RoleModel.findOne({ where: { key: 'admin' } })

        const userRoot = await UserModel.findOne({ where: { email: 'abner.jurado@teit.cfe.mx' } })
        const userAdmin = await UserModel.findOne({ where: { email: 'diego.galvan@teit.cfe.mx' } })

        const userHasRole = [
            {
                user_id: userRoot.id,
                role_id: roleRoot.id
            },
            {
                user_id: userAdmin.id,
                role_id: roleAdmin.id
            }
        ]

        let cont = 0
        for (const content of userHasRole) {
            const checkRoleUser = await UserHasRoleModel.findOne({
                where: {
                    user_id: content.user_id,
                    role_id: content.role_id
                }
            })
            
            if (!checkRoleUser) {
                await UserHasRoleModel.create(content)
                cont++
            }
        }
        
        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${userHasRole.length}`);
    }
}

export default AssignRoleUserSeeder