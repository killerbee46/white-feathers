import Material from '../models/material.js';

// Create new material
export const createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    return res.status(201).json({
      message: 'Material created successfully',
      material,
    });
  } catch (err) {
    console.error('Create Material Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Get all materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    return res.status(200).json({
      status: 'success',
      message: 'Materials fetched successfully',
      materials,
    });
  } catch (err) {
    console.error('Get Materials Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single material by ID
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json(material);
  } catch (err) {
    console.error('Get Material By ID Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update material by ID (PATCH for partial updates)
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    // Validate request body
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No update data provided' 
      });
    }

    // Find the material first
    const material = await Material.findById(id);
    
    if (!material) {
      return res.status(404).json({ 
        success: false,
        message: 'Material not found' 
      });
    }

    // Update the material fields
    Object.keys(updates).forEach(update => {
      material[update] = updates[update];
    });

    // Save the material - this will trigger the post-save hook
    const updatedMaterial = await material.save();

    return res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: updatedMaterial
    });

  } catch (err) {
    console.error('Update Material Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error updating material',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete material by ID
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error('Delete Material Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
