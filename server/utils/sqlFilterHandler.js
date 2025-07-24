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
    if (filters.metal === "gold") query = query + ` and p.pm_id = 2 or p.pmt_id >= 1 `;
    if (filters.metal === "silver") query = query + ` and p.pm_id = 3 or p.pmt_id >= 10 `;
    if (filters.metal === "diamond") query = query + ` and p.pm_id = 1 `;
    if (filters.metal === "rhodium") query = query + ` and p.pm_id = 4 `;
    if (filters.sortBy === "latest") query = query + `  order by id desc `;
    if (filters.sortBy === "price-htl") query = query + ` order by ${dynamic_price} desc `;
    if (filters.sortBy === "price-lth") query = query + ` order by ${dynamic_price} `;
    if (filters.sortBy === "discounted") query = query + ` and p.offer > 0 `;
    if (filters.limit) query = query + ` limit ${filters?.limit} `;
    if (filters.offset) query = query + ` offset ${filters?.offset} `;

    return query;
}