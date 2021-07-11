﻿import {expect, test} from '@playwright/test';
import { SVGOMGPage, MenuOptionsElements } from '../pages/SVGOMGPage';

test.describe('Verify the About menu option', () => {
    /* Test Case: 
    * Ensure that “About” option in the main menu is working properly.
    * 
    * Assumptions: 
    * 1. About option should redirect to the page "https://github.com/jakearchibald/svgomg/blob/master/README.md"
     */
    
    test.beforeEach(async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        await svgomgPage.goto();
        
    });

    test('Check that when click on "About" menu option, redirects to the correct about page', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        
        await svgomgPage.clickOnMenuOption(MenuOptionsElements.about);
        
        expect(await page.url()).toBe('https://github.com/jakearchibald/svgomg/blob/master/README.md');
    });
});