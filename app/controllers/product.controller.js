const db = require('../models');
const Product = db.product;
const Card = db.card;
const Watchlist = db.watchlist;
const Sellerdetails = db.sellerdetails;


// Produkt hinzufügen
exports.add = (req, res) => {
  // Zugriff auf die Dateinamen
  const fileNames = req.files.map(file => file.filename);

  // Extrahiere die Formulardaten
  const formData = JSON.parse(req.body.formData);

  // Generiere die Bild-URLs
  const imageUrls = fileNames.map(filename => {
    return `${req.protocol}://${req.get('host')}/productImgs/${filename}`;
  });

  // Erstelle ein neues Produkt mit den Formulardaten und den Bild-URLs
  const newProduct = {
    productname: formData.productname,
    productdescription: formData.productdescription,
    productcategorie: formData.productcategorie,
    productid: formData.productid,
    sellerid: formData.userid,
    productprice: formData.productprice,
    productamount: formData.productamount,
    images: imageUrls.join(','),
    proofed: 0,
    sold: 0,
  };

  // Speichere das neue Produkt in der Datenbank
  Product.create(newProduct)
    .then(() => {
      console.log('Produkt erfolgreich hinzugefügt');
      const jsonResponse = { message: 'Produkt erfolgreich hinzugefügt' };
      res.json(jsonResponse);
    })
    .catch(err => {
      console.error('Fehler beim Hinzufügen des Produkts:', err);
      const jsonResponse = { error: 'Fehler beim Hinzufügen des Produkts' };
      res.status(500).json(jsonResponse);
    });
};

// Alle geprüften Produkte abrufen (mit Verkäuderdetails)
exports.getProducts = (req, res) => {
  Product.findAll({
    where: {
      proofed: 1
    },
    order: [['createdAt', 'DESC']]
  })
    .then(products => {
      
      // Array zum Speichern des Endergebnisses mit Verkäuferdetails
      const productsWithDetails = [];

      // Funktion zum Abrufen von Verkäuferdetails für ein bestimmtes Produkt
      const fetchSellerDetails = async (product) => {
        const seller = await Sellerdetails.findOne({
          where: {
            sellerid: product.sellerid
          },
          attributes: ['sellerid', 'shopname', 'description', 'bankaccountnumber', 'tel', 'street', 'zip', 'city', 'image']
        });

        if (seller) {
          // Kombiniere Produkt mit Verkäuferdetails
          const productWithDetails = {
            ...product.toJSON(),
            sellerdetails: seller.toJSON()
          };
          productsWithDetails.push(productWithDetails);
        }
      };

      const promises = products.map(product => fetchSellerDetails(product));

      // Wartet auf alle promises
      Promise.all(promises)
        .then(() => {
        // Sortiere die productsWithDetails nach createdAt in absteigender Reihenfolge
        productsWithDetails.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const responseData = {
          products: productsWithDetails
        };
        res.status(200).json(responseData);
      })
      .catch(err => {
        const jsonResponse = { error: 'Error retrieving seller details' };
        res.status(500).json(jsonResponse);
      });
    })
    .catch(err => {
      const jsonResponse = { error: 'Error getting the products' };
      res.status(500).json(jsonResponse);
    });
};

// Produkte je Verkäufer abrufen
exports.getProductsForSeller = async (req, res) => {
  const sellerId = req.params.sellerId;

  try {
    const products = await Product.findAll({
      where: {
        sellerid: sellerId
      },
      order: [['createdAt', 'DESC']]
    });
    res.json({ products: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Produkt löschen (Produkt wird auch im Warenkorb und der Watchlist gelöscht)
exports.delete = (req, res) => {
  const productId = req.body.productId;

  // Lösche das Produkt in der Datenbank
  Card.destroy({
    where: { productId: productId }
  })
  .then(deletedCardCount => {
    Watchlist.destroy({
      where: { productid: productId }
    })
    .then(deletedWatchlistCount => {
      Product.destroy({
        where: { id: productId }
      })
      .then(deletedProductCount => {
        if (deletedProductCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product, cards and watchlist successfully deleted' });
      })
      .catch(error => {
        res.status(500).json({ error: 'Error deleting product' });
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error deleting watchlist' });
    });
  })
  .catch(error => {
    res.status(500).json({ error: 'Error deleting cards' });
  });
};

// Produkt ändern
exports.change = (req, res) => {

    const fileNames = req.files.map(file => file.filename);

    // Extrahiere die Formulardaten
    const formData = JSON.parse(req.body.formData);

    // Generiere die Bild-URLs
    const imageUrls = fileNames.map(filename => {
      return `${req.protocol}://${req.get('host')}/productImgs/${filename}`;
    });
  
      for (let i = formData.images.length - 1; i >= 0; i--) {
      const filename = formData.images[i];
      
      if (filename.startsWith("data")) {
        formData.images.splice(i, 1);
      }
  }
      formData.images.push(...imageUrls);
  
  const newProduct = {
    productname: formData.productname,
    productdescription: formData.productdescription,
    productcategorie: formData.productcategorie,
    productid: formData.productid,
    sellerid: formData.sellerid,
    productprice: formData.productprice,
    productamount: formData.productamount,
    images: formData.images.join(','),
  };
  Product.update(newProduct, {
    where: { productid: formData.productid }
  })
    .then(numAffectedRows => {
      if (numAffectedRows[0] === 1) {
        res.status(200).json({ message: 'Product data successfully changed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
}

// Produkt abrufen
exports.getProduct = (req, res) => { 
  const productId = req.params.productId;

  Product.findOne({
    where: { id: productId },
  })
  .then((product) => {
    if (product) {
      // Hier wird das Produkt gefunden
      const sellerId = product.sellerid;

      // Verkäuferdetails abrufen
      Sellerdetails.findOne({
        where: { sellerid: sellerId },
      })
      .then((seller) => {
        if (seller) {
          // Produkt- und Verkäuferdetails erfolgreich abgerufen
          const productWithSellerDetails = {
            product: product,
            seller: seller
          };
          res.status(200).json(productWithSellerDetails);
        } else {
          // Verkäufer nicht gefunden
          res.status(404).json({ message: "Seller not found" });
        }
      })
      .catch((error) => {
        // Fehler beim Abrufen der Verkäuferdetails
        res.status(500).json({ message: "Internal Server Error" });
      });
    } else {
      // Produkt nicht gefunden
      res.status(404).json({ message: "Product not found" });
    }
  })
  .catch((error) => {
    // Fehler beim Abrufen des Produkts
    res.status(500).json({ message: "Internal Server Error" });
  });
}

// Ungeprüfte oder ungeprüfte Produkte abrufen
exports.getPorductsForAdmin = (req, res) => {
  
  const proofedValue = req.params.proofed;
  console.log(proofedValue);

  if (proofedValue == 0) {
    Product.findAll({
    where: {
      proofed: 0
    }
  })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
  }
  else if(proofedValue == 1){
    Product.findAll({
    where: {
      proofed: 1
    }
  })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
  }

  
};

// Einzelnes Produkt freigeben
exports.releaseProduct = (req, res) => {
  const productId = req.body.productId;

  Product.update(
    { proofed: 1 },
    { where: { id: productId } }
  )
    .then(num => {
      if (num[0] === 1) {
        res.json({ message: "Product released successfully." });
      } else {
        res.status(404).json({ message: "Product not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

// Einzelnes Produkt sperren
exports.lockProduct = (req, res) => {
  const productId = req.body.productId;

  Product.update(
    { proofed: 0 },
    { where: { id: productId } }
  )
    .then(num => {
      if (num[0] === 1) {
        res.json({ message: "Product released successfully." });
      } else {
        res.status(404).json({ message: "Product not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

// Alle Produkte freigeben
exports.releaseAllProducts = (req, res) => {
  const products = req.body.products;

  const updatePromises = products.map(product => {
    return Product.update(
      { proofed: 1 },
      { where: { id: product.id } }
    );
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: "All products released successfully." });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

// Alle Produkte sperren
exports.lockAllProducts = (req, res) => {
  const products = req.body.products;

  const updatePromises = products.map(product => {
    return Product.update(
      { proofed: 0 },
      { where: { id: product.id } }
    );
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: "All products released successfully." });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};
