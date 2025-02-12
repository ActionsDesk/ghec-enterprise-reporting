import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'
import * as github from '../__fixtures__/@actions/github.js'
import * as octokit from '../__fixtures__/@octokit/rest.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }

    static plugin() {
      return Octokit
    }
  }

  return {
    Octokit
  }
})

const utils = await import('../src/utils.js')

const { getOctokit } = await import('@actions/github')
const mocktokit = jest.mocked(getOctokit('MY_TOKEN'))

describe('utils', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEnterpriseOrgsData', () => {
    beforeEach(() => {
      mocktokit.graphql
        .mockResolvedValueOnce({
          enterprise: {
            organizations: {
              totalCount: 2,
              nodes: [
                {
                  name: 'org1',
                  login: 'org1',
                  organizationBillingEmail: 'email'
                }
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor'
              }
            }
          }
        })
        .mockResolvedValueOnce({
          enterprise: {
            organizations: {
              totalCount: 2,
              nodes: [
                {
                  name: 'org2',
                  login: 'org2',
                  organizationBillingEmail: 'email'
                }
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: undefined
              }
            }
          }
        })
    })

    it('Gets the organizations data', async () => {
      const organizations = await utils.getEnterpriseOrgsData(
        'MY_EXAMPLE_TOKEN',
        'my-example-enterprise'
      )

      expect(mocktokit.graphql).toHaveBeenCalledTimes(2)
      expect(mocktokit.graphql).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          enterprise: 'my-example-enterprise',
          cursor: undefined
        })
      )
      expect(mocktokit.graphql).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          enterprise: 'my-example-enterprise',
          cursor: 'cursor'
        })
      )
      expect(organizations).toEqual([
        {
          name: 'org1',
          login: 'org1',
          organizationBillingEmail: 'email'
        },
        {
          name: 'org2',
          login: 'org2',
          organizationBillingEmail: 'email'
        }
      ])
    })
  })

  describe('getEnterpriseBillingData', () => {
    beforeEach(() => {
      mocktokit.graphql.mockResolvedValueOnce({
        enterprise: {
          billingInfo: {
            assetPacks: 1,
            bandwidthUsage: 1,
            bandwidthQuota: 1,
            bandwidthUsagePercentage: 100,
            storageQuota: 1,
            storageUsage: 1,
            storageUsagePercentage: 100,
            totalLicenses: 1,
            allLicensableUsersCount: 1,
            totalAvailableLicenses: 1
          }
        }
      })

      // This is a workaround because of the plugin
      ;(
        mocktokit as any
      ).billing.getGithubActionsBillingGhe.mockResolvedValueOnce({
        data: {
          total_minutes_used: 1,
          total_paid_minutes_used: 1,
          included_minutes: 1
        }
      })

      // This is a workaround because of the plugin
      ;(
        mocktokit as any
      ).billing.getGithubPackagesBillingGhe.mockResolvedValueOnce({
        data: {
          total_gigabytes_bandwidth_used: 1,
          total_paid_gigabytes_bandwidth_used: 1,
          included_gigabytes_bandwidth: 1
        }
      })

      // This is a workaround because of the plugin
      ;(
        mocktokit as any
      ).billing.getSharedStorageBillingGhe.mockResolvedValueOnce({
        data: {
          days_left_in_billing_cycle: 1,
          estimated_paid_storage_for_month: 1,
          estimated_storage_for_month: 1
        }
      })
    })

    it('Gets the billing data', async () => {
      const billingData = await utils.getEnterpriseBillingData(
        'MY_EXAMPLE_TOKEN',
        'my-example-enterprise'
      )

      expect(mocktokit.graphql).toHaveBeenCalledTimes(1)
      expect(mocktokit.graphql).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          enterprise: 'my-example-enterprise'
        })
      )
      expect(
        (mocktokit as any).billing.getGithubActionsBillingGhe
      ).toHaveBeenCalledTimes(1)
      expect(
        (mocktokit as any).billing.getGithubPackagesBillingGhe
      ).toHaveBeenCalledTimes(1)
      expect(
        (mocktokit as any).billing.getSharedStorageBillingGhe
      ).toHaveBeenCalledTimes(1)

      expect(billingData).toMatchObject({
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
        totalAvailableLicenses: 1,
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
      })
    })
  })

  describe('generateReport', () => {
    it('Generates the report', () => {
      const report = utils.generateReport(
        'My Report Title',
        'my-example-enterprise',
        [
          {
            name: 'org1',
            login: 'org1',
            organizationBillingEmail: 'email'
          }
        ],
        {
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
          totalAvailableLicenses: 1,
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
      )

      expect(report).toEqual(expect.stringContaining('My Report Title'))
    })
  })
})
