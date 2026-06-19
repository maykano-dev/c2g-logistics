[
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 2,
    "column_name": "admin_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 3,
    "column_name": "telegram_chat_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 4,
    "column_name": "notifications_enabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 5,
    "column_name": "notification_types",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: admin_settings ===",
    "col_order": 7,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 2,
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 3,
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 4,
    "column_name": "department",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 5,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'open'::character varying"
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 6,
    "column_name": "priority",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'medium'::character varying"
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 7,
    "column_name": "assignee_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 8,
    "column_name": "related_entity_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 9,
    "column_name": "related_entity_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 10,
    "column_name": "created_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 11,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: admin_tasks ===",
    "col_order": 12,
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 3,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 4,
    "column_name": "email",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 5,
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 6,
    "column_name": "role",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'admin'::character varying"
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 7,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'active'::character varying"
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 8,
    "column_name": "totp_secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 9,
    "column_name": "totp_enabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: admins ===",
    "col_order": 10,
    "column_name": "master_pin",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 2,
    "column_name": "affiliate_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 3,
    "column_name": "order_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 4,
    "column_name": "order_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 5,
    "column_name": "order_total",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 6,
    "column_name": "amount",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "1.50"
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 7,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 8,
    "column_name": "customer_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 9,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'settled'::text"
  },
  {
    "section": "=== TABLE: affiliate_earnings ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 3,
    "column_name": "affiliate_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 4,
    "column_name": "social_accounts",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'[]'::jsonb"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 5,
    "column_name": "application_reason",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 6,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 7,
    "column_name": "reviewed_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 8,
    "column_name": "reviewed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 9,
    "column_name": "rejection_reason",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 10,
    "column_name": "balance",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 11,
    "column_name": "total_earned",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 12,
    "column_name": "total_referrals",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 13,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 14,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: affiliate_profiles ===",
    "col_order": 15,
    "column_name": "whatsapp_number",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "nextval('announcements_id_seq'::regclass)"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 2,
    "column_name": "title",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 3,
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 4,
    "column_name": "type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'info'::character varying"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 5,
    "column_name": "icon",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'bell'::text"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 6,
    "column_name": "action_label",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 7,
    "column_name": "action_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 8,
    "column_name": "is_active",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 9,
    "column_name": "start_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 10,
    "column_name": "end_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 11,
    "column_name": "target_audience",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'all'::character varying"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 12,
    "column_name": "priority",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 13,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: announcements ===",
    "col_order": 14,
    "column_name": "created_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 3,
    "column_name": "action",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 4,
    "column_name": "entity_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 5,
    "column_name": "entity_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 6,
    "column_name": "details",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 7,
    "column_name": "ip_address",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 8,
    "column_name": "user_agent",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: audit_logs ===",
    "col_order": 9,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: auth_rate_limits ===",
    "col_order": 1,
    "column_name": "ip_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: auth_rate_limits ===",
    "col_order": 2,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "section": "=== TABLE: auth_rate_limits ===",
    "col_order": 3,
    "column_name": "attempt_count",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "1"
  },
  {
    "section": "=== TABLE: auth_rate_limits ===",
    "col_order": 4,
    "column_name": "first_attempt_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: auth_rate_limits ===",
    "col_order": 5,
    "column_name": "locked_until",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: captcha_challenges ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: captcha_challenges ===",
    "col_order": 2,
    "column_name": "answer",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: captcha_challenges ===",
    "col_order": 3,
    "column_name": "used",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: captcha_challenges ===",
    "col_order": 4,
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "(now() + '00:05:00'::interval)"
  },
  {
    "section": "=== TABLE: captcha_challenges ===",
    "col_order": 5,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 2,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 3,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 4,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 5,
    "column_name": "subject",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 6,
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 7,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'new'::text"
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 8,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: contact_inquiries ===",
    "col_order": 9,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 3,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 4,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 5,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 6,
    "column_name": "street_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 7,
    "column_name": "city",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 8,
    "column_name": "region",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 9,
    "column_name": "postal_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 10,
    "column_name": "country",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'Ghana'::text"
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 11,
    "column_name": "is_primary",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 12,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: customer_addresses ===",
    "col_order": 13,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 3,
    "column_name": "author_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 4,
    "column_name": "author_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 5,
    "column_name": "note_text",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customer_notes ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 3,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 4,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 5,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 6,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'active'::text"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 8,
    "column_name": "customer_unique_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "('CUS-'::text || lpad((((random() * (999999)::double precision))::integer)::text, 6, '0'::text))"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 9,
    "column_name": "role",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'customer'::text"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 10,
    "column_name": "telegram_chat_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 11,
    "column_name": "telegram_notifications_enabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 12,
    "column_name": "referred_by_affiliate_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: customers ===",
    "col_order": 13,
    "column_name": "referral_code_used",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 3,
    "column_name": "customer_name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 4,
    "column_name": "customer_phone",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 5,
    "column_name": "customer_email",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 6,
    "column_name": "shipping_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 7,
    "column_name": "shipping_notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 8,
    "column_name": "items",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 9,
    "column_name": "subtotal",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 10,
    "column_name": "service_fee",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 11,
    "column_name": "total_amount",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 12,
    "column_name": "payment_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending'::character varying"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 13,
    "column_name": "order_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending_payment'::character varying"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 14,
    "column_name": "payment_reference",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 15,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 16,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 17,
    "column_name": "shipping_method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'sea'::text"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 18,
    "column_name": "estimated_delivery",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 19,
    "column_name": "shipping_cost",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 20,
    "column_name": "shipping_fee_paid",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 21,
    "column_name": "shipping_fee_payment_reference",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 22,
    "column_name": "order_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 23,
    "column_name": "payment_gateway",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 24,
    "column_name": "payment_details",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 25,
    "column_name": "shipment_start_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 26,
    "column_name": "estimated_duration_days",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "45"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 27,
    "column_name": "rate_at_purchase",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 28,
    "column_name": "importer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 29,
    "column_name": "total_cost_ghs",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 30,
    "column_name": "total_profit_ghs",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00"
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 31,
    "column_name": "procurement_cycle_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: ecom_orders ===",
    "col_order": 32,
    "column_name": "procurement_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 3,
    "column_name": "full_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 4,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 5,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 6,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 7,
    "column_name": "notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 8,
    "column_name": "approved_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 9,
    "column_name": "approved_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 11,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: employees ===",
    "col_order": 12,
    "column_name": "staff_role",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 2,
    "column_name": "media_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 3,
    "column_name": "public_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 4,
    "column_name": "resource_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'image'::character varying"
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 5,
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: gallery_submissions ===",
    "col_order": 6,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending'::character varying"
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 3,
    "column_name": "business_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 4,
    "column_name": "store_slug",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 5,
    "column_name": "business_description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 6,
    "column_name": "whatsapp",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 7,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 8,
    "column_name": "ghana_card",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 9,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 10,
    "column_name": "wallet_balance",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.00"
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 11,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: importers ===",
    "col_order": 12,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 3,
    "column_name": "tracking_number",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 4,
    "column_name": "items_description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 5,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending'::character varying"
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 6,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: incoming_packages ===",
    "col_order": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: login_attempts ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: login_attempts ===",
    "col_order": 2,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: login_attempts ===",
    "col_order": 3,
    "column_name": "ip",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "section": "=== TABLE: login_attempts ===",
    "col_order": 4,
    "column_name": "attempted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 3,
    "column_name": "notification_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 4,
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 5,
    "column_name": "channel",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "'telegram'::character varying"
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 6,
    "column_name": "sent",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 7,
    "column_name": "error_message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 8,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 9,
    "column_name": "read_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 10,
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: notification_log ===",
    "col_order": 11,
    "column_name": "data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 3,
    "column_name": "title",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 4,
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 5,
    "column_name": "type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 6,
    "column_name": "is_read",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: notifications ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 2,
    "column_name": "order_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 3,
    "column_name": "author_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 4,
    "column_name": "activity_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 5,
    "column_name": "content",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_activity_feed ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 2,
    "column_name": "order_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 3,
    "column_name": "old_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 4,
    "column_name": "new_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 5,
    "column_name": "old_payment_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 6,
    "column_name": "new_payment_status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 7,
    "column_name": "changed_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 8,
    "column_name": "changed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 9,
    "column_name": "notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_history ===",
    "col_order": 10,
    "column_name": "change_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'status_change'::character varying"
  },
  {
    "section": "=== TABLE: order_status_log ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: order_status_log ===",
    "col_order": 2,
    "column_name": "order_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_log ===",
    "col_order": 3,
    "column_name": "previous_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_log ===",
    "col_order": 4,
    "column_name": "new_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: order_status_log ===",
    "col_order": 5,
    "column_name": "changed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 3,
    "column_name": "type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 4,
    "column_name": "customer_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 5,
    "column_name": "total",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'0'::numeric"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 6,
    "column_name": "payment_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'paid'::text"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 7,
    "column_name": "order_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 8,
    "column_name": "items",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'[]'::jsonb"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 9,
    "column_name": "product_link",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'link'::text"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 10,
    "column_name": "cny_price",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'0'::numeric"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 11,
    "column_name": "quantity",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 12,
    "column_name": "estimated_weight_kg",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": "'0'::double precision"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 13,
    "column_name": "notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 14,
    "column_name": "screenshot_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 16,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 17,
    "column_name": "customer_unique_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 18,
    "column_name": "shipping_mode",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'air'::text"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 19,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 20,
    "column_name": "product_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 21,
    "column_name": "order_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 22,
    "column_name": "payment_reference",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 23,
    "column_name": "shipment_start_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 24,
    "column_name": "estimated_duration_days",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "45"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 25,
    "column_name": "shipping_cost",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 26,
    "column_name": "shipping_fee_paid",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 27,
    "column_name": "shipping_fee_payment_reference",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: orders ===",
    "col_order": 28,
    "column_name": "item_tracking_numbers",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "nextval('payment_reconciliation_logs_id_seq'::regclass)"
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 3,
    "column_name": "total_checked",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 4,
    "column_name": "recovered",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 5,
    "column_name": "still_pending",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 6,
    "column_name": "errors",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payment_reconciliation_logs ===",
    "col_order": 7,
    "column_name": "details",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 2,
    "column_name": "affiliate_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 3,
    "column_name": "amount",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 4,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 5,
    "column_name": "payment_method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 6,
    "column_name": "payment_details",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 7,
    "column_name": "processed_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 8,
    "column_name": "processed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 9,
    "column_name": "admin_notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: payout_requests ===",
    "col_order": 11,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: procurement_cycles ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: procurement_cycles ===",
    "col_order": 2,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: procurement_cycles ===",
    "col_order": 3,
    "column_name": "cutoff_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: procurement_cycles ===",
    "col_order": 4,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'open'::text"
  },
  {
    "section": "=== TABLE: procurement_cycles ===",
    "col_order": 5,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 2,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 3,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 4,
    "column_name": "is_primary",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 5,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 6,
    "column_name": "public_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_images ===",
    "col_order": 7,
    "column_name": "media_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'image'::character varying"
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 2,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 3,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 4,
    "column_name": "rating",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 5,
    "column_name": "review_text",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: product_reviews ===",
    "col_order": 7,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 2,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 3,
    "column_name": "sku",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 4,
    "column_name": "price",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 5,
    "column_name": "stock",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 6,
    "column_name": "variant_options",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 8,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 9,
    "column_name": "image_public_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 10,
    "column_name": "price_cny",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 11,
    "column_name": "combination",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 12,
    "column_name": "cost_price_cny",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: product_variants ===",
    "col_order": 13,
    "column_name": "selling_price_ghs",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 3,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 4,
    "column_name": "sku",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 5,
    "column_name": "price",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'0'::numeric"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 6,
    "column_name": "stock",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 7,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'draft'::text"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 8,
    "column_name": "category",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 9,
    "column_name": "image",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 10,
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 11,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 12,
    "column_name": "product_link",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 13,
    "column_name": "is_trending",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 14,
    "column_name": "is_promotion",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 15,
    "column_name": "promotion_order",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 16,
    "column_name": "view_count",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 17,
    "column_name": "sales_count",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 18,
    "column_name": "created_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 19,
    "column_name": "forced_shipping_method",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 20,
    "column_name": "general_options_prices",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 21,
    "column_name": "service_fee_applicable",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 22,
    "column_name": "embedding",
    "data_type": "USER-DEFINED",
    "udt_name": "vector",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 23,
    "column_name": "price_cny",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 24,
    "column_name": "general_options_prices_cny",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 25,
    "column_name": "importer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 26,
    "column_name": "product_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 27,
    "column_name": "source_platform",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 28,
    "column_name": "source_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 29,
    "column_name": "cost_price_cny",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: products ===",
    "col_order": 30,
    "column_name": "selling_price_ghs",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 3,
    "column_name": "internal_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 4,
    "column_name": "headline",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 5,
    "column_name": "subtext",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 6,
    "column_name": "media_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'image'::text"
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 7,
    "column_name": "media_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 8,
    "column_name": "media_url_thumbnail",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 9,
    "column_name": "link_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 10,
    "column_name": "action_label",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 11,
    "column_name": "is_active",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 12,
    "column_name": "link",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 13,
    "column_name": "thumbnail_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 14,
    "column_name": "public_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 15,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: promotions ===",
    "col_order": 16,
    "column_name": "image_transform",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 3,
    "column_name": "endpoint",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 4,
    "column_name": "p256dh",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 5,
    "column_name": "auth",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: push_subscriptions ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 2,
    "column_name": "package_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 3,
    "column_name": "inspector_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 4,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending'::character varying"
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 5,
    "column_name": "notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 6,
    "column_name": "photos",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "section": "=== TABLE: qc_inspections ===",
    "col_order": 7,
    "column_name": "inspected_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: recently_viewed ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: recently_viewed ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: recently_viewed ===",
    "col_order": 3,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: recently_viewed ===",
    "col_order": 4,
    "column_name": "viewed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 2,
    "column_name": "scanned_tracking",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 3,
    "column_name": "scan_result",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 4,
    "column_name": "package_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 5,
    "column_name": "package_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 6,
    "column_name": "customer_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 7,
    "column_name": "items_description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 8,
    "column_name": "current_status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: scan_logs ===",
    "col_order": 9,
    "column_name": "scanned_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 3,
    "column_name": "store_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'C2G Mall\t'::text"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 4,
    "column_name": "public_email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'support@example.com\t'::text"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 5,
    "column_name": "public_phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'+233 00 000 0000\t'::text"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 6,
    "column_name": "warehouse_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 7,
    "column_name": "air_rate_per_kg",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'85'::numeric"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 8,
    "column_name": "air_base_fee",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'50'::numeric"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 9,
    "column_name": "sea_rate_per_kg",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'35'::numeric"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 10,
    "column_name": "sea_base_fee",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": "'200'::numeric"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 11,
    "column_name": "maintenance_mode",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 12,
    "column_name": "payment_gateway",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'paystack'::text"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 13,
    "column_name": "hubtel_client_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 14,
    "column_name": "hubtel_client_secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 15,
    "column_name": "hubtel_merchant_account",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 16,
    "column_name": "hubtel_test_mode",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 17,
    "column_name": "hubtel_api_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 18,
    "column_name": "hubtel_api_key",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 19,
    "column_name": "hubtel_callback_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 20,
    "column_name": "rate_link_orders",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.52"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 21,
    "column_name": "rate_shop_products",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.52"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 22,
    "column_name": "exchange_rate_cny_to_ghs",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "1.92"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 23,
    "column_name": "exchange_rate_ghs_to_cny",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.52"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 24,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 25,
    "column_name": "maintenance_pages",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 26,
    "column_name": "rates",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 27,
    "column_name": "usd_ghs_rate",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "15.50"
  },
  {
    "section": "=== TABLE: settings ===",
    "col_order": 28,
    "column_name": "payment_rates",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb"
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 2,
    "column_name": "share_code",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 3,
    "column_name": "cart_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 4,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 5,
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "(now() + '30 days'::interval)"
  },
  {
    "section": "=== TABLE: shared_carts ===",
    "col_order": 6,
    "column_name": "access_count",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 3,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "auth.uid()"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 4,
    "column_name": "tracking_number",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 5,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'''in-transit'''::text"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 6,
    "column_name": "carrier",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 7,
    "column_name": "origin",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 8,
    "column_name": "destination",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 9,
    "column_name": "current_location",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 10,
    "column_name": "eta_days",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 11,
    "column_name": "items_description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 12,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 13,
    "column_name": "total_weight_kg",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": "'0'::double precision"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 14,
    "column_name": "associated_order_ids",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 15,
    "column_name": "customer_contact",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 16,
    "column_name": "customer_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 17,
    "column_name": "method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 18,
    "column_name": "shipping_cost",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 19,
    "column_name": "customer_unique_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 20,
    "column_name": "shipping_fee_paid",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 21,
    "column_name": "shipping_fee_payment_reference",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 22,
    "column_name": "order_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 23,
    "column_name": "shipment_start_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 24,
    "column_name": "estimated_duration_days",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "45"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 25,
    "column_name": "registration_fee_paid",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 26,
    "column_name": "registration_fee_payment_reference",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shipments ===",
    "col_order": 27,
    "column_name": "arrival_photo_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 2,
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 3,
    "column_name": "image_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 4,
    "column_name": "image_public_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 5,
    "column_name": "link_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 6,
    "column_name": "audience",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'all'::character varying"
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 7,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'active'::character varying"
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 8,
    "column_name": "start_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 9,
    "column_name": "end_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 11,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: shop_ads ===",
    "col_order": 12,
    "column_name": "frequency_per_24h",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "1"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 2,
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 3,
    "column_name": "platform",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 4,
    "column_name": "store_link",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 5,
    "column_name": "contact_info",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 6,
    "column_name": "total_orders",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 7,
    "column_name": "success_rate",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "100.00"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 8,
    "column_name": "avg_delivery_days",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": "0.0"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 9,
    "column_name": "disputes",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "section": "=== TABLE: suppliers ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 2,
    "column_name": "related_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 3,
    "column_name": "related_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 4,
    "column_name": "issue_text",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 5,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'open'::text"
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 6,
    "column_name": "created_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 7,
    "column_name": "created_by_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 8,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 9,
    "column_name": "resolved_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: support_escalations ===",
    "col_order": 10,
    "column_name": "resolved_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: system_settings ===",
    "col_order": 1,
    "column_name": "key",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: system_settings ===",
    "col_order": 2,
    "column_name": "value",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: system_settings ===",
    "col_order": 3,
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: system_settings ===",
    "col_order": 4,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: system_settings ===",
    "col_order": 5,
    "column_name": "updated_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 2,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 3,
    "column_name": "message_text",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 4,
    "column_name": "channel",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'telegram'::text"
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 5,
    "column_name": "audience",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'all'::text"
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 6,
    "column_name": "created_by",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_broadcasts ===",
    "col_order": 7,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'sent'::text"
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 3,
    "column_name": "chat_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 4,
    "column_name": "direction",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 5,
    "column_name": "message_text",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 6,
    "column_name": "is_read",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 8,
    "column_name": "media_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_messages ===",
    "col_order": 9,
    "column_name": "media_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 3,
    "column_name": "token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 4,
    "column_name": "chat_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 5,
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "(now() + '00:10:00'::interval)"
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 6,
    "column_name": "used",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: telegram_verification_tokens ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 2,
    "column_name": "tracking_number",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 3,
    "column_name": "weight",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 4,
    "column_name": "cbm",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 5,
    "column_name": "arrival_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 6,
    "column_name": "notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 7,
    "column_name": "photos",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 8,
    "column_name": "status",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "'pending'::character varying"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 9,
    "column_name": "assigned_customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: unmatched_packages ===",
    "col_order": 11,
    "column_name": "resolved_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 3,
    "column_name": "label",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 4,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 5,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 6,
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 7,
    "column_name": "street_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 8,
    "column_name": "delivery_notes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 9,
    "column_name": "is_primary",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_addresses ===",
    "col_order": 11,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_dismissed_announcements ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "nextval('user_dismissed_announcements_id_seq'::regclass)"
  },
  {
    "section": "=== TABLE: user_dismissed_announcements ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_dismissed_announcements ===",
    "col_order": 3,
    "column_name": "announcement_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_dismissed_announcements ===",
    "col_order": 4,
    "column_name": "dismissed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 3,
    "column_name": "email_notifications",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 4,
    "column_name": "whatsapp_notifications",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 5,
    "column_name": "order_updates",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 6,
    "column_name": "promotional_emails",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_preferences ===",
    "col_order": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "nextval('user_searches_id_seq'::regclass)"
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 2,
    "column_name": "search_query",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 3,
    "column_name": "search_date",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 4,
    "column_name": "ip_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 5,
    "column_name": "user_agent",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_searches ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 3,
    "column_name": "ip_address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 4,
    "column_name": "user_agent",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 5,
    "column_name": "last_active_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: user_sessions ===",
    "col_order": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 2,
    "column_name": "location",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 3,
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 4,
    "column_name": "address",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 5,
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 6,
    "column_name": "is_default",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: warehouse_addresses ===",
    "col_order": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: wishlist ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: wishlist ===",
    "col_order": 2,
    "column_name": "customer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: wishlist ===",
    "col_order": 3,
    "column_name": "product_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: wishlist ===",
    "col_order": 4,
    "column_name": "variant_id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "section": "=== TABLE: wishlist ===",
    "col_order": 5,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 1,
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 2,
    "column_name": "importer_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 3,
    "column_name": "amount",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 4,
    "column_name": "momo_number",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 5,
    "column_name": "momo_network",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 6,
    "column_name": "status",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "section": "=== TABLE: withdrawals ===",
    "col_order": 8,
    "column_name": "processed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  }
]



[
  {
    "from_table": "affiliate_earnings",
    "from_column": "affiliate_id",
    "to_table": "affiliate_profiles",
    "to_column": "id",
    "constraint_name": "affiliate_earnings_affiliate_id_fkey"
  },
  {
    "from_table": "affiliate_earnings",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "affiliate_earnings_customer_id_fkey"
  },
  {
    "from_table": "affiliate_profiles",
    "from_column": "user_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "affiliate_profiles_user_id_fkey"
  },
  {
    "from_table": "affiliate_profiles",
    "from_column": "reviewed_by",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "affiliate_profiles_reviewed_by_fkey"
  },
  {
    "from_table": "customer_notes",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "customer_notes_customer_id_fkey"
  },
  {
    "from_table": "customers",
    "from_column": "referred_by_affiliate_id",
    "to_table": "affiliate_profiles",
    "to_column": "id",
    "constraint_name": "customers_referred_by_affiliate_id_fkey"
  },
  {
    "from_table": "ecom_orders",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "ecom_orders_customer_id_fkey"
  },
  {
    "from_table": "ecom_orders",
    "from_column": "importer_id",
    "to_table": "importers",
    "to_column": "id",
    "constraint_name": "ecom_orders_importer_id_fkey"
  },
  {
    "from_table": "incoming_packages",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "incoming_packages_customer_id_fkey"
  },
  {
    "from_table": "notification_log",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "notification_log_customer_id_fkey"
  },
  {
    "from_table": "order_activity_feed",
    "from_column": "order_id",
    "to_table": "orders",
    "to_column": "id",
    "constraint_name": "order_activity_feed_order_id_fkey"
  },
  {
    "from_table": "order_status_history",
    "from_column": "order_id",
    "to_table": "ecom_orders",
    "to_column": "id",
    "constraint_name": "order_status_history_order_id_fkey"
  },
  {
    "from_table": "order_status_log",
    "from_column": "order_id",
    "to_table": "ecom_orders",
    "to_column": "id",
    "constraint_name": "order_status_log_order_id_fkey"
  },
  {
    "from_table": "orders",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "orders_product_id_fkey"
  },
  {
    "from_table": "payout_requests",
    "from_column": "processed_by",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "payout_requests_processed_by_fkey"
  },
  {
    "from_table": "payout_requests",
    "from_column": "affiliate_id",
    "to_table": "affiliate_profiles",
    "to_column": "id",
    "constraint_name": "payout_requests_affiliate_id_fkey"
  },
  {
    "from_table": "product_images",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "product_images_product_id_fkey"
  },
  {
    "from_table": "product_reviews",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "product_reviews_product_id_fkey"
  },
  {
    "from_table": "product_variants",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "product_variants_product_id_fkey"
  },
  {
    "from_table": "products",
    "from_column": "importer_id",
    "to_table": "importers",
    "to_column": "id",
    "constraint_name": "products_importer_id_fkey"
  },
  {
    "from_table": "qc_inspections",
    "from_column": "package_id",
    "to_table": "incoming_packages",
    "to_column": "id",
    "constraint_name": "qc_inspections_package_id_fkey"
  },
  {
    "from_table": "recently_viewed",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "recently_viewed_product_id_fkey"
  },
  {
    "from_table": "shipments",
    "from_column": "order_id",
    "to_table": "ecom_orders",
    "to_column": "id",
    "constraint_name": "shipments_order_id_fkey"
  },
  {
    "from_table": "shipments",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "shipments_customer_id_fkey"
  },
  {
    "from_table": "telegram_messages",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "telegram_messages_customer_id_fkey"
  },
  {
    "from_table": "telegram_verification_tokens",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "telegram_verification_tokens_customer_id_fkey"
  },
  {
    "from_table": "unmatched_packages",
    "from_column": "assigned_customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "unmatched_packages_assigned_customer_id_fkey"
  },
  {
    "from_table": "user_addresses",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "user_addresses_customer_id_fkey"
  },
  {
    "from_table": "user_dismissed_announcements",
    "from_column": "announcement_id",
    "to_table": "announcements",
    "to_column": "id",
    "constraint_name": "user_dismissed_announcements_announcement_id_fkey"
  },
  {
    "from_table": "user_preferences",
    "from_column": "customer_id",
    "to_table": "customers",
    "to_column": "id",
    "constraint_name": "user_preferences_customer_id_fkey"
  },
  {
    "from_table": "wishlist",
    "from_column": "variant_id",
    "to_table": "product_variants",
    "to_column": "id",
    "constraint_name": "wishlist_variant_id_fkey"
  },
  {
    "from_table": "wishlist",
    "from_column": "product_id",
    "to_table": "products",
    "to_column": "id",
    "constraint_name": "wishlist_product_id_fkey"
  },
  {
    "from_table": "withdrawals",
    "from_column": "importer_id",
    "to_table": "importers",
    "to_column": "id",
    "constraint_name": "withdrawals_importer_id_fkey"
  }
]



[
  {
    "tablename": "admin_settings",
    "indexname": "admin_settings_admin_id_key",
    "indexdef": "CREATE UNIQUE INDEX admin_settings_admin_id_key ON public.admin_settings USING btree (admin_id)"
  },
  {
    "tablename": "admin_settings",
    "indexname": "admin_settings_pkey",
    "indexdef": "CREATE UNIQUE INDEX admin_settings_pkey ON public.admin_settings USING btree (id)"
  },
  {
    "tablename": "admin_settings",
    "indexname": "idx_admin_settings_admin_id",
    "indexdef": "CREATE INDEX idx_admin_settings_admin_id ON public.admin_settings USING btree (admin_id)"
  },
  {
    "tablename": "admin_settings",
    "indexname": "idx_admin_settings_notifications_enabled",
    "indexdef": "CREATE INDEX idx_admin_settings_notifications_enabled ON public.admin_settings USING btree (notifications_enabled)"
  },
  {
    "tablename": "admin_settings",
    "indexname": "idx_admin_settings_telegram_chat_id",
    "indexdef": "CREATE INDEX idx_admin_settings_telegram_chat_id ON public.admin_settings USING btree (telegram_chat_id)"
  },
  {
    "tablename": "admin_tasks",
    "indexname": "admin_tasks_pkey",
    "indexdef": "CREATE UNIQUE INDEX admin_tasks_pkey ON public.admin_tasks USING btree (id)"
  },
  {
    "tablename": "admin_tasks",
    "indexname": "idx_admin_tasks_assignee",
    "indexdef": "CREATE INDEX idx_admin_tasks_assignee ON public.admin_tasks USING btree (assignee_id)"
  },
  {
    "tablename": "admin_tasks",
    "indexname": "idx_admin_tasks_department",
    "indexdef": "CREATE INDEX idx_admin_tasks_department ON public.admin_tasks USING btree (department)"
  },
  {
    "tablename": "admin_tasks",
    "indexname": "idx_admin_tasks_status",
    "indexdef": "CREATE INDEX idx_admin_tasks_status ON public.admin_tasks USING btree (status)"
  },
  {
    "tablename": "admins",
    "indexname": "admins_pkey",
    "indexdef": "CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id)"
  },
  {
    "tablename": "admins",
    "indexname": "admins_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX admins_user_id_key ON public.admins USING btree (user_id)"
  },
  {
    "tablename": "affiliate_earnings",
    "indexname": "affiliate_earnings_pkey",
    "indexdef": "CREATE UNIQUE INDEX affiliate_earnings_pkey ON public.affiliate_earnings USING btree (id)"
  },
  {
    "tablename": "affiliate_earnings",
    "indexname": "idx_earnings_affiliate",
    "indexdef": "CREATE INDEX idx_earnings_affiliate ON public.affiliate_earnings USING btree (affiliate_id, created_at DESC)"
  },
  {
    "tablename": "affiliate_earnings",
    "indexname": "idx_earnings_order",
    "indexdef": "CREATE INDEX idx_earnings_order ON public.affiliate_earnings USING btree (order_id)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "affiliate_profiles_affiliate_code_key",
    "indexdef": "CREATE UNIQUE INDEX affiliate_profiles_affiliate_code_key ON public.affiliate_profiles USING btree (affiliate_code)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "affiliate_profiles_pkey",
    "indexdef": "CREATE UNIQUE INDEX affiliate_profiles_pkey ON public.affiliate_profiles USING btree (id)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "affiliate_profiles_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX affiliate_profiles_user_id_key ON public.affiliate_profiles USING btree (user_id)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "idx_affiliate_code",
    "indexdef": "CREATE INDEX idx_affiliate_code ON public.affiliate_profiles USING btree (affiliate_code)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "idx_affiliate_status",
    "indexdef": "CREATE INDEX idx_affiliate_status ON public.affiliate_profiles USING btree (status)"
  },
  {
    "tablename": "affiliate_profiles",
    "indexname": "idx_affiliate_user",
    "indexdef": "CREATE INDEX idx_affiliate_user ON public.affiliate_profiles USING btree (user_id)"
  },
  {
    "tablename": "announcements",
    "indexname": "announcements_pkey",
    "indexdef": "CREATE UNIQUE INDEX announcements_pkey ON public.announcements USING btree (id)"
  },
  {
    "tablename": "announcements",
    "indexname": "idx_announcements_active",
    "indexdef": "CREATE INDEX idx_announcements_active ON public.announcements USING btree (is_active, start_date, end_date)"
  },
  {
    "tablename": "announcements",
    "indexname": "idx_announcements_priority",
    "indexdef": "CREATE INDEX idx_announcements_priority ON public.announcements USING btree (priority DESC)"
  },
  {
    "tablename": "audit_logs",
    "indexname": "audit_logs_pkey",
    "indexdef": "CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id)"
  },
  {
    "tablename": "audit_logs",
    "indexname": "idx_audit_logs_created_at",
    "indexdef": "CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at)"
  },
  {
    "tablename": "audit_logs",
    "indexname": "idx_audit_logs_entity",
    "indexdef": "CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id)"
  },
  {
    "tablename": "audit_logs",
    "indexname": "idx_audit_logs_user_id",
    "indexdef": "CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id)"
  },
  {
    "tablename": "auth_rate_limits",
    "indexname": "auth_rate_limits_pkey",
    "indexdef": "CREATE UNIQUE INDEX auth_rate_limits_pkey ON public.auth_rate_limits USING btree (ip_address, email)"
  },
  {
    "tablename": "captcha_challenges",
    "indexname": "captcha_challenges_expires_at_idx",
    "indexdef": "CREATE INDEX captcha_challenges_expires_at_idx ON public.captcha_challenges USING btree (expires_at)"
  },
  {
    "tablename": "captcha_challenges",
    "indexname": "captcha_challenges_pkey",
    "indexdef": "CREATE UNIQUE INDEX captcha_challenges_pkey ON public.captcha_challenges USING btree (id)"
  },
  {
    "tablename": "captcha_challenges",
    "indexname": "captcha_challenges_used_idx",
    "indexdef": "CREATE INDEX captcha_challenges_used_idx ON public.captcha_challenges USING btree (used)"
  },
  {
    "tablename": "contact_inquiries",
    "indexname": "contact_inquiries_pkey",
    "indexdef": "CREATE UNIQUE INDEX contact_inquiries_pkey ON public.contact_inquiries USING btree (id)"
  },
  {
    "tablename": "contact_inquiries",
    "indexname": "idx_contact_inquiries_created_at",
    "indexdef": "CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries USING btree (created_at DESC)"
  },
  {
    "tablename": "contact_inquiries",
    "indexname": "idx_contact_inquiries_status",
    "indexdef": "CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries USING btree (status)"
  },
  {
    "tablename": "customer_addresses",
    "indexname": "customer_addresses_customer_id_street_address_key",
    "indexdef": "CREATE UNIQUE INDEX customer_addresses_customer_id_street_address_key ON public.customer_addresses USING btree (customer_id, street_address)"
  },
  {
    "tablename": "customer_addresses",
    "indexname": "customer_addresses_pkey",
    "indexdef": "CREATE UNIQUE INDEX customer_addresses_pkey ON public.customer_addresses USING btree (id)"
  },
  {
    "tablename": "customer_addresses",
    "indexname": "idx_customer_addresses_customer_id",
    "indexdef": "CREATE INDEX idx_customer_addresses_customer_id ON public.customer_addresses USING btree (customer_id)"
  },
  {
    "tablename": "customer_addresses",
    "indexname": "idx_customer_addresses_primary",
    "indexdef": "CREATE INDEX idx_customer_addresses_primary ON public.customer_addresses USING btree (customer_id, is_primary) WHERE (is_primary = true)"
  },
  {
    "tablename": "customer_notes",
    "indexname": "customer_notes_pkey",
    "indexdef": "CREATE UNIQUE INDEX customer_notes_pkey ON public.customer_notes USING btree (id)"
  },
  {
    "tablename": "customers",
    "indexname": "customers_id_key",
    "indexdef": "CREATE UNIQUE INDEX customers_id_key ON public.customers USING btree (id)"
  },
  {
    "tablename": "customers",
    "indexname": "customers_pkey",
    "indexdef": "CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id)"
  },
  {
    "tablename": "customers",
    "indexname": "idx_customer_referrer",
    "indexdef": "CREATE INDEX idx_customer_referrer ON public.customers USING btree (referred_by_affiliate_id)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "ecom_orders_order_id_key",
    "indexdef": "CREATE UNIQUE INDEX ecom_orders_order_id_key ON public.ecom_orders USING btree (order_id)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "ecom_orders_pkey",
    "indexdef": "CREATE UNIQUE INDEX ecom_orders_pkey ON public.ecom_orders USING btree (id)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_created_at",
    "indexdef": "CREATE INDEX idx_ecom_orders_created_at ON public.ecom_orders USING btree (created_at)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_customer_id",
    "indexdef": "CREATE INDEX idx_ecom_orders_customer_id ON public.ecom_orders USING btree (customer_id)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_order_id",
    "indexdef": "CREATE INDEX idx_ecom_orders_order_id ON public.ecom_orders USING btree (order_id)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_order_status",
    "indexdef": "CREATE INDEX idx_ecom_orders_order_status ON public.ecom_orders USING btree (order_status)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_payment_reference",
    "indexdef": "CREATE INDEX idx_ecom_orders_payment_reference ON public.ecom_orders USING btree (payment_reference)"
  },
  {
    "tablename": "ecom_orders",
    "indexname": "idx_ecom_orders_payment_status",
    "indexdef": "CREATE INDEX idx_ecom_orders_payment_status ON public.ecom_orders USING btree (payment_status)"
  },
  {
    "tablename": "employees",
    "indexname": "employees_email_idx",
    "indexdef": "CREATE INDEX employees_email_idx ON public.employees USING btree (lower(email))"
  },
  {
    "tablename": "employees",
    "indexname": "employees_pkey",
    "indexdef": "CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree (id)"
  },
  {
    "tablename": "employees",
    "indexname": "employees_status_idx",
    "indexdef": "CREATE INDEX employees_status_idx ON public.employees USING btree (status)"
  },
  {
    "tablename": "employees",
    "indexname": "employees_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX employees_user_id_key ON public.employees USING btree (user_id)"
  },
  {
    "tablename": "gallery_submissions",
    "indexname": "gallery_submissions_pkey",
    "indexdef": "CREATE UNIQUE INDEX gallery_submissions_pkey ON public.gallery_submissions USING btree (id)"
  },
  {
    "tablename": "gallery_submissions",
    "indexname": "idx_gallery_submissions_status",
    "indexdef": "CREATE INDEX idx_gallery_submissions_status ON public.gallery_submissions USING btree (status)"
  },
  {
    "tablename": "gallery_submissions",
    "indexname": "idx_gallery_submissions_submitted_at",
    "indexdef": "CREATE INDEX idx_gallery_submissions_submitted_at ON public.gallery_submissions USING btree (submitted_at)"
  },
  {
    "tablename": "importers",
    "indexname": "importers_pkey",
    "indexdef": "CREATE UNIQUE INDEX importers_pkey ON public.importers USING btree (id)"
  },
  {
    "tablename": "importers",
    "indexname": "importers_store_slug_key",
    "indexdef": "CREATE UNIQUE INDEX importers_store_slug_key ON public.importers USING btree (store_slug)"
  },
  {
    "tablename": "incoming_packages",
    "indexname": "idx_incoming_packages_customer_id",
    "indexdef": "CREATE INDEX idx_incoming_packages_customer_id ON public.incoming_packages USING btree (customer_id)"
  },
  {
    "tablename": "incoming_packages",
    "indexname": "idx_incoming_packages_status",
    "indexdef": "CREATE INDEX idx_incoming_packages_status ON public.incoming_packages USING btree (status)"
  },
  {
    "tablename": "incoming_packages",
    "indexname": "incoming_packages_pkey",
    "indexdef": "CREATE UNIQUE INDEX incoming_packages_pkey ON public.incoming_packages USING btree (id)"
  },
  {
    "tablename": "login_attempts",
    "indexname": "login_attempts_email_idx",
    "indexdef": "CREATE INDEX login_attempts_email_idx ON public.login_attempts USING btree (email, attempted_at)"
  },
  {
    "tablename": "login_attempts",
    "indexname": "login_attempts_pkey",
    "indexdef": "CREATE UNIQUE INDEX login_attempts_pkey ON public.login_attempts USING btree (id)"
  },
  {
    "tablename": "notification_log",
    "indexname": "idx_notification_log_created_at",
    "indexdef": "CREATE INDEX idx_notification_log_created_at ON public.notification_log USING btree (created_at)"
  },
  {
    "tablename": "notification_log",
    "indexname": "idx_notification_log_customer_id",
    "indexdef": "CREATE INDEX idx_notification_log_customer_id ON public.notification_log USING btree (customer_id)"
  },
  {
    "tablename": "notification_log",
    "indexname": "idx_notification_log_type",
    "indexdef": "CREATE INDEX idx_notification_log_type ON public.notification_log USING btree (notification_type)"
  },
  {
    "tablename": "notification_log",
    "indexname": "notification_log_pkey",
    "indexdef": "CREATE UNIQUE INDEX notification_log_pkey ON public.notification_log USING btree (id)"
  },
  {
    "tablename": "notifications",
    "indexname": "idx_notifications_user_id",
    "indexdef": "CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id)"
  },
  {
    "tablename": "notifications",
    "indexname": "notifications_pkey",
    "indexdef": "CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id)"
  },
  {
    "tablename": "order_activity_feed",
    "indexname": "idx_order_activity_feed_order_id",
    "indexdef": "CREATE INDEX idx_order_activity_feed_order_id ON public.order_activity_feed USING btree (order_id)"
  },
  {
    "tablename": "order_activity_feed",
    "indexname": "order_activity_feed_pkey",
    "indexdef": "CREATE UNIQUE INDEX order_activity_feed_pkey ON public.order_activity_feed USING btree (id)"
  },
  {
    "tablename": "order_status_history",
    "indexname": "idx_order_status_history_changed_at",
    "indexdef": "CREATE INDEX idx_order_status_history_changed_at ON public.order_status_history USING btree (changed_at DESC)"
  },
  {
    "tablename": "order_status_history",
    "indexname": "idx_order_status_history_order_id",
    "indexdef": "CREATE INDEX idx_order_status_history_order_id ON public.order_status_history USING btree (order_id)"
  },
  {
    "tablename": "order_status_history",
    "indexname": "order_status_history_pkey",
    "indexdef": "CREATE UNIQUE INDEX order_status_history_pkey ON public.order_status_history USING btree (id)"
  },
  {
    "tablename": "order_status_log",
    "indexname": "order_status_log_pkey",
    "indexdef": "CREATE UNIQUE INDEX order_status_log_pkey ON public.order_status_log USING btree (id)"
  },
  {
    "tablename": "orders",
    "indexname": "idx_orders_customer_id",
    "indexdef": "CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id)"
  },
  {
    "tablename": "orders",
    "indexname": "idx_orders_order_id",
    "indexdef": "CREATE INDEX idx_orders_order_id ON public.orders USING btree (order_id)"
  },
  {
    "tablename": "orders",
    "indexname": "idx_orders_shipping_mode",
    "indexdef": "CREATE INDEX idx_orders_shipping_mode ON public.orders USING btree (shipping_mode)"
  },
  {
    "tablename": "orders",
    "indexname": "idx_orders_status",
    "indexdef": "CREATE INDEX idx_orders_status ON public.orders USING btree (order_status)"
  },
  {
    "tablename": "orders",
    "indexname": "orders_order_id_key",
    "indexdef": "CREATE UNIQUE INDEX orders_order_id_key ON public.orders USING btree (order_id)"
  },
  {
    "tablename": "orders",
    "indexname": "orders_pkey",
    "indexdef": "CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id)"
  },
  {
    "tablename": "payment_reconciliation_logs",
    "indexname": "payment_reconciliation_logs_pkey",
    "indexdef": "CREATE UNIQUE INDEX payment_reconciliation_logs_pkey ON public.payment_reconciliation_logs USING btree (id)"
  },
  {
    "tablename": "payout_requests",
    "indexname": "idx_payout_affiliate",
    "indexdef": "CREATE INDEX idx_payout_affiliate ON public.payout_requests USING btree (affiliate_id)"
  },
  {
    "tablename": "payout_requests",
    "indexname": "idx_payout_status",
    "indexdef": "CREATE INDEX idx_payout_status ON public.payout_requests USING btree (status, created_at DESC)"
  },
  {
    "tablename": "payout_requests",
    "indexname": "payout_requests_pkey",
    "indexdef": "CREATE UNIQUE INDEX payout_requests_pkey ON public.payout_requests USING btree (id)"
  },
  {
    "tablename": "procurement_cycles",
    "indexname": "procurement_cycles_pkey",
    "indexdef": "CREATE UNIQUE INDEX procurement_cycles_pkey ON public.procurement_cycles USING btree (id)"
  },
  {
    "tablename": "product_images",
    "indexname": "product_images_pkey",
    "indexdef": "CREATE UNIQUE INDEX product_images_pkey ON public.product_images USING btree (id)"
  },
  {
    "tablename": "product_reviews",
    "indexname": "product_reviews_pkey",
    "indexdef": "CREATE UNIQUE INDEX product_reviews_pkey ON public.product_reviews USING btree (id)"
  },
  {
    "tablename": "product_reviews",
    "indexname": "product_reviews_product_id_user_id_key",
    "indexdef": "CREATE UNIQUE INDEX product_reviews_product_id_user_id_key ON public.product_reviews USING btree (product_id, user_id)"
  },
  {
    "tablename": "product_variants",
    "indexname": "product_variants_pkey",
    "indexdef": "CREATE UNIQUE INDEX product_variants_pkey ON public.product_variants USING btree (id)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_created_by",
    "indexdef": "CREATE INDEX idx_products_created_by ON public.products USING btree (created_by)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_forced_shipping_method",
    "indexdef": "CREATE INDEX idx_products_forced_shipping_method ON public.products USING btree (forced_shipping_method) WHERE (forced_shipping_method IS NOT NULL)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_general_options_prices",
    "indexdef": "CREATE INDEX idx_products_general_options_prices ON public.products USING gin (general_options_prices) WHERE (general_options_prices IS NOT NULL)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_promotion",
    "indexdef": "CREATE INDEX idx_products_promotion ON public.products USING btree (is_promotion) WHERE (is_promotion = true)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_sales_count",
    "indexdef": "CREATE INDEX idx_products_sales_count ON public.products USING btree (sales_count DESC)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_sku",
    "indexdef": "CREATE INDEX idx_products_sku ON public.products USING btree (sku)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_trending",
    "indexdef": "CREATE INDEX idx_products_trending ON public.products USING btree (is_trending) WHERE (is_trending = true)"
  },
  {
    "tablename": "products",
    "indexname": "idx_products_view_count",
    "indexdef": "CREATE INDEX idx_products_view_count ON public.products USING btree (view_count DESC)"
  },
  {
    "tablename": "products",
    "indexname": "products_embedding_idx",
    "indexdef": "CREATE INDEX products_embedding_idx ON public.products USING hnsw (embedding vector_cosine_ops)"
  },
  {
    "tablename": "products",
    "indexname": "products_id_key",
    "indexdef": "CREATE UNIQUE INDEX products_id_key ON public.products USING btree (id)"
  },
  {
    "tablename": "products",
    "indexname": "products_pkey",
    "indexdef": "CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id)"
  },
  {
    "tablename": "products",
    "indexname": "products_product_code_key",
    "indexdef": "CREATE UNIQUE INDEX products_product_code_key ON public.products USING btree (product_code)"
  },
  {
    "tablename": "products",
    "indexname": "products_search_idx",
    "indexdef": "CREATE INDEX products_search_idx ON public.products USING gin (((setweight(to_tsvector('english'::regconfig, COALESCE(name, ''::text)), 'A'::\"char\") || setweight(to_tsvector('english'::regconfig, COALESCE(description, ''::text)), 'B'::\"char\"))))"
  },
  {
    "tablename": "products",
    "indexname": "products_sku_key",
    "indexdef": "CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku)"
  },
  {
    "tablename": "products",
    "indexname": "products_sku_unique",
    "indexdef": "CREATE UNIQUE INDEX products_sku_unique ON public.products USING btree (sku)"
  },
  {
    "tablename": "promotions",
    "indexname": "promotions_pkey",
    "indexdef": "CREATE UNIQUE INDEX promotions_pkey ON public.promotions USING btree (id)"
  },
  {
    "tablename": "push_subscriptions",
    "indexname": "idx_push_subs_user_id",
    "indexdef": "CREATE INDEX idx_push_subs_user_id ON public.push_subscriptions USING btree (user_id)"
  },
  {
    "tablename": "push_subscriptions",
    "indexname": "push_subscriptions_endpoint_key",
    "indexdef": "CREATE UNIQUE INDEX push_subscriptions_endpoint_key ON public.push_subscriptions USING btree (endpoint)"
  },
  {
    "tablename": "push_subscriptions",
    "indexname": "push_subscriptions_pkey",
    "indexdef": "CREATE UNIQUE INDEX push_subscriptions_pkey ON public.push_subscriptions USING btree (id)"
  },
  {
    "tablename": "qc_inspections",
    "indexname": "idx_qc_inspections_package",
    "indexdef": "CREATE INDEX idx_qc_inspections_package ON public.qc_inspections USING btree (package_id)"
  },
  {
    "tablename": "qc_inspections",
    "indexname": "idx_qc_inspections_status",
    "indexdef": "CREATE INDEX idx_qc_inspections_status ON public.qc_inspections USING btree (status)"
  },
  {
    "tablename": "qc_inspections",
    "indexname": "qc_inspections_pkey",
    "indexdef": "CREATE UNIQUE INDEX qc_inspections_pkey ON public.qc_inspections USING btree (id)"
  },
  {
    "tablename": "recently_viewed",
    "indexname": "idx_recently_viewed_customer_id",
    "indexdef": "CREATE INDEX idx_recently_viewed_customer_id ON public.recently_viewed USING btree (customer_id, viewed_at DESC)"
  },
  {
    "tablename": "recently_viewed",
    "indexname": "recently_viewed_customer_id_product_id_key",
    "indexdef": "CREATE UNIQUE INDEX recently_viewed_customer_id_product_id_key ON public.recently_viewed USING btree (customer_id, product_id)"
  },
  {
    "tablename": "recently_viewed",
    "indexname": "recently_viewed_pkey",
    "indexdef": "CREATE UNIQUE INDEX recently_viewed_pkey ON public.recently_viewed USING btree (id)"
  },
  {
    "tablename": "scan_logs",
    "indexname": "scan_logs_pkey",
    "indexdef": "CREATE UNIQUE INDEX scan_logs_pkey ON public.scan_logs USING btree (id)"
  },
  {
    "tablename": "settings",
    "indexname": "settings_pkey",
    "indexdef": "CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree (id)"
  },
  {
    "tablename": "shared_carts",
    "indexname": "idx_shared_carts_expires_at",
    "indexdef": "CREATE INDEX idx_shared_carts_expires_at ON public.shared_carts USING btree (expires_at)"
  },
  {
    "tablename": "shared_carts",
    "indexname": "idx_shared_carts_share_code",
    "indexdef": "CREATE INDEX idx_shared_carts_share_code ON public.shared_carts USING btree (share_code)"
  },
  {
    "tablename": "shared_carts",
    "indexname": "shared_carts_pkey",
    "indexdef": "CREATE UNIQUE INDEX shared_carts_pkey ON public.shared_carts USING btree (id)"
  },
  {
    "tablename": "shared_carts",
    "indexname": "shared_carts_share_code_key",
    "indexdef": "CREATE UNIQUE INDEX shared_carts_share_code_key ON public.shared_carts USING btree (share_code)"
  },
  {
    "tablename": "shipments",
    "indexname": "idx_shipments_order_id",
    "indexdef": "CREATE INDEX idx_shipments_order_id ON public.shipments USING btree (order_id)"
  },
  {
    "tablename": "shipments",
    "indexname": "idx_shipments_reg_fee_ref",
    "indexdef": "CREATE INDEX idx_shipments_reg_fee_ref ON public.shipments USING btree (registration_fee_payment_reference)"
  },
  {
    "tablename": "shipments",
    "indexname": "shipments_id_key",
    "indexdef": "CREATE UNIQUE INDEX shipments_id_key ON public.shipments USING btree (id)"
  },
  {
    "tablename": "shipments",
    "indexname": "shipments_pkey",
    "indexdef": "CREATE UNIQUE INDEX shipments_pkey ON public.shipments USING btree (id)"
  },
  {
    "tablename": "shipments",
    "indexname": "shipments_tracking_number_key",
    "indexdef": "CREATE UNIQUE INDEX shipments_tracking_number_key ON public.shipments USING btree (tracking_number)"
  },
  {
    "tablename": "shop_ads",
    "indexname": "idx_shop_ads_audience",
    "indexdef": "CREATE INDEX idx_shop_ads_audience ON public.shop_ads USING btree (audience)"
  },
  {
    "tablename": "shop_ads",
    "indexname": "idx_shop_ads_dates",
    "indexdef": "CREATE INDEX idx_shop_ads_dates ON public.shop_ads USING btree (start_date, end_date)"
  },
  {
    "tablename": "shop_ads",
    "indexname": "idx_shop_ads_status",
    "indexdef": "CREATE INDEX idx_shop_ads_status ON public.shop_ads USING btree (status)"
  },
  {
    "tablename": "shop_ads",
    "indexname": "shop_ads_pkey",
    "indexdef": "CREATE UNIQUE INDEX shop_ads_pkey ON public.shop_ads USING btree (id)"
  },
  {
    "tablename": "suppliers",
    "indexname": "suppliers_pkey",
    "indexdef": "CREATE UNIQUE INDEX suppliers_pkey ON public.suppliers USING btree (id)"
  },
  {
    "tablename": "support_escalations",
    "indexname": "support_escalations_pkey",
    "indexdef": "CREATE UNIQUE INDEX support_escalations_pkey ON public.support_escalations USING btree (id)"
  },
  {
    "tablename": "system_settings",
    "indexname": "system_settings_pkey",
    "indexdef": "CREATE UNIQUE INDEX system_settings_pkey ON public.system_settings USING btree (key)"
  },
  {
    "tablename": "telegram_broadcasts",
    "indexname": "telegram_broadcasts_pkey",
    "indexdef": "CREATE UNIQUE INDEX telegram_broadcasts_pkey ON public.telegram_broadcasts USING btree (id)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "idx_telegram_messages_chat_id",
    "indexdef": "CREATE INDEX idx_telegram_messages_chat_id ON public.telegram_messages USING btree (chat_id)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "idx_telegram_messages_created_at",
    "indexdef": "CREATE INDEX idx_telegram_messages_created_at ON public.telegram_messages USING btree (created_at)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "idx_telegram_messages_customer_id",
    "indexdef": "CREATE INDEX idx_telegram_messages_customer_id ON public.telegram_messages USING btree (customer_id)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "idx_telegram_messages_direction",
    "indexdef": "CREATE INDEX idx_telegram_messages_direction ON public.telegram_messages USING btree (direction)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "idx_telegram_messages_is_read",
    "indexdef": "CREATE INDEX idx_telegram_messages_is_read ON public.telegram_messages USING btree (is_read)"
  },
  {
    "tablename": "telegram_messages",
    "indexname": "telegram_messages_pkey",
    "indexdef": "CREATE UNIQUE INDEX telegram_messages_pkey ON public.telegram_messages USING btree (id)"
  },
  {
    "tablename": "telegram_verification_tokens",
    "indexname": "idx_telegram_tokens_customer_id",
    "indexdef": "CREATE INDEX idx_telegram_tokens_customer_id ON public.telegram_verification_tokens USING btree (customer_id)"
  },
  {
    "tablename": "telegram_verification_tokens",
    "indexname": "idx_telegram_tokens_expires_at",
    "indexdef": "CREATE INDEX idx_telegram_tokens_expires_at ON public.telegram_verification_tokens USING btree (expires_at)"
  },
  {
    "tablename": "telegram_verification_tokens",
    "indexname": "idx_telegram_tokens_token",
    "indexdef": "CREATE INDEX idx_telegram_tokens_token ON public.telegram_verification_tokens USING btree (token)"
  },
  {
    "tablename": "telegram_verification_tokens",
    "indexname": "telegram_verification_tokens_pkey",
    "indexdef": "CREATE UNIQUE INDEX telegram_verification_tokens_pkey ON public.telegram_verification_tokens USING btree (id)"
  },
  {
    "tablename": "telegram_verification_tokens",
    "indexname": "telegram_verification_tokens_token_key",
    "indexdef": "CREATE UNIQUE INDEX telegram_verification_tokens_token_key ON public.telegram_verification_tokens USING btree (token)"
  },
  {
    "tablename": "unmatched_packages",
    "indexname": "idx_unmatched_packages_status",
    "indexdef": "CREATE INDEX idx_unmatched_packages_status ON public.unmatched_packages USING btree (status)"
  },
  {
    "tablename": "unmatched_packages",
    "indexname": "idx_unmatched_packages_tracking",
    "indexdef": "CREATE INDEX idx_unmatched_packages_tracking ON public.unmatched_packages USING btree (tracking_number)"
  },
  {
    "tablename": "unmatched_packages",
    "indexname": "unmatched_packages_pkey",
    "indexdef": "CREATE UNIQUE INDEX unmatched_packages_pkey ON public.unmatched_packages USING btree (id)"
  },
  {
    "tablename": "user_addresses",
    "indexname": "idx_user_addresses_customer_id",
    "indexdef": "CREATE INDEX idx_user_addresses_customer_id ON public.user_addresses USING btree (customer_id)"
  },
  {
    "tablename": "user_addresses",
    "indexname": "idx_user_addresses_primary",
    "indexdef": "CREATE INDEX idx_user_addresses_primary ON public.user_addresses USING btree (customer_id, is_primary) WHERE (is_primary = true)"
  },
  {
    "tablename": "user_addresses",
    "indexname": "user_addresses_pkey",
    "indexdef": "CREATE UNIQUE INDEX user_addresses_pkey ON public.user_addresses USING btree (id)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "indexname": "idx_user_dismissed",
    "indexdef": "CREATE INDEX idx_user_dismissed ON public.user_dismissed_announcements USING btree (user_id, announcement_id)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "indexname": "user_dismissed_announcements_pkey",
    "indexdef": "CREATE UNIQUE INDEX user_dismissed_announcements_pkey ON public.user_dismissed_announcements USING btree (id)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "indexname": "user_dismissed_announcements_user_id_announcement_id_key",
    "indexdef": "CREATE UNIQUE INDEX user_dismissed_announcements_user_id_announcement_id_key ON public.user_dismissed_announcements USING btree (user_id, announcement_id)"
  },
  {
    "tablename": "user_preferences",
    "indexname": "idx_user_preferences_customer_id",
    "indexdef": "CREATE INDEX idx_user_preferences_customer_id ON public.user_preferences USING btree (customer_id)"
  },
  {
    "tablename": "user_preferences",
    "indexname": "user_preferences_customer_id_key",
    "indexdef": "CREATE UNIQUE INDEX user_preferences_customer_id_key ON public.user_preferences USING btree (customer_id)"
  },
  {
    "tablename": "user_preferences",
    "indexname": "user_preferences_pkey",
    "indexdef": "CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (id)"
  },
  {
    "tablename": "user_searches",
    "indexname": "idx_user_searches_date",
    "indexdef": "CREATE INDEX idx_user_searches_date ON public.user_searches USING btree (search_date)"
  },
  {
    "tablename": "user_searches",
    "indexname": "idx_user_searches_query",
    "indexdef": "CREATE INDEX idx_user_searches_query ON public.user_searches USING btree (search_query)"
  },
  {
    "tablename": "user_searches",
    "indexname": "user_searches_pkey",
    "indexdef": "CREATE UNIQUE INDEX user_searches_pkey ON public.user_searches USING btree (id)"
  },
  {
    "tablename": "user_sessions",
    "indexname": "idx_user_sessions_user_id",
    "indexdef": "CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id)"
  },
  {
    "tablename": "user_sessions",
    "indexname": "user_sessions_pkey",
    "indexdef": "CREATE UNIQUE INDEX user_sessions_pkey ON public.user_sessions USING btree (id)"
  },
  {
    "tablename": "warehouse_addresses",
    "indexname": "idx_warehouse_addresses_created_at",
    "indexdef": "CREATE INDEX idx_warehouse_addresses_created_at ON public.warehouse_addresses USING btree (created_at DESC)"
  },
  {
    "tablename": "warehouse_addresses",
    "indexname": "idx_warehouse_addresses_is_default",
    "indexdef": "CREATE INDEX idx_warehouse_addresses_is_default ON public.warehouse_addresses USING btree (is_default) WHERE (is_default = true)"
  },
  {
    "tablename": "warehouse_addresses",
    "indexname": "idx_warehouse_addresses_location",
    "indexdef": "CREATE INDEX idx_warehouse_addresses_location ON public.warehouse_addresses USING btree (location)"
  },
  {
    "tablename": "warehouse_addresses",
    "indexname": "idx_warehouse_addresses_single_default",
    "indexdef": "CREATE UNIQUE INDEX idx_warehouse_addresses_single_default ON public.warehouse_addresses USING btree (is_default) WHERE (is_default = true)"
  },
  {
    "tablename": "warehouse_addresses",
    "indexname": "warehouse_addresses_pkey",
    "indexdef": "CREATE UNIQUE INDEX warehouse_addresses_pkey ON public.warehouse_addresses USING btree (id)"
  },
  {
    "tablename": "wishlist",
    "indexname": "idx_wishlist_customer_id",
    "indexdef": "CREATE INDEX idx_wishlist_customer_id ON public.wishlist USING btree (customer_id)"
  },
  {
    "tablename": "wishlist",
    "indexname": "idx_wishlist_product_id",
    "indexdef": "CREATE INDEX idx_wishlist_product_id ON public.wishlist USING btree (product_id)"
  },
  {
    "tablename": "wishlist",
    "indexname": "wishlist_customer_id_product_id_variant_id_key",
    "indexdef": "CREATE UNIQUE INDEX wishlist_customer_id_product_id_variant_id_key ON public.wishlist USING btree (customer_id, product_id, variant_id)"
  },
  {
    "tablename": "wishlist",
    "indexname": "wishlist_pkey",
    "indexdef": "CREATE UNIQUE INDEX wishlist_pkey ON public.wishlist USING btree (id)"
  },
  {
    "tablename": "withdrawals",
    "indexname": "withdrawals_pkey",
    "indexdef": "CREATE UNIQUE INDEX withdrawals_pkey ON public.withdrawals USING btree (id)"
  }
]

[
  {
    "tablename": "admin_settings",
    "policyname": "Admins can manage own settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = admin_id)",
    "with_check": "(auth.uid() = admin_id)"
  },
  {
    "tablename": "admin_settings",
    "policyname": "Service role can manage admin settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "admin_tasks",
    "policyname": "Admins full access to admin_tasks",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "admins",
    "policyname": "Admins can delete admins",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "is_user_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "admins",
    "policyname": "Admins can insert new admins",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "is_user_admin(auth.uid())"
  },
  {
    "tablename": "admins",
    "policyname": "Admins can read all admins",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "is_user_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "admins",
    "policyname": "Admins can update admins",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "is_user_admin(auth.uid())",
    "with_check": "is_user_admin(auth.uid())"
  },
  {
    "tablename": "admins",
    "policyname": "Allow admins to verify their own status",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "admins",
    "policyname": "Users can check own admin status",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(user_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "affiliate_earnings",
    "policyname": "Admins can view all earnings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "affiliate_earnings",
    "policyname": "Affiliates can view own earnings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(affiliate_id IN ( SELECT affiliate_profiles.id\n   FROM affiliate_profiles\n  WHERE (affiliate_profiles.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Admins can update affiliate status",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Admins can view all affiliates",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Allow admin delete on affiliate_profiles",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Users can create own affiliate application",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(user_id = auth.uid())"
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Users can update own pending application",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) AND (status = 'pending'::text))",
    "with_check": "(user_id = auth.uid())"
  },
  {
    "tablename": "affiliate_profiles",
    "policyname": "Users can view own affiliate profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(user_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "announcements",
    "policyname": "Admin: Full access to announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)",
    "with_check": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)"
  },
  {
    "tablename": "announcements",
    "policyname": "Admins can manage announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "((auth.jwt() ->> 'email'::text) = 'c2glogisticsgh@gmail.com'::text)",
    "with_check": "((auth.jwt() ->> 'email'::text) = 'c2glogisticsgh@gmail.com'::text)"
  },
  {
    "tablename": "announcements",
    "policyname": "Customers can view active announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "((is_active = true) AND (start_date <= now()) AND ((end_date IS NULL) OR (end_date >= now())) AND (((target_audience)::text = 'all'::text) OR ((target_audience)::text = 'customers'::text)))",
    "with_check": null
  },
  {
    "tablename": "announcements",
    "policyname": "Public can view active announcements",
    "permissive": "PERMISSIVE",
    "roles": "{anon}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "tablename": "announcements",
    "policyname": "Users can view active announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "tablename": "announcements",
    "policyname": "Users: Can read active announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "tablename": "audit_logs",
    "policyname": "Admins full access to audit_logs",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "contact_inquiries",
    "policyname": "Admins can view all inquiries",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "contact_inquiries",
    "policyname": "Anyone can insert contact inquiries",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "customer_addresses",
    "policyname": "Users can delete their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "customer_addresses",
    "policyname": "Users can insert their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "customer_addresses",
    "policyname": "Users can update their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "customer_addresses",
    "policyname": "Users can view their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "customer_notes",
    "policyname": "Support and Admin insert notes",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))))"
  },
  {
    "tablename": "customer_notes",
    "policyname": "Support and Admin view notes",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))))",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Admins can delete customers",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Admins can insert customers",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "customers",
    "policyname": "Admins can update customers",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "customers",
    "policyname": "Admins can view all customers",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Enable read access for authenticated users",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Support views customers",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Users can insert own customer record",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = id)"
  },
  {
    "tablename": "customers",
    "policyname": "Users can update own customer record",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = id)",
    "with_check": "(auth.uid() = id)"
  },
  {
    "tablename": "customers",
    "policyname": "Users can view own customer record",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = id)",
    "with_check": null
  },
  {
    "tablename": "customers",
    "policyname": "Warehouse views customers",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Admins can manage all ecom orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Customers can read own orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(customer_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Only service role can update payment fields",
    "permissive": "PERMISSIVE",
    "roles": "{service_role}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Public read for payment verification",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "SELECT",
    "qual": "(payment_reference IS NOT NULL)",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Service role can update orders",
    "permissive": "PERMISSIVE",
    "roles": "{service_role}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can delete their own unpaid orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((auth.uid() = customer_id) AND ((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'awaiting_payment'::character varying])::text[])))",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can insert their own ecom orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can insert their own orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can update their own orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can view their own ecom orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "ecom_orders",
    "policyname": "Users can view their own orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "employees",
    "policyname": "Admins manage employees",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "employees",
    "policyname": "Employees view self",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(user_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "gallery_submissions",
    "policyname": "Admins can delete gallery submissions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "gallery_submissions",
    "policyname": "Anyone can view gallery submissions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "gallery_submissions",
    "policyname": "Authenticated users can insert gallery submissions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.role() = 'authenticated'::text)"
  },
  {
    "tablename": "importers",
    "policyname": "Public can view approved importers",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(status = 'approved'::text)",
    "with_check": null
  },
  {
    "tablename": "importers",
    "policyname": "Service role can manage importers",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "importers",
    "policyname": "Users can insert their own importer profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "tablename": "importers",
    "policyname": "Users can update own pending profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((auth.uid() = user_id) AND (status = 'pending'::text))",
    "with_check": null
  },
  {
    "tablename": "importers",
    "policyname": "Users can view own importer profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "incoming_packages",
    "policyname": "Users can insert their own incoming packages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "incoming_packages",
    "policyname": "Users can update their own incoming packages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "incoming_packages",
    "policyname": "Users can view their own incoming packages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "notification_log",
    "policyname": "Service role can insert notification logs",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "notification_log",
    "policyname": "Users can delete own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "notification_log",
    "policyname": "Users can update own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "notification_log",
    "policyname": "Users can view own notification logs",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "notification_log",
    "policyname": "Users can view own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "notifications",
    "policyname": "Service role can manage notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "notifications",
    "policyname": "Users can update own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "notifications",
    "policyname": "Users can view own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "order_activity_feed",
    "policyname": "Admins full access to order_activity_feed",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "order_status_history",
    "policyname": "Admins can view all order history",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "order_status_history",
    "policyname": "Only admins can insert order history",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "order_status_history",
    "policyname": "Users can view their own order history",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM ecom_orders\n  WHERE ((ecom_orders.id = order_status_history.order_id) AND (ecom_orders.customer_id = auth.uid()))))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "Admins can update link orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "orders",
    "policyname": "Support views orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "Users can delete their own unpaid link orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((auth.uid() = customer_id) AND (payment_status = ANY (ARRAY['pending'::text, 'awaiting_payment'::text])))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "Warehouse views orders",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "admins_delete_all_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "admins_select_all_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "admins_update_all_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "users_delete_pending_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "((customer_id = auth.uid()) AND (order_status = ANY (ARRAY['new'::text, 'awaiting_payment'::text, 'cancelled'::text])))",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "users_insert_own_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(customer_id = auth.uid())"
  },
  {
    "tablename": "orders",
    "policyname": "users_select_own_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(customer_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "orders",
    "policyname": "users_update_own_orders",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(customer_id = auth.uid())",
    "with_check": "(customer_id = auth.uid())"
  },
  {
    "tablename": "payment_reconciliation_logs",
    "policyname": "Service role can insert reconciliation logs",
    "permissive": "PERMISSIVE",
    "roles": "{service_role}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "payment_reconciliation_logs",
    "policyname": "Service role can view reconciliation logs",
    "permissive": "PERMISSIVE",
    "roles": "{service_role}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "payout_requests",
    "policyname": "Admins can process payouts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "payout_requests",
    "policyname": "Admins can view all payouts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "payout_requests",
    "policyname": "Affiliates can create own payout requests",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(affiliate_id IN ( SELECT affiliate_profiles.id\n   FROM affiliate_profiles\n  WHERE ((affiliate_profiles.user_id = auth.uid()) AND (affiliate_profiles.status = 'approved'::text))))"
  },
  {
    "tablename": "payout_requests",
    "policyname": "Affiliates can view own payouts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(affiliate_id IN ( SELECT affiliate_profiles.id\n   FROM affiliate_profiles\n  WHERE (affiliate_profiles.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "procurement_cycles",
    "policyname": "Public can view procurement cycles",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "procurement_cycles",
    "policyname": "Service role can manage procurement cycles",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "product_images",
    "policyname": "Admins can delete product images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Admins can insert product images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "product_images",
    "policyname": "Admins can update product images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Allow admin full access",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "product_images",
    "policyname": "Allow delete for admins",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Allow insert for admins",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "product_images",
    "policyname": "Allow public read access",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Allow update for admins",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Anyone can view product images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "product_images",
    "policyname": "Approved employees manage own product_images",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM products p\n  WHERE ((p.id = product_images.product_id) AND (p.created_by = auth.uid()) AND (EXISTS ( SELECT 1\n           FROM employees e\n          WHERE ((e.user_id = auth.uid()) AND (e.status = 'approved'::text)))))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM products p\n  WHERE ((p.id = product_images.product_id) AND (p.created_by = auth.uid()))))"
  },
  {
    "tablename": "product_reviews",
    "policyname": "Anyone can read product reviews",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "product_reviews",
    "policyname": "Users can delete their own reviews",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "product_reviews",
    "policyname": "Users can insert their own reviews",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "tablename": "product_reviews",
    "policyname": "Users can update their own reviews",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "product_variants",
    "policyname": "Admins can manage product variants",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "product_variants",
    "policyname": "Anyone can view product variants",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "product_variants",
    "policyname": "Approved employees manage own product_variants",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM products p\n  WHERE ((p.id = product_variants.product_id) AND (p.created_by = auth.uid()) AND (EXISTS ( SELECT 1\n           FROM employees e\n          WHERE ((e.user_id = auth.uid()) AND (e.status = 'approved'::text)))))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM products p\n  WHERE ((p.id = product_variants.product_id) AND (p.created_by = auth.uid()))))"
  },
  {
    "tablename": "products",
    "policyname": "Admins can delete products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Admins can insert products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "products",
    "policyname": "Admins can update products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Anyone can view products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Approved employees delete own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((created_by = auth.uid()) AND (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text)))))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Approved employees insert own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((created_by = auth.uid()) AND (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text)))))"
  },
  {
    "tablename": "products",
    "policyname": "Approved employees update own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((created_by = auth.uid()) AND (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text)))))",
    "with_check": "(created_by = auth.uid())"
  },
  {
    "tablename": "products",
    "policyname": "Enable insert for authenticated users only",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "products",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Importers can delete own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = products.importer_id)))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Importers can insert products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = products.importer_id)))"
  },
  {
    "tablename": "products",
    "policyname": "Importers can update own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = products.importer_id)))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "Importers can view their own products",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = products.importer_id)))",
    "with_check": null
  },
  {
    "tablename": "products",
    "policyname": "update",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "promotions",
    "policyname": "Admins full access to promotions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "promotions",
    "policyname": "Allow full access for admins",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))"
  },
  {
    "tablename": "promotions",
    "policyname": "Allow public read access to active promotions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "tablename": "push_subscriptions",
    "policyname": "Service role can manage subscriptions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "push_subscriptions",
    "policyname": "Users can manage own subscriptions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "qc_inspections",
    "policyname": "Admins full access to qc_inspections",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "recently_viewed",
    "policyname": "Users can manage their own recently viewed",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "scan_logs",
    "policyname": "Enable delete access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "scan_logs",
    "policyname": "Enable insert access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "scan_logs",
    "policyname": "Enable read access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "scan_logs",
    "policyname": "Enable update access for all users",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "settings",
    "policyname": "Admin: Can update settings",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)",
    "with_check": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)"
  },
  {
    "tablename": "settings",
    "policyname": "Admins can update settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "settings",
    "policyname": "Everyone can view settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "settings",
    "policyname": "Public read access to settings",
    "permissive": "PERMISSIVE",
    "roles": "{anon,authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "settings",
    "policyname": "Users: Can read settings",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "shared_carts",
    "policyname": "Anyone can create shared carts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "shared_carts",
    "policyname": "Anyone can read shared carts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "shared_carts",
    "policyname": "Anyone can update shared cart access count",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "shipments",
    "policyname": "Admins can view all shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "shipments",
    "policyname": "Customers can create their own shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "shipments",
    "policyname": "Customers can delete their own shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "shipments",
    "policyname": "Customers can update their own shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "shipments",
    "policyname": "Customers can view their own shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "shipments",
    "policyname": "Support views shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))",
    "with_check": null
  },
  {
    "tablename": "shipments",
    "policyname": "Warehouse updates shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))"
  },
  {
    "tablename": "shipments",
    "policyname": "Warehouse views shipments",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))",
    "with_check": null
  },
  {
    "tablename": "shipments",
    "policyname": "shipments_admin_all_policy",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "check_admin_safe()",
    "with_check": "check_admin_safe()"
  },
  {
    "tablename": "shipments",
    "policyname": "shipments_select_policy",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(customer_id = auth.uid())",
    "with_check": null
  },
  {
    "tablename": "shop_ads",
    "policyname": "Admins can manage shop ads",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "shop_ads",
    "policyname": "Anyone can view active shop ads",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(((status)::text = 'active'::text) AND ((start_date IS NULL) OR (start_date <= now())) AND ((end_date IS NULL) OR (end_date >= now())))",
    "with_check": null
  },
  {
    "tablename": "suppliers",
    "policyname": "Admins full access to suppliers",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "support_escalations",
    "policyname": "Admin update escalations",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "support_escalations",
    "policyname": "Support and Admin insert escalations",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))))"
  },
  {
    "tablename": "support_escalations",
    "policyname": "Support and Admin view escalations",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))))",
    "with_check": null
  },
  {
    "tablename": "system_settings",
    "policyname": "Allow admins to update system_settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() IN ( SELECT admin_settings.admin_id\n   FROM admin_settings))",
    "with_check": "(auth.uid() IN ( SELECT admin_settings.admin_id\n   FROM admin_settings))"
  },
  {
    "tablename": "system_settings",
    "policyname": "Allow public read access to system_settings",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "telegram_broadcasts",
    "policyname": "Admins and Staff can view broadcasts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(((auth.jwt() ->> 'role'::text) = 'service_role'::text) OR (EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text)))))",
    "with_check": null
  },
  {
    "tablename": "telegram_broadcasts",
    "policyname": "Admins can insert broadcasts",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((auth.jwt() ->> 'role'::text) = 'service_role'::text)"
  },
  {
    "tablename": "telegram_messages",
    "policyname": "Admins can insert telegram messages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id\n   FROM admins)))"
  },
  {
    "tablename": "telegram_messages",
    "policyname": "Admins can update telegram messages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id\n   FROM admins)))",
    "with_check": "((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id\n   FROM admins)))"
  },
  {
    "tablename": "telegram_messages",
    "policyname": "Admins can view all telegram messages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id\n   FROM admins)))",
    "with_check": null
  },
  {
    "tablename": "telegram_messages",
    "policyname": "Service role full access",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.role() = 'service_role'::text)",
    "with_check": null
  },
  {
    "tablename": "telegram_messages",
    "policyname": "Support views telegram messages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM employees\n  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))",
    "with_check": null
  },
  {
    "tablename": "telegram_verification_tokens",
    "policyname": "Admins can view all verification tokens",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM admins\n  WHERE (admins.user_id = auth.uid())))",
    "with_check": null
  },
  {
    "tablename": "telegram_verification_tokens",
    "policyname": "Service role can manage tokens",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  },
  {
    "tablename": "telegram_verification_tokens",
    "policyname": "Users can view own verification tokens",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "unmatched_packages",
    "policyname": "Admins full access to unmatched_packages",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users and admins can update addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((auth.uid() = customer_id) OR (EXISTS ( SELECT 1\n   FROM admins\n  WHERE ((admins.user_id = auth.uid()) AND ((admins.status)::text = 'active'::text)))))",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users and admins can view addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((auth.uid() = customer_id) OR (EXISTS ( SELECT 1\n   FROM admins\n  WHERE ((admins.user_id = auth.uid()) AND ((admins.status)::text = 'active'::text)))))",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can delete own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can delete their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can insert own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can insert their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can update their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_addresses",
    "policyname": "Users can view their own addresses",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_dismissed_announcements",
    "policyname": "Admin: Full access to dismissed announcements",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)",
    "with_check": "(( SELECT count(*) AS count\n   FROM admins\n  WHERE (admins.user_id = auth.uid())) > 0)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "policyname": "Users can manage their dismissals",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "policyname": "Users: Can create their own dismissals",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "tablename": "user_dismissed_announcements",
    "policyname": "Users: Can read their own dismissals",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "user_preferences",
    "policyname": "Users can insert their own preferences",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = customer_id)"
  },
  {
    "tablename": "user_preferences",
    "policyname": "Users can update their own preferences",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_preferences",
    "policyname": "Users can view their own preferences",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "user_searches",
    "policyname": "Allow admins to delete user_searches",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "user_searches",
    "policyname": "Allow admins to read user_searches",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "user_searches",
    "policyname": "Allow authenticated inserts on user_searches",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "user_searches",
    "policyname": "Allow public inserts on user_searches",
    "permissive": "PERMISSIVE",
    "roles": "{anon}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "user_searches",
    "policyname": "Allow service role to read user_searches",
    "permissive": "PERMISSIVE",
    "roles": "{service_role}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "user_sessions",
    "policyname": "Service role can insert sessions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "true"
  },
  {
    "tablename": "user_sessions",
    "policyname": "Service role can update sessions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "user_sessions",
    "policyname": "Users can delete own sessions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "user_sessions",
    "policyname": "Users can view own sessions",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "tablename": "warehouse_addresses",
    "policyname": "Admins can delete warehouse addresses",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "DELETE",
    "qual": "is_user_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "warehouse_addresses",
    "policyname": "Admins can insert warehouse addresses",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "is_user_admin(auth.uid())"
  },
  {
    "tablename": "warehouse_addresses",
    "policyname": "Admins can update warehouse addresses",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "is_user_admin(auth.uid())",
    "with_check": "is_user_admin(auth.uid())"
  },
  {
    "tablename": "warehouse_addresses",
    "policyname": "Admins can view all warehouse addresses",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "is_user_admin(auth.uid())",
    "with_check": null
  },
  {
    "tablename": "warehouse_addresses",
    "policyname": "Public can view active warehouse addresses",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "tablename": "wishlist",
    "policyname": "Users can manage their own wishlist",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "wishlist",
    "policyname": "Users can view their own wishlist",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = customer_id)",
    "with_check": null
  },
  {
    "tablename": "withdrawals",
    "policyname": "Importers can insert own withdrawals",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = withdrawals.importer_id)))"
  },
  {
    "tablename": "withdrawals",
    "policyname": "Importers can view own withdrawals",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() IN ( SELECT importers.user_id\n   FROM importers\n  WHERE (importers.id = withdrawals.importer_id)))",
    "with_check": null
  },
  {
    "tablename": "withdrawals",
    "policyname": "Service role can manage withdrawals",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "true",
    "with_check": "true"
  }
]



export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          admin_id: string
          created_at: string | null
          id: string
          notification_types: Json | null
          notifications_enabled: boolean | null
          telegram_chat_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          id?: string
          notification_types?: Json | null
          notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          id?: string
          notification_types?: Json | null
          notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          department: string
          description: string | null
          id: string
          priority: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: string | null
          title: string
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department: string
          description?: string | null
          id?: string
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string | null
          title: string
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string
          description?: string | null
          id?: string
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          email: string | null
          id: number
          master_pin: string | null
          name: string | null
          role: string | null
          status: string | null
          totp_enabled: boolean | null
          totp_secret: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          master_pin?: string | null
          name?: string | null
          role?: string | null
          status?: string | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          master_pin?: string | null
          name?: string | null
          role?: string | null
          status?: string | null
          totp_enabled?: boolean | null
          totp_secret?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_earnings: {
        Row: {
          affiliate_id: string | null
          amount: number
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          order_id: string
          order_total: number
          order_type: string
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          order_id: string
          order_total: number
          order_type: string
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          order_id?: string
          order_total?: number
          order_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_profiles: {
        Row: {
          affiliate_code: string
          application_reason: string | null
          balance: number | null
          created_at: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_accounts: Json
          status: string | null
          total_earned: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          affiliate_code: string
          application_reason?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_accounts?: Json
          status?: string | null
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          affiliate_code?: string
          application_reason?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_accounts?: Json
          status?: string | null
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_profiles_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          message: string
          priority: number | null
          start_date: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          message: string
          priority?: number | null
          start_date?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          message?: string
          priority?: number | null
          start_date?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          email: string
          first_attempt_at: string | null
          ip_address: string
          locked_until: string | null
        }
        Insert: {
          attempt_count?: number | null
          email?: string
          first_attempt_at?: string | null
          ip_address: string
          locked_until?: string | null
        }
        Update: {
          attempt_count?: number | null
          email?: string
          first_attempt_at?: string | null
          ip_address?: string
          locked_until?: string | null
        }
        Relationships: []
      }
      captcha_challenges: {
        Row: {
          answer: number
          created_at: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          answer: number
          created_at?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Update: {
          answer?: number
          created_at?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          customer_id: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          postal_code: string | null
          region: string | null
          street_address: string
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_id: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          postal_code?: string | null
          region?: string | null
          street_address: string
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_id?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          postal_code?: string | null
          region?: string | null
          street_address?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          author_id: string | null
          author_name: string
          created_at: string | null
          customer_id: string | null
          id: string
          note_text: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          note_text: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          note_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          customer_unique_id: string | null
          email: string
          id: string
          name: string
          phone: string | null
          referral_code_used: string | null
          referred_by_affiliate_id: string | null
          role: string | null
          status: string
          telegram_chat_id: string | null
          telegram_notifications_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          customer_unique_id?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          referral_code_used?: string | null
          referred_by_affiliate_id?: string | null
          role?: string | null
          status?: string
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          customer_unique_id?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          referral_code_used?: string | null
          referred_by_affiliate_id?: string | null
          role?: string | null
          status?: string
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_referred_by_affiliate_id_fkey"
            columns: ["referred_by_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ecom_orders: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_id: string
          customer_name: string
          customer_phone: string | null
          estimated_delivery: string | null
          estimated_duration_days: number | null
          id: string
          importer_id: string | null
          items: Json
          order_id: string | null
          order_status: string | null
          payment_details: Json | null
          payment_gateway: string | null
          payment_reference: string | null
          payment_status: string | null
          procurement_cycle_id: string | null
          procurement_status: string | null
          rate_at_purchase: number | null
          service_fee: number
          shipment_start_date: string | null
          shipping_address: string
          shipping_cost: number | null
          shipping_fee_paid: boolean | null
          shipping_fee_payment_reference: string | null
          shipping_method: string | null
          shipping_notes: string | null
          subtotal: number
          total_amount: number
          total_cost_ghs: number | null
          total_profit_ghs: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_id: string
          customer_name: string
          customer_phone?: string | null
          estimated_delivery?: string | null
          estimated_duration_days?: number | null
          id?: string
          importer_id?: string | null
          items: Json
          order_id?: string | null
          order_status?: string | null
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          procurement_cycle_id?: string | null
          procurement_status?: string | null
          rate_at_purchase?: number | null
          service_fee?: number
          shipment_start_date?: string | null
          shipping_address: string
          shipping_cost?: number | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          shipping_method?: string | null
          shipping_notes?: string | null
          subtotal: number
          total_amount: number
          total_cost_ghs?: number | null
          total_profit_ghs?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string
          customer_name?: string
          customer_phone?: string | null
          estimated_delivery?: string | null
          estimated_duration_days?: number | null
          id?: string
          importer_id?: string | null
          items?: Json
          order_id?: string | null
          order_status?: string | null
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          procurement_cycle_id?: string | null
          procurement_status?: string | null
          rate_at_purchase?: number | null
          service_fee?: number
          shipment_start_date?: string | null
          shipping_address?: string
          shipping_cost?: number | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          shipping_method?: string | null
          shipping_notes?: string | null
          subtotal?: number
          total_amount?: number
          total_cost_ghs?: number | null
          total_profit_ghs?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ecom_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecom_orders_importer_id_fkey"
            columns: ["importer_id"]
            isOneToOne: false
            referencedRelation: "importers"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          staff_role: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          staff_role?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          staff_role?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_submissions: {
        Row: {
          id: string
          media_url: string
          public_id: string | null
          resource_type: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          media_url: string
          public_id?: string | null
          resource_type?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          media_url?: string
          public_id?: string | null
          resource_type?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      importers: {
        Row: {
          business_description: string | null
          business_name: string
          created_at: string
          email: string
          ghana_card: string
          id: string
          status: string | null
          store_slug: string
          updated_at: string
          user_id: string
          wallet_balance: number | null
          whatsapp: string
        }
        Insert: {
          business_description?: string | null
          business_name: string
          created_at?: string
          email: string
          ghana_card: string
          id?: string
          status?: string | null
          store_slug: string
          updated_at?: string
          user_id: string
          wallet_balance?: number | null
          whatsapp: string
        }
        Update: {
          business_description?: string | null
          business_name?: string
          created_at?: string
          email?: string
          ghana_card?: string
          id?: string
          status?: string | null
          store_slug?: string
          updated_at?: string
          user_id?: string
          wallet_balance?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      incoming_packages: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          image_url: string | null
          items_description: string | null
          status: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          image_url?: string | null
          items_description?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          image_url?: string | null
          items_description?: string | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incoming_packages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
          ip: string
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
          ip?: string
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
          ip?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          channel: string
          created_at: string | null
          customer_id: string
          data: Json | null
          error_message: string | null
          id: string
          message: string
          notification_type: string
          read_at: string | null
          sent: boolean
          title: string | null
        }
        Insert: {
          channel?: string
          created_at?: string | null
          customer_id: string
          data?: Json | null
          error_message?: string | null
          id?: string
          message: string
          notification_type: string
          read_at?: string | null
          sent?: boolean
          title?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          customer_id?: string
          data?: Json | null
          error_message?: string | null
          id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          sent?: boolean
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_activity_feed: {
        Row: {
          activity_type: string
          author_id: string
          content: string
          created_at: string | null
          id: string
          order_id: number
        }
        Insert: {
          activity_type: string
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          order_id: number
        }
        Update: {
          activity_type?: string
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          order_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_activity_feed_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          change_type: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          new_payment_status: string | null
          new_status: string
          notes: string | null
          old_payment_status: string | null
          old_status: string | null
          order_id: string
        }
        Insert: {
          change_type?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_payment_status?: string | null
          new_status: string
          notes?: string | null
          old_payment_status?: string | null
          old_status?: string | null
          order_id: string
        }
        Update: {
          change_type?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_payment_status?: string | null
          new_status?: string
          notes?: string | null
          old_payment_status?: string | null
          old_status?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ecom_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_log: {
        Row: {
          changed_at: string | null
          id: string
          new_status: string | null
          order_id: string | null
          previous_status: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_status?: string | null
          order_id?: string | null
          previous_status?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_status?: string | null
          order_id?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ecom_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cny_price: number
          created_at: string
          customer_id: string
          customer_name: string
          customer_unique_id: string | null
          estimated_duration_days: number | null
          estimated_weight_kg: number | null
          id: number
          item_tracking_numbers: string | null
          items: Json
          notes: string | null
          order_id: string | null
          order_status: string
          payment_reference: string | null
          payment_status: string
          product_id: number | null
          product_link: string
          product_name: string | null
          quantity: number
          screenshot_url: string | null
          shipment_start_date: string | null
          shipping_cost: number | null
          shipping_fee_paid: boolean | null
          shipping_fee_payment_reference: string | null
          shipping_mode: string | null
          total: number
          type: string
        }
        Insert: {
          cny_price?: number
          created_at?: string
          customer_id?: string
          customer_name: string
          customer_unique_id?: string | null
          estimated_duration_days?: number | null
          estimated_weight_kg?: number | null
          id?: number
          item_tracking_numbers?: string | null
          items?: Json
          notes?: string | null
          order_id?: string | null
          order_status?: string
          payment_reference?: string | null
          payment_status?: string
          product_id?: number | null
          product_link?: string
          product_name?: string | null
          quantity?: number
          screenshot_url?: string | null
          shipment_start_date?: string | null
          shipping_cost?: number | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          shipping_mode?: string | null
          total?: number
          type?: string
        }
        Update: {
          cny_price?: number
          created_at?: string
          customer_id?: string
          customer_name?: string
          customer_unique_id?: string | null
          estimated_duration_days?: number | null
          estimated_weight_kg?: number | null
          id?: number
          item_tracking_numbers?: string | null
          items?: Json
          notes?: string | null
          order_id?: string | null
          order_status?: string
          payment_reference?: string | null
          payment_status?: string
          product_id?: number | null
          product_link?: string
          product_name?: string | null
          quantity?: number
          screenshot_url?: string | null
          shipment_start_date?: string | null
          shipping_cost?: number | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          shipping_mode?: string | null
          total?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reconciliation_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          errors: number | null
          id: number
          recovered: number | null
          still_pending: number | null
          total_checked: number | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          errors?: number | null
          id?: number
          recovered?: number | null
          still_pending?: number | null
          total_checked?: number | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          errors?: number | null
          id?: number
          recovered?: number | null
          still_pending?: number | null
          total_checked?: number | null
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          admin_notes: string | null
          affiliate_id: string | null
          amount: number
          created_at: string | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          processed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          affiliate_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          affiliate_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_cycles: {
        Row: {
          created_at: string
          cutoff_date: string
          id: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string
          cutoff_date: string
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string
          cutoff_date?: string
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
          is_primary: boolean | null
          media_type: string | null
          product_id: number
          public_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
          is_primary?: boolean | null
          media_type?: string | null
          product_id: number
          public_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
          is_primary?: boolean | null
          media_type?: string | null
          product_id?: number
          public_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string
          id: string
          product_id: number | null
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: number | null
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number | null
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          combination: Json | null
          cost_price_cny: number | null
          created_at: string | null
          id: number
          image_public_id: string | null
          image_url: string | null
          price: number
          price_cny: number | null
          product_id: number
          selling_price_ghs: number | null
          sku: string | null
          stock: number
          variant_options: Json | null
        }
        Insert: {
          combination?: Json | null
          cost_price_cny?: number | null
          created_at?: string | null
          id?: number
          image_public_id?: string | null
          image_url?: string | null
          price: number
          price_cny?: number | null
          product_id: number
          selling_price_ghs?: number | null
          sku?: string | null
          stock?: number
          variant_options?: Json | null
        }
        Update: {
          combination?: Json | null
          cost_price_cny?: number | null
          created_at?: string | null
          id?: number
          image_public_id?: string | null
          image_url?: string | null
          price?: number
          price_cny?: number | null
          product_id?: number
          selling_price_ghs?: number | null
          sku?: string | null
          stock?: number
          variant_options?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          cost_price_cny: number | null
          created_at: string
          created_by: string | null
          description: string | null
          embedding: string | null
          forced_shipping_method: string | null
          general_options_prices: Json | null
          general_options_prices_cny: Json | null
          id: number
          image: string | null
          image_url: string | null
          importer_id: string | null
          is_promotion: boolean | null
          is_trending: boolean | null
          name: string
          price: number
          price_cny: number | null
          product_code: string | null
          product_link: string | null
          promotion_order: number | null
          sales_count: number | null
          selling_price_ghs: number | null
          service_fee_applicable: boolean
          sku: string
          source_platform: string | null
          source_url: string | null
          status: string
          stock: number
          view_count: number | null
        }
        Insert: {
          category?: string | null
          cost_price_cny?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          embedding?: string | null
          forced_shipping_method?: string | null
          general_options_prices?: Json | null
          general_options_prices_cny?: Json | null
          id?: number
          image?: string | null
          image_url?: string | null
          importer_id?: string | null
          is_promotion?: boolean | null
          is_trending?: boolean | null
          name: string
          price?: number
          price_cny?: number | null
          product_code?: string | null
          product_link?: string | null
          promotion_order?: number | null
          sales_count?: number | null
          selling_price_ghs?: number | null
          service_fee_applicable?: boolean
          sku: string
          source_platform?: string | null
          source_url?: string | null
          status?: string
          stock?: number
          view_count?: number | null
        }
        Update: {
          category?: string | null
          cost_price_cny?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          embedding?: string | null
          forced_shipping_method?: string | null
          general_options_prices?: Json | null
          general_options_prices_cny?: Json | null
          id?: number
          image?: string | null
          image_url?: string | null
          importer_id?: string | null
          is_promotion?: boolean | null
          is_trending?: boolean | null
          name?: string
          price?: number
          price_cny?: number | null
          product_code?: string | null
          product_link?: string | null
          promotion_order?: number | null
          sales_count?: number | null
          selling_price_ghs?: number | null
          service_fee_applicable?: boolean
          sku?: string
          source_platform?: string | null
          source_url?: string | null
          status?: string
          stock?: number
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_importer_id_fkey"
            columns: ["importer_id"]
            isOneToOne: false
            referencedRelation: "importers"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          action_label: string | null
          created_at: string
          headline: string | null
          id: number
          image_transform: string | null
          internal_name: string
          is_active: boolean
          link: string | null
          link_url: string | null
          media_type: string
          media_url: string
          media_url_thumbnail: string | null
          name: string | null
          public_id: string | null
          subtext: string | null
          thumbnail_url: string | null
        }
        Insert: {
          action_label?: string | null
          created_at?: string
          headline?: string | null
          id?: number
          image_transform?: string | null
          internal_name: string
          is_active?: boolean
          link?: string | null
          link_url?: string | null
          media_type?: string
          media_url: string
          media_url_thumbnail?: string | null
          name?: string | null
          public_id?: string | null
          subtext?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          action_label?: string | null
          created_at?: string
          headline?: string | null
          id?: number
          image_transform?: string | null
          internal_name?: string
          is_active?: boolean
          link?: string | null
          link_url?: string | null
          media_type?: string
          media_url?: string
          media_url_thumbnail?: string | null
          name?: string | null
          public_id?: string | null
          subtext?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      qc_inspections: {
        Row: {
          id: string
          inspected_at: string | null
          inspector_id: string | null
          notes: string | null
          package_id: string | null
          photos: Json | null
          status: string | null
        }
        Insert: {
          id?: string
          inspected_at?: string | null
          inspector_id?: string | null
          notes?: string | null
          package_id?: string | null
          photos?: Json | null
          status?: string | null
        }
        Update: {
          id?: string
          inspected_at?: string | null
          inspector_id?: string | null
          notes?: string | null
          package_id?: string | null
          photos?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qc_inspections_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "incoming_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      recently_viewed: {
        Row: {
          customer_id: string
          id: string
          product_id: number
          viewed_at: string | null
        }
        Insert: {
          customer_id: string
          id?: string
          product_id: number
          viewed_at?: string | null
        }
        Update: {
          customer_id?: string
          id?: string
          product_id?: number
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_logs: {
        Row: {
          current_status: string | null
          customer_name: string | null
          id: string
          items_description: string | null
          package_id: string | null
          package_type: string | null
          scan_result: string
          scanned_at: string | null
          scanned_tracking: string
        }
        Insert: {
          current_status?: string | null
          customer_name?: string | null
          id?: string
          items_description?: string | null
          package_id?: string | null
          package_type?: string | null
          scan_result: string
          scanned_at?: string | null
          scanned_tracking: string
        }
        Update: {
          current_status?: string | null
          customer_name?: string | null
          id?: string
          items_description?: string | null
          package_id?: string | null
          package_type?: string | null
          scan_result?: string
          scanned_at?: string | null
          scanned_tracking?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          air_base_fee: number
          air_rate_per_kg: number
          created_at: string
          exchange_rate_cny_to_ghs: number | null
          exchange_rate_ghs_to_cny: number | null
          hubtel_api_id: string | null
          hubtel_api_key: string | null
          hubtel_callback_url: string | null
          hubtel_client_id: string | null
          hubtel_client_secret: string | null
          hubtel_merchant_account: string | null
          hubtel_test_mode: boolean | null
          id: number
          maintenance_mode: boolean
          maintenance_pages: Json | null
          payment_gateway: string | null
          payment_rates: Json | null
          public_email: string
          public_phone: string | null
          rate_link_orders: number | null
          rate_shop_products: number | null
          rates: Json | null
          sea_base_fee: number
          sea_rate_per_kg: number
          store_name: string
          updated_at: string | null
          usd_ghs_rate: number | null
          warehouse_address: string | null
        }
        Insert: {
          air_base_fee?: number
          air_rate_per_kg?: number
          created_at?: string
          exchange_rate_cny_to_ghs?: number | null
          exchange_rate_ghs_to_cny?: number | null
          hubtel_api_id?: string | null
          hubtel_api_key?: string | null
          hubtel_callback_url?: string | null
          hubtel_client_id?: string | null
          hubtel_client_secret?: string | null
          hubtel_merchant_account?: string | null
          hubtel_test_mode?: boolean | null
          id?: number
          maintenance_mode?: boolean
          maintenance_pages?: Json | null
          payment_gateway?: string | null
          payment_rates?: Json | null
          public_email?: string
          public_phone?: string | null
          rate_link_orders?: number | null
          rate_shop_products?: number | null
          rates?: Json | null
          sea_base_fee?: number
          sea_rate_per_kg?: number
          store_name?: string
          updated_at?: string | null
          usd_ghs_rate?: number | null
          warehouse_address?: string | null
        }
        Update: {
          air_base_fee?: number
          air_rate_per_kg?: number
          created_at?: string
          exchange_rate_cny_to_ghs?: number | null
          exchange_rate_ghs_to_cny?: number | null
          hubtel_api_id?: string | null
          hubtel_api_key?: string | null
          hubtel_callback_url?: string | null
          hubtel_client_id?: string | null
          hubtel_client_secret?: string | null
          hubtel_merchant_account?: string | null
          hubtel_test_mode?: boolean | null
          id?: number
          maintenance_mode?: boolean
          maintenance_pages?: Json | null
          payment_gateway?: string | null
          payment_rates?: Json | null
          public_email?: string
          public_phone?: string | null
          rate_link_orders?: number | null
          rate_shop_products?: number | null
          rates?: Json | null
          sea_base_fee?: number
          sea_rate_per_kg?: number
          store_name?: string
          updated_at?: string | null
          usd_ghs_rate?: number | null
          warehouse_address?: string | null
        }
        Relationships: []
      }
      shared_carts: {
        Row: {
          access_count: number | null
          cart_data: Json
          created_at: string | null
          expires_at: string | null
          id: string
          share_code: string
        }
        Insert: {
          access_count?: number | null
          cart_data: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          share_code: string
        }
        Update: {
          access_count?: number | null
          cart_data?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          share_code?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          arrival_photo_url: string | null
          associated_order_ids: Json | null
          carrier: string | null
          created_at: string
          current_location: string | null
          customer_contact: string | null
          customer_id: string
          customer_name: string | null
          customer_unique_id: string | null
          destination: string | null
          estimated_duration_days: number | null
          eta_days: number | null
          id: string
          image_url: string | null
          items_description: string | null
          method: string | null
          order_id: string | null
          origin: string | null
          registration_fee_paid: boolean | null
          registration_fee_payment_reference: string | null
          shipment_start_date: string | null
          shipping_cost: string | null
          shipping_fee_paid: boolean | null
          shipping_fee_payment_reference: string | null
          status: string
          total_weight_kg: number | null
          tracking_number: string
        }
        Insert: {
          arrival_photo_url?: string | null
          associated_order_ids?: Json | null
          carrier?: string | null
          created_at?: string
          current_location?: string | null
          customer_contact?: string | null
          customer_id?: string
          customer_name?: string | null
          customer_unique_id?: string | null
          destination?: string | null
          estimated_duration_days?: number | null
          eta_days?: number | null
          id?: string
          image_url?: string | null
          items_description?: string | null
          method?: string | null
          order_id?: string | null
          origin?: string | null
          registration_fee_paid?: boolean | null
          registration_fee_payment_reference?: string | null
          shipment_start_date?: string | null
          shipping_cost?: string | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          status?: string
          total_weight_kg?: number | null
          tracking_number: string
        }
        Update: {
          arrival_photo_url?: string | null
          associated_order_ids?: Json | null
          carrier?: string | null
          created_at?: string
          current_location?: string | null
          customer_contact?: string | null
          customer_id?: string
          customer_name?: string | null
          customer_unique_id?: string | null
          destination?: string | null
          estimated_duration_days?: number | null
          eta_days?: number | null
          id?: string
          image_url?: string | null
          items_description?: string | null
          method?: string | null
          order_id?: string | null
          origin?: string | null
          registration_fee_paid?: boolean | null
          registration_fee_payment_reference?: string | null
          shipment_start_date?: string | null
          shipping_cost?: string | null
          shipping_fee_paid?: boolean | null
          shipping_fee_payment_reference?: string | null
          status?: string
          total_weight_kg?: number | null
          tracking_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ecom_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_ads: {
        Row: {
          audience: string | null
          created_at: string | null
          end_date: string | null
          frequency_per_24h: number | null
          id: string
          image_public_id: string | null
          image_url: string
          link_url: string | null
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency_per_24h?: number | null
          id?: string
          image_public_id?: string | null
          image_url: string
          link_url?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          end_date?: string | null
          frequency_per_24h?: number | null
          id?: string
          image_public_id?: string | null
          image_url?: string
          link_url?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          avg_delivery_days: number | null
          contact_info: string | null
          created_at: string | null
          disputes: number | null
          id: string
          name: string
          platform: string | null
          store_link: string | null
          success_rate: number | null
          total_orders: number | null
        }
        Insert: {
          avg_delivery_days?: number | null
          contact_info?: string | null
          created_at?: string | null
          disputes?: number | null
          id?: string
          name: string
          platform?: string | null
          store_link?: string | null
          success_rate?: number | null
          total_orders?: number | null
        }
        Update: {
          avg_delivery_days?: number | null
          contact_info?: string | null
          created_at?: string | null
          disputes?: number | null
          id?: string
          name?: string
          platform?: string | null
          store_link?: string | null
          success_rate?: number | null
          total_orders?: number | null
        }
        Relationships: []
      }
      support_escalations: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_name: string | null
          id: string
          issue_text: string
          related_id: string
          related_type: string
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          id?: string
          issue_text: string
          related_id: string
          related_type: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          id?: string
          issue_text?: string
          related_id?: string
          related_type?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      telegram_broadcasts: {
        Row: {
          audience: string
          channel: string
          created_at: string
          created_by: string | null
          id: string
          message_text: string
          status: string
        }
        Insert: {
          audience?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          id?: string
          message_text: string
          status?: string
        }
        Update: {
          audience?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          id?: string
          message_text?: string
          status?: string
        }
        Relationships: []
      }
      telegram_messages: {
        Row: {
          chat_id: string
          created_at: string | null
          customer_id: string | null
          direction: string
          id: string
          is_read: boolean | null
          media_type: string | null
          media_url: string | null
          message_text: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          customer_id?: string | null
          direction: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_text?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_verification_tokens: {
        Row: {
          chat_id: number | null
          created_at: string | null
          customer_id: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          chat_id?: number | null
          created_at?: string | null
          customer_id: string
          expires_at?: string
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          chat_id?: number | null
          created_at?: string | null
          customer_id?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_verification_tokens_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      unmatched_packages: {
        Row: {
          arrival_date: string | null
          assigned_customer_id: string | null
          cbm: number | null
          created_at: string | null
          id: string
          notes: string | null
          photos: Json | null
          resolved_at: string | null
          status: string | null
          tracking_number: string | null
          weight: number | null
        }
        Insert: {
          arrival_date?: string | null
          assigned_customer_id?: string | null
          cbm?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          photos?: Json | null
          resolved_at?: string | null
          status?: string | null
          tracking_number?: string | null
          weight?: number | null
        }
        Update: {
          arrival_date?: string | null
          assigned_customer_id?: string | null
          cbm?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          photos?: Json | null
          resolved_at?: string | null
          status?: string | null
          tracking_number?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "unmatched_packages_assigned_customer_id_fkey"
            columns: ["assigned_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          created_at: string | null
          customer_id: string
          delivery_notes: string | null
          email: string
          id: string
          is_primary: boolean | null
          label: string
          name: string
          phone: string
          street_address: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          delivery_notes?: string | null
          email: string
          id?: string
          is_primary?: boolean | null
          label: string
          name: string
          phone: string
          street_address: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          delivery_notes?: string | null
          email?: string
          id?: string
          is_primary?: boolean | null
          label?: string
          name?: string
          phone?: string
          street_address?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dismissed_announcements: {
        Row: {
          announcement_id: number | null
          dismissed_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          announcement_id?: number | null
          dismissed_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          announcement_id?: number | null
          dismissed_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_dismissed_announcements_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          customer_id: string
          email_notifications: boolean | null
          id: string
          order_updates: boolean | null
          promotional_emails: boolean | null
          updated_at: string | null
          whatsapp_notifications: boolean | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          email_notifications?: boolean | null
          id?: string
          order_updates?: boolean | null
          promotional_emails?: boolean | null
          updated_at?: string | null
          whatsapp_notifications?: boolean | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          email_notifications?: boolean | null
          id?: string
          order_updates?: boolean | null
          promotional_emails?: boolean | null
          updated_at?: string | null
          whatsapp_notifications?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_searches: {
        Row: {
          created_at: string | null
          id: number
          ip_address: string | null
          search_date: string | null
          search_query: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          ip_address?: string | null
          search_date?: string | null
          search_query: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          ip_address?: string | null
          search_date?: string | null
          search_query?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          last_active_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_active_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_active_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      warehouse_addresses: {
        Row: {
          address: string
          created_at: string | null
          id: string
          is_default: boolean | null
          location: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          location: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          location?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          product_id: number
          variant_id: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          product_id: number
          variant_id?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          product_id?: number
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          importer_id: string
          momo_network: string
          momo_number: string
          processed_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          importer_id: string
          momo_network: string
          momo_number: string
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          importer_id?: string
          momo_network?: string
          momo_number?: string
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_importer_id_fkey"
            columns: ["importer_id"]
            isOneToOne: false
            referencedRelation: "importers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_set_employee_status:
        | {
            Args: { p_employee_id: string; p_notes?: string; p_status: string }
            Returns: Json
          }
        | {
            Args: {
              p_employee_id: string
              p_notes?: string
              p_staff_role?: string
              p_status: string
            }
            Returns: Json
          }
      check_account_exists: {
        Args: { p_email: string; p_phone?: string }
        Returns: Json
      }
      check_admin_safe: { Args: never; Returns: boolean }
      cleanup_expired_shared_carts: { Args: never; Returns: number }
      cleanup_expired_telegram_tokens: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      confirm_payment_client_side: {
        Args: { p_order_id: number; p_reference: string }
        Returns: Json
      }
      create_customer_profile: {
        Args: {
          p_customer_unique_id?: string
          p_email: string
          p_name: string
          p_phone?: string
          p_referral_code_used?: string
          p_status?: string
          p_user_id: string
        }
        Returns: undefined
      }
      create_employee_profile: {
        Args: {
          p_email: string
          p_full_name: string
          p_phone?: string
          p_user_id: string
        }
        Returns: Json
      }
      decrement_product_stock:
        | {
            Args: { decrement_qty: number; product_id_to_update: number }
            Returns: undefined
          }
        | {
            Args: {
              product_id_to_update: string
              quantity_to_decrement: number
            }
            Returns: undefined
          }
      decrement_variant_stock:
        | {
            Args: { decrement_qty: number; variant_id_to_update: number }
            Returns: undefined
          }
        | {
            Args: { decrement_qty: number; variant_id_to_update: number }
            Returns: undefined
          }
      delete_own_order: { Args: { p_order_id: string }; Returns: undefined }
      delete_unpaid_orders_after_24hours: { Args: never; Returns: number }
      delete_unpaid_orders_after_30min: { Args: never; Returns: number }
      delete_user_account: { Args: never; Returns: undefined }
      fn_fulfill_ecom_order: {
        Args: { order_id_to_fulfill: number }
        Returns: string
      }
      generate_customer_unique_id: {
        Args: { full_name: string }
        Returns: string
      }
      generate_share_code: { Args: never; Returns: string }
      get_employee_status: { Args: never; Returns: Json }
      get_product_rating: {
        Args: { product_id_param: number }
        Returns: {
          average_rating: number
          rating_breakdown: Json
          total_reviews: number
        }[]
      }
      get_promotion_products: {
        Args: { limit_count?: number }
        Returns: {
          id: number
          main_image_url: string
          name: string
          price: number
          promotion_order: number
          sku: string
          stock: number
        }[]
      }
      get_related_products: {
        Args: {
          category_param: string
          limit_count?: number
          product_id_param: number
        }
        Returns: {
          id: number
          main_image_url: string
          name: string
          price: number
          sku: string
          stock: number
        }[]
      }
      get_top_selling_products: {
        Args: { from_date: string }
        Returns: {
          product_id: number
          product_name: string
          total_sold: number
        }[]
      }
      get_trending_products: {
        Args: { limit_count?: number }
        Returns: {
          id: number
          main_image_url: string
          name: string
          price: number
          sales_count: number
          sku: string
          stock: number
          view_count: number
        }[]
      }
      increment_product_view_count: {
        Args: { product_id_param: number }
        Returns: undefined
      }
      increment_shared_cart_access: {
        Args: { cart_share_code: string }
        Returns: undefined
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_user_admin: { Args: { check_user_id: string }; Returns: boolean }
      log_user_notification: {
        Args: {
          p_customer_id: string
          p_data?: Json
          p_message: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      match_products: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          id: string
          similarity: number
        }[]
      }
      match_shipment_by_id_prefix: {
        Args: { p_prefix: string }
        Returns: {
          arrival_photo_url: string | null
          associated_order_ids: Json | null
          carrier: string | null
          created_at: string
          current_location: string | null
          customer_contact: string | null
          customer_id: string
          customer_name: string | null
          customer_unique_id: string | null
          destination: string | null
          estimated_duration_days: number | null
          eta_days: number | null
          id: string
          image_url: string | null
          items_description: string | null
          method: string | null
          order_id: string | null
          origin: string | null
          registration_fee_paid: boolean | null
          registration_fee_payment_reference: string | null
          shipment_start_date: string | null
          shipping_cost: string | null
          shipping_fee_paid: boolean | null
          shipping_fee_payment_reference: string | null
          status: string
          total_weight_kg: number | null
          tracking_number: string
        }[]
        SetofOptions: {
          from: "*"
          to: "shipments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      process_scanned_package: {
        Args: { scanned_tracking: string }
        Returns: Json
      }
      refresh_cached_ghs_prices: { Args: never; Returns: undefined }
      search_products: {
        Args: { search_query: string }
        Returns: {
          category: string
          created_at: string
          description: string
          has_variants: boolean
          id: number
          name: string
          price: number
          primary_image: string
          rank: number
          status: string
          stock: number
          stock_status: string
        }[]
      }
      search_users_for_admin: {
        Args: { search_term: string }
        Returns: {
          created_at: string
          customer_unique_id: string | null
          email: string
          id: string
          name: string
          phone: string | null
          referral_code_used: string | null
          referred_by_affiliate_id: string | null
          role: string | null
          status: string
          telegram_chat_id: string | null
          telegram_notifications_enabled: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "customers"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      send_telegram_notification: {
        Args: {
          p_customer_id: string
          p_data?: Json
          p_message: string
          p_title: string
          p_type: string
        }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      track_package: { Args: { search_query: string }; Returns: Json }
      update_product_prices_by_multiplier: {
        Args: { multiplier: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
