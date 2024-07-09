import express from 'express'
import { creatUser } from '../controllers/userControler.js'
const router = express.Router()


router.route('/').post(creatUser)

export default router
