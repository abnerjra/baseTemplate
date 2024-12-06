import BaseModel from '../models/Base/BaseModel.js';
import { errorLog } from './ResponseHandler.helper.js';

class ResetSequence extends BaseModel{
    constructor() {
        super()
    }

    handleRebootSequence = async (tables) => {
        try {
            for (const table of tables) {
                // Obtener el valor máximo del ID de la tabla
                const result = await this.orm.$queryRawUnsafe(
                    `SELECT COALESCE(MAX("id"), 0) AS "maxId" FROM "${table}"`
                );

                const maxId = result[0]?.maxId || 0;

                // Reiniciar la secuencia de ID
                await this.orm.$executeRawUnsafe(
                    `ALTER SEQUENCE "${table}_id_seq" RESTART WITH ${maxId + 1}`
                );
            }
            console.log('Secuencias reiniciadas con éxito...');
        } catch (error) {
            console.error('Error al reiniciar las secuencias:', error);
            return errorLog(res, 'Error al restablecer la secuencia', error)
        } finally {
            await this.orm.$disconnect(); // Asegurarse de cerrar la conexión al final
        }
    }
}

const resetSequenceInstance = new ResetSequence
export const {
    handleRebootSequence
} = resetSequenceInstance