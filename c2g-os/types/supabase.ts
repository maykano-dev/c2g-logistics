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
