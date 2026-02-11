import express from 'express';
import { 
  createMetal, 
  getMetals, 
  updateMetal, 
  getMetalById, 
  deleteMetal, 
  getMetalByMaterial
} from '../controllers/metalController.js';

const router = express.Router();

// Create a new Metal
router.post('/', createMetal);

// Get all Metals
router.get('/', getMetals);

// Get a single Metal by ID
router.get('/:id', getMetalById);

// Get Metals by ID
router.get('/material/:id', getMetalByMaterial);

// Update a Metal by ID (PATCH only for partial updates)
router.patch('/:id', updateMetal);

// Delete a Metal by ID
router.delete('/:id', deleteMetal);

export default router;