import mongoose from 'mongoose';
import Material from '../models/Material.js';
import Metal from '../models/metal.js';

// Create a new metal
export const createMetal = async (req, res) => {
  try {
    console.log('=== CREATE METAL REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', 
      dbState === 0 ? 'disconnected' :
      dbState === 1 ? 'connected' :
      dbState === 2 ? 'connecting' : 'disconnecting'
    );

    if (dbState !== 1) {
      throw new Error('Database not connected. Please check your MongoDB connection.');
    }

    const { name, type, purityPercentage, materialid } = req.body;

    // Validate required fields first
    if (!name || !type || purityPercentage === undefined || !materialid) {
      const error = new Error('Missing required fields');
      error.status = 400;
      error.details = {
        required: ['name', 'type', 'purityPercentage', 'materialid'],
        received: { name, type, purityPercentage, materialid }
      };
      throw error;
    }

    // Validate material exists
    console.log('Looking up material with ID:', materialid);
    const material = await Material.findById(materialid).lean();
    
    if (!material) {
      const error = new Error(`Material with ID ${materialid} not found`);
      error.status = 404;
      throw error;
    }
    
    console.log('Found material:', material);

    // Validate material has required fields
    if (material.unitPrice === undefined) {
      const error = new Error('Material is missing unitPrice');
      error.status = 400;
      throw error;
    }

    // Calculate prices with validation
    const pricePerTola = Number(material.unitPrice) * (Number(purityPercentage) / 100);
    const basePricePerGram = pricePerTola / 11.664;

    // Create metal data object
    const metalData = {
      name: name.toString().trim(),
      type: type.toString().toLowerCase(),
      purityPercentage: Number(purityPercentage),
      materialid: materialid.trim(),
      basePricePerGram: Number(basePricePerGram.toFixed(2)),
      unitPrice: Number(pricePerTola.toFixed(2))
    };

    console.log('Creating metal with data:', JSON.stringify(metalData, null, 2));
    
    // Create and save metal with validation
    const metal = new Metal(metalData);
    const validationError = metal.validateSync();
    
    if (validationError) {
      console.error('Validation Errors:', validationError.errors);
      const error = new Error('Validation failed');
      error.status = 400;
      error.details = Object.values(validationError.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value,
        kind: err.kind
      }));
      throw error;
    }
    
    const savedMetal = await metal.save();
    
    console.log('Metal created successfully:', savedMetal);

    return res.status(201).json({
      success: true,
      message: 'Metal created successfully',
      data: savedMetal
    });
    
  } catch (err) {
    console.error('=== CREATE METAL ERROR ===');
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      ...(err.details && { details: err.details }),
      ...(err.keyPattern && { keyPattern: err.keyPattern }),
      ...(err.keyValue && { keyValue: err.keyValue }),
      ...(err.errors && { errors: err.errors })
    });
    
    const statusCode = err.status || 500;
    const errorResponse = {
      success: false,
      error: err.message || 'Server error while creating metal',
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          ...(err.details && { validation: err.details }),
          ...(err.code && { code: err.code }),
          ...(err.errors && { errors: err.errors })
        }
      })
    };
    
    return res.status(statusCode).json(errorResponse);
  }
};

// Get all metals
export const getAllMetals = async (req, res) => {
  try {
    const metals = await Metal.find().populate('materialid');
    return res.status(200).json(metals);
  } catch (err) {
    console.error('Get All Metals Error:', err);
    return res.status(500).json({ error: 'Server error while fetching metals' });
  }
};

// Get single metal by ID
export const getMetalById = async (req, res) => {
  try {
    const metal = await Metal.findById(req.params.id).populate('materialid');
    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }
    return res.status(200).json(metal);
  } catch (err) {
    console.error('Get Metal By ID Error:', err);
    return res.status(500).json({ error: 'Server error while fetching metal' });
  }
};

// Update metal and recalculate prices
export const updateMetal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const metal = await Metal.findById(id);
    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }

    // Update fields if provided
    if (updates.name !== undefined) metal.name = updates.name;
    if (updates.type !== undefined) metal.type = updates.type;
    
    // If materialid or purityPercentage changes, recalculate prices
    if (updates.materialid || updates.purityPercentage) {
      const materialId = updates.materialid || metal.materialid;
      const purity = updates.purityPercentage || metal.purityPercentage;
      
      const material = await Material.findById(materialId);
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
      
      metal.materialid = materialId;
      metal.purityPercentage = purity;
      metal.unitPrice = material.unitPrice * (purity / 100);
      metal.basePricePerGram = metal.unitPrice / 11.664;
    }

    await metal.save();
    
    return res.status(200).json({
      message: 'Metal updated successfully',
      metal: await metal.populate('materialid')
    });
  } catch (err) {
    console.error('Update Metal Error:', err);
    return res.status(500).json({ error: 'Server error while updating metal' });
  }
};

// Delete metal
export const deleteMetal = async (req, res) => {
  try {
    const metal = await Metal.findByIdAndDelete(req.params.id);
    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }
    return res.status(200).json({
      message: 'Metal deleted successfully',
      metal
    });
  } catch (err) {
    console.error('Delete Metal Error:', err);
    return res.status(500).json({ error: 'Server error while deleting metal' });
  }
};
