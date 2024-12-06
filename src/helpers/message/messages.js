export default {
    response: {
        create: { message: "Registro creado correctamente", severity: "success", code: 201 },
        update: { message: "Registro actualizado correctamente", severity: "success", code: 200 },
        read:   { message: "Información de registro", severity: "success", code: 200 },
        reads:  { message: "Información de registro", severity: "success", code: 200 },
        delete: { message: "Registro eliminado correctamente", severity: "success", code: 200 },
        empty:  { message: "No hay registros", severity: "warning", code: 200 }
    },
    fails: {
        register:   { message: "Error al procesar la solicitud", severity: "error", code: 400 },
        duplicate:  { message: "El registro ya se encuentra en el sistema", severity: "warning", code: 409 }
    },
    auth: {
        invalidToken: { message: "Token inválido o expirado. Por favor, intente iniciar sesión nuevamente", severity: "error", code: 401 },
        login: { message: "Inicio de sesión exitoso... bienvenido!!!", severity: "success", code: 200 },
        logout: { message: "Cierre de sesión", severity: "success", code: 200 },
        notFoundEmail: { message: "El correo proporcionado no se encuentra registrado en sistema", severity: "error", code: 404 },
        notMatchPassword: { message: "La contraseña ingresada es incorrecta", severity: "error", code: 401 },
        requiredToken: { message: "Es necesario proporcionar el token de acceso", severity: "error", code: 401 },
        sessionExpire: { message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente", severity: "error", code: 401 },
    },
    validate: {
        existsEmail:  { message: "El correo ingresado ya existe en el sistema", severity: "warning", code: 422 },
        notExists:  { message: "El registro no existe", severity: "warning", code: 422 },
    }
}
