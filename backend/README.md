# Guides
- [Step-by-Step Guide to Secure JWT Authentication with Refresh Tokens in Express.js, TypeScript, and Prisma](https://medium.com/@gigi.shalamberidze2022/implementing-secure-authentication-authorization-in-express-js-with-jwt-typescript-and-prisma-087c90596889)

# Adding routes
- Register each domain's routes in its own file first. E.g. `auth.route.ts`
- Initiate routes in `app.ts`

# Stripe payment

Visit: https://dashboard.stripe.com/ to get your secret stripe key, use sandbox for testing purpose
Simulated card information for testing: 

- Card number: 4242424242424242
- Any future date for expire date, and random 3 numbers for cvc
