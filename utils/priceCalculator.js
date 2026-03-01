const priceCalculator = ({ productData, res }) => {
  const { metalId, materialId, metal, material, weight, price,mk_gm=0, mk_pp=0, jarti=0, jarti_gm=0, offer=0  } = productData

  const metalPrice = ( metalId && metalId > 0 && metalId !== 11 ? parseInt(material?.price) / 11.664 * metal?.purity / 100 : 0 ) * weight
  const rhodiumPrice = metalId && metalId == 11 ? 4 * parseInt(material?.price) * weight / 11.664 : 0
  const makingCharges = mk_pp + (mk_gm * weight) + ((metalId <= 0 && metalId !== 11 ? 0 : parseInt(material?.price) ) / 11.664 * (jarti / 100) * weight) + (material == 2 ? (jarti_gm * parseInt(material?.price) / 11.664) : 0)
  const totalDiamondPrice = materialId == 1 ? parseInt(price) || material?.price * weight  : 0

  const actualPrice = (metalPrice + makingCharges + ((metalId > 0 && metalId < 10 ? material?.lux_tax : 0) / 100 * (metalPrice + makingCharges)) + rhodiumPrice + totalDiamondPrice)

  const discount = (metalPrice + makingCharges) * (offer / 100) + (metalId == 11 ? 0.5 * parseInt(price) * weight / 11.664 : 0) + ((materialId == 1 ? parseFloat(material?.discount) : 0) / 100 * totalDiamondPrice)

  const finalPrice = actualPrice - discount
  
  return {
    actualPrice:parseInt(actualPrice),
    discount:parseInt(discount),
    finalPrice:parseInt(finalPrice)
  }
}

export default priceCalculator