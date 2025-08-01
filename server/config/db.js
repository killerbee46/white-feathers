import mongoose from "mongoose";
import colors from "colors";

// Enable strict query mode
mongoose.set('strictQuery', true);

// Connection options
const options = {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,         // 45 seconds
  connectTimeoutMS: 30000,        // 30 seconds
  retryWrites: true,
  w: 'majority'
};

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...'.yellow);
    
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URL, options);
    
    console.log(
      `✅ Successfully connected to MongoDB: ${conn.connection.host}`.bgGreen.black
    );
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:'.red, err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected'.yellow);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:'.red, error.message);
    console.error('Connection string used:'.red, process.env.MONGO_URL ? '*****' : 'Not set');
    
    // Exit process with failure
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination'.yellow);
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:'.red, err);
    process.exit(1);
  }
});

export default connectDB;
