class PrefixManager {
    constructor() {
        if (!PrefixManager.instance) {
            this.prefix = null; // Valor inicial
            PrefixManager.instance = this;
        }

        return PrefixManager.instance;
    }

    /**
     * Establece el prefijo de la ruta
     * 
     * @param {string} prefix - Nombre de la ruta.
     */
    setPrefix = (prefix) => {
        this.prefix = prefix;
    }

    /**
     * Retorna el prefijo actual de la ruta
     * @returns {string} - Prefijo actual de la ruta
     */
    getPrefix = () => {
        return this.prefix;
    }
}

// Exportar una instancia única
const prefixManager = new PrefixManager();
export default prefixManager;
