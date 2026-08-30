// src/api/v1/auth/auth.routes.js

const router = require("express").Router();

const {
  register,
  login,
  logout,
  refreshToken
} = require("./auth.controller");

const validate = require("../../../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema
} = require("./auth.validator");


router.post(
  "/register",
  validate(registerSchema),
  register
);


router.post(
  "/login",
  validate(loginSchema),
  login
);


router.post(
  "/refresh",
  refreshToken
);


router.post(
  "/logout",
  logout
);



> cat auth.service.js
// search.service.js
const {
    indexUser
} = require("../../../../search/indexer/index.service");

const engine =
require("./engine/memory.adapter");



exports.globalSearch =
async(query)=>{


const results =
await engine.search(
query.q
);



return {

results,

total:
results.length

};


};
