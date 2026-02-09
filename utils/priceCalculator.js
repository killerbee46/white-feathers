export const priceCalculator = (data) => {

  let totalPrice = 0
  let totalDiscount = 0

  data?.map((d) => {
    const pricePerGram = d?.materialId == 1 ?
      d?.price ?? d?.material?.price :
      d?.metalId > 0 ? 1 : 0
    const makingChargePerGram = d?.mk_gm
    const makingChargePerPiece = d?.mk_pp
    const jartiPerGram = d?.jarti / 100 * d?.material?.price / 11.664
    let discount = 0
    // gold silver
    if (d?.unit === "gm" || d?.unit === "tola") {
      pricePerGram = (d?.unit === "gm") ?
        d?.metalId?.unitPrice / 11.664 :
        (d?.unit === "tola") ? d?.metalId?.unitPrice : 0

      makingChargePerGram = (d?.makingUnit === "gm") ?
        d?.makingCharge : (d?.makingUnit === "percent") ?
          ((d?.materialId?.unitPrice / 11.664) * (d?.makingCharge / 100)) : 0
    }
    else {
      pricePerGram = (d?.unit === "carat") ?
        d?.materialId?.unitPrice :
        d?.materialId?.unitPrice / 100

      discount = d?.materialId?.discount / 100 * d?.materialId?.unitPrice * d?.weight
    }


    totalPrice += (pricePerGram + makingChargePerGram + jartiPerGram) * d?.weight + makingChargePerPiece
    totalDiscount += discount || 0
  })
  return {
    totalPrice: totalPrice.toFixed(0),
    totalDiscount: totalDiscount.toFixed(0),
    finalPrice: (totalPrice - totalDiscount)
  }
}