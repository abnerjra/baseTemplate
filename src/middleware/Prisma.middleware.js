import OrmAdapterInstance from "../helpers/libs/OrmAdapter.plugin.js";
import { toZonedTime, format } from "date-fns-tz";

class Prisma {
    constructor() {
        this.orm = OrmAdapterInstance.getClient();
        this.tz = process.env.TZ || "UTC";

        // Registrar el middleware al inicializar la clase
        this.orm.$use(async (params, next) => {
            const result = await next(params);
            return this.transformDates(result);
        });
    }

    // Función que recorre y transforma las fechas en los datos
    transformDates = (data) => {
        if (Array.isArray(data)) {
            return data.map((item) => this.transformDates(item));
        } else if (data && typeof data === "object") {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    if (value instanceof Date) {
                        const zonedTime = toZonedTime(value, this.tz);
                        return [key, format(zonedTime, "yyyy-MM-dd HH:mm:ss")];
                    }
                    if (typeof value === "object") {
                        return [key, this.transformDates(value)];
                    }
                    return [key, value];
                })
            );
        }
        return data;
    };
}

const PrismaInstance = new Prisma(); // Crear una única instancia

export default PrismaInstance; // Exportar la instancia