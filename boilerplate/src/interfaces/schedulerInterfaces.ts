export interface LoggerData {
    connections: { database: string; status: string; error?: string }[];
    transactions: { database: string; transactions: number }[];
    errors: { database: string; error: string }[];
}