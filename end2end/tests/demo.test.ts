﻿import { test } from '@playwright/test';
import {
    SVGOMGPage,
    MenuOptionsElements,
    ToolbarOptionsElements, 
    SettingOptionsElements, 
    CodeOutputTags
} from '../pages/SVGOMGPage';

test.describe('Verify Demo SVG optimization', () => {
    /* Test Cases: 
    * Ensure that global optimization options like “Remove comments”, “Remove <metadata>” and “Remove XML instructions” are working correctly using “Demo” options from the main menu. 
    * Use the “MARKUP” tab to verify SVG output for mentioned global optimization options on the fly.
    *   - Click on Demo > Markup tab and then check / uncheck the options and validate that the content is updated accordingly 
    */

    test.beforeEach(async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        await svgomgPage.goto();
        await page.click(MenuOptionsElements.demo);
        await page.click(ToolbarOptionsElements.markup);
        await svgomgPage.checkIfElementIsAttached(CodeOutputTags.token);
    });

    test('Check that "Remove comments" option is working', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //by default "Remove comments" is active, so we should not have the comment tag
        await svgomgPage.checkIfElementIsNotAttached(CodeOutputTags.comment);
        
        //and, if "Remove comments" is unselected, then we should have the comment tag
        await page.click(SettingOptionsElements.removeComments);
        await svgomgPage.checkIfElementIsAttached(CodeOutputTags.comment);
    });
    
    test('Check that "Remove metadata" option is working', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //by default "Remove metadata" is active, so we should not have the metadata tag
        await svgomgPage.checkIfElementIsNotAttached(CodeOutputTags.metadata);

        //and, if "Remove metadata" is unselected, then we should have the metadata tag
        await page.click(SettingOptionsElements.removeMetadata);
        await svgomgPage.checkIfElementIsAttached(CodeOutputTags.metadata);
    });

    test('Check that "Remove XML Instructions" option is working', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //by default "Remove XML Instructions" is active, so we should not have the metadata prolog
        await svgomgPage.checkIfElementIsNotAttached(CodeOutputTags.prolog);

        //and, if "Remove XML Instructions" is unselected, then we should have the metadata prolog
        await page.click(SettingOptionsElements.removeXmlInstructions);
        await svgomgPage.checkIfElementIsAttached(CodeOutputTags.prolog);
    });
    
    //we could do the same type of test for all other Demo options........
});