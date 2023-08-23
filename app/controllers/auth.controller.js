const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Sellerdetails = db.sellerdetails;
const Userdetails = db.userdetails;
const PasswordResetToken = db.passwordResetToken; 
const transporter = require('../mail/mailer');
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


// Registrieren als User
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            const token = jwt.sign({ id: user.id },
              config.secret,
              {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400 // 24 hours
              });

            const authorities = roles.map(role => role.name);

            res.status(200).send({
              id: user.id,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          const token = jwt.sign({ id: user.id },
            config.secret,
            {
              algorithm: 'HS256',
              allowInsecureKeySizes: true,
              expiresIn: 86400 // 24 hours
            });
          
          // UserDetails als Platzhalter anlegen
          Userdetails.create({
            id: user.id, 
          })
            .then(userdetails => {
              res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: ['USER'],
                accessToken: token
              });
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Registrieren als Seller
exports.signup_as_seller = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            const token = jwt.sign({ id: user.id },
              config.secret,
              {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400 // 24 hours
              });

            const authorities = roles.map(role => role.name);

            res.status(200).send({
              id: user.id,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
            });
          });
        });
      } else {
        // user role = 2
        user.setRoles([2]).then(() => {
          const token = jwt.sign({ id: user.id },
            config.secret,
            {
              algorithm: 'HS256',
              allowInsecureKeySizes: true,
              expiresIn: 86400 // 24 hours
            });

          // SellerDetails als Platzhalter anlegen
          Sellerdetails.create({
            sellerid: user.id, 
            soldproducts: 0, 
            image: 'http://localhost:8080/profilImgs/profil.png'
          })
            .then(sellerdetails => {
              res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: ['SELLER'],
                accessToken: token
              });
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Login
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//Passwort zurücksetzen Anfrage
exports.resetPassword = (req, res) => {
  const { email } = req.body;

  // Überprüfe, ob die E-Mail-Adresse in der Benutzerdatenbank existiert
  User.findOne({
    where: { email: email }
  })
  .then(user => {
    if (!user) {
      return res.json({ message: 'No user found with this email address.', emailfound: false });
    }

    // Token mit Gültigkeitsdauer anlegen
    const token = generateResetToken(email); 
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    // Speichert den Token und die zugehörigen Informationen in der Datenbank
    PasswordResetToken.create({
      token: token,
      email: email,
      expiration: expiration
    })
      .then(() => {
      
      // Emaillayout und Inhalt festlegen
      const resetLink = `http://localhost:8081/reset-password/${token}`;
      const mailOptions = {
        from: 'testemailclient@gmx.at',
        to: email,
        subject: 'TOOLSSHOPPING - Passwort zurücksetzen',
        html: `
          <p>Hier ist Ihr Zurücksetzungslink:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Bitte klicken Sie auf den Link, um Ihr Passwort zurückzusetzen.</p>
          <br></br>
          <p>by Sattlatsche GmbH</p>
        `
      };

      // Email mit Nodemailer versenden
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'An error occurred while sending the email.' });
        } else {
          res.json({ message: 'Password reset token has been generated and saved. Email sent.' });
        }
      });
    })
    .catch((err) => {
      console.error('Error creating password reset token:', err);
      res.status(500).json({ message: 'An error occurred while generating the reset token.' });
    });
  })
  .catch(error => {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'An error occurred while finding the user.' });
  });
};

//Passwort zurücksetzen Umsetzung
exports.resetPasswordToNewPassword = (req, res) => {
  const { token, password } = req.body;

  // Finde den Token in der Datenbank
  PasswordResetToken.findOne({
    where: {
      token: token
    }
  })
    .then((resetToken) => {
      if (!resetToken) {
        return res.status(404).json({ message: 'Reset token not found.' });
      }

      // Überprüfe, ob der Token abgelaufen ist
      if (resetToken.expiration < new Date()) {
        return res.status(400).json({ message: 'Reset token has expired.' });
      }

      // Finde den Benutzer anhand der E-Mail-Adresse im Token
      User.findOne({
        where: {
          email: resetToken.email
        }
      })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: 'User not found with this email address.' });
          }

          // Hash das neue Passwort und aktualisiere den Benutzer in der Datenbank
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ message: 'Error hashing password.' });
            }

            user.update({
              password: hash
            })
              .then(() => {
                // Lösche alle Reset-Token des Users aus der Datenbank
                PasswordResetToken.destroy({
                  where: {
                    email: user.email
                  }
                })
                  .then(() => {
                    res.json({ message: 'Password updated successfully.' });
                  })
                  .catch((err) => {
                    console.error('Error deleting reset token:', err);
                    res.status(500).json({ message: 'An error occurred while deleting reset token.' });
                  });
              })
              .catch((err) => {
                console.error('Error updating password:', err);
                res.status(500).json({ message: 'An error occurred while updating password.' });
              });
          });
        })
        .catch((err) => {
          console.error('Error finding user:', err);
          res.status(500).json({ message: 'An error occurred while finding user.' });
        });
    })
    .catch((err) => {
      console.error('Error finding reset token:', err);
      res.status(500).json({ message: 'An error occurred while finding reset token.' });
    });
};

// Token auf existens und Gütigkeit überprüfen
exports.checkResetTokenValidity = (req, res) => {
  const token = req.params.token;
  PasswordResetToken.findOne({
    where: { token: token, expiration: { [Op.gte]: new Date() } }
  })
    .then(foundToken => {
      if (foundToken) {
        res.json({ message: 'Token is valid.' });
      } else {
        res.status(400).json({ message: 'Token is invalid or expired.' });
      }
    })
    .catch(error => {
      console.error('Error checking reset token validity:', error);
      res.status(500).json({ message: 'An error occurred while checking token validity.' });
    });
};

// Passwort ändern
exports.changePassword = async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmNewPassword = req.body.confirmNewPassword;
  const userId = req.body.userid; 
  
  try {
    
    const user = await User.findByPk(userId);

    if (!user) {
      
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    const passwordMatch = bcrypt.compareSync(currentPassword, user.password);
    
    if (!passwordMatch) {
      
      return res.status(401).send({ message: "Aktuelles Passwort ist falsch." });
      
    }
    
    if (newPassword != confirmNewPassword) {
      
      return res.status(400).send({ message: "Die neuen Passwörter stimmen nicht überein." });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

    
    await User.update(
      { password: hashedNewPassword },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Passwort erfolgreich geändert." });
  } catch (error) {
    res.status(500).json({ message: "Interner Serverfehler bei der Passwortänderung." });
  }
};

// Email überprüfen
exports.verifyEmail = async (req, res) => {
  const email = req.body.email;

  // Generiere einen 6-stelligen Verifizierungscod
  const verificationCode = generateVerificationCode();

  // E-Mail-Optionen
  const mailOptions = {
    from: 'testemailclient@gmx.at',
    to: email,
    subject: 'Email Verifikation',
    text: `Ihr Verifizierungscode ist: ${verificationCode}`
  };

  // Versenden der E-Mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Email sending failed' });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Verification code sent successfully', verificationCode });
    }
  });
};


// Token generieren für Passwort zurücksetzen
function generateResetToken(email) {
  const secretKey = 'mySuperSecretKey123'; 
  const expiration = '1h'; 

  const token = jwt.sign({ email }, secretKey, { expiresIn: expiration });
  return token;
}

// Hilfsfunktion zur Generierung eines 6-stelligen Verifizierungscodes
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

