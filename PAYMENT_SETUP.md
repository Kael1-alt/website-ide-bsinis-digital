# Kaelstore payments and order admin

The storefront uses Midtrans Snap and a local SQLite database. It starts in **sandbox** mode; the sandbox cannot collect real money. COD orders can be recorded without a Midtrans account.

## Requirements

- Node.js 22.5 or newer (the server uses the built-in `node:sqlite` module).
- A Midtrans merchant account with the desired payment channels enabled.
- A publicly reachable HTTPS deployment for Midtrans payment notifications when you move beyond local testing.
- Public hosting must terminate HTTPS and keep the application listener private behind a trusted reverse proxy.

## Configure and run locally

1. Copy `.env.example` to `.env`.
2. Set `MIDTRANS_SERVER_KEY` to the **sandbox Server Key** from Midtrans Dashboard → Settings → Access Keys. Never put this key in browser code or commit it.
3. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` to separate, long random values. These enable the admin login (`admin@kaelstore.com`) and seller approval. The admin password is rotated locally and kept in the ignored `.env`; do not commit it or use the example placeholders as credentials.
4. Keep `MIDTRANS_IS_PRODUCTION=false` and `PUBLIC_BASE_URL=http://localhost:3000` for local sandbox testing.
5. Run `npm start`, then open `http://localhost:3000/storefront.html`.

The SQLite database is created at `data/orders.sqlite`. Accounts, hashed passwords, seller approvals, product ownership, purchase history, and sales are stored on the server. Passwords must be at least 12 characters and are hashed with Node.js `scrypt` using a random salt. Login attempts are rate-limited per client IP. Login sessions use `HttpOnly`, `SameSite=Strict` cookies instead of storing bearer tokens in browser storage; production mode also adds the `Secure` cookie flag. The browser never supplies trusted product prices: the server checks product IDs, quantities, shipping fees, and totals against its catalog.

The server binds to `127.0.0.1` by default so login credentials and bearer sessions are not exposed through a plain-HTTP listener on the local network. For a public deployment, put it behind an HTTPS-terminating reverse proxy on the same host and keep port 3000 private. Only set `HOST=0.0.0.0` when a trusted private network/proxy and firewall prevent direct public HTTP access; never expose this HTTP server directly to the internet.

New accounts are buyers by default. During registration a user may request seller access; the account remains a buyer until an admin approves the request. Sign in with `admin@kaelstore.com` and the configured `ADMIN_PASSWORD` to approve sellers at `/account.html`. An approved seller can claim a product that has not been claimed, publish products, update their own product names/prices, and review sales in their account dashboard. Product ownership is assigned to the first seller who claims an unowned sample product.

Buyers see only purchases associated with their signed-in server account. Sellers see only sales lines for products they own; orders containing products from multiple shops cannot have shipment status changed by one seller and must be coordinated by the admin. Admins can view all orders and manage fulfillment. Old browser-only demo accounts and localStorage orders are not migrated because they have no server-verified identity.

For stable sessions across server restarts, set a private random `ADMIN_SESSION_SECRET`. Without it, a temporary key is generated at startup and users must sign in again after a restart. Set `ADMIN_PASSWORD` to enable the admin account and seller approvals.

## Payment channels and automatic confirmation

The checkout sends QRIS, e-wallet (GoPay/ShopeePay), PayLater (Kredivo/Akulaku), and bank-transfer orders to Midtrans Snap. A channel only appears if it is enabled and approved for the merchant account. COD is recorded locally and marked as due on delivery.

In the Midtrans Dashboard, set the payment notification URL to:

`https://YOUR-DOMAIN/api/payments/midtrans/notification`

Midtrans webhooks are verified against `signature_key` using the server key. The server updates payment status in SQLite; the customer status page and admin page read that server-side status. Do not expose the notification endpoint through a static-only host or use the sandbox endpoint with production credentials.

For a public deployment, set `PUBLIC_BASE_URL` to the HTTPS storefront origin and use the matching production Server Key only after the merchant has been approved and tested. Set `MIDTRANS_IS_PRODUCTION=true` at that point. Keep `.env` private and protect the server behind HTTPS; the app listener must remain private.

## Admin orders

Open `/account.html` for the buyer purchase history, seller sales dashboard, and admin seller-approval overview. Admins can also open `/orders-admin.html` to manage the latest 300 orders. Admin access is enforced by the server, not just by hiding the page. The panel lists payment state, customer details, products, and lets an admin move eligible fulfillment from processing to shipped, then delivered (or cancel a failed/COD order). Online orders cannot ship until payment is confirmed. A paid order cannot be cancelled there; refunds must be handled through Midtrans separately.

## Important demo limitations

- The storefront checkout explicitly identifies itself as a local demo. Sandbox payments do not charge real money.
- This project does not connect to a real courier, calculate live shipping rates, or create shipment labels.
- Keep the server running for checkout, status lookups, admin access, and webhooks. A static hosting service alone is not sufficient.
- The sample product catalog must be updated in both `script.js` and `payment-server.js` when products or prices change.

Run the backend tests with `npm test`.
