import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv';
import {
  getReviewsLink,
  getStoreLink,
  launchBrowserAndGetPage,
  scrapeStoreRating,
  scrapeReviews,
} from './scrape';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000 || 3001;

app.use(cors());
app.use(express.json());
dotenv.config();

// Create an instance of the PrismaClient
const prisma = new PrismaClient();

app.get('/scrape/:restaurantName', async (req: Request, res: Response) => {
  try {
    const { restaurantName } = req.params;
    console.log(restaurantName);

    const { browser, page } = await launchBrowserAndGetPage();

    const storeLink = await getStoreLink(page, restaurantName);
    if (storeLink) {
      console.log(storeLink);
      await page.goto(storeLink);
    }
    console.log(storeLink);

    // This is what I had before seeing your email in my spam folder
    // const reviewsLink = await getReviewsLink(page);
    // if (reviewsLink) {
    //   await page.goto(reviewsLink);
    // }

    // const rating = await scrapeStoreRating(page);
    // const reviews = await scrapeReviews(page);

    await browser.close();

    // extract the Doordash Store Number from the store link
    // matches the last sequence of digits preceded by a slash (/)
    const matchArray = storeLink?.match(/\/(\d+)$/);
    // defaulted to Eggstreme Breakfast Burritos
    const targetId = matchArray ? Number(matchArray[1]) : 126106;

    console.log('TARGET', targetId);

    const url =
      'https://www.doordash.com/graphql/getRatingsReviewsPage?operation=getRatingsReviewsPage';

    const query = `{
      getRatingsReviewsPage(
        target: {
          targetId: ${targetId},
          targetType: 1
        },
        offset: "0",
        limit: 10
      ) {
        result {
          reviewsList {
            reviewerDisplayName
            numStars
            reviewText
            reviewedAt
            storeId
          }
        }
      }
    }`;

    const headers = {
      authority: 'www.doordash.com',
      accept: '*/*',
      'accept-language': 'en-US',
      'apollographql-client-name':
        '@doordash/app-consumer-production-ssr-client',
      'apollographql-client-version': '2.2',
      baggage:
        'sentry-environment=production,sentry-release=consumer-web-next%401.924.3,sentry-transaction=%2Fcsr-in-ssr%2Freviews%2F%5BslugId%5D,sentry-public_key=f55609756bfb481c8ad0a180c8248883,sentry-trace_id=dcf008835db5485b9e7910b1ff9ad644,sentry-sample_rate=0.2',
      'content-type': 'application/json',
      cookie:
        'dd_device_id=dx_1da4c51cf49a437f9a96dddefdbb77ca; dd_device_session_id=f5bd9d9d-5162-4d35-8d8f-89f66a1345ec; optimizelyEndUserId=oeu1681606666131r0.11018696536499806; dd_language=en-US; _gcl_au=1.1.855719937.1681606667; __ssid=6183a8fed609f133a55c93923c36e8f; rskxRunCookie=0; rCookie=z068vrbx6e4h5lkhgs4h6lgip6wc4; __pdst=2dcd79714d034500a594a99707305bde; _scid=be11f485-9572-44f0-9544-cf9300b4436f; _tt_enable_cookie=1; _ttp=BUjehDt6TinzTGDQnAbLllU2L7x; g_state={"i_l":0}; dd_cx_logged_in=true; dd_last_login_action=Login; ddweb-has-dismissed-splash-screen=true; ddweb_session_id=f50e0c21-d2b4-4cd4-823b-fbb6ded2bbb3:0; csrf_token=xKfg77vKX3xXdYvM3Zf4DqutcqHPHbsTT0edSfbZmWvSNn7VsZ6QNNA7aXuc2FQO; dd_last_login_method=Email; ajs_user_id=926964952; ajs_anonymous_id=04bf13fd-d751-4e66-89ab-25ac137a6b23; __podscribe_doordash_referrer=https://www.google.com/; __podscribe_doordash_landing_url=https://www.doordash.com/store/eggstreme-breakfast-burritos-los-angeles-23049508/; __podscribe_did=c619cdee-d9f0-4c88-aad2-ad0f7d020471; dd_locale=; amplitude_idundefineddoordash.com=eyJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOm51bGwsImxhc3RFdmVudFRpbWUiOm51bGwsImV2ZW50SWQiOjAsImlkZW50aWZ5SWQiOjAsInNlcXVlbmNlTnVtYmVyIjowfQ==; _ga_4J1MLKETLL=GS1.1.1686261557.2.0.1686261557.0.0.0; _ga_XD197XH5KV=GS1.1.1686261557.2.0.1686261557.0.0.0; iterableEndUserId=anderthan%40gmail.com; _RCRTX03=c362b93a0ec411ee88528ddb392e8e8007c10a2db7004a4b8702dc904c036edb; _RCRTX03-samesite=c362b93a0ec411ee88528ddb392e8e8007c10a2db7004a4b8702dc904c036edb; rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13=5117881; dd_rfp=49de0ade9e0c0c6e76682106ac479038; _gcl_aw=GCL.1687410639.CjwKCAjwv8qkBhAnEiwAkY-ahr4uro0h3uNR6sgrYflUt7NESvRuxgWcL6KiSl4kKlaH_xG0GpFOvBoCBCQQAvD_BwE; _gcl_dc=GCL.1687410639.CjwKCAjwv8qkBhAnEiwAkY-ahr4uro0h3uNR6sgrYflUt7NESvRuxgWcL6KiSl4kKlaH_xG0GpFOvBoCBCQQAvD_BwE; _gac_UA-36201829-6=1.1687410639.CjwKCAjwv8qkBhAnEiwAkY-ahr4uro0h3uNR6sgrYflUt7NESvRuxgWcL6KiSl4kKlaH_xG0GpFOvBoCBCQQAvD_BwE; dd_market_id=1; dd_delivery_correlation_id=d36672fb-1617-48dc-a07c-3fcc33734e7a; dd_session_id=sx_f3741ab7455c46ebbbb337479dc48402; __cf_bm=..W.ob3iMTQAAoPUEMe8lnKlDN5twQTNdsqIdqXs3Dc-1688439614-0-AYEAhVdAHRBZZbpNjM/xvDxF7DeqKZED32nfZiJb4PYE8RWKpDbh6rdOJl4XizTiWH6xCNPS0zUaTpo5KJ6sbJerhu1q7jXQYufk/FKABVsz13K5niBP+CZ8+pcg3MTeCg==; __cf_bm=WYX0VGYgvWwWaGj_fvNfRQbeZg3agp4ByVbCezAO8p8-1688439614-0-ASzkSmK4waAvfFt4wSiITSDwH+L5a8H73K9xRwg6QzddXZb5SjeBXJqoYcSx+E754535Hclpo+2yyV3dEAtfWoA=; _cfuvid=vSSS2K6kbaTCDyxE0s3xH3cJIvf9bokxVyHkixehMzM-1688439614290-0-604800000; _gid=GA1.2.1056966473.1688439620; _gat_UA-36201829-6=1; _scid_r=be11f485-9572-44f0-9544-cf9300b4436f; _ga=GA1.1.907712351.1681606667; _uetsid=e96144701a1611eebca54974b5eceb3b; _uetvid=3ee027b0e75b11ec9b220795e2a72f42; _ga_J4BQM7M3T2=GS1.1.1688439619.26.1.1688439621.58.0.0; _ga_BXB2XKP8LL=GS1.1.1688439619.2.1.1688439621.0.0.0; _sctr=1%7C1688367600000; amplitude_id_8a4cf5f3981e8b7827bab3968fb1ad2bdoordash.com=eyJkZXZpY2VJZCI6IjU4MGI3M2QzLTVhZTAtNDYxNC05OWUwLTI0OTc3YWZhOGMxZVIiLCJ1c2VySWQiOiI5MjY5NjQ5NTIiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE2ODg0Mzk2MTc1NjQsImxhc3RFdmVudFRpbWUiOjE2ODg0Mzk2MjMwMTUsImV2ZW50SWQiOjE3OTIsImlkZW50aWZ5SWQiOjg2LCJzZXF1ZW5jZU51bWJlciI6MTg3OH0=; authState=83ff4068-5289-4f59-a675-fe961e2f2ac3; ddweb_token=eyJhbGciOiJIUzI1NiJ9.eyJvcmlnX2lhdCI6MTY4ODQzOTYyMywiZXhwIjoxNjg4Njk4ODIzLCJ1c2VyIjp7ImF1dGhfdmVyc2lvbiI6MywiaXNfc3RhZmYiOmZhbHNlLCJpZCI6OTYyOTIyNzEzLCJlbWFpbCI6ImFuZGVydGhhbkBnbWFpbC5jb20ifSwiY2lkIjoxNjY2NTE5MzkwNDI2Mjk1MDQwfQ.G28LRQQc-GvgVX_HxBz3-q8ttrMxuxpcrlW-QTNBxFM:e60c2004-74d4-42fa-b7cb-1d74743765c8; lastRskxRun=1688439624625; __cfwaitingroom=ChhIK1VhZEMvNXE5TW5jcWdyQnRadkNnPT0SrAJ2VGNVNmZMbWRZeGpFazZqbm1WSFdNY0FOVGREekdDU2FOaHo4NHF3MmY2ZFJWV0NuSTBNMTY5MDVCRUNQSlJMZE1IWm1DbGtNcXBrSzBDc25KZFNTWHJraWhydEZBR0JmdjRhK1Joak8rU3FjS2lpbUwwa1VtOEdXQWc4TkViYnNkQlEwaHcyMmE5aDRiZkRzekVhaGs2OFJTb0UyalBsMTUxSzJlblN0eXlCWHJaaFBvWXlkUExkRGtpOTM2SW5BdmdFZ0VSQ0RBc3FacHNNQjVZZWQvSVdJaHVwVndqdG5DWnlnRTRVRU82RXE1OHRSWmhBaC93WDAzQzNtNGkyd1V0aE9GMVlDaEgvNXBkdjY2R3BWRE8yQ245d3RTL0FMcVFHcU10cHR4ST0%3D; _cfuvid=kMdhkh6dxIbhcf9uOaTjCqlPUIjo0F1Z7LTPDk6eZQg-1688439624753-0-604800000',
      origin: 'https://www.doordash.com',
      referer: 'https://www.doordash.com/reviews/store/126106/',
      'sec-ch-ua':
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sentry-trace': 'dcf008835db5485b9e7910b1ff9ad644-99a9cd25499256f8-0',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      'x-channel-id': 'marketplace',
      'x-csrftoken':
        'xKfg77vKX3xXdYvM3Zf4DqutcqHPHbsTT0edSfbZmWvSNn7VsZ6QNNA7aXuc2FQO',
      'x-experience-id': 'doordash',
    };

    const response = await axios.post(url, { query });

    console.log(response.data);

    const reviewsList =
      response.data.data.getRatingsReviewsPage.result.reviewsList;

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        doordashStoreId: targetId,
        reviews: {
          create: reviewsList.map(
            (review: {
              reviewerDisplayName: string;
              reviewedAt: string;
              reviewText: string;
              numStars: string;
            }) => ({
              source: review.reviewerDisplayName || null,
              date: review.reviewedAt || null,
              text: review.reviewText || null,
              rating: review.numStars || null,
            })
          ),
        },
      },
      include: {
        reviews: true,
      },
    });

    // console.log('Res --->', restaurant);

    res.json(restaurant);
  } catch (err) {
    console.log('An error has occured -->', err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
