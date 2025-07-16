import { hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js"

export const getUsers = async (req, res) => {
  const roleFilter = req?.query?.role ? {role:{$eq:req?.query?.role}} : {}
    try {
      const users = await userModel.find(roleFilter).select('-password');
      res.status(200).send({
        users
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting users list",
      });
    }
  };

  export const getUser = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).select('-password');
      res.status(200).send({
        user
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting user list",
      });
    }
  };

export const createUser = async (req, res) => {
    try {
        const { name, email, phone, address, role, image } = req.body;
        //validations
        if (!name) {
          return res.send({ error: "Name is Required" });
        }
        if (!email) {
          return res.send({ error: "Email is Required" });
        }
        if (!phone) {
          return res.send({ error: "Phone no is Required" });
        }
        if (!address) {
          return res.send({ error: "Address is Required" });
        }
        if (!role) {
          return res.send({ error: "Role is Required" });
        }
        //check user
        const exisitingUser = await userModel.findOne({ email });
        const exisitingPhone = await userModel.findOne({ phone });
        //exisiting user
        if (exisitingUser) {
          return res.status(200).send({
            success: false,
            message: "Already Register please login",
          });
        }
        if (exisitingPhone) {
      return res.status(200).send({
        success: false,
        message: "Phone already registered to another user",
      });
    }
        //register user
        const hashedPassword = await hashPassword('password');
        //save
        const user = await new userModel({
          name,
          email,
          phone,
          address,
          password: hashedPassword,
          role,
          image
        }).save();
    
        res.status(201).send({
          success: true,
          message: "User Added Successfully",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while adding user",
          error,
        });
      }
  };

  export const updateUser = async (req, res) => {
    try {
      const { email, phone } = req.body;
      const registeredUser = await userModel.findOne({ email });
      const registeredPhone = await userModel.findOne({ phone });
      //exisiting user
      if (registeredUser && registeredUser._id != req.params.id) {
        return res.status(409).send({
          success: false,
          message: "User with the same name already registered",
        });
      }
      if (registeredPhone) {
      return res.status(200).send({
        success: false,
        message: "Phone already registered to another user",
      });
    }
      // register user
      // save
      const user = await userModel.findByIdAndUpdate(req.params.id,{
        ...req.body 
      })
      await user.save();
  
      res.status(201).send({
        success: true,
        message: "User updated Successfully",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error while updating user",
        error,
      });
    }
  };

  export const deleteUser = async (req, res) => {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      res.status(200).send({
        success: true,
        message: "User Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };