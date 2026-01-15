import Material from "../models/Material.js";

// Create new material
export const createMaterial = async (req, res) => {
  try {
    const material = await Material.create({...req.body});
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
    const materials = await Material.findAll({});
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
    const material = await Material.findByPk(id);

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

    // Find the material first
    const material = await Material.findByPk(id);
    
    if (!material) {
      return res.status(404).json({ 
        success: false,
        message: 'Material not found' 
      });
    }

    // Save the material - this will trigger the post-save hook
    const updatedMaterial = await material.update({
      ...req?.body
    });

    return res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: material
    });

  } catch (err) {
    console.error('Update Material Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error updating material',
      error: err.message
    });
  }
};

// Delete material by ID
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id)
    await material.destroy();

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error('Delete Material Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
