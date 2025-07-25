import { test as base } from "@playwright/test"

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      document.addEventListener(
        "click",
        (event) => {
          const el = event.target
          if (el instanceof HTMLElement) {
            el.style.outline = "3px solid red"
            el.style.transition = "outline 0.2s ease-in-out"
            setTimeout(() => {
              el.style.outline = ""
            }, 500)
          }
        },
        true,
      )
    })
    await use(page)
  },
})