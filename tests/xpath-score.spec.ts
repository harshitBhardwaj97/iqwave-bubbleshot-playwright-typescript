import { Constants } from "../constants/constants"
import { expect, test } from "@playwright/test"
import { faker } from "@faker-js/faker"

test.beforeEach(async ({ page }) => {
  await page.goto(`${Constants.BASE_URL}`)
})

test(`xpath score`, async ({ page }) => {
  test.setTimeout(Constants.TEST_TIMEOUT)

  const nameInput = "//input[@placeholder='Your Name']"
  const startGameButton = "//button[.='Start Game']"
  const leaderBoardHeading = "//h1[.='LEADERBOARD']"

  const currentTargetTemplate = "//div[contains(@class,'w-10 h-10 flex')]/p[.='%s']"
  const currentScore = page.locator("//div[@class='min-w-full']//ul//li[3]//span").first()
  const finalScore = page.locator("//span[contains(@class,'bg-green-200 px-2')]").first()
  const target = page.locator("//div[@class='min-w-full']//ul//li[1]//span").first()
  const currentTimeLeftLocator = page.locator("//div[@class='min-w-full']//ul//li[2]//span").first()

  const now = new Date()
  const timestamp = now.toTimeString().split(" ")[0].replace(/:/g, "")
  const randomName = `${faker.person.firstName().toLowerCase()}_xpath_${timestamp}`

  await page.locator(nameInput).fill(randomName)
  await page.locator(startGameButton).click()
  await expect(page.locator(leaderBoardHeading)).toBeVisible()

  let isTimeUp = false
  console.log("starting game")
  let currentTimeLeft = await currentTimeLeftLocator.textContent()
  console.log(`current time left - ${currentTimeLeft}`)

  while (!isTimeUp) {
    try {
      const currentTimeLeft = await currentTimeLeftLocator.textContent()
      const targetValue = await target.textContent()

      if (currentTimeLeft?.trim() === "0") {
        isTimeUp = true
        break
      }

      const dynamicTargetXpath = currentTargetTemplate.replace("%s", targetValue?.trim() || "")
      const elementToHit = page.locator(dynamicTargetXpath).first()

      // use js click for better performance in fast-paced clicking
      const handle = await elementToHit.elementHandle()
      if (handle) {
        await page.evaluate((el) => (el as HTMLElement).click(), handle)
      } else {
        console.warn(`⚠️ elementHandle was null for target value "${targetValue}"`)
        break
      }

      const scoreText = await currentScore.textContent()
      console.log(`${currentTimeLeft?.trim()} seconds left, ${scoreText?.trim()} scored`)
    } catch (e) {
      console.warn("⚠️ exception occurred:", e)
      break
    }
  }

  await expect(finalScore).toBeVisible()
  const final = await finalScore.textContent()
  console.log(`🎯 final score using xpath locators - ${final?.trim()}`)
})