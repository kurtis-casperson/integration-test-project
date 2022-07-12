const Account = require('./Account')
const fs = require('fs')
const { expect } = require('@jest/globals')

// In the integration test the files will not be mocked and will be created
// create an account

beforeEach(() => {
  try {
    fs.mkdirSync('accounts')
  } catch {
    // Ignore error since folder already exists
  }
})

afterEach(() => {
  // recursive will remove the files from the directory
  fs.rmSync('accounts', { recursive: true, force: true })
})

describe('.create', () => {
  test('creates a new account and file', async () => {
    const name = 'Mr. Smith'
    const account = await Account.create(name)
    expect(account.name).toBe(name)
    expect(account.balance).toBe(0)
    // Check the name is correct
    expect(fs.readFileSync(account.filePath).toString()).toBe('0')
  })
})

// Check to ensure the file was created
describe('.find', () => {
  test('return the account name', async () => {
    const name = 'Mr. Smith'
    const balance = 10
    // create the file and pass in the balance
    fs.writeFileSync(`accounts/${name}.txt`, balance.toString())
    const account = await Account.find(name)
    expect(account.name).toBe(name)
    // Check the balance
    expect(account.balance).toBe(balance)
  })
  describe('when there is no existing account', () => {
    test('it returns undefined', async () => {
      const name = 'Mr. Smith'
      const account = await Account.find(name)
      expect(account).toBeUndefined()
    })
  })
})
