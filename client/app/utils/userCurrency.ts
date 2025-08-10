export const myCurrency = localStorage?.getItem('currency') || "npr"

export const setCurrency = (value:string) => {
    localStorage?.setItem('currency',value)
}