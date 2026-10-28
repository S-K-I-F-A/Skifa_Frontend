# 13 October UI/UX review implementation

## Frontend coverage

- Existing talent directory/profile and four-step NIN wizard preserved and covered by the browser suite.
- Nigeria-only state/city fields and +234 phone default.
- One shared WALLET_PLACEHOLDER constant; inactive intern wallet is locked.
- Seven-step intern signup: Account → Personal info → Education → Skills & availability → Certifications & work samples → Review → Pay to Make Profile Visible.
- Pay later saves a private profile. Required headshot, optional full-body photo, structured skills, per-skill levels, experience and searchable/custom skills are supported.
- Company signup can skip activation to /company/profile-preview. Full talent access requires a confirmed company entitlement.
- Notifications with category tabs, unread indicators, an unread bell, read actions and empty states.
- Video CV is unavailable until the backend confirms Pro access; checkout and video upload require successful backend responses.
- Four homepage talent cards and six company dashboard talent cards.
- Purple is limited to the wizard progress bar or a single main action/action card elsewhere.

## Backend is not implemented

No backend was provided. Account persistence is a local browser preview; no password, NIN or card details are persisted. Notifications are sample data. Temporary wallet activation controls explicitly affect only preview state.

The frontend expects these authenticated backend endpoints (default /api, or NEXT_PUBLIC_BACKEND_URL):

- GET /entitlements → { pro, walletActive, profileVisible, companyActive } (booleans).
- POST /checkout → accepts { purpose, returnUrl }; returns { url }. Purposes: profile_visibility, company_activation, pro.
- POST /confirmation-email → accepts { email }; returns { sent }.
- POST /video-cv → multipart video; returns { saved }.

The backend must enforce authentication, ownership, Pro access, payment confirmation/webhooks, NIN verification, wallet activation, media validation and actual email delivery. The frontend never grants Pro or company access from a local paid flag. Confirmation-email success copy is shown only when the service confirms delivery.

## Open decisions preserved

The currency remains USD. The meaning of 000 and the placement/HR commission process are unchanged. No SST tiers, grades or rankings were added. Skill proficiency levels and the explicitly requested Pro video feature are independent of SST.

## Verification

- TypeScript: node node_modules/typescript/bin/tsc --noEmit
- Lint: node node_modules/eslint/bin/eslint.js app components screens src lib config tests playwright.config.ts
- Build: node node_modules/next/dist/bin/next build
- Browser: npm run test:e2e (Microsoft Edge; desktop 1440×1000 and phone 390×844).
- Screenshots: test-results/ (ignored by Git).
