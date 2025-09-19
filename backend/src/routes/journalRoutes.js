// src/routes/journal.routes.js
import { Router } from 'express';
import { createJournalEntry, getUserEntries } from '../controllers/journalController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

// POST to create a new entry, GET to retrieve all entries
router.route('/').post(createJournalEntry).get(getUserEntries);

export default router;