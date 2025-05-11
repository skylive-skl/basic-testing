// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const account1 = getBankAccount(initialBalance);
    const account2 = getBankAccount(initialBalance);

    expect(() => account1.transfer(200, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initial = 100;
    const deposit = 50;
    const account = getBankAccount(initial);
    account.deposit(deposit);
    expect(account.getBalance()).toBe(initial + deposit);
  });

  test('should withdraw money', () => {
    const initial = 100;
    const withdraw = 50;
    const account = getBankAccount(initial);
    account.withdraw(withdraw);
    expect(account.getBalance()).toBe(initial - withdraw);
  });

  test('should transfer money', () => {
    const initial = 100;
    const transfer = 50;
    const account1 = getBankAccount(initial);
    const account2 = getBankAccount(initial);
    account1.transfer(transfer, account2);
    expect(account1.getBalance()).toBe(initial - transfer);
    expect(account2.getBalance()).toBe(initial + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);
    const newBalance = 200;
    const mockFetchBalance = jest.fn().mockResolvedValue(newBalance);
    account.fetchBalance = mockFetchBalance;

    const balance = await account.fetchBalance();
    expect(balance).toBe(newBalance);
    expect(mockFetchBalance).toHaveBeenCalled();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);
    const newBalance = 200;
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(newBalance);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
