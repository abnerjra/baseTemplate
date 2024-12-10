import PermissionListModel from "../../src/models/PermissionListModel.js"

class PermissionListSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        
        const data = [
            {
                name: "Crear",
                key: "create"
            },
            {
                name: "Leer",
                key: "read"
            },
            {
                name: "Actualizar",
                key: "update"
            },
            {
                name: "Eliminar",
                key: "delete"
            }
        ]
        
        let cont = 0
        for (const content of data) {
            const uniqueKey = await PermissionListModel.findOne({ where: { key: content.key } })

            if (!uniqueKey) {
                await PermissionListModel.create(content)
                cont++
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${data.length}`);
    }
}

export default PermissionListSeeder