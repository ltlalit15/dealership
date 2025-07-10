import express from "express";
import { CreateUser, login , getAllUsers, getUserById , logout, assigndelership,updateUser, deleteUser, getAssignedUsers} from "../Controllers/AuthCtrl.js"
import { authenticate } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();
router.post('/createUser', CreateUser);
router.post('/login', login);
// router.get('/users', authenticate, getAllUsers);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserById);
router.patch('/assign-dealership/:id', assigndelership);
router.post('/logout', logout);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.get('/getAssignedUsers', getAssignedUsers);


export default router;
// routes/auth.routes.js



