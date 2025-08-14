import mongoose from 'mongoose';

const metalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  type: {
    type: String,
    required: true
  },
  purityPercentage: {
    type: Number,
    required: true
  },
  basePricePerGram: {
    type: Number,
  },
  unitPrice: {
    type: Number
  },
  materialid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  }
}, { timestamps: true });

const Metal = mongoose.model('Metal', metalSchema);
export default Metal;
