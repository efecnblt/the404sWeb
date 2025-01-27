/**
 * @description İndirimi hesaplayan fonksiyon (ör. discount = 7.99)
 * @param price  Kursun ana fiyatı (örneğin 59.99)
 * @param discount İndirim miktarı (örneğin 7.99)
 * @returns Indirime uğramış fiyat, 0’ın altına düşerse 0 döndürür
 */
export function getDiscountedPrice(price: number, discount: number): number {

    if (!price || !discount || isNaN(price) || isNaN(discount)) {
        return price || 0;
    }
    return price + discount;
}