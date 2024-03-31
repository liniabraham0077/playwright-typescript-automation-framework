import { test } from '@playwright/test';
import { HomePage } from '../../page-objects/home/home';
import { AddBetPage } from '../../page-objects/add-bet/add-bet';

test.describe('Verify add bets feature using a device width of 420 px', () => {
  let homePage: HomePage;
  let addBetPage: AddBetPage;
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
    const selectedRaceCardName = await homePage.selectRaceCardFromGroupOne(1);
    addBetPage = new AddBetPage(page);
    if (typeof selectedRaceCardName === 'string') {
      await addBetPage.verifySelectedRaceCard(selectedRaceCardName);
    } else throw new Error(`Invalid race card ${selectedRaceCardName}`);
  });
  test(' @addBet add two unique bets and verify if added correctly', async () => {
    await addBetPage.addRaceCardOutcomeAndVerifyOnBetSlip(2);
  });
  test(' @addBet add race card outcome and verify bet count', async () => {
    await addBetPage.verifyBetCountOnBetSlip(2);
  });
});
