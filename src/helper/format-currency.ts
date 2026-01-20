export const formatCurrency = (price: number): string => {
    if (!price || isNaN(price)) {
        return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);
}