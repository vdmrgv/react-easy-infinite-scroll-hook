# Development Process

1. Run `yarn` to install all necessary dependencies.
2. Make your changes.
3. Run the following things in this project directory to create a package link:
```bash
yarn build && yarn link
```
4. To test your changes locally, you should use any separate project with `React`, if you don't have one, I highly recommend creating a new one via `create-react-app`.
5. Link this package in other project directory:
```bash
yarn link react-easy-infinite-scroll-hook
```
6. Now you have a linked changes and ready to test it.

## Troubleshooting

If you have problems with a linked package, try running `yarn unlink` and repeat the steps from step `3`.
