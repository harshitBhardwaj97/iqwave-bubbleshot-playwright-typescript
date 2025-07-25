import { Constants } from "../constants/constants"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto(`${Constants.BASE_URL}`)
})

test(`name is required test`, async ({ page }) => {
  await page.locator("//button[.='Start Game']").click()
  await expect(page.locator("//p[.='Please Enter Your Name']")).toBeVisible()
})