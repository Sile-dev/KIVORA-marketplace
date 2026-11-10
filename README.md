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
