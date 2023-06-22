import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async() =>{
    try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
    })
    console.log("db connected succesfully " + connect.connection.host);
} catch (error) {
    console.log(`Error: ${error}`);
    process.exit()
}
}
export default connectDB;