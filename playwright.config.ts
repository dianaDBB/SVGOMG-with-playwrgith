import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: 'end2end/tests',
    
    use: {
        headless: true,
    },

    projects: [
        {
            name: 'Chrome',
            use: {
                browserName: 'chromium',
                headless: false,
                acceptDownloads: true
            },
        }
    ],
};
export default config;