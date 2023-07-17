const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Sellerdetails = db.sellerdetails;
const Userdetails = db.userdetails;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
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
              accessToken: token
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

exports.signup_as_seller = (req, res) => {
  // Save User to Database
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
              accessToken: token
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

          // Create sellerdetails entry
          Sellerdetails.create({
            sellerid: user.id, // Use user id as sellerid
            soldproducts: 0, // Initialize the sold products count
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
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
