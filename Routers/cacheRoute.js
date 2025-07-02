


// import { Router } from 'express';
// import { redisClient } from '../Config/redisClient.js';

// const router = Router();

// router.post('/cache', async (req, res) => {
//   const { key, value } = req.body;
//   try {
//     await redisClient.setEx(key, 60, value);
//     res.json({ message: 'Key set in Redis' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error setting key in Redis' });
//   }
// });

// export default router;