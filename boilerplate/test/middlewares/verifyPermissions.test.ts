import { Request, Response, NextFunction } from 'express';
import { verifyRolePermissions } from '../../src/middlewares/core/verifyPermisssions';
import { ResponseCodes } from '../../src/enums/responseCodes';

// Mocking dependencies
jest.mock('../../src/helpers/auth/authHelper', () => ({
  Auth: jest.fn().mockImplementation(() => ({
    verifyToken: jest.fn().mockImplementation(token => {
      if (token === 'Bearer valid_token') {
        return { id: 'user_uuid', 'x-request-origin-type': '1' };
      } else {
        throw new Error('Invalid token');
      }
    })
  }))
}));

jest.mock('../../src/models/master/userModel', () => ({
  UserModel: jest.fn().mockImplementation(() => ({
    findByUUID: jest.fn().mockResolvedValue({ id: 1 })
  }))
}));

jest.mock('../../src/models/master/roleModel', () => ({
  RoleModel: jest.fn().mockImplementation(() => ({
    getRolesByUserId: jest.fn().mockImplementation(userId => {
      if (userId === 1) {
        return [{ role_name: 'Super Admin' }]; // Ensure this matches the role checked in the middleware
      } else {
        return [{ role_name: 'User' }];
      }
    }),
    getPermissionsByUserId: jest.fn().mockImplementation(userId => {
      if (userId === 1) {
        return [{ role_permissions: [{ permission_id: 1, permission_operations: ['read', 'write'] }] }];
      } else {
        return [{ role_permissions: [{ permission_id: 1, permission_operations: ['read'] }] }];
      }
    })
  }))
}));

jest.mock('../../src/models/master/permissionModel', () => ({
  PermissionModel: jest.fn().mockImplementation(() => ({
    getRoutesByPermissionId: jest.fn().mockImplementation(permissionId => {
      if (permissionId === 1) {
        return [{ route_endpoint: '/test-route' }];
      }
    })
  }))
}));

describe('verifyRolePermissions middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      baseUrl: '/test-route',
      method: 'GET',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return unauthorized if no token is provided', async () => {
    await verifyRolePermissions(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ResponseCodes.UNAUTHORIZED);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return unauthorized if token is invalid', async () => {
    mockReq.headers = { authorization: 'Bearer invalid_token' };

    await verifyRolePermissions(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ResponseCodes.UNAUTHORIZED);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow access for Super Admin role', async () => {
    mockReq.headers = { authorization: 'Bearer valid_token' };

    await verifyRolePermissions(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should allow access for user with correct permissions', async () => {
    mockReq.headers = { authorization: 'Bearer valid_token' };
    mockReq.baseUrl = '/test-route';
    mockReq.method = 'GET';

    await verifyRolePermissions(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should deny access for user without correct permissions', async () => {
    mockReq.headers = { authorization: 'Bearer valid_token' };
    mockReq.baseUrl = '/test-route';
    mockReq.method = 'POST';

    await verifyRolePermissions(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Add more test cases as needed
});