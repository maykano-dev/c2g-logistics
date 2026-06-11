--
-- PostgreSQL database dump
--

\restrict bTdE9DGHg2GDU7CsjJXn8w2MzxPOLi9APcUkyu0PfOEaaJidQBVuVkYAXVVOh22

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: private; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA private;


ALTER SCHEMA private OWNER TO postgres;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

      IF EXISTS (
        SELECT FROM pg_extension
        WHERE extname = 'pg_net'
        -- all versions in use on existing projects as of 2025-02-20
        -- version 0.12.0 onwards don't need these applied
        AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
      ) THEN
        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      END IF;
    END IF;
  END;
  $$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: set_claim(uuid, text, jsonb); Type: FUNCTION; Schema: private; Owner: postgres
--

CREATE FUNCTION private.set_claim(uid uuid, claim text, value jsonb) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- The check for is_admin is currently a placeholder
  -- if not is_admin(uid) then
  --   return 'error: access denied';
  -- else
    UPDATE auth.users SET raw_app_meta_data = 
      raw_app_meta_data || 
      jsonb_build_object(claim, value) WHERE id = uid;
    RETURN 'claim set';
  -- end if;
END;
$$;


ALTER FUNCTION private.set_claim(uid uuid, claim text, value jsonb) OWNER TO postgres;

--
-- Name: admin_set_employee_status(uuid, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
    v_admin_id uuid := auth.uid();
    v_is_admin boolean;
    v_row public.employees%rowtype;
begin
    if v_admin_id is null then
        return jsonb_build_object('ok', false, 'error', 'not_authenticated');
    end if;

    select exists(select 1 from public.admins where user_id = v_admin_id)
        into v_is_admin;
    if not v_is_admin then
        return jsonb_build_object('ok', false, 'error', 'forbidden');
    end if;

    if p_status not in ('pending', 'approved', 'rejected', 'suspended') then
        return jsonb_build_object('ok', false, 'error', 'invalid_status');
    end if;

    update public.employees
    set status = p_status,
        notes = coalesce(p_notes, notes),
        approved_at = case when p_status = 'approved' then now() else approved_at end,
        approved_by = case when p_status = 'approved' then v_admin_id else approved_by end
    where id = p_employee_id
    returning * into v_row;

    if not found then
        return jsonb_build_object('ok', false, 'error', 'not_found');
    end if;

    return jsonb_build_object(
        'ok', true,
        'id', v_row.id,
        'status', v_row.status
    );
end;
$$;


ALTER FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text) OWNER TO postgres;

--
-- Name: admin_set_employee_status(uuid, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text DEFAULT NULL::text, p_staff_role text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    v_admin_id uuid := auth.uid();
    v_is_admin boolean;
    v_row public.employees%rowtype;
BEGIN
    IF v_admin_id IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
    END IF;

    SELECT EXISTS(SELECT 1 FROM public.admins WHERE user_id = v_admin_id)
        INTO v_is_admin;
    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
    END IF;

    IF p_status NOT IN ('pending', 'approved', 'rejected', 'suspended') THEN
        RETURN jsonb_build_object('ok', false, 'error', 'invalid_status');
    END IF;
    
    IF p_staff_role IS NOT NULL AND p_staff_role NOT IN ('support', 'warehouse', 'sourcing') THEN
        RETURN jsonb_build_object('ok', false, 'error', 'invalid_role');
    END IF;

    UPDATE public.employees
    SET status = p_status,
        notes = COALESCE(p_notes, notes),
        staff_role = COALESCE(p_staff_role, staff_role),
        approved_at = CASE WHEN p_status = 'approved' THEN now() ELSE approved_at END,
        approved_by = CASE WHEN p_status = 'approved' THEN v_admin_id ELSE approved_by END
    WHERE id = p_employee_id
    RETURNING * INTO v_row;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', false, 'error', 'not_found');
    END IF;

    RETURN jsonb_build_object(
        'ok', true,
        'id', v_row.id,
        'status', v_row.status,
        'staff_role', v_row.staff_role
    );
END;
$$;


ALTER FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text, p_staff_role text) OWNER TO postgres;

--
-- Name: auto_link_customer_to_affiliate(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_link_customer_to_affiliate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    affiliate_id_to_link UUID;
BEGIN
    -- Only process if referral_code_used is provided and customer not already linked
    IF NEW.referral_code_used IS NOT NULL AND NEW.referred_by_affiliate_id IS NULL THEN
        
        -- Look up the affiliate by code (must be approved)
        SELECT id INTO affiliate_id_to_link
        FROM affiliate_profiles
        WHERE affiliate_code = NEW.referral_code_used
        AND status = 'approved'
        LIMIT 1;
        
        -- If affiliate found, link the customer
        IF affiliate_id_to_link IS NOT NULL THEN
            NEW.referred_by_affiliate_id := affiliate_id_to_link;
            
            RAISE NOTICE 'Customer % automatically linked to affiliate % (code: %)', 
                NEW.id, affiliate_id_to_link, NEW.referral_code_used;
        ELSE
            RAISE WARNING 'Referral code % not found or not approved', NEW.referral_code_used;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_link_customer_to_affiliate() OWNER TO postgres;

--
-- Name: check_account_exists(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_account_exists(p_email text, p_phone text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
    v_email_row record;
    v_phone_row record;
    v_normalized_email text := lower(trim(coalesce(p_email, '')));
    v_normalized_phone text := trim(coalesce(p_phone, ''));
begin
    -- ---------- email lookup (case-insensitive) ----------
    if length(v_normalized_email) > 0 then
        select id, status, email
        into v_email_row
        from customers
        where lower(trim(email)) = v_normalized_email
        limit 1;
    end if;

    -- ---------- phone lookup (exact text) ----------
    if length(v_normalized_phone) > 0 then
        select id, status, phone
        into v_phone_row
        from customers
        where phone::text = v_normalized_phone
        limit 1;
    end if;

    return jsonb_build_object(
        'email_exists', v_email_row.id is not null,
        'email_status', v_email_row.status,
        'phone_exists', v_phone_row.id is not null,
        'phone_status', v_phone_row.status
    );
end;
$$;


ALTER FUNCTION public.check_account_exists(p_email text, p_phone text) OWNER TO postgres;

--
-- Name: FUNCTION check_account_exists(p_email text, p_phone text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.check_account_exists(p_email text, p_phone text) IS 'Checks if a customers row exists for the given email and/or phone. Runs as SECURITY DEFINER so it can bypass RLS during pre-signup validation.';


--
-- Name: check_admin_safe(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_admin_safe() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    -- Direct query to admins table, bypassing any RLS on admins table due to SECURITY DEFINER
    RETURN EXISTS (
        SELECT 1 
        FROM admins 
        WHERE user_id = auth.uid()
    );
END;
$$;


ALTER FUNCTION public.check_admin_safe() OWNER TO postgres;

--
-- Name: cleanup_expired_shared_carts(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_expired_shared_carts() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM shared_carts WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;


ALTER FUNCTION public.cleanup_expired_shared_carts() OWNER TO postgres;

--
-- Name: cleanup_expired_telegram_tokens(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_expired_telegram_tokens() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM telegram_verification_tokens
    WHERE expires_at < NOW() OR used = TRUE;
END;
$$;


ALTER FUNCTION public.cleanup_expired_telegram_tokens() OWNER TO postgres;

--
-- Name: confirm_payment_client_side(bigint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.confirm_payment_client_side(p_order_id bigint, p_reference text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_order_exists boolean;
begin
  -- Check if order exists and matches reference
  select exists(
    select 1 from ecom_orders 
    where id = p_order_id 
    and payment_reference = p_reference
  ) into v_order_exists;

  if v_order_exists then
    update ecom_orders
    set 
      payment_status = 'paid',
      updated_at = now()
    where id = p_order_id;
    
    return json_build_object('success', true, 'message', 'Order updated');
  else
    return json_build_object('success', false, 'message', 'Order mismatch');
  end if;
end;
$$;


ALTER FUNCTION public.confirm_payment_client_side(p_order_id bigint, p_reference text) OWNER TO postgres;

--
-- Name: create_affiliate_earning_for_ecom_order(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_affiliate_earning_for_ecom_order() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_customer_affiliate_id UUID;
    v_commission_amount DECIMAL(10,2);
    v_item_count INTEGER := 0;
    v_commission_per_item DECIMAL(10,2) := 1.00; -- 1 cedi per item
BEGIN
    -- Only process when payment_status changes to 'paid' or 'completed'
    IF (NEW.payment_status IN ('paid', 'completed') AND 
        (OLD.payment_status IS NULL OR OLD.payment_status NOT IN ('paid', 'completed'))) THEN
        
        -- Get the affiliate ID that referred this customer
        SELECT referred_by_affiliate_id INTO v_customer_affiliate_id
        FROM customers
        WHERE id = NEW.customer_id
        AND referred_by_affiliate_id IS NOT NULL;
        
        -- If customer was referred, create earning
        IF v_customer_affiliate_id IS NOT NULL THEN
            -- Count items from JSONB items array (sum of quantities)
            SELECT COALESCE(SUM((item->>'quantity')::INTEGER), jsonb_array_length(NEW.items))
            INTO v_item_count
            FROM jsonb_array_elements(NEW.items) AS item;
            
            -- Fallback: if items is null or empty, count as 1
            IF v_item_count IS NULL OR v_item_count = 0 THEN
                v_item_count := 1;
            END IF;
            
            -- Calculate commission (1 cedi per item)
            v_commission_amount := v_item_count * v_commission_per_item;
            
            -- Insert affiliate earning
            INSERT INTO affiliate_earnings (
                affiliate_id,
                customer_id,
                order_id,
                order_type,
                order_total,
                amount,
                status,
                created_at
            ) VALUES (
                v_customer_affiliate_id,
                NEW.customer_id,
                NEW.id,
                'ecom_mall',
                NEW.total_amount,
                v_commission_amount,
                'pending',
                NOW()
            );
            
            RAISE NOTICE 'Created affiliate earning: % items × 1 cedi = % GHS for ecom order %', 
                v_item_count, v_commission_amount, NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_affiliate_earning_for_ecom_order() OWNER TO postgres;

--
-- Name: create_customer_profile(uuid, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text DEFAULT NULL::text, p_customer_unique_id text DEFAULT NULL::text, p_status text DEFAULT 'active'::text, p_referral_code_used text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_phone_numeric NUMERIC;
BEGIN
    -- Convert phone to numeric if provided
    IF p_phone IS NOT NULL AND p_phone != '' THEN
        BEGIN
            -- Remove non-numeric characters
            v_phone_numeric := CAST(REGEXP_REPLACE(p_phone, '[^0-9]', '', 'g') AS NUMERIC);
        EXCEPTION WHEN OTHERS THEN
            v_phone_numeric := NULL;
        END;
    ELSE
        v_phone_numeric := NULL;
    END IF;

    -- Insert customer with referral_code_used
    -- The trigger will automatically look up and link to affiliate
    INSERT INTO customers (
        id,
        name,
        email,
        phone,
        customer_unique_id,
        status,
        referral_code_used  -- Trigger will use this to link affiliate
    ) VALUES (
        p_user_id,
        p_name,
        p_email,
        v_phone_numeric,
        COALESCE(p_customer_unique_id, 'CUST-' || SUBSTRING(p_user_id::TEXT, 1, 8)),
        p_status,
        p_referral_code_used
    );

    RAISE NOTICE 'Customer profile created for %', p_email;
END;
$$;


ALTER FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text) OWNER TO postgres;

--
-- Name: FUNCTION create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text) IS 'Creates a customer profile with automatic affiliate linking via trigger';


--
-- Name: create_employee_profile(uuid, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
    v_existing public.employees%rowtype;
    v_inserted public.employees%rowtype;
    v_auth_uid uuid := auth.uid();
    v_user_exists boolean;
begin
    if p_user_id is null then
        return jsonb_build_object('ok', false, 'error', 'missing_user_id');
    end if;

    -- If there IS an authenticated session, it must match p_user_id. When
    -- there's no session (fresh signup, cookie not yet set), we accept it.
    if v_auth_uid is not null and v_auth_uid <> p_user_id then
        return jsonb_build_object('ok', false, 'error', 'user_id_mismatch');
    end if;

    -- Verify the user_id is real so anon traffic can't inject arbitrary rows.
    select exists(select 1 from auth.users where id = p_user_id) into v_user_exists;
    if not v_user_exists then
        return jsonb_build_object('ok', false, 'error', 'user_not_found');
    end if;

    if coalesce(trim(p_full_name), '') = '' then
        return jsonb_build_object('ok', false, 'error', 'missing_name');
    end if;
    if coalesce(trim(p_email), '') = '' then
        return jsonb_build_object('ok', false, 'error', 'missing_email');
    end if;

    -- Idempotent: if a row already exists for this user, return it instead
    -- of raising a unique-violation so a retry from the client is safe.
    select * into v_existing from public.employees where user_id = p_user_id;
    if found then
        return jsonb_build_object(
            'ok', true,
            'already_existed', true,
            'status', v_existing.status,
            'id', v_existing.id
        );
    end if;

    insert into public.employees (user_id, full_name, email, phone, status)
    values (p_user_id, trim(p_full_name), lower(trim(p_email)), nullif(trim(p_phone), ''), 'pending')
    returning * into v_inserted;

    return jsonb_build_object(
        'ok', true,
        'already_existed', false,
        'status', v_inserted.status,
        'id', v_inserted.id
    );
end;
$$;


ALTER FUNCTION public.create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text) OWNER TO postgres;

--
-- Name: decrement_product_stock(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.decrement_product_stock(product_id_to_update integer, decrement_qty integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    update public.products
    set stock = stock - decrement_qty
    where id = product_id_to_update
    and stock >= decrement_qty;
end;
$$;


ALTER FUNCTION public.decrement_product_stock(product_id_to_update integer, decrement_qty integer) OWNER TO postgres;

--
-- Name: decrement_product_stock(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  update public.products
  set stock = stock - quantity_to_decrement
  where id = product_id_to_update;
end;
$$;


ALTER FUNCTION public.decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer) OWNER TO postgres;

--
-- Name: decrement_variant_stock(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.decrement_variant_stock(variant_id_to_update integer, decrement_qty integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
    v_product_id int;
    v_total_stock int;
begin
    -- 1. Decrement the variant's stock
    update public.product_variants
    set stock = stock - decrement_qty
    where id = variant_id_to_update
    and stock >= decrement_qty
    returning product_id into v_product_id; -- Get the parent product ID

    -- 2. Recalculate and update the parent product's total stock
    if v_product_id is not null then
        select sum(stock)
        into v_total_stock
        from public.product_variants
        where product_id = v_product_id;
        
        update public.products
        set stock = v_total_stock
        where id = v_product_id;
    end if;

end;
$$;


ALTER FUNCTION public.decrement_variant_stock(variant_id_to_update integer, decrement_qty integer) OWNER TO postgres;

--
-- Name: decrement_variant_stock(bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
    v_product_id bigint;
    v_total_stock int;
begin
    -- 1. Decrement the variant's stock
    update public.product_variants
    set stock = stock - decrement_qty
    where id = variant_id_to_update
    and stock >= decrement_qty
    returning product_id into v_product_id; -- Get the parent product ID

    -- 2. If the variant update was successful, recalculate and update the parent product's total stock
    if v_product_id is not null then
        select sum(stock)
        into v_total_stock
        from public.product_variants
        where product_id = v_product_id;
        
        update public.products
        set stock = v_total_stock
        where id = v_product_id;
    end if;
end;
$$;


ALTER FUNCTION public.decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer) OWNER TO postgres;

--
-- Name: delete_own_order(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_own_order(p_order_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only allow deleting if the order belongs to the authenticated user
  DELETE FROM public.ecom_orders
  WHERE id = p_order_id
  AND customer_id = auth.uid();
  
  -- If no row was deleted, it means either the order doesn't exist or doesn't belong to the user
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found or access denied';
  END IF;
END;
$$;


ALTER FUNCTION public.delete_own_order(p_order_id uuid) OWNER TO postgres;

--
-- Name: delete_unpaid_orders_after_24hours(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_unpaid_orders_after_24hours() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete unpaid orders older than 24 hours
    WITH deleted AS (
        DELETE FROM ecom_orders
        WHERE payment_status = 'pending'
        AND order_status = 'pending_payment'
        AND created_at < NOW() - INTERVAL '24 hours'
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    RETURN deleted_count;
END;
$$;


ALTER FUNCTION public.delete_unpaid_orders_after_24hours() OWNER TO postgres;

--
-- Name: FUNCTION delete_unpaid_orders_after_24hours(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.delete_unpaid_orders_after_24hours() IS 'Deletes unpaid e-commerce orders that are older than 24 hours. This replaces unsafe client-side deletion logic.';


--
-- Name: delete_unpaid_orders_after_30min(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_unpaid_orders_after_30min() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete unpaid orders older than 30 minutes
    WITH deleted AS (
        DELETE FROM ecom_orders
        WHERE payment_status = 'pending'
        AND order_status = 'pending_payment'
        AND created_at < NOW() - INTERVAL '30 minutes'
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    RETURN deleted_count;
END;
$$;


ALTER FUNCTION public.delete_unpaid_orders_after_30min() OWNER TO postgres;

--
-- Name: FUNCTION delete_unpaid_orders_after_30min(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.delete_unpaid_orders_after_30min() IS 'Deletes unpaid e-commerce orders that are older than 30 minutes';


--
-- Name: ensure_single_default_warehouse_address(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_single_default_warehouse_address() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If the new row is being set as default, unset all other defaults
    IF NEW.is_default = TRUE THEN
        UPDATE warehouse_addresses
        SET is_default = FALSE
        WHERE id != NEW.id
        AND is_default = TRUE;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_single_default_warehouse_address() OWNER TO postgres;

--
-- Name: fn_fulfill_ecom_order(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_fulfill_ecom_order(order_id_to_fulfill bigint) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  selected_product_id bigint;
  selected_quantity int;
  current_stock int;
BEGIN
  -- 1. Get the order details and lock the order row
  SELECT product_id, quantity
  INTO selected_product_id, selected_quantity
  FROM public.orders
  WHERE id = order_id_to_fulfill
  AND payment_status = 'awaiting_payment'
  FOR UPDATE;

  -- 2. Check if we found a valid, unpaid order
  IF NOT FOUND THEN
    RAISE WARNING 'Order % not found or already processed.', order_id_to_fulfill;
    RETURN 'order_not_found_or_processed';
  END IF;

  -- 3. Check stock on the related product and lock the product row
  SELECT stock
  INTO current_stock
  FROM public.products
  WHERE id = selected_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE WARNING 'Product % for order % not found.', selected_product_id, order_id_to_fulfill;
    -- Still mark order as paid, but flag for admin
    UPDATE public.orders
    SET payment_status = 'paid', order_status = 'processing', notes = CONCAT(COALESCE(notes, ''), ' [FLAG: Product not found for stock decrement]')
    WHERE id = order_id_to_fulfill;
    RETURN 'product_not_found';
  END IF;

  -- 4. Check if stock is sufficient
  IF current_stock < selected_quantity THEN
    RAISE WARNING 'Insufficient stock for product % (order %). Has % needs %.', selected_product_id, order_id_to_fulfill, current_stock, selected_quantity;
    -- Still mark order as paid, but flag for admin
    UPDATE public.orders
    SET payment_status = 'paid', order_status = 'processing', notes = CONCAT(COALESCE(notes, ''), ' [FLAG: Insufficient stock for order]')
    WHERE id = order_id_to_fulfill;
    RETURN 'insufficient_stock';
  END IF;

  -- 5. All checks passed. Update order and product stock.
  UPDATE public.orders
  SET payment_status = 'paid', order_status = 'processing'
  WHERE id = order_id_to_fulfill;

  UPDATE public.products
  SET stock = stock - selected_quantity
  WHERE id = selected_product_id;
  
  RAISE LOG 'Fulfilled order %: Product % stock reduced by %.', order_id_to_fulfill, selected_product_id, selected_quantity;
  RETURN 'success';

EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error in fn_fulfill_ecom_order for order %: %', order_id_to_fulfill, SQLERRM;
    RETURN 'error';
END;
$$;


ALTER FUNCTION public.fn_fulfill_ecom_order(order_id_to_fulfill bigint) OWNER TO postgres;

--
-- Name: generate_customer_unique_id(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_customer_unique_id(full_name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    initials TEXT;
    name_parts TEXT[];
BEGIN
    -- If the name is empty or null, use a generic fallback
    IF full_name IS NULL OR trim(full_name) = '' THEN
        initials := 'XX';
    ELSE
        -- Split the name into an array of words (e.g., {'Ama', 'Tetteh'})
        name_parts := string_to_array(trim(full_name), ' ');
        
        -- If there's only one word in the name
        IF array_length(name_parts, 1) = 1 THEN
            -- Take the first two letters of that single word
            initials := UPPER(substring(name_parts[1], 1, 2));
        ELSE
            -- Take the first letter of the first word and the first letter of the last word
            initials := UPPER(
                substring(name_parts[1], 1, 1) || 
                substring(name_parts[array_length(name_parts, 1)], 1, 1)
            );
        END IF;
    END IF;

    -- Combine the initials with a random 6-digit number
    RETURN initials || '-' || LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0');
END;
$$;


ALTER FUNCTION public.generate_customer_unique_id(full_name text) OWNER TO postgres;

--
-- Name: generate_share_code(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_share_code() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing chars like 0, O, I, 1
    result TEXT := '';
    i INTEGER;
    max_attempts INTEGER := 10;
    attempts INTEGER := 0;
BEGIN
    LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
        END LOOP;
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM shared_carts WHERE share_code = result) THEN
            EXIT; -- Found unique code
        END IF;
        
        attempts := attempts + 1;
        IF attempts >= max_attempts THEN
            -- If too many attempts, append timestamp to make it unique
            result := result || substr(TO_CHAR(EXTRACT(EPOCH FROM NOW())::BIGINT, '9999999999'), -2);
            EXIT;
        END IF;
    END LOOP;
    
    RETURN UPPER(result);
END;
$$;


ALTER FUNCTION public.generate_share_code() OWNER TO postgres;

--
-- Name: get_employee_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_employee_status() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_row public.employees%rowtype;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
    END IF;

    SELECT * INTO v_row FROM public.employees WHERE user_id = v_user_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', true, 'exists', false);
    END IF;

    RETURN jsonb_build_object(
        'ok', true,
        'exists', true,
        'status', v_row.status,
        'staff_role', v_row.staff_role,
        'full_name', v_row.full_name,
        'email', v_row.email,
        'id', v_row.id
    );
END;
$$;


ALTER FUNCTION public.get_employee_status() OWNER TO postgres;

--
-- Name: get_product_rating(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_product_rating(product_id_param bigint) RETURNS TABLE(average_rating numeric, total_reviews integer, rating_breakdown jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) as average_rating,
        COUNT(r.id)::INTEGER as total_reviews,
        jsonb_build_object(
            '5', COUNT(*) FILTER (WHERE r.rating = 5),
            '4', COUNT(*) FILTER (WHERE r.rating = 4),
            '3', COUNT(*) FILTER (WHERE r.rating = 3),
            '2', COUNT(*) FILTER (WHERE r.rating = 2),
            '1', COUNT(*) FILTER (WHERE r.rating = 1)
        ) as rating_breakdown
    FROM product_reviews r
    WHERE r.product_id = product_id_param;
END;
$$;


ALTER FUNCTION public.get_product_rating(product_id_param bigint) OWNER TO postgres;

--
-- Name: get_promotion_products(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_promotion_products(limit_count integer DEFAULT 3) RETURNS TABLE(id bigint, name text, main_image_url text, price numeric, sku text, stock integer, promotion_order integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.main_image_url,
        p.price,
        p.sku,
        p.stock,
        COALESCE(p.promotion_order, 0) as promotion_order
    FROM products p
    WHERE p.is_promotion = TRUE 
        AND p.status = 'active'
    ORDER BY p.promotion_order ASC, p.created_at DESC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION public.get_promotion_products(limit_count integer) OWNER TO postgres;

--
-- Name: get_related_products(bigint, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_related_products(product_id_param bigint, category_param text, limit_count integer DEFAULT 4) RETURNS TABLE(id bigint, name text, main_image_url text, price numeric, sku text, stock integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.main_image_url,
        p.price,
        p.sku,
        p.stock
    FROM products p
    WHERE p.category = category_param
        AND p.id != product_id_param
        AND p.status = 'active'
    ORDER BY p.sales_count DESC, p.view_count DESC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION public.get_related_products(product_id_param bigint, category_param text, limit_count integer) OWNER TO postgres;

--
-- Name: get_top_selling_products(timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_top_selling_products(from_date timestamp with time zone) RETURNS TABLE(product_id bigint, product_name text, total_sold bigint)
    LANGUAGE sql
    AS $$
  SELECT
    "product_id",
    "product_name",
    SUM("quantity") AS total_sold
  FROM
    public.orders
  WHERE
    "type" = 'ecom' AND
    "payment_status" = 'paid' AND
    "created_at" >= from_date
  GROUP BY
    "product_id", "product_name"
  ORDER BY
    total_sold DESC
  LIMIT 5;
$$;


ALTER FUNCTION public.get_top_selling_products(from_date timestamp with time zone) OWNER TO postgres;

--
-- Name: get_trending_products(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_trending_products(limit_count integer DEFAULT 6) RETURNS TABLE(id bigint, name text, main_image_url text, price numeric, sku text, stock integer, view_count integer, sales_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.main_image_url,
        p.price,
        p.sku,
        p.stock,
        COALESCE(p.view_count, 0) as view_count,
        COALESCE(p.sales_count, 0) as sales_count
    FROM products p
    WHERE p.is_trending = TRUE 
        AND p.status = 'active'
    ORDER BY p.sales_count DESC, p.view_count DESC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION public.get_trending_products(limit_count integer) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Insert a new row into the public.customers table
  INSERT INTO public.customers (id, email, name, phone, customer_unique_id)
  VALUES (
    new.id,                                     -- The user's UUID from auth.users
    new.email,                                  -- The user's email
    new.raw_user_meta_data->>'full_name',       -- The full_name from signup metadata
    new.raw_user_meta_data->>'phone',           -- The phone from signup metadata
    -- THIS IS THE ONLY LINE THAT CHANGES
    public.generate_customer_unique_id(new.raw_user_meta_data->>'full_name') -- Call our new helper function
  );
  
  -- Set the user's default role in their auth token to 'customer'
  PERFORM private.set_claim(new.id, 'user_role', '"customer"');
  
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: increment_product_view_count(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_product_view_count(product_id_param bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE products
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = product_id_param;
END;
$$;


ALTER FUNCTION public.increment_product_view_count(product_id_param bigint) OWNER TO postgres;

--
-- Name: increment_shared_cart_access(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_shared_cart_access(cart_share_code character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE shared_carts 
    SET access_count = access_count + 1
    WHERE share_code = cart_share_code;
END;
$$;


ALTER FUNCTION public.increment_shared_cart_access(cart_share_code character varying) OWNER TO postgres;

--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin(user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- We will update this later to check a real admin table
  RETURN false;
END;
$$;


ALTER FUNCTION public.is_admin(user_id uuid) OWNER TO postgres;

--
-- Name: is_user_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_user_admin(check_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM admins 
        WHERE user_id = check_user_id
    );
END;
$$;


ALTER FUNCTION public.is_user_admin(check_user_id uuid) OWNER TO postgres;

--
-- Name: log_order_status_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_order_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Only log if status actually changed
    IF (TG_OP = 'UPDATE' AND OLD.order_status IS DISTINCT FROM NEW.order_status) THEN
        INSERT INTO order_status_log (
            order_id,
            previous_status,
            new_status,
            changed_at
        ) VALUES (
            NEW.id,  -- This is UUID, not bigint!
            OLD.order_status,
            NEW.order_status,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_order_status_change() OWNER TO postgres;

--
-- Name: log_user_notification(uuid, character varying, character varying, text, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO notification_log (
        customer_id,
        notification_type, -- Maps to p_type or mapped string
        title,
        message,
        channel,
        sent,
        data
    ) VALUES (
        p_customer_id,
        p_type,
        p_title,
        p_message,
        'in_app', -- Default channel for these auto-logs
        true,     -- Considered "sent" to the in-app inbox
        p_data
    );
END;
$$;


ALTER FUNCTION public.log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) OWNER TO postgres;

--
-- Name: match_products(public.vector, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.match_products(query_embedding public.vector, match_threshold double precision, match_count integer) RETURNS TABLE(id uuid, similarity double precision)
    LANGUAGE plpgsql
    AS $$
begin
  return query
  select
    products.id,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;


ALTER FUNCTION public.match_products(query_embedding public.vector, match_threshold double precision, match_count integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: shipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id uuid DEFAULT auth.uid() NOT NULL,
    tracking_number text NOT NULL,
    status text DEFAULT '''in-transit'''::text NOT NULL,
    carrier text,
    origin text,
    destination text,
    current_location text,
    eta_days integer DEFAULT 0,
    items_description text,
    image_url text,
    total_weight_kg double precision DEFAULT '0'::double precision,
    associated_order_ids jsonb,
    customer_contact text,
    customer_name text,
    method text,
    shipping_cost text,
    customer_unique_id text,
    shipping_fee_paid boolean DEFAULT false,
    shipping_fee_payment_reference character varying(255),
    order_id uuid,
    shipment_start_date timestamp with time zone,
    estimated_duration_days integer DEFAULT 45,
    registration_fee_paid boolean DEFAULT false,
    registration_fee_payment_reference text,
    arrival_photo_url text
);


ALTER TABLE public.shipments OWNER TO postgres;

--
-- Name: TABLE shipments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.shipments IS 'Force reload trigger';


--
-- Name: COLUMN shipments.shipping_fee_paid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shipments.shipping_fee_paid IS 'Whether the shipping fee has been paid for this shipment';


--
-- Name: COLUMN shipments.shipping_fee_payment_reference; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shipments.shipping_fee_payment_reference IS 'Payment reference for shipping fee payment';


--
-- Name: COLUMN shipments.order_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shipments.order_id IS 'Optional link to ecom_orders table';


--
-- Name: match_shipment_by_id_prefix(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.match_shipment_by_id_prefix(p_prefix text) RETURNS SETOF public.shipments
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT s.*
  FROM public.shipments s
  WHERE replace(s.id::text, '-', '') ILIKE replace(trim(lower(p_prefix)), '-', '') || '%'
  LIMIT 5;
$$;


ALTER FUNCTION public.match_shipment_by_id_prefix(p_prefix text) OWNER TO postgres;

--
-- Name: notify_on_address_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_on_address_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        PERFORM log_user_notification(
            NEW.customer_id, -- Used customer_id
            'address_added',
            'Address Added',
            'A new address has been added to your profile.',
            jsonb_build_object('addressId', NEW.id)
        );
    ELSIF (TG_OP = 'UPDATE') THEN
        PERFORM log_user_notification(
            NEW.customer_id, -- Used customer_id
            'address_updated',
            'Address Updated',
            'An address in your address book was updated.',
            jsonb_build_object('addressId', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.notify_on_address_change() OWNER TO postgres;

--
-- Name: notify_on_profile_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_on_profile_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Check if relevant fields changed to avoid spam (e.g. login timestamps)
        IF (OLD.name IS DISTINCT FROM NEW.name OR OLD.phone IS DISTINCT FROM NEW.phone) THEN
             PERFORM log_user_notification(
                NEW.id, -- customers table id is the user_id
                'profile_updated',
                'Profile Updated',
                'Your profile details have been updated.',
                jsonb_build_object('field', 'details')
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.notify_on_profile_change() OWNER TO postgres;

--
-- Name: notify_on_shipment_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_on_shipment_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- New Shipment
    IF (TG_OP = 'INSERT') THEN
        PERFORM log_user_notification(
            NEW.customer_id,
            'shipment_created',
            'New Shipment',
            'Shipment #' || NEW.id || ' has been created.',
            jsonb_build_object('shipmentId', NEW.id)
        );
        RETURN NEW;
    
    -- Status Update
    ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        PERFORM log_user_notification(
            NEW.customer_id,
            'shipment_updated',
            'Shipment Update',
            'Shipment #' || NEW.id || ' is now ' || NEW.status,
            jsonb_build_object('shipmentId', NEW.id, 'status', NEW.status)
        );
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.notify_on_shipment_change() OWNER TO postgres;

--
-- Name: prevent_balance_manipulation(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_balance_manipulation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only allow balance changes from triggers or service role
    IF (TG_OP = 'UPDATE' AND OLD.balance IS DISTINCT FROM NEW.balance) THEN
        -- Check if this is coming from our trigger or service role
        IF current_setting('role', true) != 'service_role' AND 
           current_setting('application_name', true) NOT LIKE '%trigger%' THEN
            RAISE EXCEPTION 'Direct balance modification not allowed. Balance is updated automatically.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_balance_manipulation() OWNER TO postgres;

--
-- Name: prevent_payment_manipulation(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_payment_manipulation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- Check if the payment_status is being changed by a normal user (not service_role)
  if (new.payment_status != old.payment_status) and (auth.role() = 'authenticated' or auth.role() = 'anon') then
    raise exception 'You are not authorized to update payment status directly.';
  end if;
  return new;
end;
$$;


ALTER FUNCTION public.prevent_payment_manipulation() OWNER TO postgres;

--
-- Name: process_payout_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_payout_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only when status changes from 'pending' to 'paid' or 'approved'
    IF (OLD.status = 'pending' AND NEW.status IN ('paid', 'approved')) THEN
        UPDATE affiliate_profiles
        SET 
            balance = balance - NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.affiliate_id;
    -- If payout is rejected, do nothing to balance
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.process_payout_balance() OWNER TO postgres;

--
-- Name: process_scanned_package(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_scanned_package(scanned_tracking text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    shipment_rec RECORD;
    incoming_rec RECORD;
    order_rec RECORD;
    items_array JSONB;
    item JSONB;
    updated_items JSONB := '[]'::jsonb;
    all_in_warehouse BOOLEAN := TRUE;
    item_updated BOOLEAN := FALSE;
    matched_tracking TEXT;
BEGIN
    -- 1. Search in Link Orders (orders table) first
    SELECT * INTO order_rec 
    FROM orders 
    WHERE type = 'link_order' 
      AND item_tracking_numbers ILIKE '%' || scanned_tracking || '%'
    LIMIT 1;

    IF FOUND THEN
        -- We found a link order that matches.
        items_array := order_rec.items;
        
        IF items_array IS NOT NULL AND jsonb_typeof(items_array) = 'array' THEN
            -- Loop through items to find the matching tracking number and update its status
            FOR item IN SELECT * FROM jsonb_array_elements(items_array)
            LOOP
                IF (item->>'tracking_number') ILIKE '%' || scanned_tracking || '%' THEN
                    matched_tracking := item->>'tracking_number';
                    IF (item->>'status') IS DISTINCT FROM 'in_warehouse' THEN
                        item := jsonb_set(item, '{status}', '"in_warehouse"');
                        item_updated := TRUE;
                    END IF;
                END IF;
                
                -- Check if this item is in warehouse
                IF (item->>'status') IS DISTINCT FROM 'in_warehouse' THEN
                    all_in_warehouse := FALSE;
                END IF;

                updated_items := updated_items || item;
            END LOOP;

            IF item_updated THEN
                -- If all items are now in warehouse, update the main order status too
                IF all_in_warehouse THEN
                    UPDATE orders 
                    SET items = updated_items, 
                        order_status = 'in_warehouse' 
                    WHERE id = order_rec.id;
                    
                    RETURN json_build_object(
                        'status', 'updated',
                        'type', 'link_order',
                        'id', order_rec.id,
                        'tracking_number', COALESCE(matched_tracking, scanned_tracking),
                        'customer_name', 'Link Order Customer',
                        'items_description', 'Link Order Items (All Arrived)',
                        'previous_status', order_rec.order_status,
                        'current_status', 'in_warehouse',
                        'method', order_rec.shipping_mode
                    );
                ELSE
                    -- Only some items arrived, main order status stays the same
                    UPDATE orders 
                    SET items = updated_items 
                    WHERE id = order_rec.id;
                    
                    RETURN json_build_object(
                        'status', 'updated',
                        'type', 'link_order',
                        'id', order_rec.id,
                        'tracking_number', COALESCE(matched_tracking, scanned_tracking),
                        'customer_name', 'Link Order Customer',
                        'items_description', 'Link Order Item Arrived (Partial)',
                        'previous_status', 'purchased',
                        'current_status', 'in_warehouse',
                        'method', order_rec.shipping_mode
                    );
                END IF;
            ELSE
                -- Found the order, but the item was already in warehouse
                RETURN json_build_object(
                    'status', 'already_processed',
                    'type', 'link_order',
                    'id', order_rec.id,
                    'tracking_number', scanned_tracking,
                    'customer_name', 'Link Order Customer',
                    'items_description', 'Link Order Item',
                    'current_status', 'in_warehouse',
                    'method', order_rec.shipping_mode
                );
            END IF;
        END IF;
    END IF;

    -- 2. Search in shipments
    SELECT * INTO shipment_rec 
    FROM shipments 
    WHERE tracking_number ILIKE '%' || scanned_tracking || '%' 
    LIMIT 1;

    IF FOUND THEN
        -- Check if it can be updated
        IF shipment_rec.status IN ('awaiting_arrival', 'pending', 'pending_payment') THEN
            UPDATE shipments 
            SET status = 'in_warehouse' 
            WHERE id = shipment_rec.id;
            
            RETURN json_build_object(
                'status', 'updated',
                'type', 'shipment',
                'id', shipment_rec.id,
                'tracking_number', shipment_rec.tracking_number,
                'customer_name', shipment_rec.customer_name,
                'items_description', shipment_rec.items_description,
                'previous_status', shipment_rec.status,
                'current_status', 'in_warehouse',
                'method', shipment_rec.method
            );
        ELSE
            -- Already processed or shouldn't be updated
            RETURN json_build_object(
                'status', 'already_processed',
                'type', 'shipment',
                'id', shipment_rec.id,
                'tracking_number', shipment_rec.tracking_number,
                'customer_name', shipment_rec.customer_name,
                'items_description', shipment_rec.items_description,
                'current_status', shipment_rec.status,
                'method', shipment_rec.method
            );
        END IF;
    END IF;

    -- 3. Search in incoming_packages
    SELECT * INTO incoming_rec 
    FROM incoming_packages 
    WHERE tracking_number ILIKE '%' || scanned_tracking || '%' 
    LIMIT 1;

    IF FOUND THEN
        -- Check if it can be updated
        IF incoming_rec.status IN ('pending', 'awaiting_arrival', 'in_transit', 'in-transit') THEN
            UPDATE incoming_packages 
            SET status = 'arrived_at_warehouse' 
            WHERE id = incoming_rec.id;
            
            RETURN json_build_object(
                'status', 'updated',
                'type', 'incoming',
                'id', incoming_rec.id,
                'tracking_number', incoming_rec.tracking_number,
                'items_description', incoming_rec.items_description,
                'previous_status', incoming_rec.status,
                'current_status', 'arrived_at_warehouse',
                'method', incoming_rec.method
            );
        ELSE
            -- Already processed or shouldn't be updated
            RETURN json_build_object(
                'status', 'already_processed',
                'type', 'incoming',
                'id', incoming_rec.id,
                'tracking_number', incoming_rec.tracking_number,
                'items_description', incoming_rec.items_description,
                'current_status', incoming_rec.status,
                'method', incoming_rec.method
            );
        END IF;
    END IF;

    -- 4. Not found in any table
    RETURN json_build_object('status', 'not_found');
END;
$$;


ALTER FUNCTION public.process_scanned_package(scanned_tracking text) OWNER TO postgres;

--
-- Name: refresh_cached_ghs_prices(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.refresh_cached_ghs_prices() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    current_rate NUMERIC;
BEGIN
    SELECT rate_shop_products INTO current_rate FROM settings WHERE id = 1;

    IF current_rate IS NULL OR current_rate <= 0 THEN
        RAISE EXCEPTION 'rate_shop_products is not set or invalid (%)', current_rate;
    END IF;

    UPDATE products
    SET price = FLOOR((price_cny / current_rate) * 100) / 100
    WHERE price_cny IS NOT NULL;

    UPDATE product_variants
    SET price = FLOOR((price_cny / current_rate) * 100) / 100
    WHERE price_cny IS NOT NULL;

    -- Also refresh the GHS .price inside each general_options_prices entry
    UPDATE products p
    SET general_options_prices = (
        SELECT jsonb_object_agg(
            opt_key,
            (
                SELECT jsonb_object_agg(
                    val_key,
                    CASE
                        WHEN jsonb_typeof(val_body) = 'object'
                             AND (val_body ? 'price_cny') THEN
                            val_body || jsonb_build_object(
                                'price',
                                FLOOR((COALESCE((val_body->>'price_cny')::numeric, 0) / current_rate) * 100) / 100
                            )
                        ELSE val_body
                    END
                )
                FROM jsonb_each(opt_body) AS inner_kv(val_key, val_body)
            )
        )
        FROM jsonb_each(p.general_options_prices) AS outer_kv(opt_key, opt_body)
    )
    WHERE p.general_options_prices IS NOT NULL
      AND jsonb_typeof(p.general_options_prices) = 'object';
END;
$$;


ALTER FUNCTION public.refresh_cached_ghs_prices() OWNER TO postgres;

--
-- Name: search_products(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_products(search_query text) RETURNS TABLE(id bigint, created_at timestamp with time zone, name text, description text, category text, price numeric, stock integer, status text, primary_image text, has_variants boolean, stock_status text, rank real)
    LANGUAGE plpgsql
    AS $$
DECLARE
  -- Convert "ladies bags" -> "ladies | bags"
  -- Also handles trimming and multiple spaces
  processed_query text := trim(regexp_replace(search_query, '\s+', ' | ', 'g'));
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.created_at,
    p.name,
    p.description,
    p.category,
    p.price,
    p.stock,
    p.status,
    (
      SELECT image_url
      FROM product_images pi
      WHERE pi.product_id = p.id
      ORDER BY pi.is_primary DESC, pi.created_at DESC
      LIMIT 1
    ) as primary_image,
    EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id) as has_variants,
    CASE
      WHEN EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.stock > 0) THEN 'in_stock'
      WHEN NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id) AND p.stock > 0 THEN 'in_stock'
      ELSE 'out_of_stock'
    END as stock_status,
    ts_rank(
      setweight(to_tsvector('english', coalesce(p.name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(p.description, '')), 'B'),
      to_tsquery('english', processed_query)
    ) as rank
  FROM products p
  WHERE 
    (
      setweight(to_tsvector('english', coalesce(p.name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(p.description, '')), 'B')
    ) @@ to_tsquery('english', processed_query)
  ORDER BY rank DESC;
END;
$$;


ALTER FUNCTION public.search_products(search_query text) OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    status text DEFAULT 'active'::text NOT NULL,
    customer_unique_id text DEFAULT ('CUS-'::text || lpad((((random() * (999999)::double precision))::integer)::text, 6, '0'::text)),
    role text DEFAULT 'customer'::text,
    telegram_chat_id character varying(255),
    telegram_notifications_enabled boolean DEFAULT true,
    referred_by_affiliate_id uuid,
    referral_code_used text,
    CONSTRAINT customers_role_check CHECK ((role = ANY (ARRAY['customer'::text, 'admin'::text])))
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: COLUMN customers.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.customers.phone IS 'Customer phone number in Ghana format (e.g., 0241234567 or +233241234567)';


--
-- Name: COLUMN customers.telegram_chat_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.customers.telegram_chat_id IS 'Telegram chat ID for sending notifications';


--
-- Name: COLUMN customers.telegram_notifications_enabled; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.customers.telegram_notifications_enabled IS 'Whether the user has enabled Telegram notifications';


--
-- Name: COLUMN customers.referred_by_affiliate_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.customers.referred_by_affiliate_id IS 'Links customer to the affiliate who referred them (forever tracking)';


--
-- Name: COLUMN customers.referral_code_used; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.customers.referral_code_used IS 'The affiliate code used during signup (for automatic linking)';


--
-- Name: search_users_for_admin(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_users_for_admin(search_term text) RETURNS SETOF public.customers
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM customers
    WHERE 
        name ILIKE '%' || search_term || '%'
        OR email ILIKE '%' || search_term || '%'
        OR phone::text ILIKE '%' || search_term || '%'
        OR telegram_chat_id::text ILIKE '%' || search_term || '%'
        OR customer_unique_id::text ILIKE '%' || search_term || '%'
        OR id::text ILIKE '%' || search_term || '%'
    LIMIT 20;
END;
$$;


ALTER FUNCTION public.search_users_for_admin(search_term text) OWNER TO postgres;

--
-- Name: secure_ecom_order_totals(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.secure_ecom_order_totals() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    item jsonb;
    row_price_cny numeric;
    row_price_ghs numeric;
    real_price numeric;
    calculated_subtotal numeric := 0;
    calculated_service_fee numeric := 0;
    is_applicable boolean;
    current_rate numeric;
BEGIN
    SELECT rate_shop_products INTO current_rate FROM settings WHERE id = 1;
    IF current_rate IS NULL OR current_rate <= 0 THEN
        current_rate := 0.52;
    END IF;

    -- Snapshot the rate on the order for audit
    NEW.rate_at_purchase := current_rate;

    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        row_price_cny := NULL;
        row_price_ghs := NULL;

        IF (item->>'variant_id') IS NOT NULL AND (item->>'variant_id') != 'null' THEN
            SELECT price_cny, price INTO row_price_cny, row_price_ghs
            FROM product_variants
            WHERE id = (item->>'variant_id')::int;
        ELSE
            SELECT price_cny, price INTO row_price_cny, row_price_ghs
            FROM products
            WHERE id = (item->>'product_id')::int;
        END IF;

        IF row_price_cny IS NOT NULL AND row_price_cny > 0 THEN
            real_price := FLOOR((row_price_cny / current_rate) * 100) / 100;
        ELSIF row_price_ghs IS NOT NULL THEN
            real_price := row_price_ghs;
        ELSE
            real_price := 0;
        END IF;

        -- Service fee modifier (per-product flag)
        SELECT COALESCE(service_fee_applicable, true) INTO is_applicable
        FROM products WHERE id = (item->>'product_id')::int;

        IF is_applicable AND real_price > 5 THEN
            calculated_service_fee := calculated_service_fee + (3 * (item->>'quantity')::int);
        END IF;

        calculated_subtotal := calculated_subtotal + (real_price * (item->>'quantity')::int);
    END LOOP;

    NEW.subtotal := calculated_subtotal;
    NEW.service_fee := calculated_service_fee;
    NEW.total_amount := calculated_subtotal + calculated_service_fee + COALESCE(NEW.shipping_cost, 0);

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.secure_ecom_order_totals() OWNER TO postgres;

--
-- Name: send_telegram_notification(uuid, character varying, character varying, text, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb DEFAULT NULL::jsonb) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_sent BOOLEAN;
BEGIN
    -- This function will be called by the Edge Function
    -- The actual sending is done by the Edge Function
    -- This is just a placeholder for future database-level logic
    
    -- Log the notification attempt
    INSERT INTO notification_log (
        customer_id,
        notification_type,
        message,
        channel,
        sent,
        created_at
    ) VALUES (
        p_customer_id,
        p_type,
        p_message,
        'telegram',
        false, -- Will be updated by Edge Function
        NOW()
    );
    
    RETURN true;
END;
$$;


ALTER FUNCTION public.send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) OWNER TO postgres;

--
-- Name: set_employees_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_employees_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.updated_at := now();
    return new;
end;
$$;


ALTER FUNCTION public.set_employees_updated_at() OWNER TO postgres;

--
-- Name: track_package(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.track_package(search_query text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $_$
DECLARE
  clean_input text;
  digits_only text;
  hex_part text;
  result jsonb;
BEGIN
  -- 1. Sanitize: Remove all whitespace, # characters, and convert to lowercase
  clean_input := lower(regexp_replace(search_query, '[\s#]', '', 'g'));
  
  IF clean_input = '' THEN RETURN NULL; END IF;

  -- 2. Shipments (Priority: Exact Tracking Number Match)
  SELECT jsonb_build_object(
    'type', 'shipment',
    'id', s.id,
    'status', s.status,
    'tracking_number', s.tracking_number,
    'created_at', s.created_at,
    'details', jsonb_build_object(
      'customer_name', s.customer_name,
      'method', s.method
    )
  ) INTO result
  FROM shipments s
  WHERE lower(s.tracking_number) = clean_input
  LIMIT 1;

  IF result IS NOT NULL THEN RETURN result; END IF;

  -- 3. Mall Orders (Ecom Orders)
  -- 3a. Exact UUID Match
  IF clean_input ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    SELECT jsonb_build_object(
      'type', 'order',
      'id', o.id,
      'status', o.order_status,
      'tracking_number', o.order_id,
      'created_at', o.created_at,
      'details', jsonb_build_object('customer_name', o.customer_name, 'payment_status', o.payment_status)
    ) INTO result FROM ecom_orders o WHERE o.id = clean_input::uuid LIMIT 1;
    
    IF result IS NOT NULL THEN RETURN result; END IF;
  END IF;

  -- 3b. Exact order_id Match
  SELECT jsonb_build_object(
    'type', 'order',
    'id', o.id,
    'status', o.order_status,
    'tracking_number', o.order_id,
    'created_at', o.created_at,
    'details', jsonb_build_object('customer_name', o.customer_name, 'payment_status', o.payment_status)
  ) INTO result FROM ecom_orders o WHERE lower(o.order_id) = clean_input LIMIT 1;

  IF result IS NOT NULL THEN RETURN result; END IF;

  -- 3c. Partial UUID Match (Ends with hex sequence, e.g. "8dc2" from "MALL-8dc2")
  -- Extract last 4-12 hex characters
  hex_part := substring(clean_input FROM '([0-9a-f]{4,12})$');
  IF hex_part IS NOT NULL THEN
     SELECT jsonb_build_object(
      'type', 'order',
      'id', o.id,
      'status', o.order_status,
      'tracking_number', o.order_id,
      'created_at', o.created_at,
      'details', jsonb_build_object('customer_name', o.customer_name, 'payment_status', o.payment_status)
    ) INTO result FROM ecom_orders o
    WHERE o.id::text LIKE '%' || hex_part 
    LIMIT 1;

    IF result IS NOT NULL THEN RETURN result; END IF;
  END IF;

  -- 4. Link Orders (Orders Table - Integer IDs)
  -- 4a. Exact order_id Custom String Match
  SELECT jsonb_build_object(
    'type', 'order',
    'id', o.id,
    'status', o.order_status,
    'tracking_number', CAST(o.order_id AS text),
    'created_at', o.created_at,
    'details', jsonb_build_object('customer_name', o.customer_name, 'payment_status', o.payment_status)
  ) INTO result FROM orders o WHERE lower(CAST(o.order_id AS text)) = clean_input LIMIT 1;

  IF result IS NOT NULL THEN RETURN result; END IF;

  -- 4b. Integer ID Match (Extract digits from "LO-87" -> "87")
  digits_only := substring(clean_input FROM '(\d+)$');
  IF digits_only IS NOT NULL THEN
     SELECT jsonb_build_object(
      'type', 'order',
      'id', o.id,
      'status', o.order_status,
      'tracking_number', CAST(o.order_id AS text),
      'created_at', o.created_at,
      'details', jsonb_build_object('customer_name', o.customer_name, 'payment_status', o.payment_status)
    ) INTO result FROM orders o
    WHERE o.id = digits_only::bigint 
    LIMIT 1;

    IF result IS NOT NULL THEN RETURN result; END IF;
  END IF;

  RETURN result;
END;
$_$;


ALTER FUNCTION public.track_package(search_query text) OWNER TO postgres;

--
-- Name: update_admin_settings_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_admin_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_admin_settings_updated_at() OWNER TO postgres;

--
-- Name: update_affiliate_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_affiliate_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the affiliate's balance and total earned
    UPDATE affiliate_profiles
    SET 
        balance = balance + NEW.amount,
        total_earned = total_earned + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_affiliate_balance() OWNER TO postgres;

--
-- Name: update_affiliate_balance_on_earning(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_affiliate_balance_on_earning() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the affiliate's balance and total_earned
    UPDATE affiliate_profiles
    SET 
        balance = balance + NEW.amount,
        total_earned = total_earned + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
    
    RAISE NOTICE 'Updated balance for affiliate %: +% GHS', NEW.affiliate_id, NEW.amount;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_affiliate_balance_on_earning() OWNER TO postgres;

--
-- Name: update_affiliate_balance_on_earning_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_affiliate_balance_on_earning_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        -- Subtract from balance when earning is deleted
        UPDATE affiliate_profiles
        SET 
            balance = balance - OLD.amount,
            total_earned = total_earned - OLD.amount,
            updated_at = NOW()
        WHERE id = OLD.affiliate_id;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_affiliate_balance_on_earning_change() OWNER TO postgres;

--
-- Name: update_affiliate_referral_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_affiliate_referral_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only if referred_by_affiliate_id is being set (not null)
    IF NEW.referred_by_affiliate_id IS NOT NULL THEN
        UPDATE affiliate_profiles
        SET 
            total_referrals = total_referrals + 1,
            updated_at = NOW()
        WHERE id = NEW.referred_by_affiliate_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_affiliate_referral_count() OWNER TO postgres;

--
-- Name: update_ecom_orders_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_ecom_orders_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_ecom_orders_updated_at() OWNER TO postgres;

--
-- Name: update_product_prices_by_multiplier(numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_prices_by_multiplier(multiplier numeric) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Multiply all master product prices in one pass
    UPDATE products
    SET price = ROUND((price * multiplier)::numeric, 2)
    WHERE price IS NOT NULL;

    -- Multiply all variant prices in one pass
    UPDATE product_variants
    SET price = ROUND((price * multiplier)::numeric, 2)
    WHERE price IS NOT NULL;
END;
$$;


ALTER FUNCTION public.update_product_prices_by_multiplier(multiplier numeric) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: update_user_preferences_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_user_preferences_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_user_preferences_updated_at() OWNER TO postgres;

--
-- Name: update_warehouse_addresses_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_warehouse_addresses_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_warehouse_addresses_updated_at() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(c.column_name order by c.ordinal_position),
            '{}'::text[]
        )
        from
            information_schema.columns c
        where
            format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                format('%I.%I', c.table_schema, c.table_name)::regclass,
                c.column_name,
                'SELECT'
            );
    table_col_names text[] = coalesce(
            array_agg(pa.attname),
            '{}'::text[]
        )
        from
            pg_attribute pa
        where
            pa.attrelid = new.entity
            and pa.attnum > 0;
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        -- Filtered column is valid
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        -- Type is sanitized and safe for string interpolation
        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;
        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        else
            -- raises an exception if value is not coercable to type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    -- Validate that selected_columns reference columns the role can SELECT
    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint on
    -- (subscription_id, entity, filters) can't be tricked by a different filter order
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value),
        '{}'
    ) from unnest(new.filters) f;

    -- Normalize selected_columns order so ARRAY['a','b'] and ARRAY['b','a'] are
    -- treated as the same subscription group in apply_rls
    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: admin_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    telegram_chat_id character varying(255),
    notifications_enabled boolean DEFAULT true,
    notification_types jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.admin_settings OWNER TO postgres;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid DEFAULT gen_random_uuid(),
    email character varying(255),
    name character varying(255),
    role character varying(50) DEFAULT 'admin'::character varying,
    status character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: COLUMN admins.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admins.email IS 'Admin email address for login and identification';


--
-- Name: COLUMN admins.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admins.name IS 'Admin full name';


--
-- Name: COLUMN admins.role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admins.role IS 'Admin role: admin or super_admin';


--
-- Name: COLUMN admins.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admins.status IS 'Admin status: active or inactive';


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.admins ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: affiliate_earnings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affiliate_earnings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid,
    order_id uuid NOT NULL,
    order_type text NOT NULL,
    order_total numeric(12,2) NOT NULL,
    amount numeric(12,2) DEFAULT 1.50 NOT NULL,
    customer_id uuid,
    customer_name text,
    status text DEFAULT 'settled'::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT affiliate_earnings_order_type_check CHECK ((order_type = ANY (ARRAY['ecom_mall'::text, 'link_order'::text]))),
    CONSTRAINT affiliate_earnings_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'settled'::text, 'cancelled'::text])))
);


ALTER TABLE public.affiliate_earnings OWNER TO postgres;

--
-- Name: TABLE affiliate_earnings; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.affiliate_earnings IS 'Tracks individual 1.5 GHS commissions for each qualifying order';


--
-- Name: affiliate_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affiliate_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    affiliate_code text NOT NULL,
    social_accounts jsonb DEFAULT '[]'::jsonb NOT NULL,
    application_reason text,
    status text DEFAULT 'pending'::text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    rejection_reason text,
    balance numeric(12,2) DEFAULT 0.00,
    total_earned numeric(12,2) DEFAULT 0.00,
    total_referrals integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    whatsapp_number text,
    CONSTRAINT affiliate_profiles_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'blocked'::text, 'rejected'::text])))
);


ALTER TABLE public.affiliate_profiles OWNER TO postgres;

--
-- Name: TABLE affiliate_profiles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.affiliate_profiles IS 'Stores affiliate applications and earnings data';


--
-- Name: COLUMN affiliate_profiles.whatsapp_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.affiliate_profiles.whatsapp_number IS 'WhatsApp number for contacting the affiliate';


--
-- Name: CONSTRAINT affiliate_profiles_status_check ON affiliate_profiles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT affiliate_profiles_status_check ON public.affiliate_profiles IS 'Ensures status is one of: pending, approved, blocked, or rejected';


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id bigint NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type character varying(20) DEFAULT 'info'::character varying,
    icon text DEFAULT 'bell'::text,
    action_label text,
    action_url text,
    is_active boolean DEFAULT true,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    target_audience character varying(20) DEFAULT 'all'::character varying,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    CONSTRAINT announcements_target_audience_check CHECK (((target_audience)::text = ANY ((ARRAY['all'::character varying, 'customers'::character varying, 'admins'::character varying])::text[]))),
    CONSTRAINT announcements_type_check CHECK (((type)::text = ANY ((ARRAY['info'::character varying, 'success'::character varying, 'warning'::character varying, 'critical'::character varying, 'promo'::character varying])::text[])))
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO postgres;

--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: captcha_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.captcha_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    answer integer NOT NULL,
    used boolean DEFAULT false NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:05:00'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.captcha_challenges OWNER TO postgres;

--
-- Name: contact_inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT contact_inquiries_status_check CHECK ((status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text, 'resolved'::text])))
);


ALTER TABLE public.contact_inquiries OWNER TO postgres;

--
-- Name: TABLE contact_inquiries; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contact_inquiries IS 'Stores contact form submissions';


--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    street_address text NOT NULL,
    city text,
    region text,
    postal_code text,
    country text DEFAULT 'Ghana'::text,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.customer_addresses OWNER TO postgres;

--
-- Name: TABLE customer_addresses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.customer_addresses IS 'Stores customer saved addresses for faster checkout';


--
-- Name: customer_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    author_id uuid,
    author_name text NOT NULL,
    note_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.customer_notes OWNER TO postgres;

--
-- Name: ecom_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ecom_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(50),
    customer_email character varying(255),
    shipping_address text NOT NULL,
    shipping_notes text,
    items jsonb NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    service_fee numeric(10,2) DEFAULT 0 NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    order_status character varying(50) DEFAULT 'pending_payment'::character varying,
    payment_reference character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    shipping_method text DEFAULT 'sea'::text,
    estimated_delivery timestamp with time zone,
    shipping_cost numeric(10,2) DEFAULT 0,
    shipping_fee_paid boolean DEFAULT false,
    shipping_fee_payment_reference character varying(255),
    order_id character varying(50),
    payment_gateway character varying(50),
    payment_details jsonb,
    shipment_start_date timestamp with time zone,
    estimated_duration_days integer DEFAULT 45,
    rate_at_purchase numeric(10,4)
);


ALTER TABLE public.ecom_orders OWNER TO postgres;

--
-- Name: TABLE ecom_orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.ecom_orders IS 'Force reload trigger';


--
-- Name: COLUMN ecom_orders.shipping_fee_paid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.ecom_orders.shipping_fee_paid IS 'Whether the shipping fee has been paid';


--
-- Name: COLUMN ecom_orders.shipping_fee_payment_reference; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.ecom_orders.shipping_fee_payment_reference IS 'Payment reference for shipping fee payment';


--
-- Name: COLUMN ecom_orders.rate_at_purchase; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.ecom_orders.rate_at_purchase IS 'CNY-per-GHS rate captured at the moment the order was placed, for audit/reporting.';


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    approved_at timestamp with time zone,
    approved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    staff_role text,
    CONSTRAINT employees_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'suspended'::text]))),
    CONSTRAINT valid_staff_role CHECK ((staff_role = ANY (ARRAY['support'::text, 'warehouse'::text, 'sourcing'::text])))
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: gallery_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    media_url text NOT NULL,
    public_id text,
    resource_type character varying(50) DEFAULT 'image'::character varying,
    submitted_at timestamp with time zone DEFAULT now(),
    status character varying(50) DEFAULT 'pending'::character varying
);


ALTER TABLE public.gallery_submissions OWNER TO postgres;

--
-- Name: incoming_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incoming_packages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    tracking_number character varying(255),
    items_description text,
    status character varying(50) DEFAULT 'pending'::character varying,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.incoming_packages OWNER TO postgres;

--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    ip text DEFAULT ''::text NOT NULL,
    attempted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: notification_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    notification_type character varying(100) NOT NULL,
    message text NOT NULL,
    channel character varying(50) DEFAULT 'telegram'::character varying NOT NULL,
    sent boolean DEFAULT false NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    title character varying,
    data jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.notification_log OWNER TO postgres;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    old_status character varying(50),
    new_status character varying(50) NOT NULL,
    old_payment_status character varying(50),
    new_payment_status character varying(50),
    changed_by uuid,
    changed_at timestamp with time zone DEFAULT now(),
    notes text,
    change_type character varying(50) DEFAULT 'status_change'::character varying
);


ALTER TABLE public.order_status_history OWNER TO postgres;

--
-- Name: TABLE order_status_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.order_status_history IS 'Tracks all order status and payment status changes for audit trail';


--
-- Name: COLUMN order_status_history.change_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.order_status_history.change_type IS 'Type of change: status_change, payment_change, or both';


--
-- Name: order_status_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    previous_status text,
    new_status text,
    changed_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.order_status_log OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type text DEFAULT ''::text NOT NULL,
    customer_name text NOT NULL,
    total numeric DEFAULT '0'::numeric NOT NULL,
    payment_status text DEFAULT 'paid'::text NOT NULL,
    order_status text DEFAULT 'pending'::text NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    product_link text DEFAULT 'link'::text NOT NULL,
    cny_price numeric DEFAULT '0'::numeric NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    estimated_weight_kg double precision DEFAULT '0'::double precision,
    notes text,
    screenshot_url text,
    customer_id uuid DEFAULT auth.uid() NOT NULL,
    customer_unique_id text,
    shipping_mode text DEFAULT 'air'::text,
    product_id bigint,
    product_name text,
    order_id character varying(50),
    payment_reference character varying(255),
    shipment_start_date timestamp with time zone,
    estimated_duration_days integer DEFAULT 45,
    shipping_cost numeric DEFAULT 0,
    shipping_fee_paid boolean DEFAULT false,
    shipping_fee_payment_reference text,
    item_tracking_numbers text,
    CONSTRAINT orders_shipping_mode_check CHECK (((shipping_mode = ANY (ARRAY['air_express'::text, 'air_normal'::text, 'sea'::text])) OR (shipping_mode IS NULL))),
    CONSTRAINT valid_shipping_mode CHECK (((shipping_mode = ANY (ARRAY['air_express'::text, 'air_normal'::text, 'sea'::text])) OR (shipping_mode IS NULL)))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: TABLE orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.orders IS 'Force reload trigger';


--
-- Name: COLUMN orders.shipping_mode; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.orders.shipping_mode IS 'Customer selected shipping mode: air_express (3 days), air_normal (12 days), or sea (35-40 days)';


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: payment_reconciliation_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_reconciliation_logs (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    total_checked integer,
    recovered integer,
    still_pending integer,
    errors integer,
    details jsonb
);


ALTER TABLE public.payment_reconciliation_logs OWNER TO postgres;

--
-- Name: payment_reconciliation_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_reconciliation_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_reconciliation_logs_id_seq OWNER TO postgres;

--
-- Name: payment_reconciliation_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_reconciliation_logs_id_seq OWNED BY public.payment_reconciliation_logs.id;


--
-- Name: payout_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payout_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid,
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'pending'::text,
    payment_method text,
    payment_details jsonb,
    processed_by uuid,
    processed_at timestamp with time zone,
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payout_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'paid'::text, 'rejected'::text])))
);


ALTER TABLE public.payout_requests OWNER TO postgres;

--
-- Name: TABLE payout_requests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.payout_requests IS 'Tracks affiliate payout requests and admin processing';


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    image_url text NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    public_id text,
    media_type character varying(50) DEFAULT 'image'::character varying
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: COLUMN product_images.public_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.product_images.public_id IS 'Cloudinary public_id for image deletion';


--
-- Name: COLUMN product_images.media_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.product_images.media_type IS 'Media type: image or video';


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_images ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id bigint NOT NULL,
    customer_id uuid NOT NULL,
    rating integer NOT NULL,
    title text,
    review_text text NOT NULL,
    is_verified_purchase boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.product_reviews OWNER TO postgres;

--
-- Name: TABLE product_reviews; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.product_reviews IS 'Stores customer product reviews and ratings';


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    sku text,
    price numeric NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    variant_options jsonb,
    created_at timestamp with time zone DEFAULT now(),
    image_url text,
    image_public_id text,
    price_cny numeric(10,2)
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: COLUMN product_variants.image_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.product_variants.image_url IS 'Optional image URL for this variant. Falls back to primary product image if not set.';


--
-- Name: COLUMN product_variants.image_public_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.product_variants.image_public_id IS 'Cloudinary public_id for variant image deletion';


--
-- Name: COLUMN product_variants.price_cny; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.product_variants.price_cny IS 'Canonical variant price in CNY (Yuan). GHS is derived live.';


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_variants ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_variants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    sku text NOT NULL,
    price numeric DEFAULT '0'::numeric NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    category text,
    image text,
    description text,
    image_url text,
    product_link text,
    is_trending boolean DEFAULT false,
    is_promotion boolean DEFAULT false,
    promotion_order integer DEFAULT 0,
    view_count integer DEFAULT 0,
    sales_count integer DEFAULT 0,
    created_by uuid,
    forced_shipping_method character varying(20),
    general_options_prices jsonb,
    service_fee_applicable boolean DEFAULT true NOT NULL,
    embedding public.vector(1536),
    price_cny numeric(10,2),
    general_options_prices_cny jsonb
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: COLUMN products.price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.price IS 'Cached GHS price. Refreshed from price_cny via refresh_cached_ghs_prices() whenever the shop rate changes. Do NOT edit manually.';


--
-- Name: COLUMN products.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.created_by IS 'User ID of the admin who created this product';


--
-- Name: COLUMN products.forced_shipping_method; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.forced_shipping_method IS 'Forces a specific shipping method for this product at checkout. Values: sea, normal, express. NULL means no restriction.';


--
-- Name: COLUMN products.general_options_prices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.general_options_prices IS 'Stores general option values with prices. Format: {"OptionName": {"value": {"value": "ValueName", "price": 10.00}}}. Used to display prices on product details page and calculate total price.';


--
-- Name: COLUMN products.service_fee_applicable; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.service_fee_applicable IS 'Determines if service fee should be applied to this product at checkout. TRUE = service fee applies, FALSE = no service fee. Default is TRUE.';


--
-- Name: COLUMN products.price_cny; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.price_cny IS 'Canonical product price in CNY (Yuan). GHS is derived: floor(price_cny / rate_shop_products * 100) / 100.';


--
-- Name: COLUMN products.general_options_prices_cny; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.products.general_options_prices_cny IS 'JSONB mirror of general_options_prices but with CNY values. Shape: { "<optName>": { "<value>": { "price_cny": num, ... } } }';


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    internal_name text NOT NULL,
    headline text,
    subtext text,
    media_type text DEFAULT 'image'::text NOT NULL,
    media_url text NOT NULL,
    media_url_thumbnail text,
    link_url text,
    action_label text,
    is_active boolean DEFAULT true NOT NULL,
    link text,
    thumbnail_url text,
    public_id text,
    name text,
    image_transform text
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: COLUMN promotions.link; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.promotions.link IS 'URL where the promotion slide clicks to';


--
-- Name: COLUMN promotions.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.promotions.name IS 'Internal name for the promotion (for admin use)';


--
-- Name: COLUMN promotions.image_transform; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.promotions.image_transform IS 'JSON string containing image transform data (zoom, x, y) for positioning';


--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.promotions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.promotions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recently_viewed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recently_viewed (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    product_id bigint NOT NULL,
    viewed_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.recently_viewed OWNER TO postgres;

--
-- Name: TABLE recently_viewed; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.recently_viewed IS 'Tracks recently viewed products by customers';


--
-- Name: scan_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scan_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    scanned_tracking text NOT NULL,
    scan_result text NOT NULL,
    package_type text,
    package_id uuid,
    customer_name text,
    items_description text,
    current_status text,
    scanned_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.scan_logs OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    store_name text DEFAULT 'C2G Mall	'::text NOT NULL,
    public_email text DEFAULT 'support@example.com	'::text NOT NULL,
    public_phone text DEFAULT '+233 00 000 0000	'::text,
    warehouse_address text,
    air_rate_per_kg numeric DEFAULT '85'::numeric NOT NULL,
    air_base_fee numeric DEFAULT '50'::numeric NOT NULL,
    sea_rate_per_kg numeric DEFAULT '35'::numeric NOT NULL,
    sea_base_fee numeric DEFAULT '200'::numeric NOT NULL,
    maintenance_mode boolean DEFAULT false NOT NULL,
    payment_gateway text DEFAULT 'paystack'::text,
    hubtel_client_id text,
    hubtel_client_secret text,
    hubtel_merchant_account text,
    hubtel_test_mode boolean DEFAULT true,
    hubtel_api_id text,
    hubtel_api_key text,
    hubtel_callback_url text,
    rate_link_orders numeric(10,4) DEFAULT 0.52,
    rate_shop_products numeric(10,4) DEFAULT 0.52,
    exchange_rate_cny_to_ghs numeric(10,4) DEFAULT 1.92,
    exchange_rate_ghs_to_cny numeric(10,4) DEFAULT 0.52,
    updated_at timestamp with time zone DEFAULT now(),
    maintenance_pages jsonb DEFAULT '{}'::jsonb,
    rates jsonb DEFAULT '{}'::jsonb,
    usd_ghs_rate numeric(10,2) DEFAULT 15.50,
    payment_rates jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: COLUMN settings.payment_gateway; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.payment_gateway IS 'Active payment gateway: paystack, expresspay, or hubtel';


--
-- Name: COLUMN settings.hubtel_client_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_client_id IS 'Hubtel API Client ID from developer portal';


--
-- Name: COLUMN settings.hubtel_client_secret; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_client_secret IS 'Hubtel API Client Secret (keep secure)';


--
-- Name: COLUMN settings.hubtel_merchant_account; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_merchant_account IS 'Hubtel Merchant Account Number (POS Sales ID) - required for payments';


--
-- Name: COLUMN settings.hubtel_test_mode; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_test_mode IS 'Whether to use Hubtel test/sandbox mode (true) or production (false)';


--
-- Name: COLUMN settings.hubtel_api_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_api_id IS 'Hubtel API ID (username) from Hubtel API Keys page - used for Basic Auth';


--
-- Name: COLUMN settings.hubtel_api_key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.settings.hubtel_api_key IS 'Hubtel API Key (password) from Hubtel API Keys page - keep secure! Used for Basic Auth';


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.settings ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shared_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shared_carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    share_code character varying(10) NOT NULL,
    cart_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval),
    access_count integer DEFAULT 0
);


ALTER TABLE public.shared_carts OWNER TO postgres;

--
-- Name: shop_ads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shop_ads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    image_url text NOT NULL,
    image_public_id text,
    link_url text,
    audience character varying(50) DEFAULT 'all'::character varying,
    status character varying(50) DEFAULT 'active'::character varying,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    frequency_per_24h integer DEFAULT 1,
    CONSTRAINT shop_ads_frequency_per_24h_check CHECK (((frequency_per_24h >= 1) AND (frequency_per_24h <= 24)))
);


ALTER TABLE public.shop_ads OWNER TO postgres;

--
-- Name: support_escalations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_escalations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    related_id text NOT NULL,
    related_type text NOT NULL,
    issue_text text NOT NULL,
    status text DEFAULT 'open'::text,
    created_by uuid,
    created_by_name text,
    created_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone,
    resolved_by uuid,
    CONSTRAINT support_escalations_related_type_check CHECK ((related_type = ANY (ARRAY['order'::text, 'shipment'::text, 'customer'::text, 'other'::text]))),
    CONSTRAINT support_escalations_status_check CHECK ((status = ANY (ARRAY['open'::text, 'resolved'::text, 'in_progress'::text])))
);


ALTER TABLE public.support_escalations OWNER TO postgres;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    key text NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- Name: telegram_broadcasts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_broadcasts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    message_text text NOT NULL,
    channel text DEFAULT 'telegram'::text NOT NULL,
    audience text DEFAULT 'all'::text NOT NULL,
    created_by uuid,
    status text DEFAULT 'sent'::text NOT NULL
);


ALTER TABLE public.telegram_broadcasts OWNER TO postgres;

--
-- Name: telegram_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    customer_id uuid,
    chat_id text NOT NULL,
    direction text NOT NULL,
    message_text text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    media_url text,
    media_type text,
    CONSTRAINT telegram_messages_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text])))
);


ALTER TABLE public.telegram_messages OWNER TO postgres;

--
-- Name: telegram_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_verification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    chat_id bigint,
    expires_at timestamp with time zone DEFAULT (now() + '00:10:00'::interval) NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.telegram_verification_tokens OWNER TO postgres;

--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    label text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    street_address text NOT NULL,
    delivery_notes text,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: TABLE user_addresses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_addresses IS 'Stores customer saved addresses for faster checkout';


--
-- Name: user_dismissed_announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_dismissed_announcements (
    id bigint NOT NULL,
    user_id uuid,
    announcement_id bigint,
    dismissed_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_dismissed_announcements OWNER TO postgres;

--
-- Name: user_dismissed_announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_dismissed_announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_dismissed_announcements_id_seq OWNER TO postgres;

--
-- Name: user_dismissed_announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_dismissed_announcements_id_seq OWNED BY public.user_dismissed_announcements.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    email_notifications boolean DEFAULT true,
    whatsapp_notifications boolean DEFAULT true,
    order_updates boolean DEFAULT true,
    promotional_emails boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: user_searches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_searches (
    id bigint NOT NULL,
    search_query text NOT NULL,
    search_date timestamp with time zone DEFAULT now(),
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_searches OWNER TO postgres;

--
-- Name: TABLE user_searches; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_searches IS 'Stores user search queries from the shop page for analytics and product discovery';


--
-- Name: COLUMN user_searches.search_query; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_searches.search_query IS 'The search query text entered by the user';


--
-- Name: COLUMN user_searches.search_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_searches.search_date IS 'When the search was performed';


--
-- Name: COLUMN user_searches.ip_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_searches.ip_address IS 'Optional: IP address of the user (currently not used)';


--
-- Name: COLUMN user_searches.user_agent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_searches.user_agent IS 'Browser user agent string';


--
-- Name: user_searches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_searches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_searches_id_seq OWNER TO postgres;

--
-- Name: user_searches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_searches_id_seq OWNED BY public.user_searches.id;


--
-- Name: warehouse_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.warehouse_addresses OWNER TO postgres;

--
-- Name: TABLE warehouse_addresses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.warehouse_addresses IS 'Stores multiple warehouse addresses for different locations. Admins can manage these addresses, and users can view them for shipping purposes.';


--
-- Name: COLUMN warehouse_addresses.location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.warehouse_addresses.location IS 'Country or region name (e.g., "China", "USA", "UK")';


--
-- Name: COLUMN warehouse_addresses.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.warehouse_addresses.name IS 'Warehouse name/title (e.g., "China Warehouse", "USA Warehouse")';


--
-- Name: COLUMN warehouse_addresses.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.warehouse_addresses.address IS 'Full warehouse address';


--
-- Name: COLUMN warehouse_addresses.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.warehouse_addresses.phone IS 'Contact phone number for the warehouse';


--
-- Name: COLUMN warehouse_addresses.is_default; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.warehouse_addresses.is_default IS 'Whether this is the default warehouse address (only one can be default)';


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    product_id bigint NOT NULL,
    variant_id bigint,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: TABLE wishlist; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.wishlist IS 'Stores customer wishlist items';


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_06_07; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_07 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_07 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_08; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_08 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_08 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_09; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_09 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_09 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_10; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_10 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_10 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_11; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_11 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_11 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_12; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_12 OWNER TO supabase_admin;

--
-- Name: messages_2026_06_13; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_06_13 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_06_13 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: messages_2026_06_07; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_07 FOR VALUES FROM ('2026-06-07 00:00:00') TO ('2026-06-08 00:00:00');


--
-- Name: messages_2026_06_08; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_08 FOR VALUES FROM ('2026-06-08 00:00:00') TO ('2026-06-09 00:00:00');


--
-- Name: messages_2026_06_09; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_09 FOR VALUES FROM ('2026-06-09 00:00:00') TO ('2026-06-10 00:00:00');


--
-- Name: messages_2026_06_10; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_10 FOR VALUES FROM ('2026-06-10 00:00:00') TO ('2026-06-11 00:00:00');


--
-- Name: messages_2026_06_11; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_11 FOR VALUES FROM ('2026-06-11 00:00:00') TO ('2026-06-12 00:00:00');


--
-- Name: messages_2026_06_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_12 FOR VALUES FROM ('2026-06-12 00:00:00') TO ('2026-06-13 00:00:00');


--
-- Name: messages_2026_06_13; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_06_13 FOR VALUES FROM ('2026-06-13 00:00:00') TO ('2026-06-14 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: payment_reconciliation_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reconciliation_logs ALTER COLUMN id SET DEFAULT nextval('public.payment_reconciliation_logs_id_seq'::regclass);


--
-- Name: user_dismissed_announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dismissed_announcements ALTER COLUMN id SET DEFAULT nextval('public.user_dismissed_announcements_id_seq'::regclass);


--
-- Name: user_searches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_searches ALTER COLUMN id SET DEFAULT nextval('public.user_searches_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--



--
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--



--
-- Data for Name: admin_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: affiliate_earnings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: affiliate_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: captcha_challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customer_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ecom_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: gallery_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: incoming_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notification_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_status_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_reconciliation_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payout_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: recently_viewed; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: scan_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shared_carts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_ads; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: support_escalations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: telegram_broadcasts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: telegram_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: telegram_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_dismissed_announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_searches; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: warehouse_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: messages_2026_06_07; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_08; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_09; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_10; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_11; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_12; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: messages_2026_06_13; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--



--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 12383, true);


--
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.jobid_seq', 6, true);


--
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.runid_seq', 176066, true);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 8, true);


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcements_id_seq', 61, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 332, true);


--
-- Name: payment_reconciliation_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_reconciliation_logs_id_seq', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1303, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 1197, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 659, true);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 9, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: user_dismissed_announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_dismissed_announcements_id_seq', 4535, true);


--
-- Name: user_searches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_searches_id_seq', 1008, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 4688, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: admin_settings admin_settings_admin_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_admin_id_key UNIQUE (admin_id);


--
-- Name: admin_settings admin_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);


--
-- Name: affiliate_earnings affiliate_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_earnings
    ADD CONSTRAINT affiliate_earnings_pkey PRIMARY KEY (id);


--
-- Name: affiliate_profiles affiliate_profiles_affiliate_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_profiles
    ADD CONSTRAINT affiliate_profiles_affiliate_code_key UNIQUE (affiliate_code);


--
-- Name: affiliate_profiles affiliate_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_profiles
    ADD CONSTRAINT affiliate_profiles_pkey PRIMARY KEY (id);


--
-- Name: affiliate_profiles affiliate_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_profiles
    ADD CONSTRAINT affiliate_profiles_user_id_key UNIQUE (user_id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: captcha_challenges captcha_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.captcha_challenges
    ADD CONSTRAINT captcha_challenges_pkey PRIMARY KEY (id);


--
-- Name: contact_inquiries contact_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id);


--
-- Name: customer_addresses customer_addresses_customer_id_street_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_street_address_key UNIQUE (customer_id, street_address);


--
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- Name: customer_notes customer_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_notes
    ADD CONSTRAINT customer_notes_pkey PRIMARY KEY (id);


--
-- Name: customers customers_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_id_key UNIQUE (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: ecom_orders ecom_orders_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ecom_orders
    ADD CONSTRAINT ecom_orders_order_id_key UNIQUE (order_id);


--
-- Name: ecom_orders ecom_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ecom_orders
    ADD CONSTRAINT ecom_orders_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: gallery_submissions gallery_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_submissions
    ADD CONSTRAINT gallery_submissions_pkey PRIMARY KEY (id);


--
-- Name: incoming_packages incoming_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoming_packages
    ADD CONSTRAINT incoming_packages_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: notification_log notification_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_log
    ADD CONSTRAINT notification_log_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: order_status_log order_status_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_log
    ADD CONSTRAINT order_status_log_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_id_key UNIQUE (order_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_reconciliation_logs payment_reconciliation_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_reconciliation_logs
    ADD CONSTRAINT payment_reconciliation_logs_pkey PRIMARY KEY (id);


--
-- Name: payout_requests payout_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payout_requests
    ADD CONSTRAINT payout_requests_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_product_id_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_customer_id_key UNIQUE (product_id, customer_id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_id_key UNIQUE (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: products products_sku_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_unique UNIQUE (sku);


--
-- Name: CONSTRAINT products_sku_unique ON products; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT products_sku_unique ON public.products IS 'Ensures all product SKUs are unique across the database';


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: recently_viewed recently_viewed_customer_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT recently_viewed_customer_id_product_id_key UNIQUE (customer_id, product_id);


--
-- Name: recently_viewed recently_viewed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT recently_viewed_pkey PRIMARY KEY (id);


--
-- Name: scan_logs scan_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_logs
    ADD CONSTRAINT scan_logs_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: shared_carts shared_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_carts
    ADD CONSTRAINT shared_carts_pkey PRIMARY KEY (id);


--
-- Name: shared_carts shared_carts_share_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_carts
    ADD CONSTRAINT shared_carts_share_code_key UNIQUE (share_code);


--
-- Name: shipments shipments_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_id_key UNIQUE (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_tracking_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_tracking_number_key UNIQUE (tracking_number);


--
-- Name: shop_ads shop_ads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop_ads
    ADD CONSTRAINT shop_ads_pkey PRIMARY KEY (id);


--
-- Name: support_escalations support_escalations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_escalations
    ADD CONSTRAINT support_escalations_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: telegram_broadcasts telegram_broadcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_broadcasts
    ADD CONSTRAINT telegram_broadcasts_pkey PRIMARY KEY (id);


--
-- Name: telegram_messages telegram_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_messages
    ADD CONSTRAINT telegram_messages_pkey PRIMARY KEY (id);


--
-- Name: telegram_verification_tokens telegram_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_verification_tokens
    ADD CONSTRAINT telegram_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: telegram_verification_tokens telegram_verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_verification_tokens
    ADD CONSTRAINT telegram_verification_tokens_token_key UNIQUE (token);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: user_dismissed_announcements user_dismissed_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dismissed_announcements
    ADD CONSTRAINT user_dismissed_announcements_pkey PRIMARY KEY (id);


--
-- Name: user_dismissed_announcements user_dismissed_announcements_user_id_announcement_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dismissed_announcements
    ADD CONSTRAINT user_dismissed_announcements_user_id_announcement_id_key UNIQUE (user_id, announcement_id);


--
-- Name: user_preferences user_preferences_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_customer_id_key UNIQUE (customer_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_searches user_searches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_searches
    ADD CONSTRAINT user_searches_pkey PRIMARY KEY (id);


--
-- Name: warehouse_addresses warehouse_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_addresses
    ADD CONSTRAINT warehouse_addresses_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_customer_id_product_id_variant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_customer_id_product_id_variant_id_key UNIQUE (customer_id, product_id, variant_id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_07 messages_2026_06_07_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_07
    ADD CONSTRAINT messages_2026_06_07_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_08 messages_2026_06_08_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_08
    ADD CONSTRAINT messages_2026_06_08_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_09 messages_2026_06_09_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_09
    ADD CONSTRAINT messages_2026_06_09_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_10 messages_2026_06_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_10
    ADD CONSTRAINT messages_2026_06_10_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_11 messages_2026_06_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_11
    ADD CONSTRAINT messages_2026_06_11_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_12 messages_2026_06_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_12
    ADD CONSTRAINT messages_2026_06_12_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_06_13 messages_2026_06_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_06_13
    ADD CONSTRAINT messages_2026_06_13_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: captcha_challenges_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX captcha_challenges_expires_at_idx ON public.captcha_challenges USING btree (expires_at);


--
-- Name: captcha_challenges_used_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX captcha_challenges_used_idx ON public.captcha_challenges USING btree (used);


--
-- Name: employees_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employees_email_idx ON public.employees USING btree (lower(email));


--
-- Name: employees_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employees_status_idx ON public.employees USING btree (status);


--
-- Name: idx_admin_settings_admin_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_settings_admin_id ON public.admin_settings USING btree (admin_id);


--
-- Name: idx_admin_settings_notifications_enabled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_settings_notifications_enabled ON public.admin_settings USING btree (notifications_enabled);


--
-- Name: idx_admin_settings_telegram_chat_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_settings_telegram_chat_id ON public.admin_settings USING btree (telegram_chat_id);


--
-- Name: idx_affiliate_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliate_code ON public.affiliate_profiles USING btree (affiliate_code);


--
-- Name: idx_affiliate_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliate_status ON public.affiliate_profiles USING btree (status);


--
-- Name: idx_affiliate_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliate_user ON public.affiliate_profiles USING btree (user_id);


--
-- Name: idx_announcements_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_announcements_active ON public.announcements USING btree (is_active, start_date, end_date);


--
-- Name: idx_announcements_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_announcements_priority ON public.announcements USING btree (priority DESC);


--
-- Name: idx_contact_inquiries_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_inquiries_created_at ON public.contact_inquiries USING btree (created_at DESC);


--
-- Name: idx_contact_inquiries_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries USING btree (status);


--
-- Name: idx_customer_addresses_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_addresses_customer_id ON public.customer_addresses USING btree (customer_id);


--
-- Name: idx_customer_addresses_primary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_addresses_primary ON public.customer_addresses USING btree (customer_id, is_primary) WHERE (is_primary = true);


--
-- Name: idx_customer_referrer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_referrer ON public.customers USING btree (referred_by_affiliate_id);


--
-- Name: idx_earnings_affiliate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_earnings_affiliate ON public.affiliate_earnings USING btree (affiliate_id, created_at DESC);


--
-- Name: idx_earnings_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_earnings_order ON public.affiliate_earnings USING btree (order_id);


--
-- Name: idx_ecom_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_created_at ON public.ecom_orders USING btree (created_at);


--
-- Name: idx_ecom_orders_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_customer_id ON public.ecom_orders USING btree (customer_id);


--
-- Name: idx_ecom_orders_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_order_id ON public.ecom_orders USING btree (order_id);


--
-- Name: idx_ecom_orders_order_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_order_status ON public.ecom_orders USING btree (order_status);


--
-- Name: idx_ecom_orders_payment_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_payment_reference ON public.ecom_orders USING btree (payment_reference);


--
-- Name: idx_ecom_orders_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ecom_orders_payment_status ON public.ecom_orders USING btree (payment_status);


--
-- Name: idx_gallery_submissions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_submissions_status ON public.gallery_submissions USING btree (status);


--
-- Name: idx_gallery_submissions_submitted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gallery_submissions_submitted_at ON public.gallery_submissions USING btree (submitted_at);


--
-- Name: idx_incoming_packages_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incoming_packages_customer_id ON public.incoming_packages USING btree (customer_id);


--
-- Name: idx_incoming_packages_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incoming_packages_status ON public.incoming_packages USING btree (status);


--
-- Name: idx_notification_log_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notification_log_created_at ON public.notification_log USING btree (created_at);


--
-- Name: idx_notification_log_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notification_log_customer_id ON public.notification_log USING btree (customer_id);


--
-- Name: idx_notification_log_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notification_log_type ON public.notification_log USING btree (notification_type);


--
-- Name: idx_order_status_history_changed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_status_history_changed_at ON public.order_status_history USING btree (changed_at DESC);


--
-- Name: idx_order_status_history_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_status_history_order_id ON public.order_status_history USING btree (order_id);


--
-- Name: idx_orders_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_order_id ON public.orders USING btree (order_id);


--
-- Name: idx_orders_shipping_mode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_shipping_mode ON public.orders USING btree (shipping_mode);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status ON public.orders USING btree (order_status);


--
-- Name: idx_payout_affiliate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payout_affiliate ON public.payout_requests USING btree (affiliate_id);


--
-- Name: idx_payout_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payout_status ON public.payout_requests USING btree (status, created_at DESC);


--
-- Name: idx_product_reviews_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_reviews_customer_id ON public.product_reviews USING btree (customer_id);


--
-- Name: idx_product_reviews_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_reviews_product_id ON public.product_reviews USING btree (product_id);


--
-- Name: idx_product_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_reviews_rating ON public.product_reviews USING btree (product_id, rating);


--
-- Name: idx_products_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_created_by ON public.products USING btree (created_by);


--
-- Name: idx_products_forced_shipping_method; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_forced_shipping_method ON public.products USING btree (forced_shipping_method) WHERE (forced_shipping_method IS NOT NULL);


--
-- Name: idx_products_general_options_prices; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_general_options_prices ON public.products USING gin (general_options_prices) WHERE (general_options_prices IS NOT NULL);


--
-- Name: idx_products_promotion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_promotion ON public.products USING btree (is_promotion) WHERE (is_promotion = true);


--
-- Name: idx_products_sales_count; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sales_count ON public.products USING btree (sales_count DESC);


--
-- Name: idx_products_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sku ON public.products USING btree (sku);


--
-- Name: idx_products_trending; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_trending ON public.products USING btree (is_trending) WHERE (is_trending = true);


--
-- Name: idx_products_view_count; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_view_count ON public.products USING btree (view_count DESC);


--
-- Name: idx_recently_viewed_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recently_viewed_customer_id ON public.recently_viewed USING btree (customer_id, viewed_at DESC);


--
-- Name: idx_shared_carts_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shared_carts_expires_at ON public.shared_carts USING btree (expires_at);


--
-- Name: idx_shared_carts_share_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shared_carts_share_code ON public.shared_carts USING btree (share_code);


--
-- Name: idx_shipments_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shipments_order_id ON public.shipments USING btree (order_id);


--
-- Name: idx_shipments_reg_fee_ref; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shipments_reg_fee_ref ON public.shipments USING btree (registration_fee_payment_reference);


--
-- Name: idx_shop_ads_audience; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shop_ads_audience ON public.shop_ads USING btree (audience);


--
-- Name: idx_shop_ads_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shop_ads_dates ON public.shop_ads USING btree (start_date, end_date);


--
-- Name: idx_shop_ads_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shop_ads_status ON public.shop_ads USING btree (status);


--
-- Name: idx_telegram_messages_chat_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_messages_chat_id ON public.telegram_messages USING btree (chat_id);


--
-- Name: idx_telegram_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_messages_created_at ON public.telegram_messages USING btree (created_at);


--
-- Name: idx_telegram_messages_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_messages_customer_id ON public.telegram_messages USING btree (customer_id);


--
-- Name: idx_telegram_messages_direction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_messages_direction ON public.telegram_messages USING btree (direction);


--
-- Name: idx_telegram_messages_is_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_messages_is_read ON public.telegram_messages USING btree (is_read);


--
-- Name: idx_telegram_tokens_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_tokens_customer_id ON public.telegram_verification_tokens USING btree (customer_id);


--
-- Name: idx_telegram_tokens_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_tokens_expires_at ON public.telegram_verification_tokens USING btree (expires_at);


--
-- Name: idx_telegram_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telegram_tokens_token ON public.telegram_verification_tokens USING btree (token);


--
-- Name: idx_user_addresses_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_addresses_customer_id ON public.user_addresses USING btree (customer_id);


--
-- Name: idx_user_addresses_primary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_addresses_primary ON public.user_addresses USING btree (customer_id, is_primary) WHERE (is_primary = true);


--
-- Name: idx_user_dismissed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_dismissed ON public.user_dismissed_announcements USING btree (user_id, announcement_id);


--
-- Name: idx_user_preferences_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_preferences_customer_id ON public.user_preferences USING btree (customer_id);


--
-- Name: idx_user_searches_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_searches_date ON public.user_searches USING btree (search_date);


--
-- Name: idx_user_searches_query; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_searches_query ON public.user_searches USING btree (search_query);


--
-- Name: idx_warehouse_addresses_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouse_addresses_created_at ON public.warehouse_addresses USING btree (created_at DESC);


--
-- Name: idx_warehouse_addresses_is_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouse_addresses_is_default ON public.warehouse_addresses USING btree (is_default) WHERE (is_default = true);


--
-- Name: idx_warehouse_addresses_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouse_addresses_location ON public.warehouse_addresses USING btree (location);


--
-- Name: idx_warehouse_addresses_single_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_warehouse_addresses_single_default ON public.warehouse_addresses USING btree (is_default) WHERE (is_default = true);


--
-- Name: idx_wishlist_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_customer_id ON public.wishlist USING btree (customer_id);


--
-- Name: idx_wishlist_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_product_id ON public.wishlist USING btree (product_id);


--
-- Name: login_attempts_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX login_attempts_email_idx ON public.login_attempts USING btree (email, attempted_at);


--
-- Name: products_embedding_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_embedding_idx ON public.products USING hnsw (embedding public.vector_cosine_ops);


--
-- Name: products_search_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_search_idx ON public.products USING gin (((setweight(to_tsvector('english'::regconfig, COALESCE(name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(description, ''::text)), 'B'::"char"))));


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_07_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_07_inserted_at_topic_idx ON realtime.messages_2026_06_07 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_08_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_08_inserted_at_topic_idx ON realtime.messages_2026_06_08 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_09_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_09_inserted_at_topic_idx ON realtime.messages_2026_06_09 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_10_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_10_inserted_at_topic_idx ON realtime.messages_2026_06_10 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_11_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_11_inserted_at_topic_idx ON realtime.messages_2026_06_11 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_12_inserted_at_topic_idx ON realtime.messages_2026_06_12 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_06_13_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_06_13_inserted_at_topic_idx ON realtime.messages_2026_06_13 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2026_06_07_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_07_inserted_at_topic_idx;


--
-- Name: messages_2026_06_07_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_07_pkey;


--
-- Name: messages_2026_06_08_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_08_inserted_at_topic_idx;


--
-- Name: messages_2026_06_08_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_08_pkey;


--
-- Name: messages_2026_06_09_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_09_inserted_at_topic_idx;


--
-- Name: messages_2026_06_09_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_09_pkey;


--
-- Name: messages_2026_06_10_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_10_inserted_at_topic_idx;


--
-- Name: messages_2026_06_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_10_pkey;


--
-- Name: messages_2026_06_11_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_11_inserted_at_topic_idx;


--
-- Name: messages_2026_06_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_11_pkey;


--
-- Name: messages_2026_06_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_12_inserted_at_topic_idx;


--
-- Name: messages_2026_06_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_12_pkey;


--
-- Name: messages_2026_06_13_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_06_13_inserted_at_topic_idx;


--
-- Name: messages_2026_06_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_06_13_pkey;


--
-- Name: ecom_orders check_payment_manipulation; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_payment_manipulation BEFORE UPDATE ON public.ecom_orders FOR EACH ROW EXECUTE FUNCTION public.prevent_payment_manipulation();


--
-- Name: products embed-products; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "embed-products" AFTER INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://ozhyflsobsoaypihwrco.supabase.co/functions/v1/generate-product-embedding', 'POST', '{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA","Content-Type":"application/json"}', '{}', '5000');


--
-- Name: employees employees_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER employees_set_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_employees_updated_at();


--
-- Name: affiliate_earnings on_affiliate_earning_added; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_affiliate_earning_added AFTER INSERT ON public.affiliate_earnings FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_balance();


--
-- Name: customers on_customer_referred; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_customer_referred AFTER INSERT OR UPDATE OF referred_by_affiliate_id ON public.customers FOR EACH ROW WHEN ((new.referred_by_affiliate_id IS NOT NULL)) EXECUTE FUNCTION public.update_affiliate_referral_count();


--
-- Name: payout_requests on_payout_processed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_payout_processed AFTER UPDATE OF status ON public.payout_requests FOR EACH ROW EXECUTE FUNCTION public.process_payout_balance();


--
-- Name: affiliate_profiles prevent_balance_changes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_balance_changes BEFORE UPDATE OF balance, total_earned ON public.affiliate_profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_balance_manipulation();


--
-- Name: ecom_orders trg_secure_ecom_order_totals; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_secure_ecom_order_totals BEFORE INSERT ON public.ecom_orders FOR EACH ROW EXECUTE FUNCTION public.secure_ecom_order_totals();


--
-- Name: customers trigger_auto_link_affiliate; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_link_affiliate BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION public.auto_link_customer_to_affiliate();


--
-- Name: ecom_orders trigger_create_affiliate_earning_ecom_order; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_create_affiliate_earning_ecom_order AFTER INSERT OR UPDATE OF payment_status ON public.ecom_orders FOR EACH ROW EXECUTE FUNCTION public.create_affiliate_earning_for_ecom_order();


--
-- Name: warehouse_addresses trigger_ensure_single_default_warehouse_address; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_ensure_single_default_warehouse_address BEFORE INSERT OR UPDATE ON public.warehouse_addresses FOR EACH ROW WHEN ((new.is_default = true)) EXECUTE FUNCTION public.ensure_single_default_warehouse_address();


--
-- Name: ecom_orders trigger_log_order_status_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_log_order_status_change AFTER UPDATE ON public.ecom_orders FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();


--
-- Name: user_addresses trigger_notify_addresses; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_notify_addresses AFTER INSERT OR UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION public.notify_on_address_change();


--
-- Name: customers trigger_notify_profile; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_notify_profile AFTER UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.notify_on_profile_change();


--
-- Name: shipments trigger_notify_shipments; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_notify_shipments AFTER INSERT OR UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.notify_on_shipment_change();


--
-- Name: admin_settings trigger_update_admin_settings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_admin_settings_updated_at();


--
-- Name: warehouse_addresses trigger_update_warehouse_addresses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_warehouse_addresses_updated_at BEFORE UPDATE ON public.warehouse_addresses FOR EACH ROW EXECUTE FUNCTION public.update_warehouse_addresses_updated_at();


--
-- Name: affiliate_profiles update_affiliate_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_affiliate_profiles_updated_at BEFORE UPDATE ON public.affiliate_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ecom_orders update_ecom_orders_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_ecom_orders_timestamp BEFORE UPDATE ON public.ecom_orders FOR EACH ROW EXECUTE FUNCTION public.update_ecom_orders_updated_at();


--
-- Name: payout_requests update_payout_requests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_payout_requests_updated_at BEFORE UPDATE ON public.payout_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_preferences update_user_preferences_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_preferences_timestamp BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_user_preferences_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_settings admin_settings_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: affiliate_earnings affiliate_earnings_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_earnings
    ADD CONSTRAINT affiliate_earnings_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE;


--
-- Name: affiliate_earnings affiliate_earnings_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_earnings
    ADD CONSTRAINT affiliate_earnings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: affiliate_profiles affiliate_profiles_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_profiles
    ADD CONSTRAINT affiliate_profiles_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.customers(id);


--
-- Name: affiliate_profiles affiliate_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affiliate_profiles
    ADD CONSTRAINT affiliate_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: customer_addresses customer_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: customer_notes customer_notes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_notes
    ADD CONSTRAINT customer_notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: customer_notes customer_notes_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_notes
    ADD CONSTRAINT customer_notes_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: customers customers_referred_by_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_referred_by_affiliate_id_fkey FOREIGN KEY (referred_by_affiliate_id) REFERENCES public.affiliate_profiles(id) ON DELETE SET NULL;


--
-- Name: ecom_orders ecom_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ecom_orders
    ADD CONSTRAINT ecom_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: employees employees_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id);


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: incoming_packages incoming_packages_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoming_packages
    ADD CONSTRAINT incoming_packages_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: notification_log notification_log_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_log
    ADD CONSTRAINT notification_log_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: order_status_history order_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id);


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ecom_orders(id) ON DELETE CASCADE;


--
-- Name: order_status_log order_status_log_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_log
    ADD CONSTRAINT order_status_log_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ecom_orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id);


--
-- Name: orders orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: payout_requests payout_requests_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payout_requests
    ADD CONSTRAINT payout_requests_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE;


--
-- Name: payout_requests payout_requests_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payout_requests
    ADD CONSTRAINT payout_requests_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.customers(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: recently_viewed recently_viewed_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT recently_viewed_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: recently_viewed recently_viewed_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT recently_viewed_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: shipments shipments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: shipments shipments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ecom_orders(id) ON DELETE SET NULL;


--
-- Name: support_escalations support_escalations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_escalations
    ADD CONSTRAINT support_escalations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: support_escalations support_escalations_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_escalations
    ADD CONSTRAINT support_escalations_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: system_settings system_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: telegram_broadcasts telegram_broadcasts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_broadcasts
    ADD CONSTRAINT telegram_broadcasts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: telegram_messages telegram_messages_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_messages
    ADD CONSTRAINT telegram_messages_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: telegram_verification_tokens telegram_verification_tokens_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_verification_tokens
    ADD CONSTRAINT telegram_verification_tokens_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: user_dismissed_announcements user_dismissed_announcements_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dismissed_announcements
    ADD CONSTRAINT user_dismissed_announcements_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: user_dismissed_announcements user_dismissed_announcements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_dismissed_announcements
    ADD CONSTRAINT user_dismissed_announcements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: support_escalations Admin update escalations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin update escalations" ON public.support_escalations FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: settings Admin: Can update settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin: Can update settings" ON public.settings FOR UPDATE TO authenticated USING ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0)) WITH CHECK ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0));


--
-- Name: announcements Admin: Full access to announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin: Full access to announcements" ON public.announcements TO authenticated USING ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0)) WITH CHECK ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0));


--
-- Name: user_dismissed_announcements Admin: Full access to dismissed announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin: Full access to dismissed announcements" ON public.user_dismissed_announcements TO authenticated USING ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0)) WITH CHECK ((( SELECT count(*) AS count
   FROM public.admins
  WHERE (admins.user_id = auth.uid())) > 0));


--
-- Name: telegram_broadcasts Admins and Staff can view broadcasts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins and Staff can view broadcasts" ON public.telegram_broadcasts FOR SELECT USING ((((auth.jwt() ->> 'role'::text) = 'service_role'::text) OR (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text))))));


--
-- Name: admins Admins can delete admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete admins" ON public.admins FOR DELETE TO authenticated USING (public.is_user_admin(auth.uid()));


--
-- Name: customers Admins can delete customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete customers" ON public.customers FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: gallery_submissions Admins can delete gallery submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete gallery submissions" ON public.gallery_submissions FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: product_images Admins can delete product images; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete product images" ON public.product_images FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: products Admins can delete products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: warehouse_addresses Admins can delete warehouse addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete warehouse addresses" ON public.warehouse_addresses FOR DELETE TO authenticated USING (public.is_user_admin(auth.uid()));


--
-- Name: telegram_broadcasts Admins can insert broadcasts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert broadcasts" ON public.telegram_broadcasts FOR INSERT WITH CHECK (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


--
-- Name: customers Admins can insert customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: admins Admins can insert new admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert new admins" ON public.admins FOR INSERT TO authenticated WITH CHECK (public.is_user_admin(auth.uid()));


--
-- Name: product_images Admins can insert product images; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert product images" ON public.product_images FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: products Admins can insert products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: telegram_messages Admins can insert telegram messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert telegram messages" ON public.telegram_messages FOR INSERT WITH CHECK (((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id
   FROM public.admins))));


--
-- Name: warehouse_addresses Admins can insert warehouse addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert warehouse addresses" ON public.warehouse_addresses FOR INSERT TO authenticated WITH CHECK (public.is_user_admin(auth.uid()));


--
-- Name: ecom_orders Admins can manage all ecom orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all ecom orders" ON public.ecom_orders USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: announcements Admins can manage announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage announcements" ON public.announcements TO authenticated USING (((auth.jwt() ->> 'email'::text) = 'c2glogisticsgh@gmail.com'::text)) WITH CHECK (((auth.jwt() ->> 'email'::text) = 'c2glogisticsgh@gmail.com'::text));


--
-- Name: admin_settings Admins can manage own settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage own settings" ON public.admin_settings USING ((auth.uid() = admin_id)) WITH CHECK ((auth.uid() = admin_id));


--
-- Name: product_variants Admins can manage product variants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage product variants" ON public.product_variants USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: shop_ads Admins can manage shop ads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage shop ads" ON public.shop_ads USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: payout_requests Admins can process payouts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can process payouts" ON public.payout_requests FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: admins Admins can read all admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can read all admins" ON public.admins FOR SELECT TO authenticated USING (public.is_user_admin(auth.uid()));


--
-- Name: admins Admins can update admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update admins" ON public.admins FOR UPDATE TO authenticated USING (public.is_user_admin(auth.uid())) WITH CHECK (public.is_user_admin(auth.uid()));


--
-- Name: affiliate_profiles Admins can update affiliate status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update affiliate status" ON public.affiliate_profiles FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: customers Admins can update customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update customers" ON public.customers FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: orders Admins can update link orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update link orders" ON public.orders FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: product_images Admins can update product images; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update product images" ON public.product_images FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: products Admins can update products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: settings Admins can update settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update settings" ON public.settings USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: telegram_messages Admins can update telegram messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update telegram messages" ON public.telegram_messages FOR UPDATE USING (((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id
   FROM public.admins)))) WITH CHECK (((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id
   FROM public.admins))));


--
-- Name: warehouse_addresses Admins can update warehouse addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update warehouse addresses" ON public.warehouse_addresses FOR UPDATE TO authenticated USING (public.is_user_admin(auth.uid())) WITH CHECK (public.is_user_admin(auth.uid()));


--
-- Name: affiliate_profiles Admins can view all affiliates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all affiliates" ON public.affiliate_profiles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: customers Admins can view all customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all customers" ON public.customers FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: affiliate_earnings Admins can view all earnings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all earnings" ON public.affiliate_earnings FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: contact_inquiries Admins can view all inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all inquiries" ON public.contact_inquiries FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: order_status_history Admins can view all order history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all order history" ON public.order_status_history FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: payout_requests Admins can view all payouts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all payouts" ON public.payout_requests FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: shipments Admins can view all shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all shipments" ON public.shipments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: telegram_messages Admins can view all telegram messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all telegram messages" ON public.telegram_messages FOR SELECT USING (((auth.role() = 'service_role'::text) OR (auth.uid() IN ( SELECT admins.user_id
   FROM public.admins))));


--
-- Name: telegram_verification_tokens Admins can view all verification tokens; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all verification tokens" ON public.telegram_verification_tokens FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: warehouse_addresses Admins can view all warehouse addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all warehouse addresses" ON public.warehouse_addresses FOR SELECT TO authenticated USING (public.is_user_admin(auth.uid()));


--
-- Name: employees Admins manage employees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage employees" ON public.employees USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: payout_requests Affiliates can create own payout requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Affiliates can create own payout requests" ON public.payout_requests FOR INSERT WITH CHECK ((affiliate_id IN ( SELECT affiliate_profiles.id
   FROM public.affiliate_profiles
  WHERE ((affiliate_profiles.user_id = auth.uid()) AND (affiliate_profiles.status = 'approved'::text)))));


--
-- Name: affiliate_earnings Affiliates can view own earnings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Affiliates can view own earnings" ON public.affiliate_earnings FOR SELECT USING ((affiliate_id IN ( SELECT affiliate_profiles.id
   FROM public.affiliate_profiles
  WHERE (affiliate_profiles.user_id = auth.uid()))));


--
-- Name: payout_requests Affiliates can view own payouts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Affiliates can view own payouts" ON public.payout_requests FOR SELECT USING ((affiliate_id IN ( SELECT affiliate_profiles.id
   FROM public.affiliate_profiles
  WHERE (affiliate_profiles.user_id = auth.uid()))));


--
-- Name: affiliate_profiles Allow admin delete on affiliate_profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin delete on affiliate_profiles" ON public.affiliate_profiles FOR DELETE USING (true);


--
-- Name: product_images Allow admin full access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin full access" ON public.product_images USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: user_searches Allow admins to delete user_searches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to delete user_searches" ON public.user_searches FOR DELETE TO authenticated USING (true);


--
-- Name: user_searches Allow admins to read user_searches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to read user_searches" ON public.user_searches FOR SELECT TO authenticated USING (true);


--
-- Name: system_settings Allow admins to update system_settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to update system_settings" ON public.system_settings USING ((auth.uid() IN ( SELECT admin_settings.admin_id
   FROM public.admin_settings))) WITH CHECK ((auth.uid() IN ( SELECT admin_settings.admin_id
   FROM public.admin_settings)));


--
-- Name: admins Allow admins to verify their own status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to verify their own status" ON public.admins FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_searches Allow authenticated inserts on user_searches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated inserts on user_searches" ON public.user_searches FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: product_images Allow delete for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow delete for admins" ON public.product_images FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: promotions Allow full access for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow full access for admins" ON public.promotions USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: product_images Allow insert for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow insert for admins" ON public.product_images FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: user_searches Allow public inserts on user_searches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public inserts on user_searches" ON public.user_searches FOR INSERT TO anon WITH CHECK (true);


--
-- Name: product_images Allow public read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access" ON public.product_images FOR SELECT USING (true);


--
-- Name: promotions Allow public read access to active promotions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to active promotions" ON public.promotions FOR SELECT USING ((is_active = true));


--
-- Name: system_settings Allow public read access to system_settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to system_settings" ON public.system_settings FOR SELECT USING (true);


--
-- Name: user_searches Allow service role to read user_searches; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow service role to read user_searches" ON public.user_searches FOR SELECT TO service_role USING (true);


--
-- Name: product_images Allow update for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow update for admins" ON public.product_images FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: shared_carts Anyone can create shared carts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can create shared carts" ON public.shared_carts FOR INSERT WITH CHECK (true);


--
-- Name: contact_inquiries Anyone can insert contact inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can insert contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);


--
-- Name: shared_carts Anyone can read shared carts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read shared carts" ON public.shared_carts FOR SELECT USING (true);


--
-- Name: shared_carts Anyone can update shared cart access count; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can update shared cart access count" ON public.shared_carts FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: shop_ads Anyone can view active shop ads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active shop ads" ON public.shop_ads FOR SELECT USING ((((status)::text = 'active'::text) AND ((start_date IS NULL) OR (start_date <= now())) AND ((end_date IS NULL) OR (end_date >= now()))));


--
-- Name: product_reviews Anyone can view approved reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews FOR SELECT USING (true);


--
-- Name: gallery_submissions Anyone can view gallery submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view gallery submissions" ON public.gallery_submissions FOR SELECT USING (true);


--
-- Name: product_images Anyone can view product images; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);


--
-- Name: product_variants Anyone can view product variants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT USING (true);


--
-- Name: products Anyone can view products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);


--
-- Name: products Approved employees delete own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Approved employees delete own products" ON public.products FOR DELETE USING (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text))))));


--
-- Name: products Approved employees insert own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Approved employees insert own products" ON public.products FOR INSERT WITH CHECK (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text))))));


--
-- Name: product_images Approved employees manage own product_images; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Approved employees manage own product_images" ON public.product_images USING ((EXISTS ( SELECT 1
   FROM public.products p
  WHERE ((p.id = product_images.product_id) AND (p.created_by = auth.uid()) AND (EXISTS ( SELECT 1
           FROM public.employees e
          WHERE ((e.user_id = auth.uid()) AND (e.status = 'approved'::text)))))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.products p
  WHERE ((p.id = product_images.product_id) AND (p.created_by = auth.uid())))));


--
-- Name: product_variants Approved employees manage own product_variants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Approved employees manage own product_variants" ON public.product_variants USING ((EXISTS ( SELECT 1
   FROM public.products p
  WHERE ((p.id = product_variants.product_id) AND (p.created_by = auth.uid()) AND (EXISTS ( SELECT 1
           FROM public.employees e
          WHERE ((e.user_id = auth.uid()) AND (e.status = 'approved'::text)))))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.products p
  WHERE ((p.id = product_variants.product_id) AND (p.created_by = auth.uid())))));


--
-- Name: products Approved employees update own products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Approved employees update own products" ON public.products FOR UPDATE USING (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text)))))) WITH CHECK ((created_by = auth.uid()));


--
-- Name: gallery_submissions Authenticated users can insert gallery submissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can insert gallery submissions" ON public.gallery_submissions FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: shipments Customers can create their own shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can create their own shipments" ON public.shipments FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: shipments Customers can delete their own shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can delete their own shipments" ON public.shipments FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: ecom_orders Customers can read own orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can read own orders" ON public.ecom_orders FOR SELECT TO authenticated USING ((customer_id = auth.uid()));


--
-- Name: shipments Customers can update their own shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can update their own shipments" ON public.shipments FOR UPDATE USING ((auth.uid() = customer_id)) WITH CHECK ((auth.uid() = customer_id));


--
-- Name: announcements Customers can view active announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can view active announcements" ON public.announcements FOR SELECT TO authenticated USING (((is_active = true) AND (start_date <= now()) AND ((end_date IS NULL) OR (end_date >= now())) AND (((target_audience)::text = 'all'::text) OR ((target_audience)::text = 'customers'::text))));


--
-- Name: shipments Customers can view their own shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Customers can view their own shipments" ON public.shipments FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: employees Employees view self; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Employees view self" ON public.employees FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: scan_logs Enable delete access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete access for all users" ON public.scan_logs FOR DELETE USING (true);


--
-- Name: scan_logs Enable insert access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert access for all users" ON public.scan_logs FOR INSERT WITH CHECK (true);


--
-- Name: products Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.products FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: products Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);


--
-- Name: scan_logs Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.scan_logs FOR SELECT USING (true);


--
-- Name: customers Enable read access for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users" ON public.customers FOR SELECT TO authenticated USING (true);


--
-- Name: scan_logs Enable update access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update access for all users" ON public.scan_logs FOR UPDATE USING (true);


--
-- Name: settings Everyone can view settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can view settings" ON public.settings FOR SELECT USING (true);


--
-- Name: order_status_history Only admins can insert order history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can insert order history" ON public.order_status_history FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: ecom_orders Only service role can update payment fields; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only service role can update payment fields" ON public.ecom_orders FOR UPDATE TO service_role USING (true) WITH CHECK (true);


--
-- Name: announcements Public can view active announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT TO anon USING ((is_active = true));


--
-- Name: warehouse_addresses Public can view active warehouse addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active warehouse addresses" ON public.warehouse_addresses FOR SELECT TO authenticated USING (true);


--
-- Name: settings Public read access to settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read access to settings" ON public.settings FOR SELECT TO authenticated, anon USING (true);


--
-- Name: ecom_orders Public read for payment verification; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read for payment verification" ON public.ecom_orders FOR SELECT TO authenticated, anon USING ((payment_reference IS NOT NULL));


--
-- Name: notification_log Service role can insert notification logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can insert notification logs" ON public.notification_log FOR INSERT WITH CHECK (true);


--
-- Name: payment_reconciliation_logs Service role can insert reconciliation logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can insert reconciliation logs" ON public.payment_reconciliation_logs FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: admin_settings Service role can manage admin settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can manage admin settings" ON public.admin_settings USING (true) WITH CHECK (true);


--
-- Name: telegram_verification_tokens Service role can manage tokens; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can manage tokens" ON public.telegram_verification_tokens USING (true) WITH CHECK (true);


--
-- Name: ecom_orders Service role can update orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can update orders" ON public.ecom_orders FOR UPDATE TO service_role USING (true);


--
-- Name: payment_reconciliation_logs Service role can view reconciliation logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can view reconciliation logs" ON public.payment_reconciliation_logs FOR SELECT TO service_role USING (true);


--
-- Name: telegram_messages Service role full access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role full access" ON public.telegram_messages USING ((auth.role() = 'service_role'::text));


--
-- Name: support_escalations Support and Admin insert escalations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support and Admin insert escalations" ON public.support_escalations FOR INSERT WITH CHECK (((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))));


--
-- Name: customer_notes Support and Admin insert notes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support and Admin insert notes" ON public.customer_notes FOR INSERT WITH CHECK (((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))));


--
-- Name: support_escalations Support and Admin view escalations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support and Admin view escalations" ON public.support_escalations FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))));


--
-- Name: customer_notes Support and Admin view notes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support and Admin view notes" ON public.customer_notes FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text))))));


--
-- Name: customers Support views customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support views customers" ON public.customers FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))));


--
-- Name: orders Support views orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support views orders" ON public.orders FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))));


--
-- Name: shipments Support views shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support views shipments" ON public.shipments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))));


--
-- Name: telegram_messages Support views telegram messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Support views telegram messages" ON public.telegram_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'support'::text)))));


--
-- Name: user_addresses Users and admins can update addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users and admins can update addresses" ON public.user_addresses FOR UPDATE USING (((auth.uid() = customer_id) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE ((admins.user_id = auth.uid()) AND ((admins.status)::text = 'active'::text))))));


--
-- Name: user_addresses Users and admins can view addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users and admins can view addresses" ON public.user_addresses FOR SELECT USING (((auth.uid() = customer_id) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE ((admins.user_id = auth.uid()) AND ((admins.status)::text = 'active'::text))))));


--
-- Name: admins Users can check own admin status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can check own admin status" ON public.admins FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: affiliate_profiles Users can create own affiliate application; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own affiliate application" ON public.affiliate_profiles FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_addresses Users can delete own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own addresses" ON public.user_addresses FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: notification_log Users can delete own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own notifications" ON public.notification_log FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: customer_addresses Users can delete their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own addresses" ON public.customer_addresses FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: user_addresses Users can delete their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own addresses" ON public.user_addresses FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: product_reviews Users can delete their own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own reviews" ON public.product_reviews FOR DELETE USING ((auth.uid() = customer_id));


--
-- Name: orders Users can delete their own unpaid link orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own unpaid link orders" ON public.orders FOR DELETE USING (((auth.uid() = customer_id) AND (payment_status = ANY (ARRAY['pending'::text, 'awaiting_payment'::text]))));


--
-- Name: ecom_orders Users can delete their own unpaid orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own unpaid orders" ON public.ecom_orders FOR DELETE USING (((auth.uid() = customer_id) AND ((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'awaiting_payment'::character varying])::text[]))));


--
-- Name: user_addresses Users can insert own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own addresses" ON public.user_addresses FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: customers Users can insert own customer record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own customer record" ON public.customers FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: customer_addresses Users can insert their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own addresses" ON public.customer_addresses FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: user_addresses Users can insert their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own addresses" ON public.user_addresses FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: ecom_orders Users can insert their own ecom orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own ecom orders" ON public.ecom_orders FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: incoming_packages Users can insert their own incoming packages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own incoming packages" ON public.incoming_packages FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: ecom_orders Users can insert their own orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own orders" ON public.ecom_orders FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: user_preferences Users can insert their own preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: product_reviews Users can insert their own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own reviews" ON public.product_reviews FOR INSERT WITH CHECK ((auth.uid() = customer_id));


--
-- Name: user_dismissed_announcements Users can manage their dismissals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their dismissals" ON public.user_dismissed_announcements TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: recently_viewed Users can manage their own recently viewed; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own recently viewed" ON public.recently_viewed USING ((auth.uid() = customer_id));


--
-- Name: wishlist Users can manage their own wishlist; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist USING ((auth.uid() = customer_id));


--
-- Name: customers Users can update own customer record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own customer record" ON public.customers FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: notification_log Users can update own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own notifications" ON public.notification_log FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: affiliate_profiles Users can update own pending application; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own pending application" ON public.affiliate_profiles FOR UPDATE USING (((user_id = auth.uid()) AND (status = 'pending'::text))) WITH CHECK ((user_id = auth.uid()));


--
-- Name: customer_addresses Users can update their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own addresses" ON public.customer_addresses FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: user_addresses Users can update their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own addresses" ON public.user_addresses FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: incoming_packages Users can update their own incoming packages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own incoming packages" ON public.incoming_packages FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: ecom_orders Users can update their own orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own orders" ON public.ecom_orders FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: user_preferences Users can update their own preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: product_reviews Users can update their own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own reviews" ON public.product_reviews FOR UPDATE USING ((auth.uid() = customer_id));


--
-- Name: announcements Users can view active announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view active announcements" ON public.announcements FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: affiliate_profiles Users can view own affiliate profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own affiliate profile" ON public.affiliate_profiles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: customers Users can view own customer record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own customer record" ON public.customers FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: notification_log Users can view own notification logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own notification logs" ON public.notification_log FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: notification_log Users can view own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own notifications" ON public.notification_log FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: telegram_verification_tokens Users can view own verification tokens; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own verification tokens" ON public.telegram_verification_tokens FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: customer_addresses Users can view their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own addresses" ON public.customer_addresses FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: user_addresses Users can view their own addresses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own addresses" ON public.user_addresses FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: ecom_orders Users can view their own ecom orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own ecom orders" ON public.ecom_orders FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: incoming_packages Users can view their own incoming packages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own incoming packages" ON public.incoming_packages FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: order_status_history Users can view their own order history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own order history" ON public.order_status_history FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.ecom_orders
  WHERE ((ecom_orders.id = order_status_history.order_id) AND (ecom_orders.customer_id = auth.uid())))));


--
-- Name: ecom_orders Users can view their own orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own orders" ON public.ecom_orders FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: user_preferences Users can view their own preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: wishlist Users can view their own wishlist; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: user_dismissed_announcements Users: Can create their own dismissals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users: Can create their own dismissals" ON public.user_dismissed_announcements FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: announcements Users: Can read active announcements; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users: Can read active announcements" ON public.announcements FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: settings Users: Can read settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users: Can read settings" ON public.settings FOR SELECT TO authenticated USING (true);


--
-- Name: user_dismissed_announcements Users: Can read their own dismissals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users: Can read their own dismissals" ON public.user_dismissed_announcements FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: shipments Warehouse updates shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Warehouse updates shipments" ON public.shipments FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text)))));


--
-- Name: customers Warehouse views customers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Warehouse views customers" ON public.customers FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text)))));


--
-- Name: orders Warehouse views orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Warehouse views orders" ON public.orders FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text)))));


--
-- Name: shipments Warehouse views shipments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Warehouse views shipments" ON public.shipments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.employees
  WHERE ((employees.user_id = auth.uid()) AND (employees.status = 'approved'::text) AND (employees.staff_role = 'warehouse'::text)))));


--
-- Name: admin_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: admins; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

--
-- Name: orders admins_delete_all_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY admins_delete_all_orders ON public.orders FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: orders admins_select_all_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY admins_select_all_orders ON public.orders FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: orders admins_update_all_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY admins_update_all_orders ON public.orders FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))));


--
-- Name: affiliate_earnings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;

--
-- Name: affiliate_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: announcements; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_inquiries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: customer_addresses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

--
-- Name: customer_notes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: customers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

--
-- Name: ecom_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ecom_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery_submissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.gallery_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: incoming_packages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.incoming_packages ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

--
-- Name: order_status_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: payment_reconciliation_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_reconciliation_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: payout_requests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: product_images; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

--
-- Name: product_reviews; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: product_variants; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: promotions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

--
-- Name: recently_viewed; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

--
-- Name: scan_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

--
-- Name: shared_carts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.shared_carts ENABLE ROW LEVEL SECURITY;

--
-- Name: shipments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

--
-- Name: shipments shipments_admin_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY shipments_admin_all_policy ON public.shipments TO authenticated USING (public.check_admin_safe()) WITH CHECK (public.check_admin_safe());


--
-- Name: shipments shipments_select_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY shipments_select_policy ON public.shipments FOR SELECT TO authenticated USING ((customer_id = auth.uid()));


--
-- Name: shop_ads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.shop_ads ENABLE ROW LEVEL SECURITY;

--
-- Name: support_escalations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.support_escalations ENABLE ROW LEVEL SECURITY;

--
-- Name: system_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: telegram_broadcasts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.telegram_broadcasts ENABLE ROW LEVEL SECURITY;

--
-- Name: telegram_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: telegram_verification_tokens; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.telegram_verification_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: products update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY update ON public.products FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);


--
-- Name: user_addresses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

--
-- Name: user_dismissed_announcements; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_dismissed_announcements ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_searches; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

--
-- Name: orders users_delete_pending_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY users_delete_pending_orders ON public.orders FOR DELETE TO authenticated USING (((customer_id = auth.uid()) AND (order_status = ANY (ARRAY['new'::text, 'awaiting_payment'::text, 'cancelled'::text]))));


--
-- Name: orders users_insert_own_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY users_insert_own_orders ON public.orders FOR INSERT TO authenticated WITH CHECK ((customer_id = auth.uid()));


--
-- Name: orders users_select_own_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY users_select_own_orders ON public.orders FOR SELECT TO authenticated USING ((customer_id = auth.uid()));


--
-- Name: orders users_update_own_orders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY users_update_own_orders ON public.orders FOR UPDATE TO authenticated USING ((customer_id = auth.uid())) WITH CHECK ((customer_id = auth.uid()));


--
-- Name: warehouse_addresses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.warehouse_addresses ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Admin Write Access for Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Admin Write Access for Products" ON storage.objects TO authenticated USING (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid()))))) WITH CHECK (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))));


--
-- Name: objects Admins can view all order screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Admins can view all order screenshots" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE ((admins.id)::text = (auth.uid())::text)))));


--
-- Name: objects Admins upload telegram media; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Admins upload telegram media" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'telegram-media'::text) AND (auth.uid() IN ( SELECT admins.user_id
   FROM public.admins))));


--
-- Name: objects Allow admin delete; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow admin delete" ON storage.objects FOR DELETE USING (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))));


--
-- Name: objects Allow admin insert; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow admin insert" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))));


--
-- Name: objects Allow admin update; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow admin update" ON storage.objects FOR UPDATE USING (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.user_id = auth.uid())))));


--
-- Name: objects Allow public read access; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING ((bucket_id = 'product-images'::text));


--
-- Name: objects Allow user to view own folder; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow user to view own folder" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Allow user to view own folder duibbi_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow user to view own folder duibbi_0" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Allow user uploads to own folder; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow user uploads to own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Allow user uploads to own folder duibbi_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow user uploads to own folder duibbi_0" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Customer Upload Access for Screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Customer Upload Access for Screenshots" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'order-screenshots'::text) AND (auth.uid() = ((storage.foldername(name))[1])::uuid)));


--
-- Name: objects Public Read Access for Products; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Read Access for Products" ON storage.objects FOR SELECT USING ((bucket_id = 'product-images'::text));


--
-- Name: objects Public Read Access for Screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Read Access for Screenshots" ON storage.objects FOR SELECT USING ((bucket_id = 'order-screenshots'::text));


--
-- Name: objects Public read telegram media; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read telegram media" ON storage.objects FOR SELECT USING ((bucket_id = 'telegram-media'::text));


--
-- Name: objects Service role uploads telegram media; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Service role uploads telegram media" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'telegram-media'::text) AND (auth.role() = 'service_role'::text)));


--
-- Name: objects Users can delete their own order screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can delete their own order screenshots" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Users can upload their own order screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload their own order screenshots" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Users can view their own order screenshots; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can view their own order screenshots" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: objects screenshots duibbi_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "screenshots duibbi_0" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'order-screenshots'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)));


--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: objects view duibbi_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "view duibbi_0" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'order-screenshots'::text) AND (split_part(name, '/'::text, 1) = (auth.uid())::text)));


--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA cron TO postgres;
RESET SESSION AUTHORIZATION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION gtrgm_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO service_role;


--
-- Name: FUNCTION gtrgm_out(public.gtrgm); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO service_role;


--
-- Name: FUNCTION halfvec_in(cstring, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_in(cstring, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_in(cstring, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.halfvec_in(cstring, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_in(cstring, oid, integer) TO service_role;


--
-- Name: FUNCTION halfvec_out(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_out(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_out(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_out(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_out(public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_recv(internal, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_recv(internal, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_recv(internal, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.halfvec_recv(internal, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_recv(internal, oid, integer) TO service_role;


--
-- Name: FUNCTION halfvec_send(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_send(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_send(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_send(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_send(public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_typmod_in(cstring[]) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_typmod_in(cstring[]) TO anon;
GRANT ALL ON FUNCTION public.halfvec_typmod_in(cstring[]) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_typmod_in(cstring[]) TO service_role;


--
-- Name: FUNCTION sparsevec_in(cstring, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_in(cstring, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_in(cstring, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_in(cstring, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_in(cstring, oid, integer) TO service_role;


--
-- Name: FUNCTION sparsevec_out(public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_out(public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_out(public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_out(public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_out(public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_recv(internal, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_recv(internal, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_recv(internal, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_recv(internal, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_recv(internal, oid, integer) TO service_role;


--
-- Name: FUNCTION sparsevec_send(public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_send(public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_send(public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_send(public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_send(public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_typmod_in(cstring[]) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_typmod_in(cstring[]) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_typmod_in(cstring[]) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_typmod_in(cstring[]) TO service_role;


--
-- Name: FUNCTION vector_in(cstring, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_in(cstring, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.vector_in(cstring, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.vector_in(cstring, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.vector_in(cstring, oid, integer) TO service_role;


--
-- Name: FUNCTION vector_out(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_out(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_out(public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_out(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_out(public.vector) TO service_role;


--
-- Name: FUNCTION vector_recv(internal, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_recv(internal, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.vector_recv(internal, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.vector_recv(internal, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.vector_recv(internal, oid, integer) TO service_role;


--
-- Name: FUNCTION vector_send(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_send(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_send(public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_send(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_send(public.vector) TO service_role;


--
-- Name: FUNCTION vector_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_typmod_in(cstring[]) TO postgres;
GRANT ALL ON FUNCTION public.vector_typmod_in(cstring[]) TO anon;
GRANT ALL ON FUNCTION public.vector_typmod_in(cstring[]) TO authenticated;
GRANT ALL ON FUNCTION public.vector_typmod_in(cstring[]) TO service_role;


--
-- Name: FUNCTION array_to_halfvec(real[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_halfvec(real[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_halfvec(real[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_halfvec(real[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_halfvec(real[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_sparsevec(real[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_sparsevec(real[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_sparsevec(real[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_sparsevec(real[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_sparsevec(real[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_vector(real[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_vector(real[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_vector(real[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_vector(real[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_vector(real[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_halfvec(double precision[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_halfvec(double precision[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_halfvec(double precision[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_halfvec(double precision[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_halfvec(double precision[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_sparsevec(double precision[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_sparsevec(double precision[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_sparsevec(double precision[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_sparsevec(double precision[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_sparsevec(double precision[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_vector(double precision[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_vector(double precision[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_vector(double precision[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_vector(double precision[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_vector(double precision[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_halfvec(integer[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_halfvec(integer[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_halfvec(integer[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_halfvec(integer[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_halfvec(integer[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_sparsevec(integer[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_sparsevec(integer[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_sparsevec(integer[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_sparsevec(integer[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_sparsevec(integer[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_vector(integer[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_vector(integer[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_vector(integer[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_vector(integer[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_vector(integer[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_halfvec(numeric[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_halfvec(numeric[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_halfvec(numeric[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_halfvec(numeric[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_halfvec(numeric[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_sparsevec(numeric[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_sparsevec(numeric[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_sparsevec(numeric[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_sparsevec(numeric[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_sparsevec(numeric[], integer, boolean) TO service_role;


--
-- Name: FUNCTION array_to_vector(numeric[], integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.array_to_vector(numeric[], integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.array_to_vector(numeric[], integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.array_to_vector(numeric[], integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.array_to_vector(numeric[], integer, boolean) TO service_role;


--
-- Name: FUNCTION halfvec_to_float4(public.halfvec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_to_float4(public.halfvec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_to_float4(public.halfvec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.halfvec_to_float4(public.halfvec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_to_float4(public.halfvec, integer, boolean) TO service_role;


--
-- Name: FUNCTION halfvec(public.halfvec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec(public.halfvec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.halfvec(public.halfvec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.halfvec(public.halfvec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec(public.halfvec, integer, boolean) TO service_role;


--
-- Name: FUNCTION halfvec_to_sparsevec(public.halfvec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_to_sparsevec(public.halfvec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_to_sparsevec(public.halfvec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.halfvec_to_sparsevec(public.halfvec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_to_sparsevec(public.halfvec, integer, boolean) TO service_role;


--
-- Name: FUNCTION halfvec_to_vector(public.halfvec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_to_vector(public.halfvec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_to_vector(public.halfvec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.halfvec_to_vector(public.halfvec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_to_vector(public.halfvec, integer, boolean) TO service_role;


--
-- Name: FUNCTION sparsevec_to_halfvec(public.sparsevec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_to_halfvec(public.sparsevec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_to_halfvec(public.sparsevec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_to_halfvec(public.sparsevec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_to_halfvec(public.sparsevec, integer, boolean) TO service_role;


--
-- Name: FUNCTION sparsevec(public.sparsevec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec(public.sparsevec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec(public.sparsevec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.sparsevec(public.sparsevec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec(public.sparsevec, integer, boolean) TO service_role;


--
-- Name: FUNCTION sparsevec_to_vector(public.sparsevec, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_to_vector(public.sparsevec, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_to_vector(public.sparsevec, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_to_vector(public.sparsevec, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_to_vector(public.sparsevec, integer, boolean) TO service_role;


--
-- Name: FUNCTION vector_to_float4(public.vector, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_to_float4(public.vector, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.vector_to_float4(public.vector, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.vector_to_float4(public.vector, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.vector_to_float4(public.vector, integer, boolean) TO service_role;


--
-- Name: FUNCTION vector_to_halfvec(public.vector, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_to_halfvec(public.vector, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.vector_to_halfvec(public.vector, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.vector_to_halfvec(public.vector, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.vector_to_halfvec(public.vector, integer, boolean) TO service_role;


--
-- Name: FUNCTION vector_to_sparsevec(public.vector, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_to_sparsevec(public.vector, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.vector_to_sparsevec(public.vector, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.vector_to_sparsevec(public.vector, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.vector_to_sparsevec(public.vector, integer, boolean) TO service_role;


--
-- Name: FUNCTION vector(public.vector, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector(public.vector, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.vector(public.vector, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.vector(public.vector, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.vector(public.vector, integer, boolean) TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text) TO anon;
GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text) TO authenticated;
GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text) TO service_role;


--
-- Name: FUNCTION admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text, p_staff_role text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text, p_staff_role text) TO anon;
GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text, p_staff_role text) TO authenticated;
GRANT ALL ON FUNCTION public.admin_set_employee_status(p_employee_id uuid, p_status text, p_notes text, p_staff_role text) TO service_role;


--
-- Name: FUNCTION auto_link_customer_to_affiliate(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_link_customer_to_affiliate() TO anon;
GRANT ALL ON FUNCTION public.auto_link_customer_to_affiliate() TO authenticated;
GRANT ALL ON FUNCTION public.auto_link_customer_to_affiliate() TO service_role;


--
-- Name: FUNCTION binary_quantize(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.binary_quantize(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.binary_quantize(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.binary_quantize(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.binary_quantize(public.halfvec) TO service_role;


--
-- Name: FUNCTION binary_quantize(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.binary_quantize(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.binary_quantize(public.vector) TO anon;
GRANT ALL ON FUNCTION public.binary_quantize(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.binary_quantize(public.vector) TO service_role;


--
-- Name: FUNCTION check_account_exists(p_email text, p_phone text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_account_exists(p_email text, p_phone text) TO anon;
GRANT ALL ON FUNCTION public.check_account_exists(p_email text, p_phone text) TO authenticated;
GRANT ALL ON FUNCTION public.check_account_exists(p_email text, p_phone text) TO service_role;


--
-- Name: FUNCTION check_admin_safe(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_admin_safe() TO anon;
GRANT ALL ON FUNCTION public.check_admin_safe() TO authenticated;
GRANT ALL ON FUNCTION public.check_admin_safe() TO service_role;


--
-- Name: FUNCTION cleanup_expired_shared_carts(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_expired_shared_carts() TO anon;
GRANT ALL ON FUNCTION public.cleanup_expired_shared_carts() TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_expired_shared_carts() TO service_role;


--
-- Name: FUNCTION cleanup_expired_telegram_tokens(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_expired_telegram_tokens() TO anon;
GRANT ALL ON FUNCTION public.cleanup_expired_telegram_tokens() TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_expired_telegram_tokens() TO service_role;


--
-- Name: FUNCTION confirm_payment_client_side(p_order_id bigint, p_reference text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.confirm_payment_client_side(p_order_id bigint, p_reference text) TO anon;
GRANT ALL ON FUNCTION public.confirm_payment_client_side(p_order_id bigint, p_reference text) TO authenticated;
GRANT ALL ON FUNCTION public.confirm_payment_client_side(p_order_id bigint, p_reference text) TO service_role;


--
-- Name: FUNCTION cosine_distance(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.cosine_distance(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.cosine_distance(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.cosine_distance(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.cosine_distance(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION cosine_distance(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.cosine_distance(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.cosine_distance(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.cosine_distance(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.cosine_distance(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION cosine_distance(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.cosine_distance(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.cosine_distance(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.cosine_distance(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.cosine_distance(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION create_affiliate_earning_for_ecom_order(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_affiliate_earning_for_ecom_order() TO anon;
GRANT ALL ON FUNCTION public.create_affiliate_earning_for_ecom_order() TO authenticated;
GRANT ALL ON FUNCTION public.create_affiliate_earning_for_ecom_order() TO service_role;


--
-- Name: FUNCTION create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text) TO anon;
GRANT ALL ON FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text) TO authenticated;
GRANT ALL ON FUNCTION public.create_customer_profile(p_user_id uuid, p_name text, p_email text, p_phone text, p_customer_unique_id text, p_status text, p_referral_code_used text) TO service_role;


--
-- Name: FUNCTION create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text) TO anon;
GRANT ALL ON FUNCTION public.create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text) TO authenticated;
GRANT ALL ON FUNCTION public.create_employee_profile(p_user_id uuid, p_full_name text, p_email text, p_phone text) TO service_role;


--
-- Name: FUNCTION decrement_product_stock(product_id_to_update integer, decrement_qty integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update integer, decrement_qty integer) TO anon;
GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update integer, decrement_qty integer) TO authenticated;
GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update integer, decrement_qty integer) TO service_role;


--
-- Name: FUNCTION decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer) TO anon;
GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer) TO authenticated;
GRANT ALL ON FUNCTION public.decrement_product_stock(product_id_to_update uuid, quantity_to_decrement integer) TO service_role;


--
-- Name: FUNCTION decrement_variant_stock(variant_id_to_update integer, decrement_qty integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update integer, decrement_qty integer) TO anon;
GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update integer, decrement_qty integer) TO authenticated;
GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update integer, decrement_qty integer) TO service_role;


--
-- Name: FUNCTION decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer) TO anon;
GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer) TO authenticated;
GRANT ALL ON FUNCTION public.decrement_variant_stock(variant_id_to_update bigint, decrement_qty integer) TO service_role;


--
-- Name: FUNCTION delete_own_order(p_order_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_own_order(p_order_id uuid) TO anon;
GRANT ALL ON FUNCTION public.delete_own_order(p_order_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.delete_own_order(p_order_id uuid) TO service_role;


--
-- Name: FUNCTION delete_unpaid_orders_after_24hours(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_24hours() TO anon;
GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_24hours() TO authenticated;
GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_24hours() TO service_role;


--
-- Name: FUNCTION delete_unpaid_orders_after_30min(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_30min() TO anon;
GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_30min() TO authenticated;
GRANT ALL ON FUNCTION public.delete_unpaid_orders_after_30min() TO service_role;


--
-- Name: FUNCTION ensure_single_default_warehouse_address(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.ensure_single_default_warehouse_address() TO anon;
GRANT ALL ON FUNCTION public.ensure_single_default_warehouse_address() TO authenticated;
GRANT ALL ON FUNCTION public.ensure_single_default_warehouse_address() TO service_role;


--
-- Name: FUNCTION fn_fulfill_ecom_order(order_id_to_fulfill bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_fulfill_ecom_order(order_id_to_fulfill bigint) TO anon;
GRANT ALL ON FUNCTION public.fn_fulfill_ecom_order(order_id_to_fulfill bigint) TO authenticated;
GRANT ALL ON FUNCTION public.fn_fulfill_ecom_order(order_id_to_fulfill bigint) TO service_role;


--
-- Name: FUNCTION generate_customer_unique_id(full_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_customer_unique_id(full_name text) TO anon;
GRANT ALL ON FUNCTION public.generate_customer_unique_id(full_name text) TO authenticated;
GRANT ALL ON FUNCTION public.generate_customer_unique_id(full_name text) TO service_role;


--
-- Name: FUNCTION generate_share_code(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_share_code() TO anon;
GRANT ALL ON FUNCTION public.generate_share_code() TO authenticated;
GRANT ALL ON FUNCTION public.generate_share_code() TO service_role;


--
-- Name: FUNCTION get_employee_status(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_employee_status() TO anon;
GRANT ALL ON FUNCTION public.get_employee_status() TO authenticated;
GRANT ALL ON FUNCTION public.get_employee_status() TO service_role;


--
-- Name: FUNCTION get_product_rating(product_id_param bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_product_rating(product_id_param bigint) TO anon;
GRANT ALL ON FUNCTION public.get_product_rating(product_id_param bigint) TO authenticated;
GRANT ALL ON FUNCTION public.get_product_rating(product_id_param bigint) TO service_role;


--
-- Name: FUNCTION get_promotion_products(limit_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_promotion_products(limit_count integer) TO anon;
GRANT ALL ON FUNCTION public.get_promotion_products(limit_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_promotion_products(limit_count integer) TO service_role;


--
-- Name: FUNCTION get_related_products(product_id_param bigint, category_param text, limit_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_related_products(product_id_param bigint, category_param text, limit_count integer) TO anon;
GRANT ALL ON FUNCTION public.get_related_products(product_id_param bigint, category_param text, limit_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_related_products(product_id_param bigint, category_param text, limit_count integer) TO service_role;


--
-- Name: FUNCTION get_top_selling_products(from_date timestamp with time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_top_selling_products(from_date timestamp with time zone) TO anon;
GRANT ALL ON FUNCTION public.get_top_selling_products(from_date timestamp with time zone) TO authenticated;
GRANT ALL ON FUNCTION public.get_top_selling_products(from_date timestamp with time zone) TO service_role;


--
-- Name: FUNCTION get_trending_products(limit_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_trending_products(limit_count integer) TO anon;
GRANT ALL ON FUNCTION public.get_trending_products(limit_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_trending_products(limit_count integer) TO service_role;


--
-- Name: FUNCTION gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_extract_value_trgm(text, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_compress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_consistent(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_decompress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_distance(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_options(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_penalty(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_picksplit(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_same(public.gtrgm, public.gtrgm, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_union(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO service_role;


--
-- Name: FUNCTION halfvec_accum(double precision[], public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_accum(double precision[], public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_accum(double precision[], public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_accum(double precision[], public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_accum(double precision[], public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_add(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_add(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_add(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_add(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_add(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_avg(double precision[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_avg(double precision[]) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_avg(double precision[]) TO anon;
GRANT ALL ON FUNCTION public.halfvec_avg(double precision[]) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_avg(double precision[]) TO service_role;


--
-- Name: FUNCTION halfvec_cmp(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_cmp(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_cmp(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_cmp(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_cmp(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_combine(double precision[], double precision[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_combine(double precision[], double precision[]) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_combine(double precision[], double precision[]) TO anon;
GRANT ALL ON FUNCTION public.halfvec_combine(double precision[], double precision[]) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_combine(double precision[], double precision[]) TO service_role;


--
-- Name: FUNCTION halfvec_concat(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_concat(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_concat(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_concat(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_concat(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_eq(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_eq(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_eq(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_eq(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_eq(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_ge(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_ge(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_ge(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_ge(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_ge(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_gt(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_gt(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_gt(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_gt(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_gt(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_l2_squared_distance(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_l2_squared_distance(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_l2_squared_distance(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_l2_squared_distance(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_l2_squared_distance(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_le(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_le(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_le(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_le(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_le(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_lt(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_lt(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_lt(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_lt(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_lt(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_mul(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_mul(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_mul(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_mul(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_mul(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_ne(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_ne(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_ne(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_ne(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_ne(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_negative_inner_product(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_negative_inner_product(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_negative_inner_product(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_negative_inner_product(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_negative_inner_product(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_spherical_distance(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_spherical_distance(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_spherical_distance(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_spherical_distance(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_spherical_distance(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION halfvec_sub(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.halfvec_sub(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.halfvec_sub(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.halfvec_sub(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.halfvec_sub(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION hamming_distance(bit, bit); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.hamming_distance(bit, bit) TO postgres;
GRANT ALL ON FUNCTION public.hamming_distance(bit, bit) TO anon;
GRANT ALL ON FUNCTION public.hamming_distance(bit, bit) TO authenticated;
GRANT ALL ON FUNCTION public.hamming_distance(bit, bit) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION hnsw_bit_support(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.hnsw_bit_support(internal) TO postgres;
GRANT ALL ON FUNCTION public.hnsw_bit_support(internal) TO anon;
GRANT ALL ON FUNCTION public.hnsw_bit_support(internal) TO authenticated;
GRANT ALL ON FUNCTION public.hnsw_bit_support(internal) TO service_role;


--
-- Name: FUNCTION hnsw_halfvec_support(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.hnsw_halfvec_support(internal) TO postgres;
GRANT ALL ON FUNCTION public.hnsw_halfvec_support(internal) TO anon;
GRANT ALL ON FUNCTION public.hnsw_halfvec_support(internal) TO authenticated;
GRANT ALL ON FUNCTION public.hnsw_halfvec_support(internal) TO service_role;


--
-- Name: FUNCTION hnsw_sparsevec_support(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.hnsw_sparsevec_support(internal) TO postgres;
GRANT ALL ON FUNCTION public.hnsw_sparsevec_support(internal) TO anon;
GRANT ALL ON FUNCTION public.hnsw_sparsevec_support(internal) TO authenticated;
GRANT ALL ON FUNCTION public.hnsw_sparsevec_support(internal) TO service_role;


--
-- Name: FUNCTION hnswhandler(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.hnswhandler(internal) TO postgres;
GRANT ALL ON FUNCTION public.hnswhandler(internal) TO anon;
GRANT ALL ON FUNCTION public.hnswhandler(internal) TO authenticated;
GRANT ALL ON FUNCTION public.hnswhandler(internal) TO service_role;


--
-- Name: FUNCTION increment_product_view_count(product_id_param bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.increment_product_view_count(product_id_param bigint) TO anon;
GRANT ALL ON FUNCTION public.increment_product_view_count(product_id_param bigint) TO authenticated;
GRANT ALL ON FUNCTION public.increment_product_view_count(product_id_param bigint) TO service_role;


--
-- Name: FUNCTION increment_shared_cart_access(cart_share_code character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.increment_shared_cart_access(cart_share_code character varying) TO anon;
GRANT ALL ON FUNCTION public.increment_shared_cart_access(cart_share_code character varying) TO authenticated;
GRANT ALL ON FUNCTION public.increment_shared_cart_access(cart_share_code character varying) TO service_role;


--
-- Name: FUNCTION inner_product(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.inner_product(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.inner_product(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.inner_product(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.inner_product(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION inner_product(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.inner_product(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.inner_product(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.inner_product(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.inner_product(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION inner_product(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.inner_product(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.inner_product(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.inner_product(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.inner_product(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION is_admin(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_admin(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_admin(user_id uuid) TO service_role;


--
-- Name: FUNCTION is_user_admin(check_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_user_admin(check_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_user_admin(check_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_user_admin(check_user_id uuid) TO service_role;


--
-- Name: FUNCTION ivfflat_bit_support(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.ivfflat_bit_support(internal) TO postgres;
GRANT ALL ON FUNCTION public.ivfflat_bit_support(internal) TO anon;
GRANT ALL ON FUNCTION public.ivfflat_bit_support(internal) TO authenticated;
GRANT ALL ON FUNCTION public.ivfflat_bit_support(internal) TO service_role;


--
-- Name: FUNCTION ivfflat_halfvec_support(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.ivfflat_halfvec_support(internal) TO postgres;
GRANT ALL ON FUNCTION public.ivfflat_halfvec_support(internal) TO anon;
GRANT ALL ON FUNCTION public.ivfflat_halfvec_support(internal) TO authenticated;
GRANT ALL ON FUNCTION public.ivfflat_halfvec_support(internal) TO service_role;


--
-- Name: FUNCTION ivfflathandler(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.ivfflathandler(internal) TO postgres;
GRANT ALL ON FUNCTION public.ivfflathandler(internal) TO anon;
GRANT ALL ON FUNCTION public.ivfflathandler(internal) TO authenticated;
GRANT ALL ON FUNCTION public.ivfflathandler(internal) TO service_role;


--
-- Name: FUNCTION jaccard_distance(bit, bit); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.jaccard_distance(bit, bit) TO postgres;
GRANT ALL ON FUNCTION public.jaccard_distance(bit, bit) TO anon;
GRANT ALL ON FUNCTION public.jaccard_distance(bit, bit) TO authenticated;
GRANT ALL ON FUNCTION public.jaccard_distance(bit, bit) TO service_role;


--
-- Name: FUNCTION l1_distance(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l1_distance(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.l1_distance(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.l1_distance(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.l1_distance(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION l1_distance(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l1_distance(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.l1_distance(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.l1_distance(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.l1_distance(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION l1_distance(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l1_distance(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.l1_distance(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.l1_distance(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.l1_distance(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION l2_distance(public.halfvec, public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_distance(public.halfvec, public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.l2_distance(public.halfvec, public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.l2_distance(public.halfvec, public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_distance(public.halfvec, public.halfvec) TO service_role;


--
-- Name: FUNCTION l2_distance(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_distance(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.l2_distance(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.l2_distance(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_distance(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION l2_distance(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_distance(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.l2_distance(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.l2_distance(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.l2_distance(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION l2_norm(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_norm(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.l2_norm(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.l2_norm(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_norm(public.halfvec) TO service_role;


--
-- Name: FUNCTION l2_norm(public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_norm(public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.l2_norm(public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.l2_norm(public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_norm(public.sparsevec) TO service_role;


--
-- Name: FUNCTION l2_normalize(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_normalize(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.l2_normalize(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.l2_normalize(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_normalize(public.halfvec) TO service_role;


--
-- Name: FUNCTION l2_normalize(public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_normalize(public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.l2_normalize(public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.l2_normalize(public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.l2_normalize(public.sparsevec) TO service_role;


--
-- Name: FUNCTION l2_normalize(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.l2_normalize(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.l2_normalize(public.vector) TO anon;
GRANT ALL ON FUNCTION public.l2_normalize(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.l2_normalize(public.vector) TO service_role;


--
-- Name: FUNCTION log_order_status_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_order_status_change() TO anon;
GRANT ALL ON FUNCTION public.log_order_status_change() TO authenticated;
GRANT ALL ON FUNCTION public.log_order_status_change() TO service_role;


--
-- Name: FUNCTION log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.log_user_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO service_role;


--
-- Name: FUNCTION match_products(query_embedding public.vector, match_threshold double precision, match_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.match_products(query_embedding public.vector, match_threshold double precision, match_count integer) TO anon;
GRANT ALL ON FUNCTION public.match_products(query_embedding public.vector, match_threshold double precision, match_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.match_products(query_embedding public.vector, match_threshold double precision, match_count integer) TO service_role;


--
-- Name: TABLE shipments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shipments TO anon;
GRANT ALL ON TABLE public.shipments TO authenticated;
GRANT ALL ON TABLE public.shipments TO service_role;


--
-- Name: FUNCTION match_shipment_by_id_prefix(p_prefix text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.match_shipment_by_id_prefix(p_prefix text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.match_shipment_by_id_prefix(p_prefix text) TO anon;
GRANT ALL ON FUNCTION public.match_shipment_by_id_prefix(p_prefix text) TO authenticated;
GRANT ALL ON FUNCTION public.match_shipment_by_id_prefix(p_prefix text) TO service_role;


--
-- Name: FUNCTION notify_on_address_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.notify_on_address_change() TO anon;
GRANT ALL ON FUNCTION public.notify_on_address_change() TO authenticated;
GRANT ALL ON FUNCTION public.notify_on_address_change() TO service_role;


--
-- Name: FUNCTION notify_on_profile_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.notify_on_profile_change() TO anon;
GRANT ALL ON FUNCTION public.notify_on_profile_change() TO authenticated;
GRANT ALL ON FUNCTION public.notify_on_profile_change() TO service_role;


--
-- Name: FUNCTION notify_on_shipment_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.notify_on_shipment_change() TO anon;
GRANT ALL ON FUNCTION public.notify_on_shipment_change() TO authenticated;
GRANT ALL ON FUNCTION public.notify_on_shipment_change() TO service_role;


--
-- Name: FUNCTION prevent_balance_manipulation(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.prevent_balance_manipulation() TO anon;
GRANT ALL ON FUNCTION public.prevent_balance_manipulation() TO authenticated;
GRANT ALL ON FUNCTION public.prevent_balance_manipulation() TO service_role;


--
-- Name: FUNCTION prevent_payment_manipulation(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.prevent_payment_manipulation() TO anon;
GRANT ALL ON FUNCTION public.prevent_payment_manipulation() TO authenticated;
GRANT ALL ON FUNCTION public.prevent_payment_manipulation() TO service_role;


--
-- Name: FUNCTION process_payout_balance(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.process_payout_balance() TO anon;
GRANT ALL ON FUNCTION public.process_payout_balance() TO authenticated;
GRANT ALL ON FUNCTION public.process_payout_balance() TO service_role;


--
-- Name: FUNCTION process_scanned_package(scanned_tracking text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.process_scanned_package(scanned_tracking text) TO anon;
GRANT ALL ON FUNCTION public.process_scanned_package(scanned_tracking text) TO authenticated;
GRANT ALL ON FUNCTION public.process_scanned_package(scanned_tracking text) TO service_role;


--
-- Name: FUNCTION refresh_cached_ghs_prices(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.refresh_cached_ghs_prices() TO anon;
GRANT ALL ON FUNCTION public.refresh_cached_ghs_prices() TO authenticated;
GRANT ALL ON FUNCTION public.refresh_cached_ghs_prices() TO service_role;


--
-- Name: FUNCTION search_products(search_query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_products(search_query text) TO anon;
GRANT ALL ON FUNCTION public.search_products(search_query text) TO authenticated;
GRANT ALL ON FUNCTION public.search_products(search_query text) TO service_role;


--
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customers TO anon;
GRANT ALL ON TABLE public.customers TO authenticated;
GRANT ALL ON TABLE public.customers TO service_role;


--
-- Name: FUNCTION search_users_for_admin(search_term text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_users_for_admin(search_term text) TO anon;
GRANT ALL ON FUNCTION public.search_users_for_admin(search_term text) TO authenticated;
GRANT ALL ON FUNCTION public.search_users_for_admin(search_term text) TO service_role;


--
-- Name: FUNCTION secure_ecom_order_totals(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.secure_ecom_order_totals() TO anon;
GRANT ALL ON FUNCTION public.secure_ecom_order_totals() TO authenticated;
GRANT ALL ON FUNCTION public.secure_ecom_order_totals() TO service_role;


--
-- Name: FUNCTION send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.send_telegram_notification(p_customer_id uuid, p_type character varying, p_title character varying, p_message text, p_data jsonb) TO service_role;


--
-- Name: FUNCTION set_employees_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_employees_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_employees_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_employees_updated_at() TO service_role;


--
-- Name: FUNCTION set_limit(real); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.set_limit(real) TO postgres;
GRANT ALL ON FUNCTION public.set_limit(real) TO anon;
GRANT ALL ON FUNCTION public.set_limit(real) TO authenticated;
GRANT ALL ON FUNCTION public.set_limit(real) TO service_role;


--
-- Name: FUNCTION show_limit(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_limit() TO postgres;
GRANT ALL ON FUNCTION public.show_limit() TO anon;
GRANT ALL ON FUNCTION public.show_limit() TO authenticated;
GRANT ALL ON FUNCTION public.show_limit() TO service_role;


--
-- Name: FUNCTION show_trgm(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_trgm(text) TO postgres;
GRANT ALL ON FUNCTION public.show_trgm(text) TO anon;
GRANT ALL ON FUNCTION public.show_trgm(text) TO authenticated;
GRANT ALL ON FUNCTION public.show_trgm(text) TO service_role;


--
-- Name: FUNCTION similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity(text, text) TO service_role;


--
-- Name: FUNCTION similarity_dist(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO service_role;


--
-- Name: FUNCTION similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION sparsevec_cmp(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_cmp(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_cmp(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_cmp(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_cmp(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_eq(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_eq(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_eq(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_eq(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_eq(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_ge(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_ge(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_ge(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_ge(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_ge(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_gt(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_gt(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_gt(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_gt(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_gt(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_l2_squared_distance(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_l2_squared_distance(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_l2_squared_distance(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_l2_squared_distance(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_l2_squared_distance(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_le(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_le(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_le(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_le(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_le(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_lt(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_lt(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_lt(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_lt(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_lt(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_ne(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_ne(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_ne(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_ne(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_ne(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION sparsevec_negative_inner_product(public.sparsevec, public.sparsevec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sparsevec_negative_inner_product(public.sparsevec, public.sparsevec) TO postgres;
GRANT ALL ON FUNCTION public.sparsevec_negative_inner_product(public.sparsevec, public.sparsevec) TO anon;
GRANT ALL ON FUNCTION public.sparsevec_negative_inner_product(public.sparsevec, public.sparsevec) TO authenticated;
GRANT ALL ON FUNCTION public.sparsevec_negative_inner_product(public.sparsevec, public.sparsevec) TO service_role;


--
-- Name: FUNCTION strict_word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION subvector(public.halfvec, integer, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.subvector(public.halfvec, integer, integer) TO postgres;
GRANT ALL ON FUNCTION public.subvector(public.halfvec, integer, integer) TO anon;
GRANT ALL ON FUNCTION public.subvector(public.halfvec, integer, integer) TO authenticated;
GRANT ALL ON FUNCTION public.subvector(public.halfvec, integer, integer) TO service_role;


--
-- Name: FUNCTION subvector(public.vector, integer, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.subvector(public.vector, integer, integer) TO postgres;
GRANT ALL ON FUNCTION public.subvector(public.vector, integer, integer) TO anon;
GRANT ALL ON FUNCTION public.subvector(public.vector, integer, integer) TO authenticated;
GRANT ALL ON FUNCTION public.subvector(public.vector, integer, integer) TO service_role;


--
-- Name: FUNCTION track_package(search_query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.track_package(search_query text) TO anon;
GRANT ALL ON FUNCTION public.track_package(search_query text) TO authenticated;
GRANT ALL ON FUNCTION public.track_package(search_query text) TO service_role;


--
-- Name: FUNCTION update_admin_settings_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_admin_settings_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_admin_settings_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_admin_settings_updated_at() TO service_role;


--
-- Name: FUNCTION update_affiliate_balance(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_affiliate_balance() TO anon;
GRANT ALL ON FUNCTION public.update_affiliate_balance() TO authenticated;
GRANT ALL ON FUNCTION public.update_affiliate_balance() TO service_role;


--
-- Name: FUNCTION update_affiliate_balance_on_earning(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning() TO anon;
GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning() TO authenticated;
GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning() TO service_role;


--
-- Name: FUNCTION update_affiliate_balance_on_earning_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning_change() TO anon;
GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning_change() TO authenticated;
GRANT ALL ON FUNCTION public.update_affiliate_balance_on_earning_change() TO service_role;


--
-- Name: FUNCTION update_affiliate_referral_count(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_affiliate_referral_count() TO anon;
GRANT ALL ON FUNCTION public.update_affiliate_referral_count() TO authenticated;
GRANT ALL ON FUNCTION public.update_affiliate_referral_count() TO service_role;


--
-- Name: FUNCTION update_ecom_orders_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_ecom_orders_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_ecom_orders_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_ecom_orders_updated_at() TO service_role;


--
-- Name: FUNCTION update_product_prices_by_multiplier(multiplier numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_product_prices_by_multiplier(multiplier numeric) TO anon;
GRANT ALL ON FUNCTION public.update_product_prices_by_multiplier(multiplier numeric) TO authenticated;
GRANT ALL ON FUNCTION public.update_product_prices_by_multiplier(multiplier numeric) TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION update_user_preferences_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_user_preferences_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_user_preferences_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_user_preferences_updated_at() TO service_role;


--
-- Name: FUNCTION update_warehouse_addresses_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_warehouse_addresses_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_warehouse_addresses_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_warehouse_addresses_updated_at() TO service_role;


--
-- Name: FUNCTION vector_accum(double precision[], public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_accum(double precision[], public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_accum(double precision[], public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_accum(double precision[], public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_accum(double precision[], public.vector) TO service_role;


--
-- Name: FUNCTION vector_add(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_add(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_add(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_add(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_add(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_avg(double precision[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_avg(double precision[]) TO postgres;
GRANT ALL ON FUNCTION public.vector_avg(double precision[]) TO anon;
GRANT ALL ON FUNCTION public.vector_avg(double precision[]) TO authenticated;
GRANT ALL ON FUNCTION public.vector_avg(double precision[]) TO service_role;


--
-- Name: FUNCTION vector_cmp(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_cmp(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_cmp(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_cmp(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_cmp(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_combine(double precision[], double precision[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_combine(double precision[], double precision[]) TO postgres;
GRANT ALL ON FUNCTION public.vector_combine(double precision[], double precision[]) TO anon;
GRANT ALL ON FUNCTION public.vector_combine(double precision[], double precision[]) TO authenticated;
GRANT ALL ON FUNCTION public.vector_combine(double precision[], double precision[]) TO service_role;


--
-- Name: FUNCTION vector_concat(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_concat(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_concat(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_concat(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_concat(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_dims(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_dims(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.vector_dims(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.vector_dims(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.vector_dims(public.halfvec) TO service_role;


--
-- Name: FUNCTION vector_dims(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_dims(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_dims(public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_dims(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_dims(public.vector) TO service_role;


--
-- Name: FUNCTION vector_eq(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_eq(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_eq(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_eq(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_eq(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_ge(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_ge(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_ge(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_ge(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_ge(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_gt(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_gt(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_gt(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_gt(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_gt(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_l2_squared_distance(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_l2_squared_distance(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_l2_squared_distance(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_l2_squared_distance(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_l2_squared_distance(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_le(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_le(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_le(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_le(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_le(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_lt(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_lt(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_lt(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_lt(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_lt(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_mul(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_mul(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_mul(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_mul(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_mul(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_ne(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_ne(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_ne(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_ne(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_ne(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_negative_inner_product(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_negative_inner_product(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_negative_inner_product(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_negative_inner_product(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_negative_inner_product(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_norm(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_norm(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_norm(public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_norm(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_norm(public.vector) TO service_role;


--
-- Name: FUNCTION vector_spherical_distance(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_spherical_distance(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_spherical_distance(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_spherical_distance(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_spherical_distance(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION vector_sub(public.vector, public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.vector_sub(public.vector, public.vector) TO postgres;
GRANT ALL ON FUNCTION public.vector_sub(public.vector, public.vector) TO anon;
GRANT ALL ON FUNCTION public.vector_sub(public.vector, public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.vector_sub(public.vector, public.vector) TO service_role;


--
-- Name: FUNCTION word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION avg(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.avg(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.avg(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.avg(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.avg(public.halfvec) TO service_role;


--
-- Name: FUNCTION avg(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.avg(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.avg(public.vector) TO anon;
GRANT ALL ON FUNCTION public.avg(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.avg(public.vector) TO service_role;


--
-- Name: FUNCTION sum(public.halfvec); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sum(public.halfvec) TO postgres;
GRANT ALL ON FUNCTION public.sum(public.halfvec) TO anon;
GRANT ALL ON FUNCTION public.sum(public.halfvec) TO authenticated;
GRANT ALL ON FUNCTION public.sum(public.halfvec) TO service_role;


--
-- Name: FUNCTION sum(public.vector); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.sum(public.vector) TO postgres;
GRANT ALL ON FUNCTION public.sum(public.vector) TO anon;
GRANT ALL ON FUNCTION public.sum(public.vector) TO authenticated;
GRANT ALL ON FUNCTION public.sum(public.vector) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE cron.job TO postgres;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE cron.job_run_details TO postgres;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE admin_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_settings TO anon;
GRANT ALL ON TABLE public.admin_settings TO authenticated;
GRANT ALL ON TABLE public.admin_settings TO service_role;


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admins TO anon;
GRANT ALL ON TABLE public.admins TO authenticated;
GRANT ALL ON TABLE public.admins TO service_role;


--
-- Name: SEQUENCE admins_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.admins_id_seq TO anon;
GRANT ALL ON SEQUENCE public.admins_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.admins_id_seq TO service_role;


--
-- Name: TABLE affiliate_earnings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.affiliate_earnings TO anon;
GRANT ALL ON TABLE public.affiliate_earnings TO authenticated;
GRANT ALL ON TABLE public.affiliate_earnings TO service_role;


--
-- Name: TABLE affiliate_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.affiliate_profiles TO anon;
GRANT ALL ON TABLE public.affiliate_profiles TO authenticated;
GRANT ALL ON TABLE public.affiliate_profiles TO service_role;


--
-- Name: TABLE announcements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.announcements TO anon;
GRANT ALL ON TABLE public.announcements TO authenticated;
GRANT ALL ON TABLE public.announcements TO service_role;


--
-- Name: SEQUENCE announcements_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.announcements_id_seq TO anon;
GRANT ALL ON SEQUENCE public.announcements_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.announcements_id_seq TO service_role;


--
-- Name: TABLE captcha_challenges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.captcha_challenges TO anon;
GRANT ALL ON TABLE public.captcha_challenges TO authenticated;
GRANT ALL ON TABLE public.captcha_challenges TO service_role;


--
-- Name: TABLE contact_inquiries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contact_inquiries TO anon;
GRANT ALL ON TABLE public.contact_inquiries TO authenticated;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;


--
-- Name: TABLE customer_addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customer_addresses TO anon;
GRANT ALL ON TABLE public.customer_addresses TO authenticated;
GRANT ALL ON TABLE public.customer_addresses TO service_role;


--
-- Name: TABLE customer_notes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customer_notes TO anon;
GRANT ALL ON TABLE public.customer_notes TO authenticated;
GRANT ALL ON TABLE public.customer_notes TO service_role;


--
-- Name: TABLE ecom_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ecom_orders TO anon;
GRANT ALL ON TABLE public.ecom_orders TO authenticated;
GRANT ALL ON TABLE public.ecom_orders TO service_role;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employees TO anon;
GRANT ALL ON TABLE public.employees TO authenticated;
GRANT ALL ON TABLE public.employees TO service_role;


--
-- Name: TABLE gallery_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gallery_submissions TO anon;
GRANT ALL ON TABLE public.gallery_submissions TO authenticated;
GRANT ALL ON TABLE public.gallery_submissions TO service_role;


--
-- Name: TABLE incoming_packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.incoming_packages TO anon;
GRANT ALL ON TABLE public.incoming_packages TO authenticated;
GRANT ALL ON TABLE public.incoming_packages TO service_role;


--
-- Name: TABLE login_attempts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.login_attempts TO anon;
GRANT ALL ON TABLE public.login_attempts TO authenticated;
GRANT ALL ON TABLE public.login_attempts TO service_role;


--
-- Name: TABLE notification_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_log TO anon;
GRANT ALL ON TABLE public.notification_log TO authenticated;
GRANT ALL ON TABLE public.notification_log TO service_role;


--
-- Name: TABLE order_status_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_status_history TO anon;
GRANT ALL ON TABLE public.order_status_history TO authenticated;
GRANT ALL ON TABLE public.order_status_history TO service_role;


--
-- Name: TABLE order_status_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_status_log TO anon;
GRANT ALL ON TABLE public.order_status_log TO authenticated;
GRANT ALL ON TABLE public.order_status_log TO service_role;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.orders_id_seq TO anon;
GRANT ALL ON SEQUENCE public.orders_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.orders_id_seq TO service_role;


--
-- Name: TABLE payment_reconciliation_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_reconciliation_logs TO anon;
GRANT ALL ON TABLE public.payment_reconciliation_logs TO authenticated;
GRANT ALL ON TABLE public.payment_reconciliation_logs TO service_role;


--
-- Name: SEQUENCE payment_reconciliation_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payment_reconciliation_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.payment_reconciliation_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.payment_reconciliation_logs_id_seq TO service_role;


--
-- Name: TABLE payout_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payout_requests TO anon;
GRANT ALL ON TABLE public.payout_requests TO authenticated;
GRANT ALL ON TABLE public.payout_requests TO service_role;


--
-- Name: TABLE product_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_images TO anon;
GRANT ALL ON TABLE public.product_images TO authenticated;
GRANT ALL ON TABLE public.product_images TO service_role;


--
-- Name: SEQUENCE product_images_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.product_images_id_seq TO anon;
GRANT ALL ON SEQUENCE public.product_images_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.product_images_id_seq TO service_role;


--
-- Name: TABLE product_reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_reviews TO anon;
GRANT ALL ON TABLE public.product_reviews TO authenticated;
GRANT ALL ON TABLE public.product_reviews TO service_role;


--
-- Name: TABLE product_variants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_variants TO anon;
GRANT ALL ON TABLE public.product_variants TO authenticated;
GRANT ALL ON TABLE public.product_variants TO service_role;


--
-- Name: SEQUENCE product_variants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.product_variants_id_seq TO anon;
GRANT ALL ON SEQUENCE public.product_variants_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.product_variants_id_seq TO service_role;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;


--
-- Name: SEQUENCE products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.products_id_seq TO anon;
GRANT ALL ON SEQUENCE public.products_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.products_id_seq TO service_role;


--
-- Name: TABLE promotions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promotions TO anon;
GRANT ALL ON TABLE public.promotions TO authenticated;
GRANT ALL ON TABLE public.promotions TO service_role;


--
-- Name: SEQUENCE promotions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.promotions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.promotions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.promotions_id_seq TO service_role;


--
-- Name: TABLE recently_viewed; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recently_viewed TO anon;
GRANT ALL ON TABLE public.recently_viewed TO authenticated;
GRANT ALL ON TABLE public.recently_viewed TO service_role;


--
-- Name: TABLE scan_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.scan_logs TO anon;
GRANT ALL ON TABLE public.scan_logs TO authenticated;
GRANT ALL ON TABLE public.scan_logs TO service_role;


--
-- Name: TABLE settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.settings TO anon;
GRANT ALL ON TABLE public.settings TO authenticated;
GRANT ALL ON TABLE public.settings TO service_role;


--
-- Name: SEQUENCE settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.settings_id_seq TO anon;
GRANT ALL ON SEQUENCE public.settings_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.settings_id_seq TO service_role;


--
-- Name: TABLE shared_carts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shared_carts TO anon;
GRANT ALL ON TABLE public.shared_carts TO authenticated;
GRANT ALL ON TABLE public.shared_carts TO service_role;


--
-- Name: TABLE shop_ads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shop_ads TO anon;
GRANT ALL ON TABLE public.shop_ads TO authenticated;
GRANT ALL ON TABLE public.shop_ads TO service_role;


--
-- Name: TABLE support_escalations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.support_escalations TO anon;
GRANT ALL ON TABLE public.support_escalations TO authenticated;
GRANT ALL ON TABLE public.support_escalations TO service_role;


--
-- Name: TABLE system_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_settings TO anon;
GRANT ALL ON TABLE public.system_settings TO authenticated;
GRANT ALL ON TABLE public.system_settings TO service_role;


--
-- Name: TABLE telegram_broadcasts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.telegram_broadcasts TO anon;
GRANT ALL ON TABLE public.telegram_broadcasts TO authenticated;
GRANT ALL ON TABLE public.telegram_broadcasts TO service_role;


--
-- Name: TABLE telegram_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.telegram_messages TO anon;
GRANT ALL ON TABLE public.telegram_messages TO authenticated;
GRANT ALL ON TABLE public.telegram_messages TO service_role;


--
-- Name: TABLE telegram_verification_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.telegram_verification_tokens TO anon;
GRANT ALL ON TABLE public.telegram_verification_tokens TO authenticated;
GRANT ALL ON TABLE public.telegram_verification_tokens TO service_role;


--
-- Name: TABLE user_addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_addresses TO anon;
GRANT ALL ON TABLE public.user_addresses TO authenticated;
GRANT ALL ON TABLE public.user_addresses TO service_role;


--
-- Name: TABLE user_dismissed_announcements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_dismissed_announcements TO anon;
GRANT ALL ON TABLE public.user_dismissed_announcements TO authenticated;
GRANT ALL ON TABLE public.user_dismissed_announcements TO service_role;


--
-- Name: SEQUENCE user_dismissed_announcements_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_dismissed_announcements_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_dismissed_announcements_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_dismissed_announcements_id_seq TO service_role;


--
-- Name: TABLE user_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_preferences TO anon;
GRANT ALL ON TABLE public.user_preferences TO authenticated;
GRANT ALL ON TABLE public.user_preferences TO service_role;


--
-- Name: TABLE user_searches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_searches TO anon;
GRANT ALL ON TABLE public.user_searches TO authenticated;
GRANT ALL ON TABLE public.user_searches TO service_role;


--
-- Name: SEQUENCE user_searches_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_searches_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_searches_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_searches_id_seq TO service_role;


--
-- Name: TABLE warehouse_addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.warehouse_addresses TO anon;
GRANT ALL ON TABLE public.warehouse_addresses TO authenticated;
GRANT ALL ON TABLE public.warehouse_addresses TO service_role;


--
-- Name: TABLE wishlist; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlist TO anon;
GRANT ALL ON TABLE public.wishlist TO authenticated;
GRANT ALL ON TABLE public.wishlist TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_06_07; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_07 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_07 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_08; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_08 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_08 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_09; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_09 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_09 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_10; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_10 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_10 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_11; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_11 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_11 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_12; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_12 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_12 TO dashboard_user;


--
-- Name: TABLE messages_2026_06_13; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_06_13 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_06_13 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO postgres;
GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO postgres;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO postgres;
GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict bTdE9DGHg2GDU7CsjJXn8w2MzxPOLi9APcUkyu0PfOEaaJidQBVuVkYAXVVOh22

