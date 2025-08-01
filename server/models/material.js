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

// Post-save hook to update related metals' prices automatically
materialSchema.post('save', async function (doc) {
  try {
    // Use mongoose.model() to get the Metal model to avoid circular dependency
    const Metal = mongoose.model('Metal');
    const metals = await Metal.find({ materialid: doc._id });

    if (metals.length === 0) {
      console.log(`No metals found linked to material: ${doc.type}`);
      return;
    }

    for (const metal of metals) {
      metal.unitPrice = doc.unitPrice * (metal.purityPercentage / 100);
      metal.basePricePerGram = metal.unitPrice / 11.664;
      await metal.save();
    }
    console.log(`Updated ${metals.length} metal(s) for material: ${doc.type}`);
  } catch (err) {
    console.error('Error updating metals:', err);
  }
});

const Material = mongoose.model('Material', materialSchema);
export default Material;
