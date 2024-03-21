import { expect, type Page } from '@playwright/test';
import { addBetPageObject } from '../page-objects/add-bet-page-object';
import { pageUtils } from '../utils/page-utils';
import { betSlipPageObject } from '../page-objects/bet-slip-page-object';

export const addBetPage = () => {
  /** Function to compare race card name from home page and add bet page */

  const verifySelectedRaceCard = async (page: Page, selectedRaceCard: string) => {
    const displayedRaceCard = await page.locator(addBetPageObject.raceCardTitle()).textContent();
    console.log(`add bet page horse ${displayedRaceCard}`);

    expect(displayedRaceCard).toEqual(selectedRaceCard);
  };

  /** Function to add two unique race card outcomes and verify the name against bet slip name */

  const addRaceCardOutcomeAndVerifyOnBetSlip = async (page: Page, raceCardOutcomeToAddCount: number) => {
    await page.locator(addBetPageObject.raceCardOutcomeWinList).first().waitFor({ state: 'visible' });
    const raceCardOutcomeAvailableCount = await page.locator(addBetPageObject.raceCardOutcomeWinList).count();
    const raceCardNumberList = pageUtils().generateListOfUniqueRandomNumbers(1, raceCardOutcomeAvailableCount, raceCardOutcomeToAddCount);
    const randomRaceCardsToAddNameList: string[] = await getRaceCardOutcomeToAddList(page, raceCardNumberList);
    await addRandomRaceCardOutcome(page, raceCardNumberList);
    await verifyAddedRaceCardsInBetSlip(page, randomRaceCardsToAddNameList);
  };

  /** Function to generate a list of two unique race card outcomes to be added */

  const getRaceCardOutcomeToAddList = async (page: Page, raceCardNumberList: number[]) => {
    const raceCardOutcomeToAddList: string[] = (await Promise.all(
      raceCardNumberList.map(async (raceCardNumber) => {
        const raceCardNameText = await page.locator(addBetPageObject.raceCardOutcomeList(raceCardNumber)).textContent();
        return raceCardNameText?.replace(/\u00A0/g, ' ').trim();
      }),
    )) as string[];
    return raceCardOutcomeToAddList;
  };

  /** Function to add two unique race card outcomes */

  const addRandomRaceCardOutcome = async (page: Page, raceCardNumberList: number[]) => {
    await Promise.all(
      raceCardNumberList.map(async (raceCardNumber) => {
        console.log(`adding race card number ${raceCardNumber}`);
        await page.locator(addBetPageObject.raceCardToAdd(raceCardNumber)).scrollIntoViewIfNeeded();
        await page.locator(addBetPageObject.raceCardToAdd(raceCardNumber)).waitFor({ state: 'visible' });
        await expect(page.locator(addBetPageObject.raceCardToAdd(raceCardNumber))).toBeVisible();
        if (await page.locator(addBetPageObject.raceCardToAdd(raceCardNumber)).isVisible()) {
          await page.locator(addBetPageObject.raceCardToAdd(raceCardNumber)).click();
          console.log(`added race card number ${raceCardNumber}`);
          await page.waitForTimeout(3000);
        } else throw new Error(`racecard number to be added ${raceCardNumber} is not visible`);
        if (await page.locator(betSlipPageObject.betSlipPanel).isVisible()) {
          await page.locator(betSlipPageObject.betSlipCloseButton).click();
        }

        if (!(await page.locator(addBetPageObject.raceCardSelected(raceCardNumber)).isVisible())) {
          await page.locator(addBetPageObject.raceCardToAdd(raceCardNumber)).click();
        }
      }),
    );
  };

  /** Function to compare the added race card otucome against bet slip names */

  const verifyAddedRaceCardsInBetSlip = async (page: Page, randomRaceCardsToAddNameList: string[]) => {
    await page.locator(betSlipPageObject.betSlipButton).click();
    const betcount = await page.locator(betSlipPageObject.betSlipBetTitleList).count();
    console.log(`betCount is ${betcount}`);
    const randomRaceCardsAddedNameList = await page.locator(betSlipPageObject.betSlipBetTitleList).allTextContents();
    console.log(`bets added text is ${randomRaceCardsAddedNameList}`);
    console.log(`bets to add text is ${randomRaceCardsToAddNameList}`);

    expect([...randomRaceCardsAddedNameList].sort()).toEqual([...randomRaceCardsToAddNameList].sort());
  };

  return {
    verifySelectedRaceCard: async (page: Page, selectedRaceCard: string) => verifySelectedRaceCard(page, selectedRaceCard),
    addRaceCardOutcomeAndVerifyOnBetSlip: async (page: Page, numberOfBets: number) => addRaceCardOutcomeAndVerifyOnBetSlip(page, numberOfBets),
  };
};