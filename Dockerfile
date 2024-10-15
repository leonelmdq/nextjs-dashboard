# Dockerfile
# Establecer la imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código del proyecto al contenedor
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Exponer el puerto en el que Next.js correrá (por defecto 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
