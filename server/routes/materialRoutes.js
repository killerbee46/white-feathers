import express from 'express';
import { 
  createMaterial, 
  getMaterials, 
  updateMaterial, 
  getMaterialById, 
  deleteMaterial 
} from '../controllers/materialController.js';

const router = express.Router();

// Create a new material
router.post('/', createMaterial);

// Get all materials
router.get('/', getMaterials);

// Get a single material by ID
router.get('/:id', getMaterialById);

// Update a material by ID (PATCH only for partial updates)
router.patch('/:id', updateMaterial);

// Delete a material by ID
router.delete('/:id', deleteMaterial);

export default router;