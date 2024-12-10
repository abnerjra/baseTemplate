## Configuración de proyecto

Instalación de dependencias
- Docker [Documentación](https://docs.docker.com/engine/install/)
- PostgreSQL 15 [Documentación](https://www.postgresql.org/download/)
- Node JS Versión 22.11 [Documentación](https://nodejs.org/en/download/package-manager/)
- Prisma [Documentación](https://www.prisma.io/docs/getting-started?_gl=1*3lzlv3*_up*MQ..*_gs*MQ..)

## Clonar proyecto de git

## ** Importante** 
- Docker ocupa los siguientes puertos para la base de datos y node js

    | PROGRAMA  | PUERTOS         |
    | :------------ | :------------ |
    | Node JS  | 3002  |
    | PostgreSQL  | 5440 |

- Antes de ejecutar el paso 3, es necesario crear la base de datos


## Estructura de carpetas recomendada para iniciar el proyecto por medio de docker

```
├── template
|   ├── README.md
|   ├── package.json
|   ├── package-lock.json
|   ├── node_modules
|   ├── prisma
|   │   ├── migrations
|   │   ├── schema.prisma
|   │   ├── seeders
|   │   └── seed.js
|   └── src
|       ├── app.js
|       ├── controllers
|       ├── helpers
|       ├── middleware
|       ├── models
|       ├── routes
|       └── use-cases
├── template.Dockerfile
├── docker-compose.yml
```

## Comandos para ejecución en docker
Paso 1) Levantar los contenedores `template-api` y `template-db`
 ```shell
    $ docker compose up -d
```

Paso 2) Comprobar que el proyecto se encuentre levantado
 ```shell
    $ docker ps
```
Deberá ver un resultado similar el siguiente

| CONTAINER ID  | IMAGE         | COMMAND                | CREATED       | STATUS       | PORTS                                               | NAMES        |
| :------------ | :------------ | :--------------------- | :------------ | :----------- | :-------------------------------------------------- | :----------- |
| e6d7d8827f6f  | template-api  | "docker-entrypoint.s…" | 5 seconds ago | Up 4 seconds | 3000/tcp, 0.0.0.0:3002->3002/tcp, :::3002->3002/tcp | template-api |
| d2eec6a6507d  | postgres:15.3 | "docker-entrypoint.s…" | 5 seconds ago | Up 4 seconds | 0.0.0.0:5440->5432/tcp, :::5440->5432/tcp           | template-db  |


Paso 2.1) Si muestra una respuesta similar el proyecto se levantó de forma correcta, en caso de no ver el contenedor de `template-api` ejecutar el siguiente comando para ver los errores de la instalación del contenrdor
```shell
    $ docker logs template-api
```
Paso 3) Ejecutar las migraciones de prisma 

```shell
    $ docker exec -it template-api npx prisma migrate reset && docker exec -it template-api npx prisma migrate dev --name init && docker exec -it template-api npx prisma generate
```

Listo con esto ya tienes el proyecto corriendo