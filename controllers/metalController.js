import Metal from "../models/Metal.js";

// Create new Metal
export const createMetal = async (req, res) => {
  try {
    const metal = await Metal.create({...req.body});
    return res.status(201).json({
      message: 'Metal created successfully',
      metal,
    });
  } catch (err) {
    console.error('Create Metal Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Get all Metals
export const getMetals = async (req, res) => {
  try {
    const metals = await Metal.findAll({});
    return res.status(200).json({
      status: 'success',
      message: 'Metals fetched successfully',
      metals,
    });
  } catch (err) {
    console.error('Get Metals Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single Metal by ID
export const getMetalById = async (req, res) => {
  try {
    const { id } = req.params;
    const metal = await Metal.findByPk(id);

    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }

    return res.status(200).send(metal);
  } catch (err) {
    console.error('Get Metal By ID Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single Metal by material
export const getMetalByMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const metal = await Metal.findAll({where:{pm_id:id}});

    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }

    return res.status(200).send(metal);
  } catch (err) {
    console.error('Get Metal By ID Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update Metal by ID (PATCH for partial updates)
export const updateMetal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    // Find the Metal first
    const metal = await Metal.findByPk(id);
    
    if (!metal) {
      return res.status(404).json({ 
        success: false,
        message: 'Metal not found' 
      });
    }

    // Save the Metal - this will trigger the post-save hook
    const updatedMetal = await Metal.update({
      ...req?.body
    });

    return res.status(200).json({
      success: true,
      message: 'Metal updated successfully',
      data: Metal
    });

  } catch (err) {
    console.error('Update Metal Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error updating Metal',
      error: err.message
    });
  }
};

// Delete Metal by ID
export const deleteMetal = async (req, res) => {
  try {
    const { id } = req.params;
    const metal = await Metal.findByPk(id)
    
    if (!metal) {
      return res.status(404).json({ error: 'Metal not found' });
    }
    await metal.destroy();

    return res.status(200).json({ message: 'Metal deleted successfully' });
  } catch (err) {
    console.error('Delete Metal Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
