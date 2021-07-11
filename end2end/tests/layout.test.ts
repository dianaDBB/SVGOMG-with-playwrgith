﻿import { test } from '@playwright/test';
import { SVGOMGPage } from '../pages/SVGOMGPage';

test.describe('Verify the application layout', () => {
    /* Test Case: 
    * Open the application URL (https://jakearchibald.github.io/svgomg) and verify the layout by checking if the main menu, section and toolbar are available in the application. 
    * 
    * Assumptions: 
    * 1. Main Menu is the element represented by the CSS class "menu" and it should be visible (it does not have the class "hidden")
    * 2. Section is the element represented by the CSS class "settings" and it should be hidden (it does not have the class "active")
    * 3. Toolbar is the element represented by the CSS class "toolbar" and it should be hidden (it does not have the class "active")
    * 4. Action Buttons Container is the element represented by the CSS class "action-button-container" and it should be hidden (it does not have the class "active")
    * */
    
    test.beforeEach(async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        await svgomgPage.goto();
    });

    test('Check that main menu, section and toolbar are available (but only main menu is visible)', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        
        await svgomgPage.checkIfMainMenuIsVisible();
        await svgomgPage.checkIfSectionIsHidden();
        await svgomgPage.checkIfToolbarIsHidden();
        await svgomgPage.checkIfActionButtonsContainerIsHidden();
    });
});