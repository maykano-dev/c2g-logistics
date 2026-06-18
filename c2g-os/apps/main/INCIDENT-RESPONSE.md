# C2G Logistics Incident Response Playbook

## 1. Database Credentials Compromised
**Symptoms:** Unauthorized DB modifications, unusual queries logged, leaked credentials on internet.
**Actions:**
1. Go to Supabase Project Settings -> Database -> Database Passwords and generate a new password.
2. Go to Supabase Project Settings -> API and roll the `anon_key` and `service_role_key`.
3. Update Vercel Environment Variables immediately with new keys.
4. Redeploy all Vercel apps to pick up new keys.
5. In Supabase Dashboard, force sign-out all users by deleting all active sessions in `user_sessions` and calling Supabase API to invalidate JWTs.

## 2. Customer Account Breach
**Symptoms:** Customer reports unauthorized orders, anomalous login alerts triggered.
**Actions:**
1. Manually lock the user account in Supabase Dashboard (Auth -> Users -> Suspend).
2. Use `enforceSessionLimit(userId, 0)` equivalent to wipe all their active sessions.
3. Review `order_activity_feed` and `audit_logs` to see what the attacker did.
4. Contact customer via phone/email to verify identity.
5. Trigger password reset link to their verified email.

## 3. Forged Webhook Requests (Hubtel)
**Symptoms:** Payments marked as "paid" without actual funds in Hubtel dashboard.
**Actions:**
1. Rotate `HUBTEL_WEBHOOK_SECRET` in Vercel.
2. Update webhook URL in Hubtel Dashboard to a new path if secret rotation fails.
3. Identify affected orders via `order_status_history` and revert them to `pending_payment`.
4. Temporarily disable Hubtel webhook handler route if under active attack.

## 4. Dependency Vulnerability Discovered (CVE)
**Symptoms:** `pnpm audit` flags critical severity vulnerability.
**Actions:**
1. Run `pnpm update <package-name>` to install patched version.
2. If patch breaks app, use `pnpm overrides` in package.json to force a secure sub-dependency version.
3. Commit, push, and monitor Vercel build.

## 5. DDoS or Rate Limit Bypass
**Symptoms:** Extreme latency, Vercel bandwidth spiking, DB connections maxed.
**Actions:**
1. Enable "Under Attack Mode" or strict IP rate limiting in Cloudflare/Vercel Edge Network.
2. Block offending ASNs/Countries via Vercel Firewall.
3. Temporarily decrease `MAX_ATTEMPTS` in `utils/security.ts`.
