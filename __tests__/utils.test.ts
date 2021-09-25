import nock, {Scope} from 'nock';

import {getEnterpriseOrgsData, getEnterpriseBillingData, generateReport} from '../src/utils';

let nockScope: Scope;
beforeEach(() => {
  nockScope = nock('https://api.github.com');
});
test('getEnterpriseOrgsData', async () => {
  nockScope.post('/graphql').reply(200, {
    data: {
      enterprise: {
        organizations: {
          totalCount: 1,
          nodes: [
            {
              name: 'mock organization',
              login: 'mock-organization',
              organizationBillingEmail: 'mock@organization.com'
            },
            {
              name: 'mock organization 2',
              login: 'mock-organization 2',
              organizationBillingEmail: 'mock2@organization.com'
            }
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: 'end-cursor'
          }
        }
      },
      rateLimit: {
        cost: 1,
        remaining: 9,
        resetAt: 1234324,
        limit: 10
      }
    }
  });
  const orgs = getEnterpriseOrgsData('gh-token', 'enterprise');
  const {value} = await orgs.next();

  expect(value).toEqual({
    name: 'mock organization',
    login: 'mock-organization',
    organizationBillingEmail: 'mock@organization.com'
  });
});
test('getEnterpriseBillingData', async () => {
  nockScope
    .post('/graphql')
    .reply(200, {
      data: {
        enterprise: {
          billingInfo: {
            assetPacks: 3,
            bandwidthUsage: 10,
            bandwidthQuota: 100,
            bandwidthUsagePercentage: 10,
            storageQuota: 200,
            storageUsage: 100,
            storageUsagePercentage: 50,
            totalLicenses: 20000,
            allLicensableUsersCount: 5000,
            totalAvailableLicenses: 15000
          }
        },
        rateLimit: {
          cost: 1,
          remaining: 9,
          resetAt: 1234324,
          limit: 10
        }
      }
    })
    .get('/enterprises/enterprise/settings/billing/actions')
    .reply(200, {
      total_minutes_used: 305,
      total_paid_minutes_used: 0,
      included_minutes: 3000,
      minutes_used_breakdown: {
        UBUNTU: 205,
        MACOS: 10,
        WINDOWS: 90
      }
    })
    .get('/enterprises/enterprise/settings/billing/packages')
    .reply(200, {
      total_gigabytes_bandwidth_used: 50,
      total_paid_gigabytes_bandwidth_used: 40,
      included_gigabytes_bandwidth: 10
    })
    .get('/enterprises/enterprise/settings/billing/shared-storage')
    .reply(200, {
      days_left_in_billing_cycle: 20,
      estimated_paid_storage_for_month: 15,
      estimated_storage_for_month: 40
    });
  const expected = {
    assetPacks: 3,
    bandwidth: {
      usage: 10,
      quota: 100,
      usagePercentage: 10
    },
    storage: {
      usage: 100,
      quota: 200,
      usagePercentage: 50
    },
    totalLicenses: 20000,
    allLicensableUsersCount: 5000,
    totalAvailableLicenses: 15000,
    actionsUsage: {
      minutesUsed: 305,
      paidMinutesUsed: 0,
      includedMinutes: 3000
    },
    packagesUsage: {
      totalGigaBytesBandwidthUsed: 50,
      totalPaidGigabytesBandwidthUsed: 40,
      includedGigabytesBandwidth: 10
    },
    sharedStorageUsage: {
      daysLeftInCycle: 20,
      estimatedPaidStorageForMonth: 15,
      estimatedStorageForMonth: 40
    }
  };
  const billingData = await getEnterpriseBillingData('gh-token', 'enterprise');
  expect(billingData).toEqual(expected);
});
test('generate report', () => {
  const title = 'Test Report';
  const organizationData = [{name: 'Test Organization', login: 'test-org', organizationBillingEmail: 'test@org.com'}];
  const enterprise = 'Test Enterprise';
  const billingData = {
    assetPacks: 3,
    bandwidth: {
      usage: 10,
      quota: 10,
      usagePercentage: 100
    },
    storage: {
      usage: 20,
      quota: 20,
      usagePercentage: 200
    },
    totalLicenses: 20000,
    allLicensableUsersCount: 5000,
    totalAvailableLicenses: 15000,
    actionsUsage: {
      minutesUsed: 100,
      paidMinutesUsed: 0,
      includedMinutes: 300
    },
    packagesUsage: {
      totalGigaBytesBandwidthUsed: 50,
      totalPaidGigabytesBandwidthUsed: 10,
      includedGigabytesBandwidth: 100
    },
    sharedStorageUsage: {
      daysLeftInCycle: 10,
      estimatedPaidStorageForMonth: 10,
      estimatedStorageForMonth: 10
    }
  };
  const expectedEnterpriseOrgs = [
    '| Name | Login | Billing Email |',
    '| ---- | ----- | ------------- |',
    '| Test Organization | test-org | test@org.com |'
  ].join('\n');
  const expectedBandwidth = [
    '| Usage | Quota | Usage Percentage |',
    '| ----- | ----- | ---------------- |',
    '| 10 | 10 | 100 |'
  ].join('\n');
  const expectedStorage = [
    '| Usage | Quota | Usage Percentage |',
    '| ----- | ----- | ---------------- |',
    '| 20 | 20 | 200 |'
  ].join('\n');

  const report = generateReport(title, enterprise, organizationData, billingData);
  expect(report).toMatch(expectedEnterpriseOrgs);
  expect(report).toMatch(expectedBandwidth);
  expect(report).toMatch(expectedStorage);
});
