import { Request, Response, NextFunction } from 'express';
import { tenantMiddleware } from '../../src/middlewares/core/tenantMiddleware';
import { defaultKnex, getKnexWithConfig } from '../../src/db/knexfile';

// Mock the dependencies
jest.mock('../../src/db/knexfile');
jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('tenantMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    mockNext = jest.fn();
    (defaultKnex as unknown as jest.Mock).mockReset();
    (getKnexWithConfig as jest.Mock).mockReset();
  });

  it('should use default Knex instance when no tenant is found', async () => {
    mockReq.headers = { 'x-request-origin': 'example.com' };
    (defaultKnex as unknown as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    });

    await tenantMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect((mockReq as any).knex).toBe(defaultKnex);
    expect((mockReq as any).isTenant).toBe(false);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should use tenant Knex instance when tenant is found', async () => {
    mockReq.headers = { 'x-request-origin': 'tenant.example.com' };
    const mockTenantConfig = {
      db_host: 'localhost',
      db_username: 'user',
      db_password: 'pass',
      db_name: 'tenant_db',
      db_port: 5432,
    };
    (defaultKnex as unknown as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockTenantConfig),
    });
    const mockTenantKnex = {};
    (getKnexWithConfig as jest.Mock).mockReturnValue(mockTenantKnex);

    await tenantMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect((mockReq as any).knex).toBe(mockTenantKnex);
    expect((mockReq as any).isTenant).toBe(true);
    expect(mockNext).toHaveBeenCalled();
    expect(getKnexWithConfig).toHaveBeenCalledWith({
      host: 'localhost',
      user: 'user',
      password: 'pass',
      database: 'tenant_db',
      port: 5432,
    });
  });

  it('should handle errors and send 500 status', async () => {
    mockReq.headers = { 'x-request-origin': 'example.com' };
    (defaultKnex as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    await tenantMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith('Middleware error: Error: Database error');
    expect(mockNext).not.toHaveBeenCalled();
  });
});