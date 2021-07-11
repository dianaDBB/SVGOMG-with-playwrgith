﻿import { expect, test } from '@playwright/test';
import { SVGOMGPage, MainElements, MenuOptionsElements, FileVariables } from '../pages/SVGOMGPage';

test.describe('Verify the Open SVG menu option', () => {
    /* Test Case: 
    * Ensure that “Open SVG” option in the main menu is working properly.
    * 
    * Assumptions: 
    * 1. Open SVG should open system find file window and after selecting a correct SVG, it opens that SVG
    *     - Main Menu ("menu") is hidden (it has the class "hidden")
    *     - Section ("settings") is visible (it has the class "active")
    *     - Toolbar ("toolbar") is visible (it has the class "active")
    *     - Action Buttons Container ("action-button-container") is visible (it has the class "active")
    *     - No Error (".toast-content") appears (this element is not on the DOM)
    * 2. If an invalid format file is provided, then an error "Load failed" should appear and the other elements do not change their status
    *     - Main Menu ("menu") is visible (it does not have the class "hidden")
    *     - Section ("settings") is hidden (it does not have the class "active")
    *     - Toolbar ("toolbar") is hidden (it does not have the class "active")
    *     - Action Buttons Container ("action-button-container") is hidden (it does not have the class "active")
    *     - No Error (".toast-content") appears (the element is on the DOM) 
     */

    test.beforeEach(async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        await svgomgPage.goto();
    });

    test('Check that when click on "Open SVG" menu option and a valid SVG is provided, then the SVG opens', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        
        //open the SVG file
        await svgomgPage.setSVGToOpen();
        await page.click(MenuOptionsElements.openSVG);

        //check that the SVG opens without errors
        await svgomgPage.checkIfMainMenuIsHidden();
        await svgomgPage.checkIfSectionIsVisible();
        await svgomgPage.checkIfToolbarIsVisible();
        await svgomgPage.checkIfActionButtonsContainerIsVisible();
        await svgomgPage.checkIfElementIsNotAttached(MainElements.errorMessages);
    });

    test('Check that when click on "Open SVG" menu option and an invalid SVG is provided, then an error appears', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //open the SVG file
        await svgomgPage.setSVGToOpen(FileVariables.svgPath, FileVariables.invalidSVGName);
        await page.click(MenuOptionsElements.openSVG);

        //check that the SVG does not opens and an error appear
        await svgomgPage.checkIfMainMenuIsVisible();
        await svgomgPage.checkIfSectionIsHidden();
        await svgomgPage.checkIfToolbarIsHidden();
        await svgomgPage.checkIfActionButtonsContainerIsHidden();

        const errorMessage = await svgomgPage.checkIfElementIsAttached(MainElements.errorMessages);
        expect(await errorMessage.innerText()).toBe('Load failed: Error in parsing SVG: Non-whitespace before first tag. Line: 0 Column: 1 Char: T');
    });
});