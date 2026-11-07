# Customer Portal — Phase 0

## Scope delivered
- Supabase Auth email/password registration, sign-in, sign-out, email verification redirect, and password recovery UI.
- Shared site navigation entry: My Account.
- Customer account routes: /account, /account/login, /account/register.
- Customer profile record with self-service profile fields.
- Authenticated RFQ ownership: signed-in submissions from the product configurator, Custom Builder, Contact Us, and Dealer enquiry form attach the authenticated user ID.
- Customer dashboard lists only the signed-in user's own enquiry records, including status and a detail view.
- Customers can send follow-up messages in a private enquiry conversation thread.
- Internal `/staff/enquiries` desk supports staff/admin review, status updates and replies.
- Staff authorization uses trusted `app_metadata.role` values (`staff` or `admin`), never user-editable metadata.
- Enquiry status lifecycle fields are available for the future sales workflow.
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

## Staff access setup
- Open the intended staff user's record in Supabase Auth and assign `app_metadata.role` to `staff` or `admin` using a trusted administrative method.
- Do not put this role in `user_metadata`; users can edit their own user metadata.
- After changing app metadata, have the staff user refresh/sign in again so the JWT contains the updated claim.
- Staff workspace: `/staff/enquiries`. It is protected in the UI and independently protected by RLS policies.

## Quotations — Phase 1
- Staff can create and issue a quotation against an enquiry from `/staff/enquiries`.
- Quotation records are versioned per enquiry and retain currency, item description/quantity/unit price, subtotal, shipping, total, Incoterm® 2020 code, named place, payment terms, delivery estimate, validity date, customer notes and internal-only notes.
- Customers can review issued quotations in the matching enquiry detail and accept or decline with an optional message.
- Customer decisions are stored separately and a database trigger updates quote status; acceptance also advances the enquiry status to `accepted`.
- Customer response RLS verifies ownership, issued status and validity date. Trigger function execution is revoked from API roles.
- Current composer supports one line item per quotation. Multi-line quotations, PDF generation, email notifications, customer PO, and automatic order conversion remain future work.
- Quote acceptance records commercial intent only; it does not create a sales order, collect payment, or constitute a signed PI / Sales Contract.

## Formal sales orders — Phase 1
- Staff can convert a customer-accepted quotation into a formal sales order from `/staff/enquiries` after reviewing it.
- One accepted quotation can create at most one sales order. The database snapshots the accepted quotation's line items, currency, amounts, Incoterm, named place, payment terms, delivery estimate, validity and customer notes; later quotation edits cannot silently change the order snapshot.
- Sales orders are linked to the registered customer account and the originating enquiry. Orders can only be created by authorized staff/admin users from an accepted quotation.
- Initial order status is `order_confirmed`. Staff can update the order lifecycle through PI issued, awaiting payment, payment received, production, quality inspection, ready to ship, shipped, delivered, completed or cancelled.
- Status changes are recorded in `wheel_order_events` and displayed in the customer's My Orders timeline. Customers can only read their own orders and customer-visible events; internal-only events remain staff-only.
- This phase does not yet generate PI PDFs, collect payments, generate signed contracts, or integrate production/QC/carrier systems. Status changes are operational records, not proof of payment or shipment.
