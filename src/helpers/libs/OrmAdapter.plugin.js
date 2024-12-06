import { PrismaClient } from "@prisma/client";

class OrmAdapter {
    constructor() {
        if (!OrmAdapter.instance) {
            this.orm = new PrismaClient()
            OrmAdapter.instance = this
        }

        return OrmAdapter.instance
    }
    
    getClient = () => {
        return this.orm
    }

    disconnect = async () => {
        await this.orm.$disconnect()
    }
    
    transaction = async (callback) => {
        return await this.orm.$transaction(callback)
    }
}

const OrmAdapterInstance = new OrmAdapter();
export default OrmAdapterInstance;