import * as core from '@actions/core'
import * as github from '@actions/github'
import moment from 'moment'
import {
  generateReport,
  getEnterpriseBillingData,
  getEnterpriseOrgsData
} from './utils.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const enterpriseSlug = core.getInput('enterprise_slug', { required: true })
  const enterpriseToken = core.getInput('enterprise_token', { required: true })
  const githubToken = core.getInput('github_token', { required: true })
  const issueTitle = core.getInput('issue_title', { required: true })

  const reportDate = moment().format('MMMM DD, YYYY')

  const title = `${issueTitle} - ${reportDate}`

  const enterpriseOrgs = await getEnterpriseOrgsData(
    enterpriseToken,
    enterpriseSlug
  )
  core.info(`Enterprise Organizatons: ${enterpriseOrgs.length}`)

  const enterpriseBillingData = await getEnterpriseBillingData(
    enterpriseToken,
    enterpriseSlug
  )
  core.info('Enterprise Billing Data:')
  core.info(JSON.stringify(enterpriseBillingData, null, 2))

  const body = generateReport(
    title,
    enterpriseSlug,
    enterpriseOrgs,
    enterpriseBillingData
  )

  const octokit = github.getOctokit(githubToken)
  await octokit.rest.issues.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    title,
    body
  })
}
