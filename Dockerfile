# Use the official Node.js 16 LTS image as the base image
FROM node:20 AS node

# Set the working directory inside the container
WORKDIR /workspace

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Update npm to the latest version
RUN npm install -g npm@9.8.1
RUN npm install -g nodemon

# Install app dependencies (ignore the deprecated package warning)
RUN npm ci

# Copy the rest of the app source code
COPY ./src ./src

# Expose port 8000 (the port that your Express app listens to)
EXPOSE 8000

# Start the Node.js app
CMD ["nodemon", "./src/index.ts"]
