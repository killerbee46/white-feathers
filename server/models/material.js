import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['gold', 'silver', 'diamond'],
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Function to update related metals
const updateRelatedMetals = async (material) => {
  try {
    const Metal = mongoose.model('Metal');
    const metals = await Metal.find({ materialid: material._id });

    if (metals.length === 0) {
      console.log(`No metals found linked to material: ${material.type}`);
      return;
    }

    const updatePromises = metals.map(metal => {
      const pricePerTola = material.unitPrice * (metal.purityPercentage / 100);
      const basePricePerGram = pricePerTola / 11.664;
      
      return Metal.findByIdAndUpdate(
        metal._id,
        {
          unitPrice: Number(pricePerTola.toFixed(2)),
          basePricePerGram: Number(basePricePerGram.toFixed(2))
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    console.log(`Updated ${metals.length} metal(s) for material: ${material.type}`);
  } catch (err) {
    console.error('Error updating metals:', err);
    throw err; // Re-throw to handle in the calling function
  }
};

// Post-save hook
materialSchema.post('save', async function(doc) {
  await updateRelatedMetals(doc);
});

// Post findOneAndUpdate hook
materialSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) { // Only proceed if document was found and updated
    await updateRelatedMetals(doc);
  }
});

const Material = mongoose.model('Material', materialSchema);
export default Material;
