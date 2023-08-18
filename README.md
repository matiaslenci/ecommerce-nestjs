<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>


# Ecommerce API 

1. Clonar proyecto
2. ``` pnpm install ``` 
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
   docker-compose up -d
```

6. Ejecutar SEED para llenar la base de datos (⚠️Elimina todos los datos actuales)
```
http://localhost:3000/api/seed
``` 

7. Levantar: ```pnpm start:dev```