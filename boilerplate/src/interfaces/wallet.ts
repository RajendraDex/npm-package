/**
 * Enum for transaction types.
 * @enum {string}
 * Represents the type of transaction, either Credit or Debit.
 */
export enum TransactionType {
    CR = "CR", // Credit
    DT = "DT"  // Debit
}

/**
 * Interface for transaction parameters.
 * @interface
 * Defines the structure for transaction parameters including customer ID, amount, and type.
 */
export interface TransactionParams {
    customerId: number; // Unique identifier for the customer
    amount: number; // Amount involved in the transaction
    type: TransactionType; // 'CR' for credit, 'DT' for debit
}

/**
 * Enum for wallet details fields.
 * @enum {string}
 * Specifies the fields available in wallet details.
 */
export enum WalletDetails{
    Balance="current_balance", // Current balance in the wallet
    CreatedAt="created_at", // Timestamp when the wallet was created
    UpdatedAt="updated_at", // Timestamp when the wallet was last updated
    CustomerId="customer_id", // Unique identifier for the customer
    Id="id" // Unique identifier for the wallet
}

/**
 * Interface for wallet details parameters.
 * @interface
 * Describes the parameters required to fetch wallet details.
 */
export interface WalletDetailsParams{
    customerId:number; // Unique identifier for the customer
    type:WalletDetails[]; // Array of wallet detail fields to be retrieved
}

/**
 * Enum for transaction modes.
 * @enum {number}
 * Represents the mode of transaction such as Cash, UPI, or Wallet.
 */
export enum TransactionMode{
    CASH=1, // Cash transaction
    UPI=2, // UPI transaction
    WALLET=3 // Wallet transaction
}

/**
 * Enum for transaction by user types.
 * @enum {number}
 * Indicates the type of user performing the transaction.
 */
export enum TransactionByUserType{
    SUPER_ADMIN=1, // Transaction by super admin
    TENANT_STAFF=2, // Transaction by tenant staff
    CUSTOMER=3, // Transaction by customer
    SYSTEM=0 // Transaction by system
}

/**
 * Enum for transaction types.
 * @enum {string}
 * Represents the type of transaction, either Credit or Debit.
 */
export enum TransactionTypes{
    CREDIT="C", // Credit transaction
    DEBIT="D" // Debit transaction
}

/**
 * Interface for user transaction parameters.
 * @interface
 * Defines the structure for parameters required to perform a user transaction.
 */
export interface UserTransactionParams{
    customerId:number; // Unique identifier for the customer
    transactionAmount:number; // Amount involved in the transaction
    transactionId?:string | null; // Unique identifier for the transaction
    type:TransactionTypes; // Type of transaction, 'C' for credit, 'D' for debit
    transactionRemarks:string; // Remarks or notes for the transaction
    transactionDate:string; // Date of the transaction
    bookingId?:number; // Identifier for the related booking
    invoiceId?:number; // Identifier for the related invoice
    promoId?:number | null; // Identifier for the related promotion
    transactionMode:TransactionMode; // Mode of the transaction
    transactionByUserType:TransactionByUserType; // Type of user performing the transaction
    transactionByUserId:number; // Identifier for the user performing the transaction
}

export interface UserBatchTransactionParams{
    customer_id:number; // Unique identifier for the customer
    transaction_amount:number; // Amount involved in the transaction
    transaction_id?:string | null; // Unique identifier for the transaction
    transaction_type:TransactionTypes; // Type of transaction, 'C' for credit, 'D' for debit
    transaction_remarks:string; // Remarks or notes for the transaction
    transaction_date:string; // Date of the transaction
    booking_id?:number; // Identifier for the related booking
    invoice_id?:number; // Identifier for the related invoice
    promo_id?:number | null; // Identifier for the related promotion
    transaction_mode:TransactionMode; // Mode of the transaction
    transaction_by_user_type:TransactionByUserType; // Type of user performing the transaction
    transaction_by_user_id:number; // Identifier for the user performing the transaction
}
