import puppeteer, { Page } from 'puppeteer-core';

// Function to launch the browser and return a new page
export async function launchBrowserAndGetPage() {
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir:
      '/Users/briannoh/Library/Application Support/Google/Chrome/Default',
    headless: false,
  });
  const page = (await browser.pages())[0];

  // // Cloudflare bypass
  // await page.setUserAgent(
  //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
  // );

  return { browser, page };
}

// Function to get the store link from the search page
export async function getStoreLink(page: Page, restaurantName: string) {
  const url = `http://www.doordash.com/search/store/${restaurantName}?event_type=search`;

  console.log('URL', url);
  await page.goto(url);

  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a'), (e) => e.href)
  );
  const storeLink = links.find((element) =>
    element.includes('https://www.doordash.com/store/')
  );

  console.log('Links', links);

  return storeLink;
}

// Function to get the reviews link from the store page
export async function getReviewsLink(page: Page) {
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a'), (e) => e.href)
  );
  const reviewsLink = links.find((element) =>
    element.includes('https://www.doordash.com/reviews/store/')
  );

  return reviewsLink;
}

// Function to get the overall rating of the store
export async function scrapeStoreRating(page: Page) {
  const rating = await page.evaluate(() => {
    const ratingElement = document.querySelector(
      'span.styles__TextElement-sc-3qedjx-0.ddsDdz'
    );
    const rating = ratingElement?.textContent?.trim();
    return parseFloat(rating || '0');
  });

  return rating;
}

// Function to scrape reviews from the reviews page
export async function scrapeReviews(page: Page) {
  const reviews = await page.evaluate(() => {
    // Get list of all review cards
    const reviewCardElements = document.querySelectorAll(
      'div[data-anchor-id^="ReviewCard-"]'
    );

    // initialize empty reviews array
    const reviewInfoList: {
      reviewSource: string | undefined;
      reviewDate: string | undefined;
      reviewText: string | undefined;
    }[] = [];

    reviewCardElements.forEach((reviewCard) => {
      // Person who wrote the review
      const reviewSourceElement = reviewCard.querySelector(
        '.styles__TextElement-sc-3qedjx-0.jdPVjd'
      );
      const reviewSource = reviewSourceElement?.textContent?.trim();

      // Date of review
      const reviewDateElement = reviewCard.querySelector(
        '.styles__TextElement-sc-3qedjx-0.cbFhUJ'
      );
      const reviewDate = reviewDateElement?.textContent?.trim();

      // Text of review
      const reviewTextElement = reviewCard.querySelector(
        '.styles__TextElement-sc-3qedjx-0.lcTVNM.gJoNDK.hxNLVj'
      );
      const reviewText = reviewTextElement?.textContent?.trim();

      reviewInfoList.push({
        reviewSource,
        reviewDate,
        reviewText,
      });
    });

    return reviewInfoList;
  });

  return reviews;
}
