## Contributing

[fork]: https://github.com/actionsdesk/ghec-enterprise-reporting/fork
[pr]: https://github.com/actionsdesk/ghec-enterprise-reporting/compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Found a bug?

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/actionsdesk/ghec-enterprise-reporting/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/actionsdesk/ghec-enterprise-reporting/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or a **reproducable test case** demonstrating the expected behavior that is not occurring.
- If possible, use the relevant bug report templates to create the issue.

## What should I know before submitting a pull request or issue

Thanks for taking the time to submit an issue and/or pull request. Before you hit the submit button please at a look at existing issues to see if there's one that tackles your issue or contribution.

If one does exist don't worry! You can also contribute to the existing issue or pull request by joining the conversation and giving feedback or testing the code or problem.

## Submitting a pull request

1. [Fork][fork] and clone the repository
2. Configure and install the dependencies: `npm install`
3. Make sure the tests pass on your machine: `npm run test`
4. Create a new branch: `git checkout -b my-branch-name`
5. Make your change, add tests, and make sure the tests still pass
6. Make sure your code is correctly formatted: `npm run format`
7. Make sure your code passes linting: `npm run lint`
8. Update `dist/index.js` using `npm run release`. This creates a single javascript file that is used as an entry-point for the action
9. Push to your fork and [submit a pull request][pr]
10. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write tests.
- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)

Thanks! :heart: :heart: :heart:

GitHub Actions Team :octocat:
