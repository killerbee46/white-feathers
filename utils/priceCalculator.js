export const priceCalculator = ({ data, res }) => {

  let totalPrice = 0
  let totalDiscount = 0

  data?.map((d) => {
    const materialPrice = parseInt(d?.material?.price)
    const pricePerGram = d?.materialId == 1 ?
      d?.price ?? materialPrice :
      d?.metalId != 10 ? materialPrice * (d?.metal?.purity / 100) / 11.664 : materialPrice / 11.664 * 4
    const disPerGram = d?.materialId == 1 ?
      (d?.price ?? materialPrice) * (parseInt(d?.material?.discount) / 100) :
      d?.metalId != 10 ? materialPrice * (d?.metal?.purity / 100) * (d?.offer ?? 0 / 100) : materialPrice / 11.664 * 0.5
    const makingChargePerGram = d?.mk_gm ?? 0
    const makingChargePerPiece = d?.mk_pp ?? 0
    const jartiPerGram = (d?.jarti ?? 0 / 100 * materialPrice) / 11.664

    const price = (pricePerGram + makingChargePerGram + jartiPerGram) * d?.weight + makingChargePerPiece
    const discount = disPerGram * d?.weight ?? 0

    totalPrice += price
    totalDiscount += discount

  })
  return {
    totalPrice: totalPrice,
    totalDiscount: totalDiscount,
    finalPrice: totalPrice - totalDiscount
  }
}