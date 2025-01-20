import 'express';
declare global {
    namespace Express {
    interface Request {
        masterDb?: Knex;
        companyDb?: Knex;
        dbName?: string;
        master_db?: string;
        role?: string;
        userInfo?: { id: number; type: number };
    }
  }
}
