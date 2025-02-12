export type ActionsUsage = {
  minutesUsed: number
  paidMinutesUsed: number
  includedMinutes: number
}

export type BillingData = {
  assetPacks: number
  bandwidth: Usage
  storage: Usage
  totalLicenses: number
  allLicensableUsersCount: number
  totalAvailableLicenses: number
  actionsUsage: ActionsUsage
  packagesUsage: PackagesUsage
  sharedStorageUsage: SharedStorageUsage
}

export type EnterpriseBillingData = {
  billingInfo: {
    assetPacks: number
    bandwidthUsage: number
    bandwidthQuota: number
    bandwidthUsagePercentage: number
    storageQuota: number
    storageUsage: number
    storageUsagePercentage: number
    totalLicenses: number
    allLicensableUsersCount: number
    totalAvailableLicenses: number
  }
}

export type EnterpriseOrganizations = {
  organizations: {
    totalCount: number
    nodes: Organization[]
    pageInfo: PageInfo
  }
}

export type EnterpriseRespose<T> = {
  enterprise: T
}

export type Organization = {
  name: string
  login: string
  organizationBillingEmail: string
}

export type PackagesUsage = {
  totalGigaBytesBandwidthUsed: number
  totalPaidGigabytesBandwidthUsed: number
  includedGigabytesBandwidth: number
}

export type PageInfo = {
  hasNextPage: boolean
  endCursor: string
}

export type RateLimit = {
  cost: number
  remaining: number
  resetAt: number
  limit: number
}

export type SharedStorageUsage = {
  daysLeftInCycle: number
  estimatedPaidStorageForMonth: number
  estimatedStorageForMonth: number
}

export type Usage = {
  usage: number
  quota: number
  usagePercentage: number
}
