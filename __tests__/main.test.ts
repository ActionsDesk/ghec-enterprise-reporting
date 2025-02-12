import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'
import * as github from '../__fixtures__/@actions/github.js'
import * as octokit from '../__fixtures__/@octokit/rest.js'
import type {
  generateReport,
  getEnterpriseBillingData,
  getEnterpriseOrgsData
} from '../src/utils.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }
  }

  return {
    Octokit
  }
})

const generateReportMock = jest.fn<typeof generateReport>()
const getEnterpriseBillingDataMock = jest.fn<typeof getEnterpriseBillingData>()
const getEnterpriseOrgsDataMock = jest.fn<typeof getEnterpriseOrgsData>()

jest.unstable_mockModule('../src/utils.js', async () => ({
  generateReport: generateReportMock,
  getEnterpriseBillingData: getEnterpriseBillingDataMock,
  getEnterpriseOrgsData: getEnterpriseOrgsDataMock
}))

const main = await import('../src/main.js')

const { getOctokit } = await import('@actions/github')
const mocktokit = jest.mocked(getOctokit('MY_TOKEN'))

const exampleBillingData = {
  assetPacks: 1,
  bandwidth: {
    usage: 1,
    quota: 1,
    usagePercentage: 100
  },
  storage: {
    usage: 1,
    quota: 1,
    usagePercentage: 100
  },
  totalLicenses: 1,
  allLicensableUsersCount: 1,
  totalAvailableLicenses: 0,
  actionsUsage: {
    minutesUsed: 1,
    paidMinutesUsed: 1,
    includedMinutes: 1
  },
  packagesUsage: {
    totalGigaBytesBandwidthUsed: 1,
    totalPaidGigabytesBandwidthUsed: 1,
    includedGigabytesBandwidth: 1
  },
  sharedStorageUsage: {
    daysLeftInCycle: 1,
    estimatedPaidStorageForMonth: 1,
    estimatedStorageForMonth: 1
  }
}

describe('main', () => {
  beforeEach(() => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('my-example-enterprise') // enterprise_slug
      .mockReturnValueOnce('MY_EXAMPLE_TOKEN') // enterprise_token
      .mockReturnValueOnce('MY_EXAMPLE_TOKEN') // github_token
      .mockReturnValueOnce('My Issue Title') // issue_title

    getEnterpriseOrgsDataMock.mockResolvedValue([
      {
        name: 'my-org',
        login: 'my-org',
        organizationBillingEmail: 'example@example.com'
      }
    ])

    getEnterpriseBillingDataMock.mockResolvedValue(exampleBillingData)

    generateReportMock.mockReturnValue('My Report')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Generates the enterprise report', async () => {
    await main.run()

    expect(core.getInput).toHaveBeenCalledTimes(4)
    expect(getEnterpriseOrgsDataMock).toHaveBeenCalledWith(
      'MY_EXAMPLE_TOKEN',
      'my-example-enterprise'
    )
    expect(getEnterpriseBillingDataMock).toHaveBeenCalledWith(
      'MY_EXAMPLE_TOKEN',
      'my-example-enterprise'
    )
    expect(generateReportMock).toHaveBeenCalledWith(
      expect.any(String),
      'my-example-enterprise',
      [
        {
          name: 'my-org',
          login: 'my-org',
          organizationBillingEmail: 'example@example.com'
        }
      ],
      exampleBillingData
    )
    expect(mocktokit.rest.issues.create).toHaveBeenCalledWith({
      owner: expect.any(String),
      repo: expect.any(String),
      title: expect.any(String),
      body: 'My Report'
    })
  })
})
