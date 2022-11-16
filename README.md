# GHEC billing and usage reporting

This action extracts billing and usage numbers from an enterprise and creates a report as a GitHub issue in the repository where it is running.

## Inputs and environment variables

### Inputs

- **enterprise**: the [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) of the enterprise you wish to query.
- **title**: the title of the report issue. This title will be used as the issue title and as the top heading of the issue body with the date of the run appended to it. By [default](https://github.com/ActionsDesk/ghec-enterprise-reporting/blob/main/action.yml) the title will have the value `GHEC Usage Report`.

### Environment variables

Environment variables are meant to be used in your workflow file. Take a look at our [docs for the proper workflow file syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions).

When dealing with token please take extra care and use the secure store available in every GitHub repo. Once the value has been added to the secure store you can access it in your workflow file by using `${{secrets.SECURE_VALUE}}` syntax. Here's a [sample workflow](#using-this-action) file as an example.

#### ENTERPRISE_TOKEN

A token that has access to the enterprise level data for the enterprise you wish to query. To create a token go to the settings on the account that should manage it.

It's important that this token have the following OAuth scopes:

- admin:enterprise
- admin:org

This token needs to be added to the secrets store of the repository that is using it. Take a look at our docs for more on [using secrets with GitHub Actions](https://docs.github.com/en/actions/getting-started-with-github-actions/security-hardening-for-github-actions#using-secrets).
Take a look at our docs for more information about [personal access tokens](https://docs.github.com/en/developers/apps/about-apps#personal-access-tokens) and [OAuth scopes](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps).

#### GITHUB_TOKEN

This is the GitHub token that is available in the Action's context. This token will be used to create an issue with the generated report. You don't have to do anything more to use this.

## Using this action

A great way to using this action is with a scheduler. Here's an example workflow file that will run our action on the 28th day of the month, every month:

```yaml
on:
  schedule:
    - cron: '0 0 28 * *'

jobs:
  report:
    runs-on: ubuntu-latest

    steps:
      - uses: actionsdesk/ghec-enterprise-reporting@v2
        with:
          enterprise: 'awesome-enterprise'
          title: 'Much enterprise reporting'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ENTERPRISE_TOKEN: ${{secrets.ENTERPRISE_TOKEN}}
```

## Contributing

All contributions are welcome, from issues to pull requests. Please take a look at our [CONTRIBUTION.md](CONTRIBUTION.md) file for details!
