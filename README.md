# LEAFCROSS-X

Next.js and Supabase rebuild for Leaf Cross Biomedical.

## First build scope

- Public frontend stays close to the current WordPress site.
- Extracted WordPress assets live in `public/assets/extracted`.
- Additional exported assets can be dropped into `public/assets/source-drop`.
- The rotating nug section is implemented with Three.js via React Three Fiber.
- Medical patient and veteran workflows are intentionally excluded.
- Retailer, manager, and admin areas are scaffolded for the new B2B-only system.

## Business rules captured

- Age gate: `I am 19+`.
- Payment methods: E-Transfer, Bank Wire, Direct Deposit.
- E-Transfer placeholder: `info@leafcross.com`.
- Payment must be received before shipment.
- GST: `5%`.
- Flat shipping: `$28.99`.
- Invoice format: `INV-2026-000001`, with a continuous counter.
- Existing retailers are manually imported.
- Expired retailer licenses block product menu access and ordering.
- Retailers can cancel orders only while unpaid.
- Product spec sheets are not downloadable by retailers.
- Monthly subscription is retained as a manual retailer recurring-order workflow.

## Imported extraction files

- Image assets copied from `/Users/rahuljoshi/Downloads/leafcross_images` into `public/assets/wordpress`.
- CSV exports copied into `wordpress-extract/csv`.
- Technical audit PDFs copied into `wordpress-extract/reports`.
- Medical patient slider assets are preserved in the raw import folder for traceability, but are not used by the public rebuild UI.

## Setup

```bash
npm install
npm run dev
```

Create `.env.local` before wiring Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
