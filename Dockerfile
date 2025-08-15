# Use a Node.js LTS version as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml from the server directory
COPY server/package.json server/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod

# Copy the rest of the server's source code
COPY server/ .

# Expose the port the app runs on
EXPOSE 8080

# Command to start the server
CMD ["pnpm", "start"]
