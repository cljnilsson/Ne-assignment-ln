FROM node:20

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose a port that the application will run on
EXPOSE 5173

# Define the command to run your application
CMD ["npm", "run", "dev"]