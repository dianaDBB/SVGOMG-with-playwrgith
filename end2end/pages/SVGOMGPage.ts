import {Page} from 'playwright';
import {expect} from "@playwright/test";

export const MainElements = {
    mainMenu: '.menu',
    section: '.settings',
    toolbar: '.toolbar',
    actionButtonsContainer: '.action-button-container',
    errorMessages: '.toast-content',
    output: '.output-switcher'
};

export const MenuOptionsElements = {
    openSVG: `${MainElements.mainMenu} >> text="Open SVG"`,
    pasteMarkup: `${MainElements.mainMenu} >> text="Paste markup"`,
    demo: `${MainElements.mainMenu} >> text="Demo"`,
    contribute: `${MainElements.mainMenu} >> text="Contribute"`,
    about: `${MainElements.mainMenu} >> text="About"`
};

export const ToolbarOptionsElements = {
    image: `${MainElements.toolbar} >> text=" Image"`,
    markup: `${MainElements.toolbar} >> text=" Markup"`
};

export const SettingOptionsElements = {
    removeComments: `${MainElements.section} >> text="Remove comments"`,
    removeMetadata: `${MainElements.section} >> text="Remove \<metadata\>"`,
    removeXmlInstructions: `${MainElements.section} >> text="Remove XML instructions"`
};

export const CodeOutputTags = {
    token: `${MainElements.output} >> .token`,
    comment: `${MainElements.output} >> .comment`,
    metadata: `${MainElements.output} >> .token :text("metadata")`,
    prolog: `${MainElements.output} >> .prolog`
};

export const OptimizerElements = {
    downloadButton: `${MainElements.actionButtonsContainer} >> .floating-action-button`,
};

export const FileVariables = {
    svgPath: 'end2end/Resources/',
    validSVGName: 'SVG_ValidExample.svg',
    validSVGOptimizedName: 'SVG_ValidExampleOtimized.svg',
    invalidSVGName: 'SVG_InvalidExample.txt',
    downloadFilePath: 'end2end/Resources/Download/',
    downloadFileName: 'downloaded.svg'
};

/* Some "whys": 
* Playwright "isVisible" does not checks if the element is within the ViewPortSize.
*   - And in this case, some of the elements are hidden by placing the element outside the ViewPortSize :(
*   - So, what we are doing to check the visibility, is checking the CSS class (active / hidden) to check if the element is or not visible
*       - And because we are talking about visual behavior, we know that the actions are not done immediately
*       - So, we need to encapsulate the check of the "CSS class" inside a wait (to give the page a little time to really change all the states)
*   - It is ideally? NO! Other solution would be, for example:
*       - We can try to do it by checking the position too
*       - Create a function that gets the page ViewPortSize and the element position and checks if the elem is inside the ViewPortSize
*       - However, IMO, the ideally solution would be to change the behavior so it does not hide it by putting outside the ViewPortSize...
* */

export class SVGOMGPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        page.setDefaultTimeout(10000)
    }

    async goto() {
        await this.page.goto('https://jakearchibald.github.io/svgomg/');
    }
    
    async checkIfMainMenuIsVisible() {
        const elem = await this.checkIfElementIsAttached(MainElements.mainMenu);
        
        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return !classAttribute.includes("hidden");
        }, elem);
    }

    async checkIfMainMenuIsHidden() {
        const elem = await this.checkIfElementIsAttached(MainElements.mainMenu);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return classAttribute.includes("hidden");
        }, elem);
    }

    async checkIfSectionIsVisible() {
        const elem = await this.checkIfElementIsAttached(MainElements.section);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return classAttribute.includes("active");
        }, elem);
    }

    async checkIfSectionIsHidden() {
        const elem = await this.checkIfElementIsAttached(MainElements.section);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return !classAttribute.includes("active");
        }, elem);
    }

    async checkIfToolbarIsVisible() {
        const elem = await this.checkIfElementIsAttached(MainElements.toolbar);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return classAttribute.includes("active");
        }, elem);
    }

    async checkIfToolbarIsHidden() {
        const elem = await this.checkIfElementIsAttached(MainElements.toolbar);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return !classAttribute.includes("active");
        }, elem);
    }

    async checkIfActionButtonsContainerIsVisible() {
        const elem = await this.checkIfElementIsAttached(MainElements.actionButtonsContainer);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return classAttribute.includes("active");
        }, elem);
    }

    async checkIfActionButtonsContainerIsHidden() {
        const elem = await this.checkIfElementIsAttached(MainElements.actionButtonsContainer);

        await this.page.waitForFunction(async (element) => {
            const classAttribute = await element.getAttribute("class");
            return !classAttribute.includes("active");
        }, elem);
    }

    async checkIfElementIsAttached(element: string) {
        const elem = await this.page.waitForSelector(element, { state: 'attached' });
        expect(elem).not.toBe(null);

        return elem;
    }

    async checkIfElementIsNotAttached(element: string) {
        const elem = await this.page.waitForSelector(element, { state: 'detached' });
        expect(elem).toBe(null);
    }

    async clickOnMenuOption(menuOption: string) {
        await this.page.click(menuOption);
    }

    async setSVGToOpen(svgFilePath = FileVariables.svgPath, svgFileName = FileVariables.validSVGName) {
        const filePathName = svgFilePath.concat(svgFileName);
        this.page.on('filechooser', async (fileChooser) => {
            await fileChooser.setFiles(filePathName);
        });
    }

    async doDownload(downloadToSpecificFolder = false, downloadFilePath = FileVariables.downloadFilePath, downloadFileName = FileVariables.downloadFileName) {
        const [ download ] = await Promise.all([
            this.page.waitForEvent('download'),
            this.page.click(OptimizerElements.downloadButton)
        ]);

        if(downloadToSpecificFolder) {
            const filePathName = downloadFilePath.concat(downloadFileName);
            await download.saveAs(filePathName);
        }
        
        return download;
    }
}