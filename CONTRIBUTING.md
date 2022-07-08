# Contributing to [react-easy-infinite-scroll-hook](https://github.com/vdmrgv/react-easy-infinite-scroll-hook)

## Development Process
All work on this repository happens directly on GitHub. Contributors send pull requests which go through a review process.

> **Working on your first pull request?** You can learn how from this *free* series: [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).
1. Fork the repo and create your branch from `main` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
2. Run `yarn` to install all required dependencies.
3. Now you are ready to make your changes!

## Tests & Verifications
Currently we use `eslint` with `prettier` for linting and formatting the code, and `jest` for unit testing. They all run just before committing changes to `git`, but you must use them locally when making changes.

* `yarn test`: Run all tests and validations.
<!-- * `yarn validate:eslint`: Run `eslint`. -->
<!-- * `yarn validate:eslint --fix`: Run `eslint` and automatically fix issues. This is useful for correcting code formatting. -->

## Sending a pull request
When you're sending a pull request:

* Prefer small pull requests focused on one change.
* Verify that all tests and validations are passing.
* Follow the pull request template when opening a pull request.

## Commit message convention
We prefix our commit messages with one of the following to signify the kind of change:

* **build**: Changes that affect the build system or external dependencies.
* **ci**, **chore**: Changes to our CI configuration files and scripts.
* **docs**: Documentation only changes.
* **feat**: A new feature.
* **fix**: A bug fix.
* **perf**: A code change that improves performance.
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **style**: Changes that do not affect the meaning of the code.
* **test**: Adding missing tests or correcting existing tests.

## Reporting issues
You can report issues on our [bug tracker](https://github.com/vdmrgv/react-easy-infinite-scroll-hook/issues). Please search for existing issues and follow the issue template when opening an issue.

## License
By contributing to [react-easy-infinite-scroll-hook](https://github.com/vdmrgv/react-easy-infinite-scroll-hook), you agree that your contributions will be licensed under the **MIT** license.
