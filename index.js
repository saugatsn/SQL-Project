const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "",
  password: "",
});

let data = [];
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.listen("8080", () => {
  console.log("App is listening on port 8080");
});

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM users";
  try {
    connection.query(q, (err, result) => {
      if (err) {
        console.log(err);
      }
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT * FROM users";
  try {
    connection.query(q, (err, users) => {
      if (err) {
        console.log(err);
      }
      res.render("showUsers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        console.log(err);
      }
      let user = result[0];
      console.log(result);
      res.render("editUser.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  console.log(req.body);
  let { username: newUsername, password: enteredPass } = req.body;
  console.log(id);
  let q1 = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q1, (err, result) => {
      if (err) {
        console.log(err);
      }
      let user = result[0];
      if (user.password != enteredPass) {
        res.send("Password not matched");
      } else {
        let q2 = `UPDATE users SET username='${newUsername}' WHERE id='${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
          res.send("Some error in Database");
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});
app.get("/user/new", (req, res) => {
  res.render("addUser.ejs");
});
app.post("/user", (req, res) => {
  console.log(req.body);
  let { email: formEmail, username: formUser, password: formPass } = req.body;
  let formId = faker.string.uuid();
  let q = `INSERT INTO users (id, email, username, password) VALUES('${formId}', '${formEmail}', '${formUser}', '${formPass}')`;
  connection.query(q, (err, result) => {
    try {
      if (err) {
        console.log(err);
      }
      res.send("Added successfully");
    } catch (err) {
      res.send("Some error occurred");
    }
  });
});
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        console.log(err);
      }
      let user = result[0];
      console.log(result);
      res.render("deleteUser.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: enteredPass } = req.body;
  let q1 = `SELECT * from users WHERE id='${id}'`;
  try {
    connection.query(q1, (err, result) => {
      if (err) {
        console.log(err);
      }
      user = result[0];
      if (enteredPass != user.password) {
        res.send("Password Not matched");
      } else {
        let q2 = `DELETE FROM users WHERE ID='${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
          res.send("Some error in Database");
        }
      }
    });
  } catch (err) {
    res.send("Some error in Database");
  }
});
// let q = "INSERT INTO users (id,username,email,password) VALUES ?";
