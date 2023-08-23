const paypal = require('paypal-rest-sdk');

// Paypal Konfiguration
paypal.configure({
  mode: 'sandbox', // sandbox für Testumgebung
  client_id: 'AUcKon4cwaiMFVH544rNqhFPvvl0esHmf2kSlKfQYthDg7gNW3R8-2O02oD3_Cg5OSbA1sHOO0xtD9tg',
  client_secret: 'ENUA8kJ_J4aFS1S2maemmhr8XqH4P-8H4xMYezL3eG55ERRtyJZy6h_INjVDqGpsdVELMLJZqvIOftr8'
});

// Paypal Bezahlung überprüfen
exports.PaypalProofPayment = (req, res) => {
    const payment = req.body.payment;
    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:8081/checkout?paypal=proofed',
            cancel_url: 'http://localhost:8081/checkout'
           },
        transactions: [{
            amount: {
                total: payment,
                currency: 'EUR'
            },
            description: 'Testzahlung'
        }]
    };

    // Paypal Payment wird erstellt
    paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
            res.sendStatus(500);
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.json({ approvalUrl }); 
        }
    });
};

// Paypal Bezahlung durchführen
exports.PaypalExecutePayment = (req, res) => { 
    const paymentId = req.body.paymentId;
    const payerId = req.body.payerId;

    const executePayment = {
        payer_id: payerId
        };

    paypal.payment.execute(paymentId, executePayment, (error, payment) => {
    if (error) {
        res.json('Error executing payment');
    } else {
        res.json('Payment successful!');
    }
    });
}