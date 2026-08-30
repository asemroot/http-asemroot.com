// src/search/search.routes.js


const router =
require("express").Router();


const auth =
require("../middleware/auth.middleware");


const {
search
}=require("./search.controller");



router.get(
"/",
auth,
search
);



module.exports=router;
> cat search.py
def page_search():
    print("🔍 Global Search")
    print("Search across the ASEM platform.")
