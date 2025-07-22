export const priceCalculator = (data) => {

    let totalPrice = 0
    let totalDiscount = 0

    data?.map((d) => {
      let pricePerGram = 0
      let makingChargePerGram = 0
      let discount = 0
      // gold silver
      if (d?.unit === "gm" || d?.unit === "tola") {
        pricePerGram = (d?.unit === "gm") ?
          d?.metalid?.unitPrice / 11.664 :
          d?.metalid?.unitPrice

        makingChargePerGram = (d?.makingUnit === "gm") ?
          d?.makingUnit : (d?.makingUnit === "percent") ?
            (d?.materialId?.unitPrice / 11.664 * d?.makingCharge / 100) : 0
      }
      else {
        pricePerGram = (d?.unit === "carat") ?
          d?.materialId?.unitPrice :
          d?.materialId?.unitPrice / 100

        discount = d?.materialId?.discount / 100 *  d?.materialId?.unitPrice * d?.weight 
      }


      totalPrice += (pricePerGram + makingChargePerGram || 0) * d?.weight
      totalDiscount += discount || 0

    })
    return {
      totalPrice: totalPrice.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      finalPrice: (totalPrice - totalDiscount).toFixed(2)
    }
  }