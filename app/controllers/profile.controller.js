const db = require('../models');
const Sellerdetails = db.sellerdetails;
const Userdetails = db.userdetails;
const User = db.user;
const fs = require('fs');
const path = require('path');

// Prodildaten für Verkäufer abrufen
exports.getProfileForSeller = (req, res) => {
  const sellerId = req.params.sellerId;

  Sellerdetails.findOne({ where: { sellerid: sellerId } })
    .then(seller => {
      if (seller) {
        const sellerDetails = seller.toJSON();

        // Verkäuferdetails erfolgreich abgerufen, jetzt Benutzerdetails abrufen
        User.findOne({ where: { id: sellerId } })
          .then(user => {
            if (user) {
               const userDetails = { ...user.toJSON(), password: undefined };

              // Kombinierte Antwort mit Verkäufer- und Benutzerdetails
              const profile = {
                seller: sellerDetails,
                user: userDetails
              };

              res.json(profile);
            } else {
              res.status(404).json({ message: 'User not found' });
            }
          })
          .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
          });
      } else {
        res.status(404).json({ message: 'Seller not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
};


// Prodildaten für User abrufen
exports.getProfileForUser = (req, res) => {
  const userId = req.params.userId;

  Userdetails.findOne({ where: { id: userId } })
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
};

// Profildaten für Verkäufer updaten
exports.updateSellerProfile = (req, res) => { 
  const sellerData = JSON.parse(req.body.sellerData);
  const imgFile = req.file; // Annahme: Das Bild wird als "image" im FormData-Objekt übertragen
  const sellerId = sellerData.sellerid;
  const updatedData = sellerData;

  // Entfernen der nicht aktualisierbaren Eigenschaften
  delete updatedData.sellerid;

  // Überprüfen, ob ein Bild hochgeladen wurde
  if (imgFile) {
    sellerData.image = `${req.protocol}://${req.get('host')}/profilImgs/${imgFile.filename}`;
  }

    Sellerdetails.update(updatedData, {
    where: { sellerid: sellerId }
  })
    .then(numRowsAffected => {
      if (numRowsAffected[0] === 1) {
        res.status(200).send({ message: 'Seller data updated successfully.' });
      } else {
        res.status(404).send({ message: 'Seller data not found.' });
      }
    })
    .catch(err => {
      console.error('Error updating seller data:', err);
      res.status(500).send({ message: 'Error updating seller data.' });
    });
};

// Profildaten für User updaten
exports.updateUserProfile = (req, res) => {
  console.log("Test");
  
  const userData = req.body;

  Userdetails.update(userData, {
    where: { id: userData.userid }
  })
    .then(numRowsAffected => {
      if (numRowsAffected[0] === 1) {
        res.status(200).send({ message: 'User data updated successfully.' });
      } else {
        res.status(404).send({ message: 'User data not found.' });
      }
    })
    .catch(err => {
      console.error('Error updating User data:', err);
      res.status(500).send({ message: 'Error updating User data.' });
    });
}
  
  // Profildaten mit Image für User updaten
  exports.updateUserProfileWithImage = (req, res) => {
    const userData = JSON.parse(req.body.userData);
    const imgFile = req.file; // Annahme: Das Bild wird als "image" im FormData-Objekt übertragen
    const userId = userData.userid;
    const updatedData = userData;

    // Entfernen der nicht aktualisierbaren Eigenschaften
    delete updatedData.userid;

    // Überprüfen, ob ein Bild hochgeladen wurde
    if (imgFile) {
      userData.image = `${req.protocol}://${req.get('host')}/profilImgs/${imgFile.filename}`;
    }

      Userdetails.update(updatedData, {
      where: { id: userId }
    })
      .then(numRowsAffected => {
        if (numRowsAffected[0] === 1) {
          res.status(200).send({ message: 'User data updated successfully.' });
        } else {
          res.status(404).send({ message: 'User data not found.' });
        }
      })
      .catch(err => {
        console.error('Error updating User data:', err);
        res.status(500).send({ message: 'Error updating User data.' });
      });
  }
