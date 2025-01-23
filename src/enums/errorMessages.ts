export enum CategoryErrors {
    CatgoryNameRequired = "Category name is required",
    StatusZeroOrOne = "Status must be either 0 or 1"
}

export enum ServiceErrors {
    ServiceNameRequired = "Service title is required",
    ServiceDescriptionRequired = "Service Description Required",
    ServicePriceRequired = "Service price is required",
    ServiceCategoryIdsRequired = "Please select a category",
    ServiceImageRequired = "Service Image Required",
    ServiceDurationRequired = "Please select a service duration",
    StatusZeroOrOne = "Status Zero Or One",
}

export enum StaffErrors {
    FirstNameRequired = "This field is required",
    LastNameRequired = "This field is required",
    EmailInvalid = "Please enter a valid email address",
    PhoneNumberRequired = "This field is required",
    PhoneNumberInvalid = "Please enter a valid phone number",
    DateInvalid = "Please select a valid date",
    GenderRequired = "This field is required",
    AddressLine1Required = "This field is required",
    CityRequired = "This field is required",
    StateRequired = "This field is required",
    CountryRequired = "This field is required",
    PincodeRequired = "This field is required",
    PincodeInvalid = "Please enter a valid zip code",
    ProfilePicInvalid = "Invalid profile picture format. Please upload a valid image",
    RoleRequired = "Please assign at least 1 role",
    StaffExperienceRequired = "This field is required",
    StaffExperienceUnrealistic = "Please enter a realistic number of years",
    DateFormatInvalid = "Invalid date format, expected YYYY-MM-DD"
}

export enum CustomerErrors {
    FirstNameRequired = "First name is required",
    LastNameRequired = "Last name is required",
    EmailIdRequired = "Invalid email address",
    CountryCodeRequired = "Country code is required",
    PhoneNumberRequired = "Phone number is required",
    PasswordRequired = "Password is required",
    InvalidGender = "Invalid gender",
    CountryCodeLength = "Country code must be at most 8 characters long",
    CustomerIdRequired = "Customer id is required",
    PromotionIdRequired = "Promotion id is required",
    DeleteFlag = "Delete flag must be either 0 or 1",
    StatusFlag = "Status must be either 0, 1, or 2"
}

export enum InvoiceErrors {
    FieldRequired = "This field is required",
    InvalidEmail = "Please enter a valid email address"
}

export enum AuthErrors {
    InvalidEmail = "Please enter a valid email address",
    InvalidPassword = "Incorrect username or password. Please try again.",
    InvalidRefreshToken = "Invalid refresh token"
}

export enum TenantErrors {
    FieldRequired = "This field is required",
    InvalidEmail = "Please enter a valid email address",
    InvalidDayofWeek = "Invalid day of the week",
    InvalidStartTime = "Invalid start time format",
    InvalidEndTime = "Invalid end time format",
    StatusZeroOrOne = "Status must be either 0 or 1"
}

export enum RoleErrors {
    RoleNameRequired = "This field is required"
}

export enum PrivilegeErrors {
    FieldRequired = "This field is required",
}

export enum PromotionErrors {
    FieldRequired = "This field is required",
    InvalidDate = "Invalid date format",
    GetPriceLessThanPayPrice = "Get price can not be less than pay price",
    InvalidStatus = "Invalid status status can be only Active or Inactive",
    MaximumSizeExceeded = `Maximum size exceeded, please enter a value less than ${'{size}'} characters`
}

export enum DiscountErrors{
    FieldRequired = "This field is required",
    InvalidDiscountType = "Invalid discount type it can be percentage or amount",
    InvalidDiscountValue = "Invalid discount value it should be less than 100 percentage",
    MaxLength = `Max length for ${'field'} is ${'maxLength'} ${'type'}`
}
   
export enum WalletErrors{
    InvalidCustomerId = "Invalid customer ID.",
    InvalidStatus = "Invalid status value.",
    InvalidAmount = "Invalid amount. Amount must be greater than zero.",
    InsufficientFunds = "Insufficient funds.",
    InvalidTransactionType = "InvalidTransactionType",
    InvalidWalletDetailsRequest = "InvalidWalletDetailsRequest"
}

export enum TransactionErrors {
    TransactionIdRequired = "Transaction id is required",
    InvoiceIdRequired = "Invoice id is required",
    FieldRequired = "This field is required",
    InvalidStatus = "Invalid status status can be only 0 or 1"
}

export enum AddressErrors{

    FieldRequired = "This field is required",
    UnableToUpdateAddress = "Unable to update address",
    AddressIdRequired = "Address ID is required",
    AddressNotFound = "Address not found",
    InvalidStatus = "Invalid status status can be only active or inactive",
    MaxLength = `Max length is for field ${'field'} is ${'maxLength'} characters`,
    InvalidPhoneNumber = "Please enter a valid phone number",
    InvalidZipcode = "Please enter a valid zipcode",
    CannotUpdateInactiveAddress = "Cannot update inactive address",
    CannotUpdateStatus = "Cannot update status",
    AddressAlreadyExists = "Address already exists"
}

