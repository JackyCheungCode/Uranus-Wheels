# Customer Portal — Phase 0

## Scope delivered
- Supabase Auth email/password registration, sign-in, sign-out, email verification redirect, and password recovery UI.
- Shared site navigation entry: My Account.
- Customer account routes: /account, /account/login, /account/register.
- Customer profile record with self-service profile fields.
- Authenticated RFQ ownership: signed-in submissions from the product configurator, Custom Builder, Contact Us, and Dealer enquiry form attach the authenticated user ID.
- Customer dashboard lists only the signed-in user's own enquiry records.
- Guest submissions remain possible and are not made readable to anonymous users.

## Database and authorization
- customer_profiles.user_id references auth.users.id; RLS restricts SELECT/INSERT/UPDATE to auth.uid().
- wheel_enquiries.user_id is nullable for guest enquiries and references auth.users.id.
- Authenticated enquiry SELECT is restricted to auth.uid() = user_id.
- Authenticated enquiry INSERT requires user_id = auth.uid() and retains the existing input constraints.
- Existing anonymous INSERT-only intake remains available; no anonymous SELECT policy is added.
- No service-role key is used in browser code.

## Deferred work
- Secure claim/linking of pre-existing guest enquiries after verified-email ownership proof.
- Enquiry conversation threads, attachments and internal notes.
- Quote versions and customer acceptance.
- Sales orders, PI/contracts, payment milestones, production events and shipment tracking.
- Organization accounts and multiple company members.
- Transactional email notifications and a production SMTP delivery check.

## Verification
- Supabase migration applied and schema/policy presence queried.
- Supabase Security Advisor returned no lints after the migration.
- Worker upload validation succeeded and Preview deployment was assigned 100% traffic.
- Browser-level registration, confirmation-email delivery, password recovery and signed-in end-to-end RFQ submission still require live browser testing.
- Configure Supabase Auth Site URL and redirect allow-list to include the Preview and production domains before enabling public account registration. Confirm custom SMTP is configured for reliable customer verification and password-reset email delivery.
