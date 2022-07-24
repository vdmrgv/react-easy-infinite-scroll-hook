# Development Process

1. Run `yarn` to install all necessary dependencies.
2. Make your changes.
3. Run the following things in this project directory to create a package link:
```bash
yarn build && yarn link
```
4. To test your changes locally, you can use project in `example` folder or create a new one via `create-react-app`.
5. Go to `example` folder and run `yarn` to install all necessary dependencies.
6. Link this package in other project directory:
```bash
yarn link react-easy-infinite-scroll-hook
```
7. Now you have a linked changes and ready to test it.
8. Run `yarn start` to test your changes.

## Troubleshooting

If you have problems with a linked package, try running `yarn unlink` and repeat the steps from step `3`.
