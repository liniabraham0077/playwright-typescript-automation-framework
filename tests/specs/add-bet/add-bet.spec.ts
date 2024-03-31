import { test } from '@playwright/test';
import { homePage } from '../../page-functions/home/home-page';
import { addBetPage } from '../../page-functions/add-bet/add-bet-page';
test.describe('Verify add bets feature using a device width of 420 px', () => {
  test.beforeEach(async ({ page }) => {
    await homePage().navigateToHomePage(page, process.env.HOSTNAME!, '');
    const selectedRaceCardName = await homePage().selectRaceCardFromGroupOne(page, 1);
    if (typeof selectedRaceCardName === 'string') {
      await addBetPage().verifySelectedRaceCard(page, selectedRaceCardName);
    } else throw new Error(`Invalid race card ${selectedRaceCardName}`);
  });
  test(' @addBet add two unique bets and verify if added correctly', async ({ page }) => {
    await addBetPage().addRaceCardOutcomeAndVerifyOnBetSlip(page, 2);
  });
  test(' @test add race card outcome and verify bet count', async ({ page }) => {
    await addBetPage().verifyBetCountOnBetSlip(page, 2);
  });
});
