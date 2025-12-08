// packages import
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Add this import


// Utils import
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import orderRoutes from './routes/orderRoutes.js'
dotenv.config();
const port = process.env.PORT || 5000; 

// Fix __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
connectDB(); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
})




app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'dist')));
// Add React frontend routing
app.get(/.* /, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.get('/',(req, res) => {
  res.send("API is running...");
});


app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});