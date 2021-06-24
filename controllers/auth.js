const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mysqlconnection = require("../connection.js");

exports.register = (req, res) => {
  console.log(req.body);

  // const name  = req.body.username;
  // const password = req.body.password;
  // const confiempassword = req.body.confiempassword;

  const { username, password, confirmpassword } = req.body;
  mysqlconnection.query(
    "SELECT user_name FROM user WHERE user_name = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "This username has been used",
        });
      } else if (password !== confirmpassword) {
        return res.render("register", {
          message: "password do not match",
        });
      }

      let hashedpassword = await bcrypt.hash(password, 8);

      const joinDate = new Date();
      // console.log(hashedpassword);

      //    res.send('testing dome');

      mysqlconnection.query(
        "INSERT INTO user SET ?",
        {
          user_name: username,
          Pass_word: hashedpassword,
          user_join_date: joinDate,
        },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res.render("register", {
              message: "register successful",
            });
          }
        }
      );
    }
  );

  // res.send('form submitted');
};

exports.login = async (req, res) => {
  // console.log(res);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("login", {
        message: "please provide username and password",
      });
    }

    mysqlconnection.query(
      "SELECT * FROM user WHERE user_name =? ",
      [username],
      async (error, result) => {
        // console.log(result);
        if (!result || !(await bcrypt.compare(password, result[0].Pass_word))) {
          return res.status(401).render("login", {
            message: "Username or password is incorrect",
          });
        } else {
          req.session.userId = result[0].user_id;
          // console.log(req.session.usernamee);
          // req.session.save();
          // const iid = result[0].id;
          // res.status(200).redirect("/");
          // console.log(iid);
          // if(req.session,usernamee)
          res.status(200).redirect("/welcome");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.logout = function (req, res) {
  // if(req.session.username)
  // {
  //     res.header('cache-control','no-cache');
  // }

  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
};
