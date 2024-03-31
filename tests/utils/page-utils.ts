import { type Page } from '@playwright/test';
import * as dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

export class PageUtils {
  /**
   * Navigates to a specific URL constructed from the given hostname and path.
   * @param page The Page object from Playwright.
   * @param hostname The base part of the URL.
   * @param path The path to append to the hostname.
   */
  static async navigateTo(page: Page, hostname: string, path: string): Promise<void> {
    const url = `${hostname}${path}`;
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Generates a list of unique random numbers within a specified range.
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
   * @param count The number of unique random numbers to generate.
   * @returns An array of unique random numbers.
   */
  static generateListOfUniqueRandomNumbers(min: number, max: number, count: number): number[] {
    if (max - min < 1) {
      throw new Error('Range too small for the desired number of unique numbers.');
    }

    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers).sort((a, b) => a - b);
  }

  /**
   * Parses a string value to a boolean.
   * @param value The string to parse.
   * @returns The boolean value of the string.
   */
  static parseStringToBoolean(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
  }
}
