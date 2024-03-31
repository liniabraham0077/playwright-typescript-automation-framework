/** Locators for home page */

export const homePageObject = {
  sportsBetLogo: '[data-automation-id="sportsbet-logo"]',
  getGroupCarousel(group: number, carousel: number): string {
    return '[data-automation-id="group-' + group + '-carousel-' + carousel + '-header-title"]';
  },
  getNthHorse(horseNumber: number): string {
    return '[data-automation-id="group-1-carousel-1-body-container-cell-' + horseNumber + '"]';
  },
  getCarouselCellTitle(carousel: number, cell: number): string {
    return '[data-automation-id="carousel-' + carousel + '-cell-' + cell + '-event-title"]';
  },
};
