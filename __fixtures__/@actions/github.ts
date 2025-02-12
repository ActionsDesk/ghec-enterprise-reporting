import * as octokit from '../@octokit/rest.js'

export const getOctokit = () => octokit

export const context = {
  repo: {
    owner: 'ActionsDesk',
    repo: 'ghec-enterprise-reporting'
  },
  payload: {
    action: 'workflow_dispatch',
    organization: {
      login: 'ActionsDesk'
    },
    repository: {
      full_name: 'ActionsDesk/ghec-enterprise-reporting',
      name: 'ghec-enterprise-reporting',
      owner: {
        login: 'ActionsDesk'
      },
      url: 'https://api.github.com/repos/ActionsDesk/ghec-enterprise-reporting'
    }
  },
  eventName: 'workflow_dispatch'
}
