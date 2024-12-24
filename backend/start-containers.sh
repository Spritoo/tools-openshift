# Start Database Container
echo "Starting MongoDB container..."
docker run --name my-mongodb --network app-network -d -p 27017:27017 -v mongo-data:/data/db mongo:6.0

# Start Frontend Container
echo "Starting frontend container..."
docker container run -d --name my-frontend -p 80:80 --network app-network mohamedibrahim01/my-frontend:v1.0

# Start Backend Container
echo "Starting backend container..."
docker run --name my-backend --network app-network --env-file .env -p 3000:3000 mohamedibrahim01/my-backend:v1.0



echo "All containers started successfully."
