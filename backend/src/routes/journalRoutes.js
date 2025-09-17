// src/routes/journal.routes.js
import { Router } from 'express';
import { createJournalEntry, getUserEntries } from '../controllers/journal.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// POST to create a new entry, GET to retrieve all entries
router.route('/').post(createJournalEntry).get(getUserEntries);

export default router;