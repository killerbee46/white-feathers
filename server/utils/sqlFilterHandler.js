const dynamic_price = ' (IF(p.pmt_id <= 9, pr.rate/11.664 * p.weight, pr.rate * p.weight) + p.dc_rate * p.dc_qty + IF(p.mk_pp, p.mk_pp, p.mk_gm * p.weight) ) '

export const sqlFilterHandler = (filters) => {
    let query = "";
    if (filters.name) query = query + ` and p_name like '%${filters?.name}%' `;
    if (filters.status) query = query + ` and status = ${filters?.status} `;
    // if (filters.category) query = query + ` and cat_id = ${filters?.category} `;
    // if (filters.date_eq) query = query + ` and status = ${filters?.status} `;
    // if (filters.date_lte) query.date = {$lte: filters.date_lte};
    // if (filters.date_gte) query.date = { ...query.date, $gte: filters.date_gte };
    if (filters.minPrice) query = query + ` and ${dynamic_price} > ${filters?.minPrice} `;
    if (filters.maxPrice) query = query + ` and ${dynamic_price} < ${filters?.maxPrice} `;
    if (filters.minWeight) query = query + ` and weight > ${filters?.minWeight} `;
    if (filters.maxWeight) query = query + ` and weight < ${filters?.maxWeight} `;
    if (filters.limit) query = query + ` limit ${filters?.limit} `;
    if (filters.offset) query = query + ` offset ${filters?.offset} `;

    return query;
}