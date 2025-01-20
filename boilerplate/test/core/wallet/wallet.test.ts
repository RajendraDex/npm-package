import { Knex } from 'knex';
import Wallet from '../../../src/core/wallet/wallet';
import DatabaseUtils from '../../../src/models/generelisedModel';
import {  WalletMessages } from '../../../src/enums/responseMessages'
import { TransactionType } from '../../../src/interfaces/wallet';
import { WalletErrors } from '../../../src/enums/errorMessages';
import { WalletDetails } from '../../../src/interfaces/wallet';

// Mock the DatabaseUtils
jest.mock('../../../src/models/generelisedModel');

describe('Wallet', () => {
  let wallet: Wallet;
  let mockDb: Knex;
  let mockDbUtils: jest.Mocked<DatabaseUtils>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockDbUtils = new DatabaseUtils(mockDb) as jest.Mocked<DatabaseUtils>;
    wallet = new Wallet(mockDb);
    (wallet as any).dbUtils = mockDbUtils; // Inject mock DatabaseUtils
  });

  describe('createWallet', () => {
    const customerId = 1;

    it('should create a new wallet successfully', async () => {
      mockDbUtils.select.mockResolvedValue([]);
      mockDbUtils.insert.mockResolvedValue([1]); // Assuming the insert method returns the ID of the created wallet

      const result = await wallet.createWallet(customerId);

      expect(result).toBe(1);
      expect(mockDbUtils.insert).toHaveBeenCalledWith('tenant_customer_wallet', {
        customer_id: customerId,
        status: 1
      }, ['id']);
    });

    it('should return existing wallet ID if wallet already exists', async () => {
      mockDbUtils.select.mockResolvedValue([{ id: 1 }]);

      const result = await wallet.createWallet(customerId);

      expect(result).toBe(1);
    });

    it('should throw an error if customer ID is invalid', async () => {
      await expect(wallet.createWallet(0)).rejects.toThrow(WalletErrors.InvalidCustomerId);
    });
  });

  describe('transaction', () => {
    const transactionParams = {
      customerId: 1,
      amount: 100,
      type: TransactionType.CR
    };

    it('should perform a credit transaction successfully', async () => {
      mockDbUtils.select.mockResolvedValue([{ id: 1, current_balance: 50 }]);
      mockDbUtils.update.mockResolvedValue(1);

      await wallet.transaction(transactionParams);

      expect(mockDbUtils.update).toHaveBeenCalledWith('tenant_customer_wallet', 'id', 1, {
        current_balance: 150,
        updated_at: mockDb.fn.now()
      });
    });

    it('should throw an error if wallet not found', async () => {
      mockDbUtils.select.mockResolvedValue([]);

      await expect(wallet.transaction(transactionParams)).rejects.toThrow(WalletMessages.WalletNotFoundForCustomer);
    });
  });

  describe('walletDetails', () => {
    const walletDetailsParams = {
      customerId: 1,
      type: [WalletDetails.Balance]
    };

    it('should fetch wallet details successfully', async () => {
      mockDbUtils.select.mockResolvedValue([{ current_balance: 100 }]);

      const result = await wallet.walletDetails(walletDetailsParams);

      expect(result).toEqual({ current_balance: 100 });
    });

    it('should return null if wallet not found', async () => {
      mockDbUtils.select.mockResolvedValue([]);

      const result = await wallet.walletDetails(walletDetailsParams);

      expect(result).toBeNull();
    });
  });
});
