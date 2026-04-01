const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb+srv://niysa2202:Nisa1703%23@quickdessert.qzdlrh3.mongodb.net/quickdessert?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const orderSchema = new mongoose.Schema({
date: String,
dessert: String,
price: Number,
quantity: Number,
total: Number
});

const Order = mongoose.model("Order", orderSchema);

// =========================
// SUBMIT ORDER
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
        total: total
    });

    await newOrder.save();

    res.send(`
        <html>
        <head>
            <title>Order Result</title>
            <style>
                body {
                    font-family: Arial;
                    text-align: center;
                    padding: 40px;
                    background: #fdfdfd;
                }
                .box {
                    background: #ffe6ef;
                    padding: 30px;
                    border-radius: 10px;
                    display: inline-block;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    text-decoration: none;
                    background: #A5B68D;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <h2>🎉 Order Successful!</h2>
                <p><b>Date:</b> ${date}</p>
                <p><b>Dessert:</b> ${dessert}</p>
                <p><b>Price:</b> RM ${p}</p>
                <p><b>Quantity:</b> ${q}</p>
                <h3>Total: RM ${total}</h3>
                <a href="/cikyah.html">Back</a>
            </div>
        </body>
        </html>
    `);

} catch (err) {
    res.send("❌ Error saving data");
}

});

// =========================
// VIEW ORDERS (SORTED)
// =========================
app.get("/orders", async (req, res) => {
// 🔥 SORT BY DATE (latest first)
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
    <html>
    <head>
        <title>Order History</title>
        <style>
            body {
                font-family: Arial;
                text-align: center;
                background: #fdfdfd;
            }
            table {
                margin: auto;
                border-collapse: collapse;
                width: 70%;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 10px;
            }
            th {
                background: #F9CDD5;
            }
            a {
                display: inline-block;
                margin-top: 20px;
                text-decoration: none;
                background: #A5B68D;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <h2>📊 Order History (Latest First)</h2>
        <table>
            <tr>
                <th>Date</th>
                <th>Dessert</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            ${rows}
        </table>
        <a href="/cikyah.html">Back</a>
    </body>
    </html>
`);

});

// =========================
// START SERVER
// =========================
app.listen(8080, () => {
console.log("🚀 Server running at http://localhost:8080");
});
