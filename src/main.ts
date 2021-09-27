import {context, getOctokit} from '@actions/github';
import {generateReport, getEnterpriseBillingData, getEnterpriseOrgsData} from './utils';
import {getInput, setFailed, setOutput} from '@actions/core';
import {Organization} from './types';
import moment from 'moment';

// execute
(async () => {
  try {
    if (!process.env.ENTERPRISE_TOKEN) {
      throw new Error('Environment variable ENTERPRISE_TOKEN is required. Please take a look at your workflow file.');
    }
    if (!process.env.GITHUB_TOKEN) {
      throw new Error(
        'Environment variable GITHUB_TOKEN with enterprise access is required. Please take a look at your workflow file.'
      );
    }

    if (process.env.BUILD_TEST) {
      setOutput('BUILD_TEST', true);
      return;
    }

    const enterpriseToken: string = process.env.ENTERPRISE_TOKEN || '';
    const repoToken: string = process.env.GITHUB_TOKEN || '';
    const enterprise: string = getInput('enterprise');
    const enterpriseOrgs: Organization[] = [];
    const reportDate = moment().format('MMMM DD, YYYY');
    let title: string = getInput('title');

    title = `${title} - ${reportDate}`;

    for await (const org of getEnterpriseOrgsData(enterpriseToken, enterprise)) {
      enterpriseOrgs.push(org);
    }
    const enterpriseBillingData = await getEnterpriseBillingData(enterpriseToken, enterprise);

    const octokit = getOctokit(repoToken);
    const body = generateReport(title, enterprise, enterpriseOrgs, enterpriseBillingData);

    await octokit.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title,
      body
    });
  } catch (error) {
    setFailed((error as Error).message);
  }
})();
