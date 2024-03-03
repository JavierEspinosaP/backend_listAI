# Establecer la imagen base con la versión de Node.js adecuada
FROM node:16 AS builder

# Crear directorio de trabajo para construir la aplicación
WORKDIR /usr/src/app

# Copiar archivos de configuración necesarios
COPY package*.json tsconfig.json ./

# Instalar todas las dependencias, incluidas las devDependencies para construir la aplicación
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Transpilar TypeScript a JavaScript
RUN npm run build

# Etapa de producción para una imagen más limpia y ligera
FROM node:16-slim

WORKDIR /usr/src/app

# Copiar solo las dependencias necesarias para la ejecución
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY .env ./

# Exponer el puerto que tu aplicación utiliza
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
