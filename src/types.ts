export interface ActionsUsage {
  minutesUsed: number;
  paidMinutesUsed: number;
  includedMinutes: number;
}
export interface Organization {
  name: string;
  login: string;
  organizationBillingEmail: string;
}
export interface PackagesUsage {
  totalGigaBytesBandwidthUsed: number;
  totalPaidGigabytesBandwidthUsed: number;
  includedGigabytesBandwidth: number;
}
interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}
interface RateLimit {
  cost: number;
  remaining: number;
  resetAt: number;
  limit: number;
}
export interface SharedStorageUsage {
  daysLeftInCycle: number;
  estimatedPaidStorageForMonth: number;
  estimatedStorageForMonth: number;
}
interface Usage {
  usage: number;
  quota: number;
  usagePercentage: number;
}
export interface EnterpriseOrganizations {
  organizations: {
    totalCount: number;
    nodes: Organization[];
    pageInfo: PageInfo;
  };
}
/**
 * Enterprise billing data response from GraphQL
 */
export interface EnterpriseBillingData {
  billingInfo: {
    assetPacks: number;
    bandwidthUsage: number;
    bandwidthQuota: number;
    bandwidthUsagePercentage: number;
    storageQuota: number;
    storageUsage: number;
    storageUsagePercentage: number;
    totalLicenses: number;
    allLicensableUsersCount: number;
    totalAvailableLicenses: number;
  };
}

/**
 * Billing data response. This type removes the enterprise namespace.
 */
export interface BillingData {
  assetPacks: number;
  bandwidth: Usage;
  storage: Usage;
  totalLicenses: number;
  allLicensableUsersCount: number;
  totalAvailableLicenses: number;
  actionsUsage: ActionsUsage;
  packagesUsage: PackagesUsage;
  sharedStorageUsage: SharedStorageUsage;
}

/**
 * Generic GraphQl response under the enterprise namespace
 */
export interface EnterpriseRespose<T> {
  enterprise: T;
  rateLimit: RateLimit;
}
