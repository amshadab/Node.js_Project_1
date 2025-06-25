const express = require("express");
const { handleGetAllUser, handleGetUserById, handleUpdateUserById,handleDeleteUserById,handleAddUser } = require("../controllers/user");

const router = express.Router();

// html rendering
// router.get("/users", async(req, res) => {
//   const result = await User.find({});
//   const html = `
//     <ul>
//     ${result.map((user) => `<li>${user.firstName}</li>`).join("")}
//     </ul>
//     `;
//   return res.send(html);
// });

// return json
router.route("/")
.get(handleGetAllUser)
.post(handleAddUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);



module.exports=router