export enum DatabaseMessages {
    DatabaseNotConfigured = 'Database name is not configured',
}
export enum ValidationMessages {
    EmailAndPasswordRequired = 'Email and password are required',
    InvalidCredentials = 'Incorrect username or password. Please try again.!',
    InvalidOldPassword = "Invalid old password",
    Unauthorized = "Unauthorized",
    Forbidden = "Forbidden",
    InvalidRefreshToken = "Invalid RefreshToken",
    PasswordChangeRequired = "Old and new password are required"
}


export enum ErrorMessages {
    InternalServerError = 'Internal Server Error',
    UnknownError = 'An unknown error occurred',
    MissingRecaptchaToken = 'Missing Recaptcha Token',
    InvalidRecaptchaToken = 'Invalid Recaptcha Token',
    RecaptchaVerificationFailed = 'Recaptcha Validation Failed',
    Unauthorized = "Unauthorized",
    InvalidRequest = "Invalid Request",
    MISSING_REQUIRED_PARAMETERS = "Missing required transaction parameters."
}

export enum PermissionMessages {
    PermissionNotFound = 'Privilege Not Found',
    PermissionDeleted = 'Privilege deleted successfully.',
    PermissionCreated = 'New privilege added successfully.',
    PermissionsFetched = 'Privileges successfully fetched',
    PermissionAlreadyExists = 'Privilege already Exists',
    PermissionUpdated = 'Privilege updated successfully.',
    RoutesAssigned = 'Routes Assigned successfully'


}

export enum UserMessages {
    PasswordChangeSuccessful = "Password changed successfully.",
    UserNotFound = 'Incorrect username or password. Please try again.',
    LoginSuccessful = "Welcome back! You're logged in.",
    RefreshTokenSuccessful = "Refresh Token Successful",
    AlreadyLoggedOut = "You have been already logged out.",
    LogoutFailed = "Logout failed.",
    LogoutSuccessful = "You have been logged out successfully."
}

export enum RoleMessages {
    RoleUpdated = "Role updated successfully.",
    RoleNotFound = 'Role Not Found',
    RoleAlreadyExists = 'Role Alredy Exists',
    RoleCreated = "New role added successfully.",
    RolesFetched = "Roles Fetched",
    RoleFetched = 'Role Fetched',
    RoleAssociatedWithUser = "Can not delete Role is associated with user",
    RoleDeleted = 'Role deleted successfully.'
}

export enum TenantMessages {
    CreateSuccessful = "New record has been successfully created",
    TenantAlreadyExists = "Company already exists.",
    StatusUpdateSuccessful = "Company Status updated successfully",
    Fetched = "'Company fetched successfully'",
    CompaniesFetched = "Companies fetched successfully",
    DomainAlreadyExists = "Tenant with this domain name already exists",
    CompanyNotExists = "Company not found.",
    AddressNotFound = "Address not found for tenant.",
    UpdateSuccessful = "The record has been updated successfully.",
    AddressFetchSuccessful = "Addresses fetched successfully"


}

export enum CustomerMessages {
    UserNameTaken = "User Name Already Taken",
    CreateCustomerFailed = "Customer creation failed",
    PhoneNumberAlreadyExists = "Phone number already exist",
    CustomerNotFound = "Customer not found",
    CustomerDeleted = "Customer deleted successfully.",
    DeleteCustomerFailed = "Delete Customer Failed",
    FetchCustomerFailed = "Fetch Customer Failed",
    FetchCustomersFailed = "Fetch Customers Failed",
    UpdateCustomerFailed = "No fields were updated. Please check the fields and try again.",
    CustomerAlreadyExists = "Customer Already Exists",
    CreateSuccessful = "New customer added successfully.",
    FetchSuccessful = "Customers fetched Successfully",
    UpdateSuccessful = 'Customer details updated successfully.',
    DeleteSuccessful = "Delete Successful",
    CustomerRecovered = "Customer recovered successfully.",
    CustomerStatusChangedSuccessfully = "Customer status changed successfully.",
    CanNotUpdateCustomer = "Can not update customer"

}

export enum StaffMessages {
    StaffAlreadyExists = "Staff already exisits",
    StaffNotFound = "Staff Not Found",
    CreateSuccessful = "New record added successfully.",
    UpdateSuccessfull = "The record updated successfully.",
    FetchSuccessful = "Fetch Successful",
    DeleteSuccessfull = "The record deleted successfully.",
    StatusChangedSuccessfull = "Staff/Provider status changed successfully.",

}

export enum CategoryMessages {
    CategoryRecovered = "Category Recovered successfully",
    CreateSuccessful = "Category created successfully",
    CategoryAlreadyExists = "Category Already Exists",
    CategoryNotFound = "Category Not Found",
    CategoryUpdated = "Category Updated successfully",
    CategoryFetched = "Category Fetched successfully",
    CategoryDeleted = "Category Deleted successfully",
}

export enum ServiceMessages {
    ServiceRecovered = "Service Recovered successfully",
    ServiceAlreadyExists = 'Service Already Exists',
    ServiceNotFound = "Service NotFound",
    CreateSuccessful = "New service added successfully.",
    ServiceUpdated = "Service updated successfully.",
    StatusChangeSuccessful = "Status Changed Successfully",
    FetchSuccessful = "FetchSuccessful",
    DeleteSuccessful = "Service deleted successfully."
}

export enum InvoiceMessages {
    InvoiceNotFound = "Invoice Not Found",
    CreateSuccessful = "New record added successfully ",
    InvoiceUpdated = "Record Updated successfully",
    FetchSuccessful = "Fetch Successful",
    CustomerNotFound = "Customer Not Found",
    ProviderNotFound = "Provider Not Found"
}

export enum BookingMessages {
    CreateSuccessful = "New record added successfully",
    BookingNotFound = "Booking Not Found",
    UpdateSuccessful = "Record Updated successfully",
    FetchSuccessful = "Fetch Successful",
    BookingNotCompleted = "Booking Not Completed",
    BookingAlreadyInvoiced = "Booking Already Invoiced"
}

export enum ReportMessages {
    FetchSuccessful = "Fetch Successful",
}

export enum PromotionMessages {
    PromotionAlreadyExists = "Promotion Already Exists",
    CreateSuccessful = "New record added successfully",
    PromotionNotFound = "Promotion Not Found",
    PromotionDetails = "Fetched successfully",
    UpdateSuccessful = "Record Updated successfully",
    PromotionList = "Fetched successfully",
    AlreadyAvaildPromotion = "Already Availd Promotion",
    DeleteSuccessful = "Delete Successful",
    PromotionExpired = "Promotion Expired",
    PromotionApplied = "Promotion Applied",
    UnableToUpdatePromotion = "Unable to update promotion its already linked with customer",
    PromotionInsertFailed = "Unable to insert promotion",
    CanNotCreatePromotionCheckCustomers = "Can not create promotion verfiy customers",
    CanNotUpdatePromotionCheckCustomers = "Can not update promotion verfiy customers",
}
export enum DiscountMessages {
    DiscountCodeAlreadyExists = "Discount code already exists",
    CreateSuccessful = "New record added successfully",
    DiscountNotFound = "Discount not found",
    FetchSuccessful = "Fetch Successful",
    UpdateSuccessful = "Record Updated successfully",
    DiscountAlreadyApplied = "Offer has been availed on the previous service",
    DiscountApplicableOnBirthday = `Happy Birthday Month! To help you celebrate, we're excited to offer you an exclusive <span> discount of ${'{discount}'}% with max value of ₹${'{maxInvoiceValue}'}/Flat rate ₹${'{flatDiscount}'}</span> off on your next purchase with us! `,
    AlreadyAvaildPromotion = "Already Availd Promotion",
}


export enum WalletMessages {
    WalletNotFoundForCustomer = "Wallet Not Found for Customer",
    WalletCreated = "Wallet created successfully",
    WalletDeleted = "Wallet deleted successfully",
    WalletStatusChanged = "Wallet status changed successfully",
}

export enum TransactionMessages {
    TransactionNotFound = "Transaction Not Found",
    TransactionDeleted = "Transaction Deleted",
    TransactionUpdated = "Transaction Updated",
    TransactionAmountMismatch = "The total of ewallet, cash, and UPI amounts does not match the invoice amount.",
    InvoiceIdRequired = "Invoice ID is required.",
    TransactionRemarks = `E-Wallet Amount ${'{type}'}`

}

export enum AddressMessages{
    CreateSuccessful = "New record added successfully",
    UpdateSuccessful = "Record Updated successfully",
    FetchSuccessful = "Fetch Successful",
}




