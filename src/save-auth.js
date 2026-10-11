const { chromium } = require('playwright');

(async () => {
  // 1. Launch a headed browser so you can physically interact with it
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 2. Navigate to your PANKHUDI portal
  // Replace the placeholder URL below with the actual portal address
  await page.goto('https://pankhudi.wcd.gov.in');

  console.log('\n=========================================================');
  console.log('👉 ACTION REQUIRED:');
  console.log('1. Go to the opened browser window and manually log in.');
  console.log('2. Complete any MFA/OTP prompts if required.');
  console.log('3. Once you are fully logged in and on the dashboard/landing page:');
  console.log('   Come back to this terminal and press [ENTER] to save.');
  console.log('=========================================================\n');

  // Wait for the user to press Enter in the terminal
  await new Promise(resolve => process.stdin.once('data', resolve));

  // 3. Save the storage state (cookies, local storage) to a JSON file
  await context.storageState({ path: 'pankhudi-state.json' });
  console.log('✅ Success! Storage state saved to "pankhudi-state.json"');

  // 4. Close the browser
  await browser.close();
  process.exit(0);
})();