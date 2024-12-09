import BaseModel from '../models/Base/BaseModel.js';
import { errorLog } from './ResponseHandler.helper.js';

class ResetSequence extends BaseModel{
    constructor() {
        super()
    }

    /**
     * Reinicia las secuencias de IDs para las tablas proporcionadas, ajustando el valor inicial de la secuencia 
     * al máximo ID actual en cada tabla.
     *
     * @function handleRebootSequence
     * @param {Array<string>} tables - Lista de nombres de las tablas cuyas secuencias de IDs deben reiniciarse.
     * 
     * @returns {Promise<void>} - No devuelve un valor directamente, pero puede registrar un mensaje de éxito o manejar errores.
     *
     * @throws {Error} - Lanza un error si ocurre un problema al reiniciar las secuencias.
     *
     * @example
     * const tables = ['users', 'orders', 'products'];
     * 
     * @description
     * 1. Para cada tabla en la lista:
     *    - Obtiene el valor máximo del campo `id` en la tabla.
     *    - Ajusta la secuencia asociada (por ejemplo, `table_id_seq`) para que comience desde `maxId + 1`.
     * 2. Utiliza consultas SQL en bruto para interactuar directamente con la base de datos.
     * 3. Maneja errores durante la operación, registrándolos y cerrando la conexión de manera segura.
     *
     */
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