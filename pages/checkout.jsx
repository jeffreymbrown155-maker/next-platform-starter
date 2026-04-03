// pages/checkout.jsx

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_PUBLIC_STRIPE_KEY');

const Checkout = () => {
    const [email, setEmail] = useState('');
    const [priceId, setPriceId] = useState('');

    const handlePriceChange = (event) => {
        setPriceId(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const stripe = await stripePromise;
        
        const response = await fetch('/api/checkout_sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, priceId }),
        });

        const sessionId = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId });
        
        if (result.error) {
            alert(result.error.message);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="Enter your email"
                />
                <select value={priceId} onChange={handlePriceChange} required>
                    <option value="" disabled>Select a pricing tier</option>
                    <option value="price_1">Basic - $29</option>
                    <option value="price_2">Pro - $99</option>
                    <option value="price_3">Enterprise - $999</option>
                </select>
                <button type="submit">Checkout</button>
            </form>

            <div className="testimonials">
                <h2>Testimonials</h2>
                <p>"This product changed my life!" - Customer A</p>
                <p>"Amazing service and support!" - Customer B</p>
                <p>"A must-have for anyone!" - Customer C</p>
            </div>

            <div className="social-proof">
                <h2>Join thousands of satisfied customers!</h2>
            </div>
        </div>
    );
};

export default Checkout;