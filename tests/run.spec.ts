import { test, expect } from '@playwright/test';
import 'dotenv/config'

const email = process.env.MF_EMAIL as string;
const password = process.env.MF_PASSWORD as string;

const workStartTime = process.env.WORK_START_TIME as string;
const workEndTime = process.env.WORK_END_TIME as string;

const month = 3;

test('test', async ({ page }) => {

  // Go to https://attendance.moneyforward.com/employee_session/new
  await page.goto('https://attendance.moneyforward.com/employee_session/new');

  // Click text=マネーフォワード IDでログイン
  await page.locator('text=マネーフォワード IDでログイン').click();

  // Fill [placeholder="example\@moneyforward\.com"]
  await page.locator('[placeholder="example\\@moneyforward\\.com"]').fill(email);

  // Click text=同意してログインする
  await page.locator('text=同意してログインする').click();

  // Fill input[name="mfid_user\[password\]"]
  await page.locator('input[name="mfid_user\\[password\\]"]').fill(password);

  // Click input:has-text("ログインする")
  await page.locator('input:has-text("ログインする")').click();
  await expect(page).toHaveURL('https://attendance.moneyforward.com/my_page');

  await page.goto(`https://attendance.moneyforward.com/my_page/attendances?day=1&month=${month}&year=2022`);

  // Click button >> nth=1
  await page.locator('button').nth(1).click();

  const elements = await page.$$('.attendance-table-row-error');
  for (let i = 0; i < elements.length; i++) {
    // Click .attendance-table-row-error #kt-attendance-table-contents-column-edit .attendance-text-link >> nth=0
    await page.locator('.attendance-table-row-error #kt-attendance-table-contents-column-edit .attendance-text-link').first().click();

    // Click text=打刻を追加
    await page.locator('text=打刻を追加').click();

    // Click text=打刻を追加
    await page.locator('text=打刻を追加').click();

    await page.locator('select[name="attendance_form\\[attendance_record_forms_attributes\\]\\[1\\]\\[event\\]"]').selectOption('clock_out')

    // Fill input[name="attendance_form\[attendance_record_forms_attributes\]\[0\]\[time\]"]
    await page.locator('input[name="attendance_form\\[attendance_record_forms_attributes\\]\\[0\\]\\[time\\]"]').fill(workStartTime);

    // Fill input[name="attendance_form\[attendance_record_forms_attributes\]\[1\]\[time\]"]
    await page.locator('input[name="attendance_form\\[attendance_record_forms_attributes\\]\\[1\\]\\[time\\]"]').fill(workEndTime);

    // Click text=保存
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://attendance.moneyforward.com/my_page/attendances?day=28&month=2&year=2022' }*/),
      page.locator('text=保存').click()
    ]);

  }

});