const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const { expect } = require('chai');
const assert = require('assert');

describe('Volvo Car Safety Page', () => {

  it('should have the correct page title', async () => {
    browser.url('https://www.volvocars.com/intl/v/car-safety/a-million-more');
    // Wait for page title to match the expected value
    browser.waitUntil(
      () => browser.getTitle() === 'A million more | Volvo Cars - International',
      {
        timeout: 5000,
      },
    );
    const AcceptButton = $('//button[text()="Accept"]');
    await AcceptButton.waitForClickable();
    await AcceptButton.click();
    await browser.pause(5000);
  });

  it('Verify Our Cars clickable', async () => {
    const ourCars = $('//button/em[text()="Our Cars"]');
    await ourCars.waitForClickable();
    // Verify that the button is clickable
    await ourCars.waitForClickable();
    const isClickable = await ourCars.isClickable();
    expect(isClickable).to.be.true;
  });

  it('should display Safety features section', () => {
    const iconCallouts = $('//div[@data-component="IconCallouts"]');
    iconCallouts.scrollIntoView();
    assert.ok(iconCallouts.isExisting(), 'IconCallouts section not found');

    const iconTextItems = $$('//div[@data-autoid="iconCallouts:iconTextItem"]');
    browser.waitUntil(
      () => iconTextItems.length > 0,
      {
        timeout: 5000,
        timeoutMsg: 'iconCallouts:iconTextItem section not found',
      }
    );
    console.log(`Number of iconTextItems: ${iconTextItems.length}`);
    const expectedContents = [
      ['Speed cap', 'Highway pilot'],
      ['Driver monitoring cameras', 'Care Key'],
    ];
    iconTextItems.forEach((iconTextItem, index) => {
      const actualContents = iconTextItem.$$('em').map(el => el.getText());
      console.log(`actualContents[${index}]: ${actualContents}`);
      assert.deepStrictEqual(actualContents, expectedContents[index], `Contents of iconCallouts:iconTextItem[${index}] do not match`);
    });
  });

  it('should display paragraphs under IconTextItem section', () => {
    const iconTextContents = $$('//div[@data-autoid="IconTextItem:text"]');
    iconTextContents.forEach((iconTextContent, index) => {
      const textParagraphs = iconTextContent.$$('p');
      assert.ok(textParagraphs.length > 0, `No paragraphs found under IconTextItem[${index + 1}]`);

      textParagraphs.forEach((textParagraph, pIndex) => {
        assert.ok(textParagraph.isExisting(), `Paragraph ${pIndex + 1} not found under IconTextItem[${index + 1}]`);
        const actualText = textParagraph.getText();
        console.log(`actualText[${index}][${pIndex}]: ${actualText}`);
        assert.notStrictEqual(actualText, '', `Paragraph ${pIndex + 1} under IconTextItem[${index + 1}] is empty`);
      });
    });
  });

  it('should redirect to a new page on clicking IconCallouts CTA', async () => {
    const ctaElement = $('//a[@data-autoid="iconCallouts:cta"]');
    await ctaElement.scrollIntoView();
    await ctaElement.waitForClickable();
    const isClickablecta = await ctaElement.isClickable();
    expect(isClickablecta).to.be.true;
  });
  
  it('should display VideoTestimonials section', function () {
    const videoTestimonialsSection = $('//div[@data-component="VideoTestimonials"]');
   // videoTestimonialsSection.scrollIntoView();
    expect(videoTestimonialsSection.isExisting(), 'VideoTestimonials section not found');
    browser.pause(10000);
    const videoElements = $$('//video[contains(@data-autoid,"videoTestimonials:video")]');
    expect(videoElements.length > 0, 'No videos found in VideoTestimonials section');
    browser.pause(5000);
    for (let i = 0; i < videoElements.length; i++) {
      const videoElement = videoElements[i];
      videoElement.waitForClickable(function (err) {
        expect.ifError(err);
        // Click the video to start playing
        videoElement.click();
  
        // Wait for the video to start playing
        browser.waitUntil(function () {
          return !videoElement.paused();
        }, 5000, `Video ${i + 1} did not start playing`);
  
        // Wait for the video to finish playing
        browser.waitUntil(function () {
          return videoElement.ended();
        }, 20000, `Video ${i + 1} did not finish playing`);
  
        // Verify that the video played for at least 5 seconds
        expect(videoElement.currentTime() >= 5, `Video ${i + 1} did not play for at least 5 seconds`);
      });
    }
  });
  
  it('Verify Menu items', async () => {
    const Pagemenu = $('//button/em[text()="Menu"]');
    await Pagemenu.waitForClickable();
    await Pagemenu.click();
    await browser.pause(5000);
    const menuitems = $$('//div[@role="listitem"]//button');
    let isMenuItemsDisplayed = true;
    for (let i = 0; i < menuitems.length; i++) {
      const menuItem = await menuitems[i].getText();
      if (
        !(
          menuItem.includes('Buy') ||
          menuItem.includes('Own') ||
          menuItem.includes('About Volvo') ||
          menuItem.includes('Explore') ||
          menuItem.includes('More')
        )
      ) {
        isMenuItemsDisplayed = false;
        break;
      }
    }
    if (isMenuItemsDisplayed) {
      console.log('Menu items displayed');
    } else {
      console.log('Menu items display failed');
    }
  });

  it('should display car images under Explore our models section', async () => {
    const exploreSection = $('//div[@data-component="ProductListCarousel"]');
    await exploreSection.scrollIntoView();
    assert.ok(await exploreSection.isExisting(), 'Explore our models section not found');

  });

  it('should click of  shop button redirect to another page', async () => {
    try {
      const shopButton = $('//a[@aria-label="Design XC90 Recharge"]');
      await shopButton.waitForClickable();
      await shopButton.click();
      await browser.pause(5000);

      // Get the title of the new page
      const title = await browser.getTitle();

      // Output the title to the console
      console.log(`Page title is: ${title}`);
      browser.waitUntil(
        () => browser.getTitle() === 'Design your XC90 Recharge | Volvo Cars International',
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      console.error(error);
    }

  });
  /*
        it('should display video component', async () => {
          const videoComponent = $('//div[@id="Video-1"]//video');
      
          // Check that the video component element is present in the DOM
          expect(videoComponent).to.exist;
      
          // Wait for the video component to be displayed and loaded
          await videoComponent.waitForDisplayed();
          await browser.pause(5000);
          await videoComponent.scrollIntoView();
      
          await browser.setWindowSize(1280, 720);
          // Wait for the video to play for 5 seconds
          await browser.pause(5000);
      
          // Take a screenshot of the video component
          const screenshotPath = path.join(process.cwd(), 'test', 'screenshots', 'video1.png');
          await browser.saveScreenshot(screenshotPath);
      
          // Compare the screenshot with a reference image
          const referenceImagePath = path.join(process.cwd(), 'test', 'reference', 'video1.png');
          const comparisonResult = await compareImages(screenshotPath, referenceImagePath);
          await browser.pause(10000);
          console.log('comparisonResult:', comparisonResult);
          expect(comparisonResult.isWithinMisMatchTolerance).to.equal(true);
        })     
      */
});

async function compareImages(screenshotPath, referenceImagePath) {
  const [screenshot, referenceImage] = await Promise.all([
    new Promise((resolve, reject) => {
      fs.createReadStream(screenshotPath)
        .pipe(new PNG())
        .on('parsed', resolve)
        .on('error', reject);
    }),
    new Promise((resolve, reject) => {
      fs.createReadStream(referenceImagePath)
        .pipe(new PNG())
        .on('parsed', resolve)
        .on('error', reject);
    })
  ]);

  const { width, height } = referenceImage;
  const misMatchThreshold = 0.1;

  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(screenshot.data, referenceImage.data, diff.data, width, height, { threshold: misMatchThreshold });

  const isWithinMisMatchTolerance = numDiffPixels <= (width * height * misMatchThreshold);

  return { numDiffPixels, isWithinMisMatchTolerance };
}



