import OrmAdapterInstance from "../../helpers/libs/OrmAdapter.plugin.js";

class BaseModel {
    constructor(modelName = null) {
        this.modelName = modelName;
        this.orm = OrmAdapterInstance.getClient(); // Obtiene la instancia del ORM automáticamente
        if (modelName) {
            // console.log(`Model name: ${this.modelName}`);
        } else {
            // console.warn('No se especificó un modelo. Usando funcionalidad genérica.');
        }
    }

    /**
     * Busca un registro por su identificador único.
     * @param {integer} id Identificador único del registro
     * @returns {Promise<object | null>} Devuelve los datos del registro en forma de objeto o un null si no hay datos
     */
    findById = async (id) => {
        const query = { where: { id } };
    
        return this.orm[this.modelName].findUnique(query);
    };
    

    /**
     * Realiza una búsqueda de múltiples registros en la base de datos utilizando los filtros proporcionados.
     * @param {Object} filters - Filtros para personalizar la consulta.
     * @param {Object<Object>} [filters.select] - Campos a seleccionar en los registros encontrados.
     *     Ejemplo: `{ id: true, name: true }`.
     * @param {Object} [filters.where] - Condiciones para filtrar los registros.
     *     Ejemplo: `{ is_active: true }`.
     * @param {Object|Array} [filters.orderBy] - Especifica cómo ordenar los resultados.
     *     Ejemplo: `{ name: 'asc' }` o `[{ name: 'asc' }, { created_at: 'desc' }]`.
     * @returns {Promise<Array<Object>>} - Una promesa que se resuelve con una lista de registros encontrados.
     * 
     * @example
     * // Buscar registros activos con campos específicos
     * const filters = {
     *   select: { id: true, name: true },
     *   where: { isActive: true },
     *   orderBy: { name: 'asc' },
     * };
     */
    findAll = async (filters) => {
        const query = {};
        const { select, where, orderBy } = filters
        
        if (select) query.select = select
        if (where) query.where = where
        if (orderBy) query.orderBy = orderBy
        
        return this.orm[this.modelName].findMany(query);
    };

    /**
     * Realiza la búsqueda de un registro en la base de datos utilizando los filtros proporcionados.
     * @param {Object} filters - Filtros para personalizar la consulta.
     * @param {Object<Object>} [filters.select] - Campos a seleccionar en los registros encontrados.
     *     Ejemplo: `{ id: true, name: true }`.
     * @param {Object} [filters.where] - Condiciones para filtrar los registros.
     *     Ejemplo: `{ is_active: true }`.
     * @param {Object|Array} [filters.orderBy] - Especifica cómo ordenar los resultados.
     *     Ejemplo: `{ name: 'asc' }` o `[{ name: 'asc' }, { created_at: 'desc' }]`.
     * @returns {Promise<Array<Object>>} - Una promesa que se resuelve con una lista de registros encontrados.
     * 
     * @example
     * // Buscar registros activos con campos específicos
     * const filters = {
     *   select: { id: true, name: true },
     *   where: { isActive: true },
     *   orderBy: { name: 'asc' },
     * };
     */
    findOne = async (filters) => {
        const query = {};
        const { select, where, orderBy } = filters
        
        if (select) query.select = select
        if (where) query.where = where
        if (orderBy) query.orderBy = orderBy
    
        return this.orm[this.modelName].findFirst(query);
    };
    

    /**
     * Crea un nuevo registro en la base de datos.
     * @param {object} data Objeto con la informacion del registro a guardar
     * @returns {Promise<object>} Objeto del registro creado.
     */
    create = async (data) => {
        return this.orm[this.modelName].create({ data });
    }

    /**
     * Actualiza un registro existente identificado por su ID.
     * @param {number} id Identificador único del registro
     * @param {object} data Información de los campos a actualizar
     * @returns {Promise<object>} Objeto del registro actualizado
     */
    update = async (id, data) => {
        return this.orm[this.modelName].update({ where: { id }, data });
    }

    /**
     * Actualiza un registro existente si no se cuenta con el identificador del registro
     * @param {object} where Indica una columna especifica si no se cuenta con un campo id
     * @param {object} data Información de los campos a actualizar
     * 
     * @example
     * const where = {
     *      email: test@email.com
     * }
     * 
     * const data = {
     *      active: false
     * }
     * 
     * @returns {Promise<object>} Objeto del registro actualizado
     */
    updateWithoutId = async (where, data) => {
        return this.orm[this.modelName].update({ where, data });
    }

    /**
     * Elimina un registro de la base de datos por su ID.
     * @param {number} id El identificador único del registro a eliminar.
     * @returns {Promise<object>} Registro eliminado.
     */
    delete = async (id) => {
        return this.orm[this.modelName].delete({ where: { id } });
    }

    /**
     * Elimina multiples registros
     * @param {object} data Registros a eliminar
     * @returns {Promise<object>} Registro eliminado.
     */
    deleteAll = async (where) => {
        return this.orm[this.modelName].deleteMany({ where });
    }

    /**
 * Ejecuta una transacción utilizando el cliente Prisma.
 * @param {function} callback Una función que contiene las operaciones que se deben ejecutar dentro de la transacción.
 * @returns {Promise<any>} El resultado de la transacción.
 */
    transaction = async (callback) => {
        const originalOrm = this.orm; // Guarda la referencia al ORM original
        try {
            return await this.orm.$transaction(async (transactionOrm) => {
                this.orm = transactionOrm; // Asigna el ORM transaccional al modelo temporalmente
                const result = await callback(transactionOrm); // Ejecuta la función de transacción
                this.orm = originalOrm; // Restaura el ORM original
                return result;
            });
        } catch (err) {
            this.orm = originalOrm; // Asegura restaurar el ORM original en caso de error
            throw err; // Re-lanza el error para que sea manejado por el código llamador
        }
    };
}

export default BaseModel;
