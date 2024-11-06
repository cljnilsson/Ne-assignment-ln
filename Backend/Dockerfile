FROM node:20

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

RUN npx tsc

# Expose a port that the application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "prod"]