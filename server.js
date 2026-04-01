const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// =========================
// 👉 HOMEPAGE
// =========================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/mainpage.html");
});

// =========================
// MongoDB Connection
// =========================
mongoose.connect("mongodb+srv://niysae2704:niysae2704@quickdessert.x1rdu7e.mongodb.net/quickdessert?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// =========================
// SCHEMAS
// =========================

// Cikyah orders
const orderSchema = new mongoose.Schema({
    date: String,
    dessert: String,
    price: Number,
    quantity: Number,
    total: Number
});
const Order = mongoose.model("Order", orderSchema);

// RM3 orders (separate collection)
const rm3Schema = new mongoose.Schema({
    date: String,
    dessert: String,
    price: Number,
    quantity: Number,
    total: Number
});
const RM3Order = mongoose.model("RM3Order", rm3Schema);

// =========================
// SUBMIT CIKYAH ORDER
// =========================
app.post("/submit", async (req, res) => {
    try {
        const { date, dessert, price, quantity } = req.body;

        const p = parseFloat(price);
        const q = parseInt(quantity);
        const total = p * q;

        const newOrder = new Order({
            date,
            dessert,
            price: p,
            quantity: q,
            total
        });

        await newOrder.save();

        res.send(`
            <h2>🎉 Order Successful!</h2>
            <p>Total: RM ${total}</p>
            <a href="/mainpage.html">Back</a>
        `);

    } catch (err) {
        res.send("❌ Error saving data");
    }
});

// =========================
// SUBMIT RM3 ORDER
// =========================
app.post("/submit-rm3", async (req, res) => {
    try {
        const { date, dessert, price, quantity } = req.body;

        const p = parseFloat(price);
        const q = parseInt(quantity);
        const total = p * q;

        const newOrder = new RM3Order({
            date,
            dessert,
            price: p,
            quantity: q,
            total
        });

        await newOrder.save();

        res.send(`
            <h2>🎉 RM3 Order Saved!</h2>
            <p>Total: RM ${total}</p>
            <a href="/rm3.html">Back</a>
        `);

    } catch (err) {
        res.send("❌ Error saving RM3 order");
    }
});

// =========================
// VIEW CIKYAH ORDERS
// =========================
app.get("/orders", async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });

    let rows = "";
    orders.forEach(o => {
        rows += `
        <tr>
            <td>${o.date}</td>
            <td>${o.dessert}</td>
            <td>${o.price}</td>
            <td>${o.quantity}</td>
            <td>${o.total}</td>
        </tr>
        `;
    });

    res.send(`
        <h2>📊 Cikyah Orders</h2>
        <table border="1">
            <tr>
                <th>Date</th>
                <th>Dessert</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            ${rows}
        </table>
        <br><a href="/orderpage.html">Back</a>
    `);
});

// =========================
// VIEW RM3 ORDERS
// =========================
app.get("/rm3orders", async (req, res) => {
    const orders = await RM3Order.find().sort({ date: -1 });

    let rows = "";
    orders.forEach(o => {
        rows += `
        <tr>
            <td>${o.date}</td>
            <td>${o.dessert}</td>
            <td>${o.price}</td>
            <td>${o.quantity}</td>
            <td>${o.total}</td>
        </tr>
        `;
    });

    res.send(`
        <h2>📊 RM3 Orders</h2>
        <table border="1">
            <tr>
                <th>Date</th>
                <th>Dessert</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            ${rows}
        </table>
        <br><a href="/mainpage.html">Back</a>
    `);
});

// =========================
// START SERVER
// =========================
app.listen(8080, () => {
    console.log("🚀 Server running at http://localhost:8080");
});
