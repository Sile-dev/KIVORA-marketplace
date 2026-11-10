# KIVORA Marketplace — redesigned storefront

This version keeps the KIVORA animated opening and changes the storefront into a responsive marketplace layout:
- Full-screen black-and-gold opening animation with moving orbiting dots; it remains for 7 seconds.
- Desktop layout uses a vertical category menu, wide central hero, and quick-action panel.
- Horizontal category navigation and horizontally scrolling product shelves, plus a full product grid.
- Mobile layout rearranges for phone screens with horizontal swipe product rows.
- Preloaded sample catalogue includes named phones, computers, bags, fashion, home, beauty, sports and accessories with product photographs.
- Visitors can browse and add products to cart before signing in.
- Supabase Auth and seller photo upload remain connected to the provided project details.

## Publish
Replace the files in the existing `Sile-dev/KIVORA-marketplace` GitHub repository with the contents of this folder. Keep the same GitHub Pages settings.

## Supabase
The website contains the Supabase project URL and public publishable key provided by the owner. Run `supabase_setup.sql` in the Supabase SQL Editor if it has not already been run. Set the Supabase Auth Site URL and Redirect URL to:
`https://sile-dev.github.io/KIVORA-marketplace/`

## Important
- Catalogue prices are indicative demonstration prices, not live quotes or guaranteed stock. Sellers must confirm product model, storage, condition, warranty and current price.
- Product photos are used as catalogue previews. Some product images may be illustrative where exact official imagery is not available.
- Secure payment processing, actual order placement, refunds, shipping updates and AI-connected customer care are not yet activated. Do not accept real payments/orders until those backend services are implemented.
- Only a Supabase public publishable key is included in frontend code. Never put a service-role or secret key in the browser.
