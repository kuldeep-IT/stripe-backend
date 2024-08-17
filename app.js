const express = require('express')
const cors = require('cors')
const stripe = require('stripe')("sk_test_51PolRmAXXvw8YucZrLXmXuB6tbHcJOAupzE3S0JaM1nUmXhL2AEzRqS6MNV5olhvfZOeZKxVD0BrpdddmFAki2v3002FOfv9P6")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Jai Dada Backend")
})

app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.title
            },
            unit_amount: product.price * 100
        },
        quantity: product.quantity
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({
        id: session.id
    })

})

app.listen(7000, () => {
    console.log("Listening on port 7000")
})

