# Choose the base image according to the runtime

FROM node:latest


# Set the working directory
WORKDIR /app

# Copy the necessary files for dependency installation
COPY package.json .
COPY package-lock.json .

# Install dependencies based on the package manager

RUN npm install


# Copy the remaining files into the container
COPY . .

# Build and run command

RUN npm run build
CMD ["node", "dist/index.js"]

