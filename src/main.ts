import * as core from '@actions/core';
import * as github from '@actions/github';
import moment from 'moment';
import {generateReport, getEnterpriseBillingData, getEnterpriseOrgsData} from './utils';
import {Organization} from './types';

async function run(): Promise<void> {
  if (process.env.CI) {
    core.setOutput('CI', true);
    return;
  }

  try {
    if (!process.env.ENTERPRISE_TOKEN) {
      throw new Error('Environment variable ENTERPRISE_TOKEN is required. Please take a look at your workflow file.');
    }
    if (!process.env.GITHUB_TOKEN) {
      throw new Error(
        'Environment variable GITHUB_TOKEN with enterprise access is required. Please take a look at your workflow file.'
      );
    }

    const enterpriseToken: string = process.env.ENTERPRISE_TOKEN || '';
    const repoToken: string = process.env.GITHUB_TOKEN || '';
    const enterprise: string = core.getInput('enterprise');
    const enterpriseOrgs: Organization[] = [];
    const reportDate = moment().format('MMMM DD, YYYY');
    let title: string = core.getInput('title');

    title = `${title} - ${reportDate}`;

    for await (const org of getEnterpriseOrgsData(enterpriseToken, enterprise)) {
      enterpriseOrgs.push(org);
    }
    const enterpriseBillingData = await getEnterpriseBillingData(enterpriseToken, enterprise);

    const octokit = github.getOctokit(repoToken);
    const body = generateReport(title, enterprise, enterpriseOrgs, enterpriseBillingData);

    await octokit.issues.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title,
      body
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
