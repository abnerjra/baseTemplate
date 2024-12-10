import RoleModel from "../../src/models/RoleModel.js"

class RoleSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const data = [
            {
                name: 'ROL ROOT',
                key: 'root',
                description: 'Superadministrador'
            },
            {
                name: 'ROL ADMINISTRADOR',
                key: 'admin',
                description: 'Administrador'
            }
        ]

        let cont = 0
        for (const content of data) {
            const uniqueKey =  await RoleModel.findOne({ where: { key: content.key } })

            if (!uniqueKey) {
                await RoleModel.create(content)
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${data.length}`);
    }
}

export default RoleSeeder