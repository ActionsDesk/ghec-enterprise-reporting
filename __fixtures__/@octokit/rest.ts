import { jest } from '@jest/globals'
import { Endpoints } from '@octokit/types'

export const graphql = jest.fn()
export const paginate = jest.fn()
export const rest = {
  issues: {
    create:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues']['response']
        >
      >()
  }
}

// Enterprise Plugin Methods
export const billing = {
  getGithubActionsBillingGhe: jest.fn(),
  getGithubPackagesBillingGhe: jest.fn(),
  getSharedStorageBillingGhe: jest.fn()
}
