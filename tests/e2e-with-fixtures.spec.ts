import { customtest } from '../Fixture/fixture';
import { PageObjectManager } from '../Pages/page-object-manager';

customtest('verify created order in history', async ({ loginpage, creatorder, dataset }) => {
  const pageObjectManager = new PageObjectManager(loginpage);
  const orderHistoryPage = pageObjectManager.getOrderHistoryPage();

  await orderHistoryPage.verifyOrderInHistory(dataset.productName, creatorder);
  console.log(dataset.welcomeMessage);

});


//npx playwright test e2e-with-fixtures.spec.ts --project=chromium --workers=1