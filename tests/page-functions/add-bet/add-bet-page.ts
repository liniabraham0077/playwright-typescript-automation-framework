import { expect, type Page } from '@playwright/test';
import { addBetPageObject } from '../../page-objects/add-bet/add-bet-page-object';
import { pageUtils } from '../../utils/page-utils';
import { betSlipPageObject } from '../../page-objects/add-bet/bet-slip-page-object';

export const addBetPage = () => {
  /** Function to compare race card name from home page and add bet page */

  const verifySelectedRaceCard = async (page: Page, selectedRaceCard: string): Promise<void> => {
    const displayedRaceCard = await page.locator(addBetPageObject.raceCardTitle()).textContent();
    console.log(`add bet page horse ${displayedRaceCard}`);

    expect(displayedRaceCard).toEqual(selectedRaceCard);
  };

  /** Function to add two unique race card outcomes and verify the name against bet slip name */

  const addRaceCardOutcomeAndVerifyOnBetSlip = async (page: Page, raceCardOutcomeToAddCount: number): Promise<void> => {
    const raceCardNumberToAddList = await generateRandomRaceCardIndexToAdd(page, raceCardOutcomeToAddCount);
    const randomRaceCardsToAddNameList = await getRaceCardOutcomeToAddList(page, raceCardNumberToAddList);
    await addRandomRaceCardOutcome(page, raceCardNumberToAddList);
    await verifyAddedRaceCardsInBetSlip(page, randomRaceCardsToAddNameList);
  };

  /** Function to add two unique race card outcomes and verify the name against bet slip name */

  const generateRandomRaceCardIndexToAdd = async (page: Page, raceCardOutcomeToAddCount: number) => {
    await page.locator(addBetPageObject.raceCardOutcomeWinList).first().waitFor({ state: 'visible' });
    const raceCardOutcomeAvailableCount = await page.locator(addBetPageObject.raceCardOutcomeWinList).count();
    const raceCardNumberToAddList = pageUtils().generateListOfUniqueRandomNumbers(1, raceCardOutcomeAvailableCount, raceCardOutcomeToAddCount);
    return raceCardNumberToAddList;
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

  const addRandomRaceCardOutcome = async (page: Page, raceCardNumberList: number[]): Promise<void> => {
    await Promise.all(
      raceCardNumberList.map(async (raceCardNumber) => {
        console.log(`adding race card number ${raceCardNumber}`);

        const raceCardLocator = page.locator(addBetPageObject.raceCardToAdd(raceCardNumber));
        await raceCardLocator.scrollIntoViewIfNeeded();
        await raceCardLocator.waitFor({ state: 'visible' });
        await expect(raceCardLocator).toBeVisible();

        await raceCardLocator.click();
        console.log(`added race card number ${raceCardNumber}`);

        const betSlipPanelLocator = page.locator(betSlipPageObject.betSlipPanel);
        if (await betSlipPanelLocator.isVisible()) {
          await page.locator(betSlipPageObject.betSlipCloseButton).click();
        }

        const raceCardSelectedLocator = page.locator(addBetPageObject.raceCardSelected(raceCardNumber));
        if (!(await raceCardSelectedLocator.isVisible())) {
          await raceCardLocator.click();
        }
      }),
    );
  };

  /** Function to compare the added race card otucome against bet slip names */

  const verifyAddedRaceCardsInBetSlip = async (page: Page, randomRaceCardsToAddNameList: string[]): Promise<void> => {
    await page.locator(betSlipPageObject.betSlipButton).click();
    const betcount = await page.locator(betSlipPageObject.betSlipBetTitleList).count();
    console.log(`betCount is ${betcount}`);
    const randomRaceCardsAddedNameList = await page.locator(betSlipPageObject.betSlipBetTitleList).allTextContents();
    console.log('bets to add ', randomRaceCardsToAddNameList);
    console.log('bets added ', randomRaceCardsAddedNameList);
    expect([...randomRaceCardsAddedNameList].sort()).toEqual([...randomRaceCardsToAddNameList].sort());
  };

  /** Function to get the count of bets added on bet slip header*/
  const verifyBetCountOnBetSlip = async (page: Page, raceCardOutcomeToAddCount: number): Promise<void> => {
    const raceCardNumberToAddList = await generateRandomRaceCardIndexToAdd(page, raceCardOutcomeToAddCount);
    await addRandomRaceCardOutcome(page, raceCardNumberToAddList);
    await verifyBetCount(page, raceCardOutcomeToAddCount);
  };

  /** Function to verify bet count on bet slip */

  const verifyBetCount = async (page: Page, raceCardOutcomeToAddCount): Promise<void> => {
    await page.locator(betSlipPageObject.betSlipButton).click();
    const betTitleCount = await page.locator(betSlipPageObject.betSlipBetTitleList).count();
    expect(betTitleCount).toEqual(raceCardOutcomeToAddCount);
    const betCountOnBetSlip = (await page.locator(betSlipPageObject.betCount).first().textContent())!;
    expect(parseInt(betCountOnBetSlip, 10)).toEqual(raceCardOutcomeToAddCount);
  };

  return {
    verifySelectedRaceCard: async (page: Page, selectedRaceCard: string): Promise<void> => verifySelectedRaceCard(page, selectedRaceCard),
    addRaceCardOutcomeAndVerifyOnBetSlip: async (page: Page, raceCardOutcomeToAddCount: number): Promise<void> => addRaceCardOutcomeAndVerifyOnBetSlip(page, raceCardOutcomeToAddCount),
    verifyBetCountOnBetSlip: async (page: Page, raceCardOutcomeToAddCount: number): Promise<void> => verifyBetCountOnBetSlip(page, raceCardOutcomeToAddCount),
  };
};
