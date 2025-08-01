import express from 'express';
import {
  createMetal,
  getAllMetals,
  getMetalById,
  updateMetal,
  deleteMetal
} from '../controllers/metalController.js';

const router = express.Router();

// Create a new metal
router.post('/', createMetal);

// Get all metals
router.get('/', getAllMetals);

// Get a single metal by ID
router.get('/:id', getMetalById);

// Update a metal by ID (PATCH for partial updates)
router.patch('/:id', updateMetal);

// Delete a metal by ID
router.delete('/:id', deleteMetal);

export default router;
