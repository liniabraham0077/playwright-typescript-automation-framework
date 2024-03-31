import { type Page } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export const pageUtils = () => {
  /** Function to navigate to a specific url for a */

  const navigateTo = async (page: Page, hostname: string, path: string) => {
    const url = hostname + path;
    console.log(`url is ${url}`);
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
  };

  /** Function to generate 'N' number of unique random numbers as a list*/

  function generateListOfUniqueRandomNumbers(min: number, max: number, count: number): number[] {
    if (max - min < 1) {
      throw new Error('Range too small for two unique numbers.');
    }

    const uniqueNumbers = new Set<number>();

    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers).sort((numberOne, numberTwo) => numberOne - numberTwo);
  }

  function parseStringToBoolean(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
  }

  return {
    navigateTo: async (page: Page, hostname: string, path: string) => navigateTo(page, hostname, path),
    generateListOfUniqueRandomNumbers: (min: number, max: number, count: number): number[] => generateListOfUniqueRandomNumbers(min, max, count),
    parseStringToBoolean: (value: string): boolean => parseStringToBoolean(value),
  };
};
