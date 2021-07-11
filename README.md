#Diana Barbosa (diana.brito.barbosa@gmail.com) - SVGOM Testing with playwright

## Installation
```
npm install
```

## How to run test cases
```
npm run end2end
```

## Structure
### end2ned\pages
* Page Object - a common pattern that introduces abstractions over web app pages to simplify interactions with them in multiple tests.
* Create a page (helper) class to encapsulate common operations on a web page

### end2ned\Resources
* Some resources (for examples SVGs) to be used during the test cases

### end2ned\tests
* Test scripts (please note that the file name must end with ```.test.ts```)
* For more details about tests creation please check the [Playwright Test Cases Docs](https://playwright.dev/docs/test-intro#first-test)

### package.json
* Project metadata and scripts

### playwright.config.ts
* Playwright configurations
* For more details about playwright configurations please check the [Playwright Configurations Docs](https://playwright.dev/docs/test-configuration)
