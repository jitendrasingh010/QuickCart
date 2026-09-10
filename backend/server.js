require("dotenv").config();
const express = require('express');
const db = require('./models/index.js');
const cors = require('cors');
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    // origin:"http://localhost:3000",
    origin: 'https://quickcart-frontend-02pg.onrender.com',
    credentials: true,
}));
app.use(cookieParser());
db.sequelize.authenticate()
    .then(() => {
        console.log("✅ Database Connected Successfully");

        return db.sequelize.sync();
    })
    .then(() => {
        console.log("✅ Tables Synced Successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err);
    });
const userRoutes = require('./routes/userRoute.js');
app.use('/userapi', userRoutes);

const categoryRoutes = require('./routes/categoryRoute.js');
app.use('/categoryapi', categoryRoutes);

const productRoutes = require('./routes/productRoute.js');
app.use('/productapi', productRoutes);

const orderRoutes = require("./routes/orderRoute.js");
app.use("/orderapi", orderRoutes);
app.use("/orderapi/orders", orderRoutes);

const paymentRoutes = require("./routes/paymentRoute.js");
app.use("/paymentapi", paymentRoutes);
