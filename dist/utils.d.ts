import type { BillingData, Organization } from './types.js';
export declare function getEnterpriseOrgsData(token: string, enterprise: string): Promise<Organization[]>;
export declare function getEnterpriseBillingData(token: string, enterprise: string): Promise<BillingData>;
export declare function generateReport(title: string, enterprise: string, organizationData: Organization[], billingData: BillingData): string;
