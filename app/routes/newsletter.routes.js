const transporter = require('../mail/mailer');
const exphbs = require('express-handlebars');
const db = require('../models');
const Product = db.product;
const token = require("../middleware/authJwt");

module.exports = function (app) {
  app.post('/api/newsletter',token.verifyToken, async (req, res) => {
      const emailAddresses = ['16262@edu.szf.at','testemailclient@gmx.at'];
      

    try {
        const latestProducts = req.body;

        const newsletterContent = {
            products: latestProducts.map((product) => ({
                image: product.images[0],
                title: product.productname,
                description: product.productdescription,
                price: product.productprice.toFixed(2)
                    .replace(".", ",") 
                }))
        };

        app.engine('handlebars', exphbs.engine({
            layoutsDir: 'views/',
            defaultLayout: null,
            extname: 'handlebars'
        }));
        app.set('view engine', 'handlebars');

        app.render('newsletter', newsletterContent, (err, html) => {
            if (err) {
            console.error('Fehler beim Rendern der Newsletter-Vorlage:', err);
            return;
            }

            emailAddresses.forEach((email) => {
            const mailOptions = {
                from: 'testemailclient@gmx.at',
                to: email,
                subject: 'TOOLSSHOPPING - Neueste Produkte im Shop',
                html: html
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.error('Fehler beim Versenden des Newsletters:', error);
                } else {
                console.log('Newsletter erfolgreich an', email, 'verschickt:', info.response);
                }
            });
            });

            res.status(200).json({ message: 'Newsletter wurde erfolgreich versendet' });
        });
    } catch (error) {
      console.error('Fehler beim Abrufen der neuesten Produkte:', error);
      res.status(500).send('Es ist ein Fehler aufgetreten');
    }
  });
};
