import { toZonedTime, format } from "date-fns-tz";
import fs from 'fs/promises';
import path from "path";

class GeneralFunctions {
    constructor () {
        this.tz = process.env.TZ
    }
    
    /**
     * Get current system date
     * @returns 
     */
    getCurrentDate = () => {
        const currenDate = new Date();
        const timeZone = this.tz

        // Convertir la fecha actual a UTC considerando la zona horaria especificada
        const date = toZonedTime(currenDate, timeZone);

        // Formatear la fecha al formato ISO 8601
        const fullDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone });

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // Los meses son base 0
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            fullDate
        };
    }

    /**
     * Converts a Unix timestamp to a readable date
     * @param {Date} unixTime UNIX timestamp
     * @returns 
     */
    convertUnixToDate = (unixTime) => {
        const date = new Date(unixTime * 1000);
        const timeZone = this.tz

        // Ajustar la fecha a la zona horaria especificada
        const zonedDate = toZonedTime(date, timeZone);

        // Formatear la fecha al formato ISO 8601
        const fullDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });

        return {
            year: zonedDate.getFullYear(),
            month: zonedDate.getMonth() + 1,
            day: zonedDate.getDate(),
            hour: zonedDate.getHours(),
            minute: zonedDate.getMinutes(),
            second: zonedDate.getSeconds(),
            fullDate
        };
    }

    convertDateUTCToTimeZone = (utcDate) => {
        const timeZone = this.tz
        // Convertir la fecha UTC a un objeto Date
        const date = new Date(utcDate);

        // Ajustar a la zona horaria especificada
        const zonedDate = toZonedTime(date, timeZone);

        // Formatear la fecha para mostrarla
        const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
            timeZone,
        });

        return formattedDate;
    }

    /**
     * Valida si existe un directorio, si no existe lo crea
     * @param {string} directory Nombre de la carpeta a ser creada
     * 
     * @returns {Promise<void>}
     * 
     * @example
     * Los directorios creados se guardan dentro de `src/storage/files/`
     */
    mkDirectory = async (directory) => {
        const makeDirectory = `src/storage/files/${directory}`
        const directoryPath = path.resolve(makeDirectory)
        try {
            await fs.access(directoryPath)
            console.log(`La carpeta "${makeDirectory}" ya existe.`);
        } catch (error) {
            await fs.mkdir(directoryPath, { recursive: true });
            console.log(`La carpeta "${makeDirectory}" fue creada.`);
        }
    }
}

const GeneralFunctionsInstance = new GeneralFunctions()
export const {
    getCurrentDate,
    convertUnixToDate,
    convertDateUTCToTimeZone,
    mkDirectory
} = GeneralFunctionsInstance
