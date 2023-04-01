const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRound = 10;
const secretKey = "lkhhfalshflk";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  console.log(salt);
  let hash = await bcrypt.hash(password, salt);
  console.log(hash);
  return hash;
};

const hashCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createToken = ({ firstName, lastName, email, role }) => {
  let token = jwt.sign({ firstName, lastName, email, role }, secretKey, {
    expiresIn: "30d",
  });
  return token;
};

const decodeToken = (token) => {
  let data = jwt.decode(token);
  return data;
};

const validate = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let payload = decodeToken(token);
      console.log(payload.exp);
      console.log(Math.floor(Date.now() / 1000));
      if (Math.floor(Date.now() / 1000) <= payload.exp) {
        next();
      } else {
        res.status(401).send({ message: "Token expired " });
      }
    } else {
      res.status(400).send({ message: "Token Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const roleAdmin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let payload = decodeToken(token);
      console.log(payload.role);

      if (payload.role === "Admin" || payload.role === "salesRep") {
        next();
      } else {
        res.status(401).send({ message: "Admin can only access " });
      }
    } else {
      res.status(401).send({ message: "Token Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const roleSalesRep = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let payload = decodeToken(token);
      console.log(payload.role);

      if (payload.role === "salesRep") {
        next();
      } else {
        res.status(401).send({ message: "SalesRep can only access " });
      }
    } else {
      res.status(401).send({ message: "Token Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
  roleSalesRep,
};
