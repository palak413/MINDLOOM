import { Router } from 'express';

const musicRouter = Router();

// Define a basic test route
// This will be accessible at YOUR_BASE_URL/api/music/
musicRouter.get('/', (req, res) => {
  res.json({ message: 'Music route is working!' });
});

// You can add more routes here later
// For example: musicRouter.get('/:songId', ...);


export default musicRouter;