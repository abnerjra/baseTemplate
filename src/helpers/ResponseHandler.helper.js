import messages from './message/messages.js';

class ResponseHandler {
    /**
     * Generar respuesta exitosa.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {Object} message - Mensaje de la respuesta.
     * @param {Array|Object} data - Datos de la respuesta.
     * @param {Object} paginado - Datos de paginación.
     */
    static success = (res, message, data = [], paginado = {}) => {
        const response = {
            message: message.message,
            severity: message.severity,
            results: data,
        };

        if (Object.keys(paginado).length > 0) {
            response.totalRecords = paginado.totalRecords;
            response.totalPerPage = paginado.totalPerPage;
        }

        return res.status(message.code).json(response);
    }

    /**
     * Generar respuesta de error.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {Object} message - Mensaje de error.
     * @param {Array|Object} data - Datos adicionales.
     */
    static error = (res, message, data = []) => {
        return res.status(message.code).json({
            message: message.message,
            severity: message.severity,
            results: data,
        });
    }

    /**
     * Registrar errores en logs y enviar respuesta.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {string} errorMessage - Mensaje del error.
     * @param {Error} exception - Excepción del error.
     */
    static errorLog = (res, errorMessage, exception) => {
        console.debug(exception); // Registrar logs (puedes usar Winston o similar)
        /* const response = isProd
            ? { message: errorMessage, severity: 'error' }
            : { message: errorMessage, severity: 'error', exception: exception.toString() }; */
        
        const response = { message: errorMessage, severity: 'error', exception: exception.toString() };

        return res.status(500).json(response);
    }

    /**
     * Formatear mensajes de validación.
     * @param {Object} res - Objeto de respuesta de Express.
     * @param {Object} message - Mensaje base.
     * @param {Array<string>} errors - Lista de errores.
     */
    static cleanMessages = (res, message, errors) => {
        const formattedMessage = `${message.message}\n${errors.map(err => `- ${err}`).join('\n')}`;
        return res.status(message.code).json({
            message: formattedMessage,
            severity: message.severity,
            results: [],
        });
    }

    /**
     * Obtener un mensaje del archivo de mensajes.
     * @param {string} path - Ruta del mensaje (e.g., 'fails.duplicate').
     * @returns {Object} - Mensaje encontrado.
     */
    static getMessage = (path) => {
        const keys = path.split('.');
        let result = messages;

        for (const key of keys) {
            if (result[key] !== undefined) {
                result = result[key];
            } else {
                return { message: 'Mensaje no encontrado', severity: 'error', code: 500 };
            }
        }

        return result;
    };
}

export const {
    getMessage,
    success,
    error,
    errorLog,
    cleanMessages
} = ResponseHandler