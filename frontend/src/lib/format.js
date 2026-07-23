export function currency(value) {
    if (value === undefined || value === null) return "$0";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

export function stockStatus(quantity) {
    if (quantity === undefined || quantity === null || quantity <= 0) {
        return { label: "Out of Stock", tone: "red" };
    }
    if (quantity <= 3) {
        return { label: "Low Stock", tone: "amber" };
    }
    return { label: "In Stock", tone: "green" };
}
