export const sqlFilterHandler = (filters) => {
    let query = "";
    if (filters.name) query = query + ` and p_name like '%${filters?.name}%' `;
    if (filters.status) query = query + ` and status = ${filters?.status} `;
    // if (filters.category) query = query + ` and cat_id = ${filters?.category} `;
    if (filters.limit) query = query + ` limit ${filters?.limit} `;
    if (filters.offset) query = query + ` offset ${filters?.offset} `;
    // if (filters.date_eq) query = query + ` and status = ${filters?.status} `;
    // if (filters.date_lte) query.date = {$lte: filters.date_lte};
    // if (filters.date_gte) query.date = { ...query.date, $gte: filters.date_gte };
  
    return query;
}