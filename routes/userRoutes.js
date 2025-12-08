import express from "express";
import { createUser, deleteUserById, getAllUsers, getCurrentUserProfile, loginUser, logoutUser, updateCurrentUserProfile,getUserById,updateuserById} from "../controllers/userControllers.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
const router = express.Router(); 


router
  .route('/')
  .post(createUser)
  .get( authenticate, authorizeAdmin, getAllUsers);
router.post("/login", loginUser)
router.post("/logout", logoutUser)

router
  .route('/profile')
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile); 

// admin routes
  router
    .route('/:id')
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateuserById);



  export default router; 