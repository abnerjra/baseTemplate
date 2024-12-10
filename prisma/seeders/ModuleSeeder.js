import ModuleModel from "../../src/models/ModuleModel.js"

class ModuleSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const data = [
            {
                name: 'Usuarios',
                key: 'user',
                description: 'Módulo de usuarios'
            },
            {
                name: 'Roles y permisos',
                key: 'role',
                description: 'Módulo de roles y permisos'
            }
        ]

        let cont = 0
        for (const content of data) {
            const uniqueKey = await ModuleModel.findOne({ where: { key: content.key } })
            
            if (!uniqueKey) {
                await ModuleModel.create(content)
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${data.length}`);
    }
}

export default ModuleSeeder