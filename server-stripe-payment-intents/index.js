require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;
  console.log(amount, "amount");

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount should already be in the smallest currency unit (e.g., paise)
      currency,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
