# KIVORA Marketplace — expanded catalogue and seller matching update

This update is based on the uploaded KIVORA Intro Fix files.

## What's included
- Keeps the 7-second black-and-gold KIVORA introduction.
- Keeps the current Supabase project URL and public publishable key already present in `app.js`.
- Expands the shopper and seller category catalogue to cover common global shopping departments.
- Adds broader search matching for everyday product terms and synonyms (for example, "earphones" can match audio/headphone listings; "fridge" can match refrigerator listings).
- Searches seller product name, category, store name and description.
- Loads active seller listings from the Supabase `products` table and shows them ahead of sample catalogue previews.
- Clearly labels sample catalogue entries as previews and actual seller entries as seller listings.
- Keeps the responsive storefront, cart, account modal and seller product photo upload.

## Important: how product matching works
KIVORA does not claim to have every item in stock. The catalogue provides broad categories and search matching. When a seller publishes a product through the seller upload form, that real listing is stored in Supabase and becomes searchable to shoppers. If nobody has listed the item, KIVORA should not pretend that it is available. Sample cards are illustrative previews, not confirmed stock or offers.

## Publish to your existing GitHub Pages site
1. Open the existing repository: https://github.com/Sile-dev/KIVORA-marketplace
2. Open the repository's root folder.
3. Replace `index.html`, `style.css`, and `app.js` with the matching files from this ZIP.
4. Keep `kivora-logo.png` and `supabase_setup.sql` in the repository.
5. Commit the changes to the branch used by GitHub Pages.
6. Wait for GitHub Pages to redeploy, then open https://sile-dev.github.io/KIVORA-marketplace/ and refresh.

Do not create a new repository or change the GitHub Pages settings.

## Supabase requirement for real seller listings
The SQL file `supabase_setup.sql` creates the products table, row-level security policies and public `product-images` storage bucket. If it has not already been run, run it once in Supabase Dashboard → SQL Editor. Do not repeatedly run it unless needed.

The browser app uses only the Supabase public publishable key. Never put a Supabase service-role key in frontend files.

## Still not live / must be integrated before taking real orders
- Public email verification may still be limited by Supabase's default email sender. Configure a production SMTP provider.
- Real payment processing, refunds, shipping labels, delivery tracking, buyer protection and dispute handling are not activated by this storefront update.
- Sample catalogue prices and images are demonstration content and are not seller offers.


## KIVORA AI customer care (new)
The storefront now includes a floating KIVORA AI chat assistant. It can answer broad questions, explain the currently implemented account/seller flows, help shoppers search the supplied catalogue, and direct users to human support when a policy or feature is not confirmed.

### Important: activate the AI backend
The chat interface is included in the website, but AI replies require deploying the Supabase Edge Function and adding an OpenAI API key. The secret is stored only on Supabase; it is NOT placed in browser JavaScript.

1. Install the Supabase CLI on a computer, or use a development environment that supports Supabase CLI.
2. From the project folder, run:
   `supabase login`
   `supabase link --project-ref izqgesrvwhdftumenhtz`
3. Set the secret:
   `supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY`
4. Deploy the function:
   `supabase functions deploy kivora-support`
5. Ensure `supabase/config.toml` is included when deploying. The function accepts public visitor requests so shoppers do not have to log in just to ask for help.
6. Commit the updated website files (`index.html`, `style.css`, `app.js`) to the existing GitHub repository and wait for GitHub Pages to redeploy.

OpenAI API usage may incur charges under the API account. The assistant does not process refunds, place orders, access private account data, or invent delivery/payment policies. Checkout/payment processing is still not configured in this storefront. Human help: https://wa.me/2348127817057

### Deploying from a phone
The ZIP includes the Edge Function source. Supabase's web dashboard may not provide a direct editor/deploy flow for Edge Functions in every account. If you only have a phone, the easiest reliable option is to use GitHub Codespaces or another browser-based terminal to run the CLI commands above.


## Passwordless registration and login (new)
- Registration asks for name, email, phone, account type, country, state, city and optional street/postcode. No password is created.
- Both registration and later login use a one-time code sent to the email address. The code proves inbox access; never share it.
- After successful code verification, the app saves the member profile in `public.profiles`.
- A separate welcome/registration email is not automatically sent by the browser code. Configure Supabase SMTP and an Auth email template/provider if you want a branded email separate from the one-time code.
- Run the updated `supabase_setup.sql` in Supabase SQL Editor to create the profiles table and row-level security policies. Existing products/storage setup is retained.

## Optional location sharing
- Location permission is requested only after the member presses **SHARE MY LOCATION (OPTIONAL)**. No location is requested on page load.
- If permission is denied or unavailable, the member can still shop and use the site.
- If granted, latitude/longitude, accuracy and timestamp are saved to that member's profile. Ordinary members can read only their own profile. An administrator can view all profiles after the project owner manually grants `is_admin=true` to the administrator account in SQL Editor.
- Do not make location sharing a condition of browsing or purchasing. Provide a clear privacy notice before launch and define retention/deletion procedures.

## Supabase email settings
Configure production SMTP in Supabase Authentication settings and use an email template that clearly displays the one-time code (`{{ .Token }}`). The current default Supabase sender may be rate-limited. Test signup and login with separate email addresses before public launch.


## Visual refresh
This build adds an editorial, image-led department discovery grid, stronger marketplace hierarchy, upgraded product-card interactions, richer hero and promotional banners, and a compact marketplace promise strip. It preserves the existing Supabase client configuration, account flow, seller flow, product rendering and AI support integration.


## Campus Mart-inspired, original KIVORA visual refresh
This build uses the supplied Campus Mart screenshot as a reference for clear mobile marketplace navigation and product discovery, while retaining an original KIVORA layout, typography, category structure and black/gold/white identity. It does not reuse Campus Mart branding or copy its visual assets.

### Updated experience
- Reworked the storefront visual hierarchy with a dark premium masthead, gold-accented search, category navigation, seller shortcuts, collection cards, product rails and a mobile quick-navigation dock.
- Fixed malformed category markup in the home page.
- Added a dedicated `account.html` page with passwordless email-code login and registration using the same existing Supabase project and public key. Buyer/seller role and profile data are saved to the existing `profiles` table.
- Rebuilt `seller.html` as a seller-centre landing page and added a deep link to the existing seller product upload flow.
- Rebuilt `support.html` as a help centre.
- Preserved `app.js`, the existing product catalogue, Supabase SQL, logo and Edge Function source except for routing account/seller navigation to their dedicated pages.

### Publish
Replace the website files in the root of the existing GitHub Pages repository with the files in this ZIP. Keep the `supabase` folder and run `supabase_setup.sql` only if the database setup has not already been completed. Do not change the existing Supabase project URL or public key.

### Important readiness note
The storefront, email-code authentication and seller product upload flow are included. Payment processing, order fulfilment, shipping integrations, refund handling and production-grade seller verification are not activated. Do not accept real payments until those services are configured and tested.
