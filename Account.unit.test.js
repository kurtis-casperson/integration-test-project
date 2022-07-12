const FileSystem = require('./FileSystem')
const Account = require('./Account')

// mocking is used because actually creating Files with FileSystem would be slow

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('deposit', () => {
  test('money is added to the account', async () => {
    const startingBalance = 5
    const amount = 10
    const account = await createAccount('Kurtis', startingBalance)
    const spy = jest
      // spyOn allows you to spy on a function, observe interactions, and mock them accordingly.
      // we want fake the FileSystem function and return a mock value
      .spyOn(FileSystem, 'write')
      .mockReturnValue(Promise.resolve())
    await account.deposit(amount)
    // check the balance of the account
    // expect() will test the number of times the file system has been updated
    expect(account.balance).toBe(amount + startingBalance)
    expect(spy).toBeCalledWith(account.filePath, amount + startingBalance)

    // check file is correct
    console.log(FileSystem.write('test'))
  })
})

describe('withdraw', () => {
  test('money is withdrawn from the account', async () => {
    const startingBalance = 10
    const withdrawAmount = 5
    const account = await createAccount('Kurtis', startingBalance)
    const spy = jest
      .spyOn(FileSystem, 'write')
      .mockReturnValue(Promise.resolve())
    await account.withdraw(withdrawAmount)

    expect(account.balance).toBe(startingBalance - withdrawAmount)
    expect(spy).toBeCalledWith(
      account.filePath,
      startingBalance - withdrawAmount
    )
  })
})

describe('Not enough money in the account', () => {
  test('should throw an error', async () => {
    const startingBalance = 5
    const withdrawAmount = 10
    const account = await createAccount('Kurtis', startingBalance)
    const spy = jest
      .spyOn(FileSystem, 'write')
      .mockReturnValue(Promise.resolve())
    // the rejection is expected with the withdraw amount being too high and then an error is to be thrown
    await expect(account.withdraw(withdrawAmount)).rejects.toThrow()
    expect(account.balance).toBe(startingBalance)
    expect(spy).not.toBeCalledWith()
  })
})

// create account helper function to mock the reading of the file.  name and balance
// balance from the Account file is a private variable so this function needs to be made to mock testing the balance
// Mocking the read value of the FileSystem b/c balance is set to the filePath that is read
const createAccount = async (name, balance) => {
  const spy = jest
    .spyOn(FileSystem, 'read')
    .mockReturnValueOnce(Promise.resolve(balance))
  const account = await Account.find(name)
  spy.mockRestore()
  return account
}
