// Interface representing promotion details
export interface IPromotionDetails {
    // Unique identifier for the promotion
    promotionUuid: string;

    // Name of the promotion
    promotionName: string;

    // Tagline of the promotion
    promotionTagline?: string;

    // Start date of the promotion
    startDate: Date;

    // Duration of the offer in days
    offerDuration: number;

    // Price to be paid for the promotion
    payPrice: string;

    // Price to be received for the promotion
    getPrice: string;

    // Name of the person who created the promotion
    createdBy: string;

    // Status of the offer (e.g., Active, Inactive)
    offerStatus: string;
}

export interface IPromotionCreate{
    offerStatus: string;
    promotionName:string;
    promotionTagline?:string;
    startDate:Date;
    offerDuration:number;
    payPrice:number;
    getPrice:number;
    customers:string[];
}

export interface IPromotionUpdate{
    offerStatus:string;
    promotionName?:string;
    startDate?:Date;
    promotionTagline?:string;
    offerDuration?:number;
    payPrice?:number;
    getPrice?:number;
    customers?:any[];
}

export interface IPromotionStatus{
    status:number;
}

export interface PromotionFormatedData {
    promotion_name: string;
    promotion_uuid?: string;
    created_by: number;
    offer_status: number;
    start_date: string;
    offer_duration: number;
    pay_price: number;
    get_price: number;
    promotion_tagline?: string;
    created_at: Date;
    updated_at: Date;
}
export interface PromotionData {
    formatedData:PromotionFormatedData;
    customers: Array<{
        customer_id: string;
        purchase_date: Date;
    }>;
    role: string;
}

export interface CustomerLinkData {
    customer_id: number;
    purchase_date: Date;
    promo_id: number;
    pay_price: number;
    get_price: number;
    expiry_date: Date | string;
}
