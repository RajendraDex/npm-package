// Mapping for tenant-related columns
export const tenantColumnMappings: Record<string, string> = {
    tenantName: 'tenant_name', // Maps tenantName to tenant_name in the database
    email: 'email_id', // Maps email to email_id in the database
    phoneNumber: 'phone_number', // Maps phoneNumber to phone_number in the database
}

// Mapping for customer-related columns
export const customerColumnMappings: Record<string, string> = {
    firstName: 'first_name', // Maps customerName to first_name in the database
    email: "email_id" // Maps email to email_id in the database
}

// Mapping for invoice-related columns
export const invoiceColumnMappings: Record<string, string> = {
    invoiceNumber: "tenant_invoices.invoice_number", // Maps invoiceNumber to invoice_number in the database
    createdAt: "tenant_invoices.service_date", // Maps createdAt to service_date, sorted by service date
    customerName: "tenant_customers.first_name", // Maps customerName to first_name in the database
    serviceName: "tenant_service.service_name", // Maps serviceName to service_name in the database
    providerName: "tenant_staff.first_name" // Maps providerName to first_name in the database
}

// Mapping for booking status values
export const bookingStatusMap = {
    'pending': 1, // Maps 'pending' status to 1
    'in-progress': 2, // Maps 'in-progress' status to 2
    'complete': 3, // Maps 'completed' status to 3
    'completed': 3, // Maps 'completed' status to 3
    'cancel': 4, // Maps 'cancel' status to 4
    'canceled': 4 // Maps 'canceled' status to 4
} as const;

// Mapping for booking sorting columns
export const bookingSortingColumnMapping: Record<string, string> = {
    createdAt: 'tb.created_at', // Maps createdAt to tb.created_at in the database
    bookingDate: 'tb.booking_date', // Maps bookingDate to tb.booking_date in the database
    bookingTime: 'tb.booking_time' // Maps bookingTime to tb.booking_time in the database
} as const;

// Mapping for promotion-related columns
export const promotionColumnMappings: Record<string, string> = {
    createdAt: 'po.created_at', // Maps createdAt to po.created_at in the database
    promotionName: 'po.promotion_name', // Maps promotionName to po.promotion_name in the database
    payPrice: 'po.pay_price', // Maps payPrice to po.pay_price in the database
    getPrice: 'po.get_price' // Maps getPrice to po.get_price in the database
} as const;

// Mapping for promotion status values
export const promotionStatusMap = {
    'Active': 1, // Maps 'Active' status to 1
    'Inactive': 0 // Maps 'Inactive' status to 2
} as const;

export const addressColumnMappings: Record<string, string> = {
    createdAt: 'created_at', // Maps createdAt to created_at in the database
    locationName: 'location_name', // Maps locationName to location_name in the database
    contactPersonName: 'contact_person_name', // Maps contactPersonName to contact_person_name in the database
    phoneNumber: 'phone_number', // Maps phoneNumber to phone_number in the database
    status: 'status' // Maps status to status in the database
} as const;

  export const discountColumnMappings:Record<string,string>={
    discountTitle:"discount_title",
    discountCode:"discount_code",
    discountPercentage:"discount_percentage",
    discountAmount:"discount_amount",
  }
