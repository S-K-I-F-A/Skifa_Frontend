import { test, expect } from "@playwright/test";
import { interns } from "../src/data/interns";
const emptyEntitlements = {
  pro: false,
  walletActive: false,
  profileVisible: false,
  companyActive: false,
};
test.beforeEach(async ({ page }) => {
  await page.route("**/api/entitlements", (route) =>
    route.fulfill({ json: emptyEntitlements }),
  );
  await page.route("**/api/checkout", (route) =>
    route.fulfill({ status: 503, json: { message: "Not connected" } }),
  );
  await page.route("**/api/confirmation-email", (route) =>
    route.fulfill({ status: 503, json: { message: "Not connected" } }),
  );
});
async function responsive(page: import("@playwright/test").Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page
      .locator('[class~="bg-accent"],[class~="!bg-accent"]')
      .filter({ visible: true }),
  ).toHaveCount(1);
}
test("Nigeria mock data has 12 interns and structured skills", () => {
  expect(interns).toHaveLength(12);
  expect(interns.filter((person) => person.idVerified)).toHaveLength(8);
  expect(interns.filter((person) => !person.idVerified)).toHaveLength(4);
  expect(
    interns.every(
      (person) =>
        person.country === "Nigeria" &&
        person.skills.every(
          (skill) =>
            skill.name &&
            ["Beginner", "Intermediate", "Professional"].includes(skill.level),
        ),
    ),
  ).toBe(true);
});
test("homepage has Nigeria copy and four talent cards", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Skifa connects ID-verified Nigerian interns with startups and SMEs.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Talent on Skifa" }).getByRole("link"),
  ).toHaveCount(5);
  await responsive(page);
  await page.screenshot({
    path: "test-results/home-" + test.info().project.name + ".png",
    fullPage: true,
  });
});
test("directory filters and profile Pro placeholder retain their layouts", async ({
  page,
}) => {
  await page.goto("/talent");
  if (test.info().project.name === "phone")
    await page.getByRole("button", { name: /Filters/ }).click();
  await page.getByLabel("State", { exact: true }).selectOption("Lagos");
  await page
    .getByLabel("Skill level", { exact: true })
    .selectOption("Professional");
  await page
    .getByLabel("Experience", { exact: true })
    .selectOption("1-2 years");
  await page
    .getByLabel("Verification", { exact: true })
    .selectOption("verified");
  await expect(page.getByText("2 interns", { exact: true })).toBeVisible();
  await page.getByLabel("Skill", { exact: true }).fill("React");
  await expect(page.getByText("1 intern", { exact: true })).toBeVisible();
  await page
    .getByRole("link", { name: /Amara Okafor Frontend developer/ })
    .click();
  await expect(page.getByText("Locked Pro video placeholder")).toBeVisible();
  await expect(
    page.getByText("Company accounts only", { exact: true }),
  ).toHaveCount(5);
  await responsive(page);
});
test("NIN wizard preserves validation, upload, selfie and masked review", async ({
  page,
}) => {
  await page.goto("/intern/verify-id");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "11 digits",
  );
  await page.getByLabel("National Identification Number").fill("12345678901");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Front of NIN slip/ }).click();
  await page.getByRole("button", { name: /Back of NIN slip/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Take selfie/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("NIN ••• ••• •901", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("12345678901", { exact: true })).toHaveCount(0);
  await responsive(page);
  await page.getByLabel("These documents are mine and valid.").check();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "NIN verification", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Wallet activated (temporary preview only)").check();
  await page.goto("/intern/wallet");
  await expect(
    page.getByRole("button", { name: "Withdraw", exact: true }),
  ).toBeVisible();
});
test("wallet starts locked and dashboard uses the same placeholder", async ({
  page,
}) => {
  await page.goto("/intern/wallet");
  await expect(page.getByText("000", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Wallet locked")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Withdraw", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Activate Wallet", exact: true }),
  ).toBeVisible();
  await responsive(page);
  await page.goto("/intern/dashboard");
  await expect(page.getByText("000", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Wallet activation", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Make profile visible", exact: true }),
  ).toBeVisible();
  await responsive(page);
});
test("intern signup pays last, allows later payment, and does not claim email delivery", async ({
  page,
}) => {
  await page.goto("/signup/intern");
  await page.getByLabel("Full name", { exact: true }).fill("Amara Okafor");
  await page.getByLabel("Email", { exact: true }).fill("amara@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page
    .getByLabel("Nigerian state", { exact: true })
    .selectOption("Lagos");
  await page.getByLabel("City", { exact: true }).fill("Ikeja");
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(
    page.getByRole("heading", { name: "Personal info", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Professional headshot (required)", { exact: true })
    .setInputFiles({
      name: "headshot.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await page.getByLabel("Headline", { exact: true }).fill("Frontend intern");
  await page
    .getByLabel("About Me (Tell us about yourself and your skills.)", {
      exact: true,
    })
    .fill("I build accessible interfaces for small businesses.");
  await page.getByLabel("Phone", { exact: true }).fill("+2348030000000");
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByLabel("I'm self-taught").check();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "React", exact: true }).click();
  await page
    .getByLabel("React level", { exact: true })
    .selectOption("Professional");
  await page
    .getByLabel("Search skills", { exact: true })
    .fill("Web accessibility");
  await page
    .getByRole("button", {
      name: "+ Add custom skill: Web accessibility",
      exact: true,
    })
    .click();
  await page
    .getByLabel("Experience", { exact: true })
    .selectOption("3-5 years");
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(
    page.getByRole("heading", { name: "Review your profile", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/React \(Professional\)/)).toBeVisible();
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Pay to Make Profile Visible",
      exact: true,
    }),
  ).toBeVisible();
  await responsive(page);
  await page.getByRole("button", { name: "Pay later", exact: true }).click();
  await expect(
    page.getByText(
      "Your profile is not visible yet. You can pay later from your dashboard.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resend email", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("not connected");
});
test("company skip preserves profile and cannot unlock talent by local state", async ({
  page,
}) => {
  await page.goto("/signup/company");
  await page.getByLabel("Work email").fill("team@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Company name", { exact: true }).fill("Example Labs");
  await page
    .getByLabel("Industry", { exact: true })
    .selectOption("Software & SaaS");
  await page.getByLabel("Staff size").selectOption("1-10");
  await page
    .getByLabel("Nigerian state", { exact: true })
    .selectOption("Lagos");
  await page.getByLabel("City", { exact: true }).fill("Ikeja");
  await page.getByLabel("Street address").fill("1 Example Street");
  await page.getByLabel("Brief description").fill("We build useful software.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Contact person").fill("Amara Okafor");
  await page.getByLabel("Your position in the company").fill("Founder");
  await page.getByLabel("Phone", { exact: true }).fill("+2348030000000");
  await page.getByLabel("Contact email").fill("amara@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await responsive(page);
  await page
    .getByRole("button", {
      name: "Skip for now and preview my profile",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Example Labs", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Founder", { exact: true })).toBeVisible();
  await responsive(page);
  await page.goto("/talent/amara-okafor");
  await expect(
    page.getByText("Company accounts only", { exact: true }),
  ).toHaveCount(5);
});
test("notifications filter, empty state and unread bell stay in sync", async ({
  page,
}) => {
  await page.goto("/intern/notifications");
  await expect(
    page.getByRole("link", { name: "Notifications, 5 unread" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Offer updates", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No notifications yet" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Payments", exact: true }).click();
  await expect(
    page.getByText("Placement payment update", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark all as read", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Notifications, 0 unread" }),
  ).toBeVisible();
  await responsive(page);
});
test("Pro gate ignores local entitlement tampering and fails closed without payment service", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("skifa-pro", "true"));
  await page.goto("/intern/video-cv");
  await expect(
    page.getByRole("tab", { name: "record", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "Video CV is a Pro feature. Upgrade to Pro to record or upload your 60-second video.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Upgrade to Pro", exact: true }).click();
  await page
    .getByRole("button", { name: "Continue to upgrade", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("not connected");
  await responsive(page);
});
