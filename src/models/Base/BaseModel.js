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
     * @param {object} select objeto que especifica los campos a incluir en la respuesta. Si es null o vacío, se devuelven todos los campos.
     * @returns {Promise<object | null>} Devuelve los datos del registro en forma de objeto o un null si no hay datos
     */
    findById = async (id, select = null) => {
        const query = { where: { id } };
    
        // Agregar select solo si no es null o undefined y contiene propiedades
        if (select && Object.keys(select).length) {
            query.select = select;
        }
    
        return this.orm[this.modelName].findUnique(query);
    };
    

    /**
     * Obtiene múltiples registros que coincidan con las condiciones proporcionadas.
     * @param {object} select Objeto que especifica los campos a incluir en la respuesta. Si es null o vacío, se devuelven todos los campos.
     * @param {object} where Objeto con las condiciones de búsqueda. Por defecto, busca todos los registros.
     * @param {object} orderBy Objeto que especifica la columna por la cual serán ordenados los registros
     * @returns {Promise<array>} Devuelve una lista de registros que cumplen con las condiciones.
     */
    findAll = async (select = null, where = {}, orderBy = null) => {
        const query = { where };
    
        // Agregar select solo si no es null o undefined y contiene propiedades
        if (select && Object.keys(select).length) {
            query.select = select;
        }

        if (orderBy) query.orderBy = orderBy
        
        return this.orm[this.modelName].findMany(query);
    };

    /**
     * Obtiene un registro por medio de un campo especifico
     * @param {object} where Objeto con las condiciones de búsqueda
     * @returns {Promise<array>} Devuelve una lista de registros que cumplen con las condiciones.
     */
    findOne = async (where = {}) => {
        const query = { where };
    
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
