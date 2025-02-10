// https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet


import { stripe } from "@/utils/stripe-server";

export async function POST(req: Request) {

    const body = await req.json();
    const { name, email, amount } = body;

    // Use an existing Customer ID if this is a returning customer.
    let customer;
    const doesCustomerExist = await stripe.customers.list({
        email,
    });

    if (doesCustomerExist.data.length > 0) {
        customer = doesCustomerExist.data[0];
    } else {
        const newCustomer = await stripe.customers.create({
        name,
        email,
        });

        customer = newCustomer;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2024-06-20" }
    );
      
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100),
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return Response.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
}
