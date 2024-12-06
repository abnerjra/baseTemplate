import UserModel from "../../src/models/UserModel.js"
import { handlePassword } from "../../src/helpers/libs/Encrypted.plugin.js"

class UserSeeder {
    constructor() {
        this.className = this.constructor.name
    }

    seed = async () => {
        const data = [
            {
                name: 'Abner',
                first_last_name: 'Jurado',
                email: 'abner.jurado@teit.cfe.mx',
                password: await handlePassword('abner.jurado'),
                acronym: 'AJH'
            },
            {
                name: 'Diego',
                first_last_name: 'Galvan',
                email: 'diego.galvan@teit.cfe.mx',
                password: await handlePassword('diego.galvan'),
                acronym: 'DGA'
            }
        ]

        let cont = 0;
        for (const content of data) {
            const checkUser = await UserModel.findOne({ email: content.email })

            if (!checkUser) {
                await UserModel.create(content)
                cont++;
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} registro(s) creado(s) de un total de ${data.length}`);
    }
}

export default UserSeeder