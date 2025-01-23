import { Knex } from 'knex';
import Wallet from '../../../src/core/wallet/wallet';
import DatabaseUtils from '../../../src/models/generelisedModel';
import { TransactionType } from '../../../src/interfaces/wallet';
import { WalletErrors} from '../../../src/enums/errorMessages';
import { WalletMessages } from '../../../src/enums/responseMessages';

// Mock the DatabaseUtils
jest.mock('../../../src/models/generelisedModel');

describe('Wallet Transactions', () => {
  let wallet: Wallet;
  let mockDb: Knex;
  let mockDbUtils: jest.Mocked<DatabaseUtils>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockDbUtils = new DatabaseUtils(mockDb) as jest.Mocked<DatabaseUtils>;
    wallet = new Wallet(mockDb);
    (wallet as any).dbUtils = mockDbUtils; // Inject mock DatabaseUtils
  });

  describe('transaction', () => {
    const transactionParamsCredit = {
      customerId: 1,
      amount: 100,
      type: TransactionType.CR
    };

    const transactionParamsDebit = {
      customerId: 1,
      amount: 50,
      type: TransactionType.DT
    };

    it('should perform a credit transaction successfully', async () => {
      mockDbUtils.select.mockResolvedValue([{ id: 1, current_balance: 50 }]);
      mockDbUtils.update.mockResolvedValue(1);

      await wallet.transaction(transactionParamsCredit);

      expect(mockDbUtils.update).toHaveBeenCalledWith('tenant_customer_wallet', 'id', 1, {
        current_balance: 150,
        updated_at: mockDb.fn.now()
      });
    });

    it('should perform a debit transaction successfully', async () => {
      mockDbUtils.select.mockResolvedValue([{ id: 1, current_balance: 100 }]);
      mockDbUtils.update.mockResolvedValue(1);

      await wallet.transaction(transactionParamsDebit);

      expect(mockDbUtils.update).toHaveBeenCalledWith('tenant_customer_wallet', 'id', 1, {
        current_balance: 50,
        updated_at: mockDb.fn.now()
      });
    });

    it('should throw an error if wallet not found', async () => {
      mockDbUtils.select.mockResolvedValue([]);

      await expect(wallet.transaction(transactionParamsCredit)).rejects.toThrow(WalletMessages.WalletNotFoundForCustomer);
    });

    it('should throw an error if insufficient funds for debit', async () => {
      mockDbUtils.select.mockResolvedValue([{ id: 1, current_balance: 30 }]);

      await expect(wallet.transaction(transactionParamsDebit)).rejects.toThrow(WalletErrors.InsufficientFunds);
    });
  });
});
