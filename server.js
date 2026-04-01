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
// 👉 MONGODB CONNECTION
// =========================
mongoose.connect("mongodb+srv://niysae2704:niysae2704@quickdessert.x1rdu7e.mongodb.net/quickdessert?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// =========================
// 👉 SCHEMA
// =========================
const orderSchema = new mongoose.Schema({
    date: String,
    dessert: String,
    price: Number,
    quantity: Number,
    total: Number
});

const Order = mongoose.model("Order", orderSchema);

// =========================
// 👉 SUBMIT ORDER
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
                body { font-family: Arial; text-align: center; padding: 40px; background: #fdfdfd; }
                .box { background: #ffe6ef; padding: 30px; border-radius: 10px; display: inline-block; }
                a { margin-top: 20px; text-decoration: none; background: #A5B68D; color: white; padding: 10px 15px; border-radius: 5px; display:inline-block;}
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
                <a href="/mainpage.html">Back</a>
            </div>
        </body>
        </html>
        `);

    } catch (err) {
        console.log(err);
        res.send("❌ Error saving data");
    }
});

// =========================
// 👉 ALL ORDERS (THEMED)
// =========================
app.get("/orders", async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });

    let rows = "";
    orders.forEach(o => {
        rows += `
        <tr>
            <td>${o.date}</td>
            <td>${o.dessert}</td>
            <td>RM ${o.price}</td>
            <td>${o.quantity}</td>
            <td>RM ${o.total}</td>
        </tr>`;
    });

    res.send(getStyledPage("📊 All Orders", rows));
});

// =========================
// 👉 RM3 ORDERS ONLY
// =========================
app.get("/rm3orders", async (req, res) => {
    const orders = await Order.find({ dessert: "Puding Roti" }).sort({ date: -1 });

    let rows = "";
    orders.forEach(o => {
        rows += `
        <tr>
            <td>${o.date}</td>
            <td>${o.dessert}</td>
            <td>RM ${o.price}</td>
            <td>${o.quantity}</td>
            <td>RM ${o.total}</td>
        </tr>`;
    });

    res.send(getStyledPage("📊 RM3 Orders (Puding Roti)", rows));
});

// =========================
// 👉 REUSABLE THEME FUNCTION 🔥
// =========================
function getStyledPage(title, rows) {
    return `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body {
                font-family: Arial;
                margin: 0;
                background-color: #fdfdfd;
                text-align: center;
            }

            header {
                background: #F9CDD5;
                padding: 20px;
            }

            nav {
                background: #A5B68D;
                padding: 10px;
            }

            nav a {
                color: black;
                text-decoration: none;
                margin: 15px;
                font-weight: bold;
            }

            nav a:hover {
                text-decoration: underline;
            }

            h2 {
                color: #ff8fb1;
                margin-top: 30px;
            }

            table {
                margin: 30px auto;
                border-collapse: collapse;
                width: 70%;
                background: #ffe6ef;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                border-radius: 10px;
                overflow: hidden;
            }

            th, td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
            }

            th {
                background: #F9CDD5;
            }

            tr:hover {
                background-color: #fff0f5;
            }

            .btn {
                display: inline-block;
                margin-top: 20px;
                text-decoration: none;
                background: #A5B68D;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
            }

            .btn:hover {
                background: #5fc43c;
            }

            footer {
                margin-top: 40px;
                background: #F9CDD5;
                padding: 10px;
            }
        </style>
    </head>

    <body>

        <header>
            <h1>QuickDessert</h1>
            <p>Dessert is not a meal, it is a moment</p>
        </header>

        <nav>
            <a href="/mainpage.html">Home</a>
            <a href="/rm3.html">Order</a>
            <a href="#">Recipe</a>
        </nav>

        <h2>${title}</h2>

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

        <a class="btn" href="/mainpage.html">Back</a>

        <footer>
            <p>© 2026 QuickDessert - Niysa</p>
        </footer>

    </body>
    </html>
    `;
}

// =========================
// START SERVER
// =========================
app.listen(8080, () => {
    console.log("🚀 Server running");
});
