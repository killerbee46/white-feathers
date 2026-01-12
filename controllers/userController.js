import { hashPassword } from "../helpers/authHelper.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  
  try {
    const users = await User.findAll({attributes:{exclude:['pass','otp',"password"]}});
    res.status(200).json({
      status: 'success',
      message: "Users list fetched successfully",
      data: users
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
    const user = await User.findByPk(req.params.id,{attributes:{exclude:["pass","otp","password"]}});
    res.status(200).send({
      success: true,
      data:user
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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id,{attributes:{exclude:["pass","otp","password"]}});

    return res.status(200).json({
      status:'success',
      message: "Profile fetched successfully",
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting profile",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, address, password } = req?.body
    const user = await User.findByPk(req.user.id);
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updated = await user.update(
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address,
      }
    )
    return res.status(200).json({
      status: 'success',
      message: "User updated successfully",
      user:{
        c_id:user?.c_id,
        name:user?.name,
        email:user?.email,
        address:user?.address,
        role:user?.role,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating profile",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, image,password } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }
    //check user
    const exisitingUser = await User.findOne({where:{ email }});
    const exisitingPhone = await User.findOne({where:{ phone }});
    //exisiting user
    if (exisitingUser) {
      return res.status(409).send({
        success: false,
        message: "User with same email already exists",
      });
    }
    if (exisitingPhone) {
      return res.status(409).send({
        success: false,
        message: "Phone already registered to another user",
      });
    }
    //register user
    const hashedPassword = await hashPassword('password');
    //save
    const user = await User.create({
      name,
      email:email.toLowerCase(),
      phone,
      address,
      password: hashedPassword,
      role,
      image
    });

    const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${user?.phone}&text=White Feather's Jewellery - User Created: Email:${user?.phone} - Pass:password&token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);

    if (user) {
      await fetch(sparrowUrl)
    }

    res.status(201).send({
      success: true,
      message: "User Added Successfully"
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
    const registeredUser = await User.findOne({where:{ email }});
    const registeredPhone = await User.findOne({where:{ phone }});
    //exisiting user
    if (registeredUser && registeredUser.id != req.params.id) {
      return res.status(409).send({
        success: false,
        message: "User with the same email already registered",
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
    const user = await User.findByPk(req.params.id)
     await user.update(req.params.id, {
      ...req.body
    })

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
    await User.destroy({where:{c_id:req.params.id}});
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