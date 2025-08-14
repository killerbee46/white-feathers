export const filterHandler = (filters) => {
    let query = {};
    if (filters.name) query.name = new RegExp(filters.name, 'i');
    if (filters.futsal) query.futsal = {$eq:filters.futsal};
    if (filters.booker) query.booker = {$eq:filters.booker};
    if (filters.status) query.status = {$eq:filters.status};
    if (filters.date_eq) query.date = {$eq:filters.date_eq};
    if (filters.date_lte) query.date = {$lte: filters.date_lte};
    if (filters.date_gte) query.date = { ...query.date, $gte: filters.date_gte };
    if (filters.category) query.category = {$in: filters.category };
    if (filters.location) query.location = new RegExp(filters.location, 'i');
  
    return query;
  };