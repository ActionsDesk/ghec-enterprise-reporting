import { getOctokitOptions } from '@actions/github/lib/utils.js'
import { enterpriseCloud } from '@octokit/plugin-enterprise-cloud'
import { Octokit } from '@octokit/rest'
import { Eta } from 'eta'
import * as path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import type {
  ActionsUsage,
  BillingData,
  EnterpriseBillingData,
  EnterpriseOrganizations,
  EnterpriseRespose,
  Organization,
  PackagesUsage,
  SharedStorageUsage
} from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function getEnterpriseOrgsData(
  token: string,
  enterprise: string
): Promise<Organization[]> {
  const OctokitWithPlugins = Octokit.plugin(enterpriseCloud as any)
  const octokit = new OctokitWithPlugins(getOctokitOptions(token))

  let organizations: Organization[] = []

  const organizationQuery = `
    query($enterprise: String!, $cursor: String) {
      enterprise(slug: $enterprise) {
        organizations(first:10, after: $cursor) {
          totalCount
          nodes {
            name
            login
            organizationBillingEmail
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `

  let response: EnterpriseRespose<EnterpriseOrganizations> =
    await octokit.graphql(organizationQuery, {
      enterprise,
      cursor: undefined
    })

  organizations = organizations.concat(response.enterprise.organizations.nodes)

  while (response.enterprise.organizations.pageInfo.hasNextPage) {
    response = await octokit.graphql(organizationQuery, {
      enterprise,
      cursor: response.enterprise.organizations.pageInfo.endCursor
    })

    organizations = organizations.concat(
      response.enterprise.organizations.nodes
    )
  }

  return organizations
}

export async function getEnterpriseBillingData(
  token: string,
  enterprise: string
): Promise<BillingData> {
  const OctokitWithPlugins = Octokit.plugin(enterpriseCloud as any)
  const octokit = new OctokitWithPlugins(getOctokitOptions(token))

  const billingInfoQuery = `
    query($enterprise: String!) {
      enterprise(slug: $enterprise) {
        billingInfo {
          assetPacks
          bandwidthUsage
          bandwidthQuota
          bandwidthUsagePercentage
          storageQuota
          storageUsage
          storageUsagePercentage
          totalLicenses
          allLicensableUsersCount
          totalAvailableLicenses
        }
      }
    }
  `

  const enterpriseBillingData: EnterpriseRespose<EnterpriseBillingData> =
    await octokit.graphql(billingInfoQuery, {
      enterprise
    })

  const { data: actionsBilling } =
    await octokit.billing.getGithubActionsBillingGhe({ enterprise })

  const actionsUsage: ActionsUsage = {
    minutesUsed: actionsBilling.total_minutes_used,
    paidMinutesUsed: actionsBilling.total_paid_minutes_used,
    includedMinutes: actionsBilling.included_minutes
  }

  const { data: packagesBilling } =
    await octokit.billing.getGithubPackagesBillingGhe({ enterprise })

  const packagesUsage: PackagesUsage = {
    totalGigaBytesBandwidthUsed: packagesBilling.total_gigabytes_bandwidth_used,
    totalPaidGigabytesBandwidthUsed:
      packagesBilling.total_paid_gigabytes_bandwidth_used,
    includedGigabytesBandwidth: packagesBilling.included_gigabytes_bandwidth
  }

  const { data: storageBilling } =
    await octokit.billing.getSharedStorageBillingGhe({ enterprise })

  const sharedStorageUsage: SharedStorageUsage = {
    daysLeftInCycle: storageBilling.days_left_in_billing_cycle,
    estimatedPaidStorageForMonth:
      storageBilling.estimated_paid_storage_for_month,
    estimatedStorageForMonth: storageBilling.estimated_storage_for_month
  }

  return {
    assetPacks: enterpriseBillingData.enterprise.billingInfo.assetPacks,
    bandwidth: {
      usage: enterpriseBillingData.enterprise.billingInfo.bandwidthUsage,
      quota: enterpriseBillingData.enterprise.billingInfo.bandwidthQuota,
      usagePercentage:
        enterpriseBillingData.enterprise.billingInfo.bandwidthUsagePercentage
    },
    storage: {
      usage: enterpriseBillingData.enterprise.billingInfo.storageUsage,
      quota: enterpriseBillingData.enterprise.billingInfo.storageQuota,
      usagePercentage:
        enterpriseBillingData.enterprise.billingInfo.storageUsagePercentage
    },
    totalLicenses: enterpriseBillingData.enterprise.billingInfo.totalLicenses,
    allLicensableUsersCount:
      enterpriseBillingData.enterprise.billingInfo.allLicensableUsersCount,
    totalAvailableLicenses:
      enterpriseBillingData.enterprise.billingInfo.totalAvailableLicenses,
    actionsUsage,
    packagesUsage,
    sharedStorageUsage
  }
}

export function generateReport(
  title: string,
  enterprise: string,
  organizationData: Organization[],
  billingData: BillingData
): string {
  const eta = new Eta({ views: path.join(__dirname, '/templates') })

  const data = {
    title,
    enterprise,
    organizations: organizationData,
    ...billingData
  }

  eta.render('ghec-enterprise-template.tmpl', data)

  return eta.render('ghec-enterprise-template.tmpl', data)
}
