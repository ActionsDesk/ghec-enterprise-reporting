# GitHub Enterprise Cloud Billing and Usage Reporting

This action extracts billing and usage numbers from a GitHub enterprise and
creates a report as an issue in the repository where it is running.

## Inputs

- **`enterprise_slug`**: The
  [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) of the enterprise you
  wish to query
- **`enterprise_token`**: The token that has access to the enterprise you wish
  to query

  This should be created as a
  [GitHub Actions secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)
  in the repository that is using this action. This token should have the
  following scopes:

  - `admin:enterprise`
  - `admin:org`

- **`github_token`**: The token that will be used to create the issue (defaults
  to the
  [automatic token](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication)
  provided by GitHub)
- **`issue_title`**: The title of the report issue (default:
  `GHEC Usage Report`)

  This title will be used as the issue title, as well as the top heading of the
  issue body with the date of the run appended to it.

## Usage

A great way to using this action is with a scheduler. Here's an example workflow
file that will run our action on the 28th day of the month, every month:

```yaml
on:
  schedule:
    - cron: '0 0 28 * *'

jobs:
  report:
    name: Report on GitHub Enterprise Cloud Usage
    runs-on: ubuntu-latest

    steps:
      - name: Generate Report
        id: report
        uses: ActionsDesk/ghec-enterprise-reporting@vX.Y.Z # Replace with the latest version
        with:
          enterprise_slug: awesome-enterprise
          enterprise_token: ${{ secrets.ENTERPRISE_TOKEN }}
          issue_title: My Enterprise Report
```

## Example Output

The following markdown will be generated in the issue body:

```markdown
This usage report is for the **ENTERPRISE_SLUG** GHEC account.

## AssetPacks

Total Purchased: 6

## Enterprise Organizations

| Name     | Login     | Billing Email |
| -------- | --------- | ------------- |
| ORG_NAME | ORG_LOGIN | BILLING_EMAIL |

## Bandwidth

| Usage | Quota | Usage Percentage |
| ----- | ----- | ---------------- |
| 0     | 0     | 0                |

## Storage

| Usage | Quota | Usage Percentage |
| ----- | ----- | ---------------- |
| 0     | 0     | 0                |

## Licenses

| Total Licenses | All Licensable Users Count | Total Available Licenses |
| -------------- | -------------------------- | ------------------------ |
| 0              | 0                          | 0                        |

## Actions Usage

| Minutes Used | Paid Minutes Used | Included Minutes |
| ------------ | ----------------- | ---------------- |
| 0            | 0                 | 0                |

## Packages Usage

| Total GB Bandwidth Used | Total Paid GB Bandwidth Used | Included GB Bandwidth |
| ----------------------- | ---------------------------- | --------------------- |
| 0                       | 0                            | 0                     |

## Shared Storage Usage

| Days Left In Cycle | Estimated Paid Storage For Month | Estimated Storage For Month |
| ------------------ | -------------------------------- | --------------------------- |
| 0                  | 0                                | 0                           |
```

## Contributing

All contributions are welcome, from issues to pull requests. Please take a look
at our [CONTRIBUTION.md](CONTRIBUTION.md) file for details!
