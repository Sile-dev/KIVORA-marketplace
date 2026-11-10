# KIVORA Marketplace — upgraded starter

## Included
- Four-second animated KIVORA intro followed by a public storefront (no forced sign-in).
- Product search, category filters, product cards with product photography, and a local cart.
- Supabase Auth configured with the project URL and public publishable key supplied by the owner.
- Seller product upload and image storage using the existing `product-images` bucket.
- WhatsApp customer-care contact.
- Clear notice that checkout is not live and no real payments/orders are processed.

## Deploy
1. Upload the contents of this `kivora` folder to the existing `Sile-dev/KIVORA-marketplace` GitHub repository, replacing the old site files.
2. In Supabase, open SQL Editor and run `supabase_setup.sql` if you have not already run it.
3. In Supabase → Authentication → URL Configuration, set Site URL to:
   `https://sile-dev.github.io/KIVORA-marketplace/`
   Add that same URL to Redirect URLs.
4. Wait for GitHub Pages to redeploy, then test public browsing, signup/login and seller image upload.

## Important
- The frontend contains only the Supabase project URL and public publishable key. Never put a Supabase service-role/secret key in browser code.
- Sample products and prices are illustrative catalogue previews, not verified live stock or guaranteed market quotes. Sellers must replace them with accurate listings.
- Secure checkout, real orders, refunds, shipping status and an AI-connected support agent are not activated in this static frontend. They require server-side services, payment gateway/webhook configuration and a support backend.
- Sample product photos are hosted by Unsplash. Seller-uploaded photos are stored in the Supabase `product-images` bucket.
