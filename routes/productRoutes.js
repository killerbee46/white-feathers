import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import { getProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

//routes
// router.post(
//   "/create-product",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   createProduct
// );
// //routes
// router.put(
//   "/update-product/:pid",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   updateProduct
// );

//get products
router.get("/", getProducts);

//single product
router.get("/:id", getProduct);

// //get photo
// router.get("/product-photo/:pid", productPhoto);

// //delete rproduct
// router.delete("/delete-product/:pid", deleteProduct);

// //filter product
// router.post("/product-filters", productFilters);

// //product count
// router.get("/product-count", productCount);

// //product per page
// router.get("/product-list/:page", productList);

// //search product
// router.get("/search/:keyword", searchProduct);

// //similar product
// router.get("/related-product/:pid/:cid", realtedProduct);

// //category wise product
// router.get("/product-category/:slug", productCategory);

// //payments routes
// //token
// // router.get("/braintree/token", braintreeTokenController);

// //payments
// // router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
