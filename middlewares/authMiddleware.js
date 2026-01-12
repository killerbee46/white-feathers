import JWT from "jsonwebtoken";
import User from "../models/User.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
      let token = req.headers.authorization.split(" ")[1];
    
      if (!token) {
        return res.status(403).send({ message: "No token provided!" });
      }
    
      JWT.verify(token,
                process.env.JWT_SECRET,
                (err, decoded) => {
                  if (err) {
                    return res.status(401).send({
                      message: "Unauthorized ! Please Login",
                    });
                  }
                  req.user = decoded;
                  next();
                });
  } catch (error) {
    console.log(error);
  }
};

export const checkForSignIn = async (req, res, next) => {
  try {
    const tokenExists = req.headers.authorization
    
      if (!tokenExists) {
        next()
      }
    
      else{
        let token = tokenExists.split(" ")[1];
        JWT.verify(token,
                process.env.JWT_SECRET,
                (err, decoded) => {
                  if (err) {
                    return res.status(401).send({
                      message: "Unauthorized ! Please Login",
                    });
                  }
                  req.user = decoded;
                  next();
                });
      }
  } catch (error) {
    console.log(error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 3) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};