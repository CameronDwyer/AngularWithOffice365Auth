import { SiteWithAuthPage } from './app.po';

describe('site-with-auth App', () => {
  let page: SiteWithAuthPage;

  beforeEach(() => {
    page = new SiteWithAuthPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
