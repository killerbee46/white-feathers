const productPrice = ({ productData, goldPrice, silverPrice, diamondPrice, details = false }) => {

    const metal = productData?.Metal

    const metalPrice = (productData?.pmt_id <= 0 ? 0 : productData?.pmt_id < 10 ? goldPrice * metal?.purity / 100 / 11.664 : (productData?.pmt_id == 10 ? silverPrice * metal?.purity / 100 / 11.664 : 0)) * productData?.weight
    const rhodiumPrice = productData?.pmt_id == 11 ? 4 * silverPrice * productData?.weight / 11.664 : 0
    const makingCharges = productData?.mk_pp + (productData?.mk_gm * productData?.weight) + ((productData?.pmt_id <= 0 ? 0 : productData?.pmt_id < 10 ? goldPrice : silverPrice) / 11.664 * (productData?.jarti / 100) * productData?.weight)
    const totalDiamondPrice = (productData?.p_name.toLowerCase()?.includes('solitaire') ? productData?.dc_rate : diamondPrice.price) * productData?.dc_qty + (productData?.dc_rate_bce2 * productData?.dc_qty_bce2)

    const actualPrice = productData?.isFixedPrice > 0 ? productData?.fixed_price :
        (metalPrice + rhodiumPrice + makingCharges + totalDiamondPrice)

    const discount = productData?.isFixedPrice > 0 ? productData?.offer / 100 * actualPrice : (metalPrice + makingCharges) * (productData?.offer / 100) + (productData?.pmt_id == 11 ? 0.5 * silverPrice * productData?.weight / 11.664 : 0) + (diamondPrice?.discount / 100 * totalDiamondPrice)

    const finalPrice = actualPrice - discount

    const image = productData?.image ?? productData?.Images[0]?.s_path

    if (details) {
        return {
            id: productData?.id_pack,
            image: image,
            title: productData?.p_name,
            actualPrice: actualPrice,
            discount: discount,
            finalPrice: finalPrice,
            ps_id:productData?.ps_id,
            metal:productData?.Metal,
            tag_kid:productData?.tag_kid,
            tag_men:productData?.tag_men,
            tag_women:productData?.tag_women,
            tag_gift:productData?.tag_gift,
            diamondDiscount:productData?.dc_qty || productData?.dc_qty_bce2 ? diamondPrice?.discount : 0,
            productDiscount:productData?.offer,
        }
    }
    else {
        return {
            id: productData?.id_pack,
            image: image,
            title: productData?.p_name,
            actualPrice: actualPrice,
            discount: discount,
            finalPrice: finalPrice,
            diamondDiscount:productData?.dc_qty || productData?.dc_qty_bce2 ? diamondPrice?.discount : 0
        }
    }
}

export default productPrice