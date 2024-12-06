import OrmAdapterInstance from "../src/helpers/libs/OrmAdapter.plugin.js";
import AssignRoleUserSeeder from "./seeders/AssignRoleUserSeeder.js";
import ModuleSeeder from "./seeders/ModuleSeeder.js";
import PermissionListSeeder from "./seeders/PermissionListSeeder.js";
import PermissionModuleSeeder from "./seeders/PermissionModuleSeeder.js";
import RolePermissionSeeder from "./seeders/RolePermissionSeeder.js";
import RoleSeeder from "./seeders/RoleSeeder.js";
import UserSeeder from "./seeders/UserSeeder.js";

async function seedDatabase() {
    const userSeeder = new UserSeeder()
    const moduleSeeder = new ModuleSeeder()
    const permissionListSeeder = new PermissionListSeeder()
    const permissionModuleSeeder = new PermissionModuleSeeder()
    const roleSeeder = new RoleSeeder()
    const rolePermissionSeeder = new RolePermissionSeeder()
    const assignRoleUserSeeder = new AssignRoleUserSeeder()

    try {
        console.log("Start seeding database...");
        
        await userSeeder.seed()
        await moduleSeeder.seed()
        await permissionListSeeder.seed()
        await permissionModuleSeeder.seed()
        await roleSeeder.seed()
        await rolePermissionSeeder.seed()
        await assignRoleUserSeeder.seed()
        
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        // Cierra la conexión Prisma al finalizar
        await OrmAdapterInstance.disconnect();
    }
}

seedDatabase();