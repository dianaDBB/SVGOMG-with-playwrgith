import * as fs from "fs";
﻿import { expect, test } from '@playwright/test';
import {
    SVGOMGPage,
    MenuOptionsElements,
    FileVariables,
    ToolbarOptionsElements,
    MainElements, CodeOutputTags
} from '../pages/SVGOMGPage';

test.describe('Verify SVG optimization', () => {
    /* Test Cases: 
    * Verify that the SVG optimization is working correctly by using “Open SVG” or “Paste markup” options from the main menu. -> What is "working correctly"? What is expected?
    *   - Check that after opening a SVG, the markup section shows the optimized SVG markup
    * 
    * Ensure that uploaded / pasted SVG (using default settings) can be downloaded with reduced file size after optimizations.
    *   - After opening the SVG, do the download (with the default optimization settings) and then compare the original file size with the downloaded one (download must be smaller) 
    * 
    * Verify downloaded SVG file contents eg. by checking SVG markup or specific attributes
    *   - After doing the download, check that the SVG markup are the expected ones (compare the file with an expected one)
    */

    test.beforeEach(async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);
        await svgomgPage.goto();
    });

    test('Check that the SVG optimization is working correctly', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //open SVG (do not do anything else, use the default settings!)
        await svgomgPage.setSVGToOpen();
        await page.click(MenuOptionsElements.openSVG);
        
        //go to Markup tab and check that the content is the expected optimized one
        await page.click(ToolbarOptionsElements.markup);
        await svgomgPage.checkIfElementIsAttached(CodeOutputTags.token); // wait for markup to be loaded...        
        expect(await page.innerText(MainElements.output)).toBe(await fs.readFileSync(`${FileVariables.svgPath}${FileVariables.validSVGOptimizedName}`, 'utf8'));
    });
    
    test('Check that the uploaded (using default settings) can be downloaded with reduced file size after optimization', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //open SVG (do not do anything else, use the default settings!)
        await svgomgPage.setSVGToOpen();
        await page.click(MenuOptionsElements.openSVG);
        
        //download optimized SVG
        const download = await svgomgPage.doDownload(true);
        expect(await download.failure()).toBe(null);
        
        //check that downloaded file size is less than the original file size
        const downloadedTestFile = await fs.readFileSync(`${FileVariables.downloadFilePath}${FileVariables.downloadFileName}`);
        const downloadedSize = downloadedTestFile.byteLength;

        const originalTestFile = await fs.readFileSync(`${FileVariables.svgPath}${FileVariables.validSVGName}`);
        const originalSize = originalTestFile.byteLength;
        
        expect(downloadedSize < originalSize).toBe(true);
    });

    test('Check that the downloaded SVG file contents are the expected ones after a optimization', async ({ page }) => {
        const svgomgPage = new SVGOMGPage(page);

        //open SVG (do not do anything else, use the default settings!)
        await svgomgPage.setSVGToOpen();
        await page.click(MenuOptionsElements.openSVG);

        //download optimized SVG
        const download = await svgomgPage.doDownload(true);
        expect(await download.failure()).toBe(null);

        //check that downloaded file has the expected contents
        const downloadedTestFile = await fs.readFileSync(`${FileVariables.downloadFilePath}${FileVariables.downloadFileName}`);
        const expectedFile = await fs.readFileSync(`${FileVariables.svgPath}${FileVariables.validSVGOptimizedName}`);
        
        expect(downloadedTestFile.compare(expectedFile)).toBe(0);
    });
});