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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          created_at: string
          created_by: string | null
          display_name: string
          email: string
          is_master: boolean
          role: Database["public"]["Enums"]["admin_role"]
          status: Database["public"]["Enums"]["admin_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_name: string
          email: string
          is_master?: boolean
          role: Database["public"]["Enums"]["admin_role"]
          status?: Database["public"]["Enums"]["admin_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_name?: string
          email?: string
          is_master?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          status?: Database["public"]["Enums"]["admin_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["admin_role"] | null
          event_id: string
          id: number
          ip_address: unknown
          metadata: Json
          new_data: Json | null
          occurred_at: string
          old_data: Json | null
          request_id: string
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["admin_role"] | null
          event_id?: string
          id?: never
          ip_address?: unknown
          metadata?: Json
          new_data?: Json | null
          occurred_at?: string
          old_data?: Json | null
          request_id?: string
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["admin_role"] | null
          event_id?: string
          id?: never
          ip_address?: unknown
          metadata?: Json
          new_data?: Json | null
          occurred_at?: string
          old_data?: Json | null
          request_id?: string
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      audio_editorial_markers: {
        Row: {
          created_at: string
          id: string
          marker_type: string
          note: string
          time_ms: number
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          marker_type?: string
          note?: string
          time_ms: number
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          marker_type?: string
          note?: string
          time_ms?: number
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_editorial_markers_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_mix_presets: {
        Row: {
          channels: Json
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channels?: Json
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channels?: Json
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audio_playlist_items: {
        Row: {
          created_at: string
          id: string
          playlist_id: string
          position: number
          preset_id: string | null
          track_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          playlist_id: string
          position?: number
          preset_id?: string | null
          track_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number
          preset_id?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "audio_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_playlist_items_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_playlists: {
        Row: {
          cover_key: string
          created_at: string
          description: string
          genre: string
          id: string
          is_official: boolean
          owner_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_key?: string
          created_at?: string
          description?: string
          genre?: string
          id?: string
          is_official?: boolean
          owner_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_key?: string
          created_at?: string
          description?: string
          genre?: string
          id?: string
          is_official?: boolean
          owner_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          audio_path: string
          author_name: string
          catalog_slug: string
          cover_path: string
          created_at: string
          created_by: string | null
          description: string
          duration_seconds: number
          energy_level: number
          format_encoding: string
          genre: string
          id: string
          is_featured: boolean
          is_published: boolean
          license_name: string
          license_url: string
          listen_count: number
          mental_rhythm_bpm: number
          mood: string
          sampling_rate_hz: number
          spatial_mode: string
          subtitle: string
          tags: string[]
          title: string
          track_kind: Database["public"]["Enums"]["audio_track_kind"]
          transcript: Json
          updated_at: string
          waveform_peaks: number[]
        }
        Insert: {
          audio_path?: string
          author_name?: string
          catalog_slug?: string
          cover_path?: string
          created_at?: string
          created_by?: string | null
          description?: string
          duration_seconds?: number
          energy_level?: number
          format_encoding?: string
          genre?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          license_name?: string
          license_url?: string
          listen_count?: number
          mental_rhythm_bpm?: number
          mood?: string
          sampling_rate_hz?: number
          spatial_mode?: string
          subtitle?: string
          tags?: string[]
          title: string
          track_kind?: Database["public"]["Enums"]["audio_track_kind"]
          transcript?: Json
          updated_at?: string
          waveform_peaks?: number[]
        }
        Update: {
          audio_path?: string
          author_name?: string
          catalog_slug?: string
          cover_path?: string
          created_at?: string
          created_by?: string | null
          description?: string
          duration_seconds?: number
          energy_level?: number
          format_encoding?: string
          genre?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          license_name?: string
          license_url?: string
          listen_count?: number
          mental_rhythm_bpm?: number
          mood?: string
          sampling_rate_hz?: number
          spatial_mode?: string
          subtitle?: string
          tags?: string[]
          title?: string
          track_kind?: Database["public"]["Enums"]["audio_track_kind"]
          transcript?: Json
          updated_at?: string
          waveform_peaks?: number[]
        }
        Relationships: []
      }
      audio_user_settings: {
        Row: {
          auto_pause_on_typing_stop: boolean
          crossfade_duration_ms: number
          favorite_track_ids: string[]
          master_volume: number
          mixer_channels: Json
          playback_rate: number
          pomodoro_auto_start: boolean
          pomodoro_break_minutes: number
          pomodoro_cycles: number
          pomodoro_focus_minutes: number
          pomodoro_long_break_minutes: number
          preferred_genres: string[]
          show_waveform: boolean
          sound_follows_pomodoro: boolean
          spatial_mode: string
          typing_inactivity_threshold_ms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_pause_on_typing_stop?: boolean
          crossfade_duration_ms?: number
          favorite_track_ids?: string[]
          master_volume?: number
          mixer_channels?: Json
          playback_rate?: number
          pomodoro_auto_start?: boolean
          pomodoro_break_minutes?: number
          pomodoro_cycles?: number
          pomodoro_focus_minutes?: number
          pomodoro_long_break_minutes?: number
          preferred_genres?: string[]
          show_waveform?: boolean
          sound_follows_pomodoro?: boolean
          spatial_mode?: string
          typing_inactivity_threshold_ms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_pause_on_typing_stop?: boolean
          crossfade_duration_ms?: number
          favorite_track_ids?: string[]
          master_volume?: number
          mixer_channels?: Json
          playback_rate?: number
          pomodoro_auto_start?: boolean
          pomodoro_break_minutes?: number
          pomodoro_cycles?: number
          pomodoro_focus_minutes?: number
          pomodoro_long_break_minutes?: number
          preferred_genres?: string[]
          show_waveform?: boolean
          sound_follows_pomodoro?: boolean
          spatial_mode?: string
          typing_inactivity_threshold_ms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      author_archetypes: {
        Row: {
          accent_color: string
          advancement_text: string
          asset_key: string
          benefits: Json
          code_prefix: string
          created_at: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          name: string
          sort_order: number
          stage_max: number
          stage_min: number
          tagline: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          advancement_text?: string
          asset_key?: string
          benefits?: Json
          code_prefix: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name: string
          sort_order?: number
          stage_max?: number
          stage_min?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          advancement_text?: string
          asset_key?: string
          benefits?: Json
          code_prefix?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          stage_max?: number
          stage_min?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      communication_api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
          scopes: string[]
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          revoked_at?: string | null
          scopes?: string[]
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          scopes?: string[]
          status?: string
        }
        Relationships: []
      }
      communication_campaigns: {
        Row: {
          audience_rules: Json
          campaign_tags: string[]
          created_at: string
          created_by: string | null
          id: string
          internal_name: string
          published_at: string | null
          scheduled_for: string | null
          selected_channels: string[]
          status: string
          summary: string
          timezone: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audience_rules?: Json
          campaign_tags?: string[]
          created_at?: string
          created_by?: string | null
          id?: string
          internal_name: string
          published_at?: string | null
          scheduled_for?: string | null
          selected_channels?: string[]
          status?: string
          summary?: string
          timezone?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audience_rules?: Json
          campaign_tags?: string[]
          created_at?: string
          created_by?: string | null
          id?: string
          internal_name?: string
          published_at?: string | null
          scheduled_for?: string | null
          selected_channels?: string[]
          status?: string
          summary?: string
          timezone?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      communication_catalogs: {
        Row: {
          accent_color: string
          api_collection_path: string
          channel: string
          created_at: string
          description: string
          display_order: number
          icon_name: string
          is_public: boolean
          name: string
          public_base_path: string
          settings: Json
          supports_canvas: boolean
          updated_at: string
        }
        Insert: {
          accent_color?: string
          api_collection_path: string
          channel: string
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string
          is_public?: boolean
          name: string
          public_base_path: string
          settings?: Json
          supports_canvas?: boolean
          updated_at?: string
        }
        Update: {
          accent_color?: string
          api_collection_path?: string
          channel?: string
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string
          is_public?: boolean
          name?: string
          public_base_path?: string
          settings?: Json
          supports_canvas?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      communication_components: {
        Row: {
          category: string
          component_key: string
          config: Json
          created_at: string
          created_by: string | null
          css_code: string
          description: string
          html_code: string
          icon_name: string
          id: string
          is_active: boolean
          is_official: boolean
          js_code: string
          name: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          category: string
          component_key: string
          config?: Json
          created_at?: string
          created_by?: string | null
          css_code?: string
          description?: string
          html_code?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          js_code?: string
          name: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          category?: string
          component_key?: string
          config?: Json
          created_at?: string
          created_by?: string | null
          css_code?: string
          description?: string
          html_code?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          js_code?: string
          name?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      communication_delivery_attempts: {
        Row: {
          attempt_number: number
          attempted_at: string
          campaign_id: string
          error_message: string | null
          id: number
          item_id: string
          provider: string | null
          provider_reference: string | null
          response_body: Json
          response_code: string | null
          status: string
        }
        Insert: {
          attempt_number?: number
          attempted_at?: string
          campaign_id: string
          error_message?: string | null
          id?: never
          item_id: string
          provider?: string | null
          provider_reference?: string | null
          response_body?: Json
          response_code?: string | null
          status: string
        }
        Update: {
          attempt_number?: number
          attempted_at?: string
          campaign_id?: string
          error_message?: string | null
          id?: never
          item_id?: string
          provider?: string | null
          provider_reference?: string | null
          response_body?: Json
          response_code?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_delivery_attempts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "communication_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_delivery_attempts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "communication_items"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_items: {
        Row: {
          audience_rules: Json
          campaign_id: string
          channel: string
          created_at: string
          created_by: string | null
          delivery_provider: string | null
          external_reference: string | null
          id: string
          is_public: boolean
          last_error: string | null
          payload: Json
          public_path: string | null
          published_at: string | null
          scheduled_for: string | null
          seo: Json
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audience_rules?: Json
          campaign_id: string
          channel: string
          created_at?: string
          created_by?: string | null
          delivery_provider?: string | null
          external_reference?: string | null
          id?: string
          is_public?: boolean
          last_error?: string | null
          payload?: Json
          public_path?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          seo?: Json
          slug?: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audience_rules?: Json
          campaign_id?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          delivery_provider?: string | null
          external_reference?: string | null
          id?: string
          is_public?: boolean
          last_error?: string | null
          payload?: Json
          public_path?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          seo?: Json
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "communication_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_media_assets: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          created_by: string | null
          file_name: string
          id: string
          media_type: string
          mime_type: string
          public_url: string
          size_bytes: number
          storage_path: string
          title: string
        }
        Insert: {
          alt_text?: string
          caption?: string
          created_at?: string
          created_by?: string | null
          file_name: string
          id?: string
          media_type: string
          mime_type: string
          public_url: string
          size_bytes: number
          storage_path: string
          title?: string
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          created_by?: string | null
          file_name?: string
          id?: string
          media_type?: string
          mime_type?: string
          public_url?: string
          size_bytes?: number
          storage_path?: string
          title?: string
        }
        Relationships: []
      }
      communication_receipts: {
        Row: {
          item_id: string
          metadata: Json
          occurred_at: string
          receipt_type: string
          user_id: string
        }
        Insert: {
          item_id: string
          metadata?: Json
          occurred_at?: string
          receipt_type: string
          user_id: string
        }
        Update: {
          item_id?: string
          metadata?: Json
          occurred_at?: string
          receipt_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_receipts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "communication_items"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_projects: {
        Row: {
          color: string
          cover_url: string
          created_at: string
          description: string
          id: string
          name: string
          owner_id: string
          settings: Json
          status: string
          updated_at: string
        }
        Insert: {
          color?: string
          cover_url?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          owner_id: string
          settings?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          color?: string
          cover_url?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner_id?: string
          settings?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      encyclopedia_entries: {
        Row: {
          aliases: string[]
          appearance: string
          color: string
          connections: string
          created_at: string
          details: string
          entry_type: Database["public"]["Enums"]["encyclopedia_entry_type"]
          history: string
          id: string
          is_pinned: boolean
          is_spoiler: boolean
          name: string
          owner_id: string
          profile_answers: Json
          rules: string
          status: string
          story_role: string
          summary: string
          tags: string[]
          template_id: string
          updated_at: string
          work_id: string
        }
        Insert: {
          aliases?: string[]
          appearance?: string
          color?: string
          connections?: string
          created_at?: string
          details?: string
          entry_type?: Database["public"]["Enums"]["encyclopedia_entry_type"]
          history?: string
          id?: string
          is_pinned?: boolean
          is_spoiler?: boolean
          name: string
          owner_id: string
          profile_answers?: Json
          rules?: string
          status?: string
          story_role?: string
          summary?: string
          tags?: string[]
          template_id?: string
          updated_at?: string
          work_id: string
        }
        Update: {
          aliases?: string[]
          appearance?: string
          color?: string
          connections?: string
          created_at?: string
          details?: string
          entry_type?: Database["public"]["Enums"]["encyclopedia_entry_type"]
          history?: string
          id?: string
          is_pinned?: boolean
          is_spoiler?: boolean
          name?: string
          owner_id?: string
          profile_answers?: Json
          rules?: string
          status?: string
          story_role?: string
          summary?: string
          tags?: string[]
          template_id?: string
          updated_at?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encyclopedia_entries_work_owner_fk"
            columns: ["work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      extension_catalog: {
        Row: {
          allowed_groups: string[]
          author: string
          category: string
          config: Json
          created_at: string
          currency: string
          description: string
          feature_flag: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          media_type: string
          media_url: string
          name: string
          price_cents: number
          price_model: string
          product_kind: string
          tags: string[]
          updated_at: string
          version: string
        }
        Insert: {
          allowed_groups?: string[]
          author?: string
          category: string
          config?: Json
          created_at?: string
          currency?: string
          description: string
          feature_flag?: string | null
          id: string
          is_featured?: boolean
          is_published?: boolean
          media_type?: string
          media_url?: string
          name: string
          price_cents?: number
          price_model?: string
          product_kind?: string
          tags?: string[]
          updated_at?: string
          version?: string
        }
        Update: {
          allowed_groups?: string[]
          author?: string
          category?: string
          config?: Json
          created_at?: string
          currency?: string
          description?: string
          feature_flag?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_type?: string
          media_url?: string
          name?: string
          price_cents?: number
          price_model?: string
          product_kind?: string
          tags?: string[]
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          allowed_groups: string[]
          description: string
          enabled: boolean
          key: string
          name: string
          rollout_percentage: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          allowed_groups?: string[]
          description?: string
          enabled?: boolean
          key: string
          name: string
          rollout_percentage?: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          allowed_groups?: string[]
          description?: string
          enabled?: boolean
          key?: string
          name?: string
          rollout_percentage?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          department: string
          effective_at: string
          is_published: boolean
          pdf_href: string
          related_features: string[]
          sections: Json
          short_description: string
          slug: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          department?: string
          effective_at?: string
          is_published?: boolean
          pdf_href?: string
          related_features?: string[]
          sections?: Json
          short_description?: string
          slug: string
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          department?: string
          effective_at?: string
          is_published?: boolean
          pdf_href?: string
          related_features?: string[]
          sections?: Json
          short_description?: string
          slug?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      library_catalog_works: {
        Row: {
          added_at: string
          catalog_id: string
          owner_id: string
          work_id: string
        }
        Insert: {
          added_at?: string
          catalog_id: string
          owner_id: string
          work_id: string
        }
        Update: {
          added_at?: string
          catalog_id?: string
          owner_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_catalog_works_catalog_owner_fk"
            columns: ["catalog_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "library_catalogs"
            referencedColumns: ["id", "owner_id"]
          },
          {
            foreignKeyName: "library_catalog_works_work_owner_fk"
            columns: ["work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      library_catalogs: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          name: string
          owner_id: string
          position: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          owner_id: string
          position?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_guide_steps: {
        Row: {
          action_href: string
          action_label: string
          animation: string
          created_at: string
          guide_id: string
          id: string
          media_url: string
          message: string
          metadata: Json
          mock_state: Json
          placement: string
          position: number
          selector: string
          template_css: string
          template_html: string
          template_js: string
          template_key: string
          title: string
          updated_at: string
        }
        Insert: {
          action_href?: string
          action_label?: string
          animation?: string
          created_at?: string
          guide_id: string
          id?: string
          media_url?: string
          message: string
          metadata?: Json
          mock_state?: Json
          placement?: string
          position: number
          selector?: string
          template_css?: string
          template_html?: string
          template_js?: string
          template_key?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_href?: string
          action_label?: string
          animation?: string
          created_at?: string
          guide_id?: string
          id?: string
          media_url?: string
          message?: string
          metadata?: Json
          mock_state?: Json
          placement?: string
          position?: number
          selector?: string
          template_css?: string
          template_html?: string
          template_js?: string
          template_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_guide_steps_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "product_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      product_guide_targets: {
        Row: {
          created_at: string
          description: string
          element_kind: string
          label: string
          last_seen_at: string | null
          metadata: Json
          route_pattern: string
          selector: string
          source: string
          target_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          element_kind?: string
          label: string
          last_seen_at?: string | null
          metadata?: Json
          route_pattern: string
          selector: string
          source?: string
          target_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          element_kind?: string
          label?: string
          last_seen_at?: string | null
          metadata?: Json
          route_pattern?: string
          selector?: string
          source?: string
          target_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_guide_templates: {
        Row: {
          created_at: string
          created_by: string | null
          css: string
          description: string
          html: string
          is_active: boolean
          js: string
          mock_state: Json
          name: string
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          css?: string
          description?: string
          html: string
          is_active?: boolean
          js?: string
          mock_state?: Json
          name: string
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          css?: string
          description?: string
          html?: string
          is_active?: boolean
          js?: string
          mock_state?: Json
          name?: string
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      product_guides: {
        Row: {
          allowed_groups: string[]
          allowed_tags: string[]
          created_at: string
          created_by: string | null
          description: string
          dismissible: boolean
          enabled: boolean
          ends_at: string | null
          experience_type: string
          feature_key: string
          guide_key: string
          id: string
          name: string
          new_users_only: boolean
          priority: number
          rollout_percentage: number
          route_pattern: string
          settings: Json
          starts_at: string | null
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          allowed_groups?: string[]
          allowed_tags?: string[]
          created_at?: string
          created_by?: string | null
          description?: string
          dismissible?: boolean
          enabled?: boolean
          ends_at?: string | null
          experience_type: string
          feature_key?: string
          guide_key: string
          id?: string
          name: string
          new_users_only?: boolean
          priority?: number
          rollout_percentage?: number
          route_pattern: string
          settings?: Json
          starts_at?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          allowed_groups?: string[]
          allowed_tags?: string[]
          created_at?: string
          created_by?: string | null
          description?: string
          dismissible?: boolean
          enabled?: boolean
          ends_at?: string | null
          experience_type?: string
          feature_key?: string
          guide_key?: string
          id?: string
          name?: string
          new_users_only?: boolean
          priority?: number
          rollout_percentage?: number
          route_pattern?: string
          settings?: Json
          starts_at?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_path: string | null
          bio: string | null
          communications_opt_in: boolean
          country_code: string | null
          created_at: string
          display_name: string
          experience_level: string | null
          full_name: string | null
          id: string
          locale: string
          nickname: string | null
          onboarding_completed_at: string | null
          pen_name: string | null
          privacy_accepted_at: string | null
          terms_accepted_at: string | null
          timezone: string
          updated_at: string
          username: string
          writing_focus: string | null
          writing_genres: string[]
        }
        Insert: {
          age?: number | null
          avatar_path?: string | null
          bio?: string | null
          communications_opt_in?: boolean
          country_code?: string | null
          created_at?: string
          display_name: string
          experience_level?: string | null
          full_name?: string | null
          id: string
          locale?: string
          nickname?: string | null
          onboarding_completed_at?: string | null
          pen_name?: string | null
          privacy_accepted_at?: string | null
          terms_accepted_at?: string | null
          timezone?: string
          updated_at?: string
          username: string
          writing_focus?: string | null
          writing_genres?: string[]
        }
        Update: {
          age?: number | null
          avatar_path?: string | null
          bio?: string | null
          communications_opt_in?: boolean
          country_code?: string | null
          created_at?: string
          display_name?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          locale?: string
          nickname?: string | null
          onboarding_completed_at?: string | null
          pen_name?: string | null
          privacy_accepted_at?: string | null
          terms_accepted_at?: string | null
          timezone?: string
          updated_at?: string
          username?: string
          writing_focus?: string | null
          writing_genres?: string[]
        }
        Relationships: []
      }
      story_universes: {
        Row: {
          canon_policy: string
          color: string
          cover_url: string
          created_at: string
          description: string
          era_label: string
          id: string
          metadata: Json
          name: string
          owner_id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          canon_policy?: string
          color?: string
          cover_url?: string
          created_at?: string
          description?: string
          era_label?: string
          id?: string
          metadata?: Json
          name: string
          owner_id: string
          project_id: string
          updated_at?: string
        }
        Update: {
          canon_policy?: string
          color?: string
          cover_url?: string
          created_at?: string
          description?: string
          era_label?: string
          id?: string
          metadata?: Json
          name?: string
          owner_id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_universes_project_id_owner_id_fkey"
            columns: ["project_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "creative_projects"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      universe_graph_edges: {
        Row: {
          created_at: string
          direction: string
          id: string
          label: string
          metadata: Json
          owner_id: string
          relation_type: string
          source_id: string
          source_kind: string
          target_id: string
          target_kind: string
          universe_id: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          direction?: string
          id?: string
          label?: string
          metadata?: Json
          owner_id: string
          relation_type: string
          source_id: string
          source_kind: string
          target_id: string
          target_kind: string
          universe_id: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          label?: string
          metadata?: Json
          owner_id?: string
          relation_type?: string
          source_id?: string
          source_kind?: string
          target_id?: string
          target_kind?: string
          universe_id?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "universe_graph_edges_universe_id_owner_id_fkey"
            columns: ["universe_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "story_universes"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      universe_works: {
        Row: {
          chronology_order: number
          continuity_role: string
          created_at: string
          notes: string
          owner_id: string
          universe_id: string
          work_id: string
        }
        Insert: {
          chronology_order?: number
          continuity_role?: string
          created_at?: string
          notes?: string
          owner_id: string
          universe_id: string
          work_id: string
        }
        Update: {
          chronology_order?: number
          continuity_role?: string
          created_at?: string
          notes?: string
          owner_id?: string
          universe_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "universe_works_universe_id_owner_id_fkey"
            columns: ["universe_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "story_universes"
            referencedColumns: ["id", "owner_id"]
          },
          {
            foreignKeyName: "universe_works_work_id_owner_id_fkey"
            columns: ["work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      user_access_profiles: {
        Row: {
          groups: string[]
          notes: string
          status: string
          tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          groups?: string[]
          notes?: string
          status?: string
          tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          groups?: string[]
          notes?: string
          status?: string
          tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_author_profiles: {
        Row: {
          archetype_id: string
          computed_at: string | null
          created_at: string
          last_explanation: string
          pending_archetype_id: string | null
          pending_recomputations: number
          plan_code: string
          public_code: string
          rhythm_code: string
          stable_since: string
          stage_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          archetype_id: string
          computed_at?: string | null
          created_at?: string
          last_explanation?: string
          pending_archetype_id?: string | null
          pending_recomputations?: number
          plan_code?: string
          public_code?: string
          rhythm_code?: string
          stable_since?: string
          stage_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          archetype_id?: string
          computed_at?: string | null
          created_at?: string
          last_explanation?: string
          pending_archetype_id?: string | null
          pending_recomputations?: number
          plan_code?: string
          public_code?: string
          rhythm_code?: string
          stable_since?: string
          stage_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_author_profiles_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "author_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_author_profiles_pending_archetype_id_fkey"
            columns: ["pending_archetype_id"]
            isOneToOne: false
            referencedRelation: "author_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior_profiles: {
        Row: {
          churn_signal: string
          computed_at: string | null
          consent_snapshot_at: string | null
          content_derived: boolean
          history_distance: number | null
          normalized_signals: Json
          rolling_window_weeks: number
          segment_key: string
          updated_at: string
          usage_vector: string | null
          user_id: string
        }
        Insert: {
          churn_signal?: string
          computed_at?: string | null
          consent_snapshot_at?: string | null
          content_derived?: boolean
          history_distance?: number | null
          normalized_signals?: Json
          rolling_window_weeks?: number
          segment_key?: string
          updated_at?: string
          usage_vector?: string | null
          user_id: string
        }
        Update: {
          churn_signal?: string
          computed_at?: string | null
          consent_snapshot_at?: string | null
          content_derived?: boolean
          history_distance?: number | null
          normalized_signals?: Json
          rolling_window_weeks?: number
          segment_key?: string
          updated_at?: string
          usage_vector?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_extension_entitlements: {
        Row: {
          created_at: string
          ends_at: string | null
          extension_id: string
          granted_by: string | null
          metadata: Json
          source: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          extension_id: string
          granted_by?: string | null
          metadata?: Json
          source: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          extension_id?: string
          granted_by?: string | null
          metadata?: Json
          source?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_extension_entitlements_extension_id_fkey"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extension_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_extension_installations: {
        Row: {
          extension_id: string
          installed_at: string
          is_active: boolean
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          extension_id: string
          installed_at?: string
          is_active?: boolean
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          extension_id?: string
          installed_at?: string
          is_active?: boolean
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_extension_installations_extension_id_fkey"
            columns: ["extension_id"]
            isOneToOne: false
            referencedRelation: "extension_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_guide_progress: {
        Row: {
          completed_at: string | null
          current_step: number
          dismissed_at: string | null
          guide_id: string
          guide_version: number
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number
          dismissed_at?: string | null
          guide_id: string
          guide_version: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number
          dismissed_at?: string | null
          guide_id?: string
          guide_version?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_guide_progress_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "product_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai: Json
          appearance: Json
          communications: Json
          created_at: string
          guidance: Json
          notifications: Json
          privacy: Json
          updated_at: string
          user_id: string
          writing: Json
        }
        Insert: {
          ai?: Json
          appearance?: Json
          communications?: Json
          created_at?: string
          guidance?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id: string
          writing?: Json
        }
        Update: {
          ai?: Json
          appearance?: Json
          communications?: Json
          created_at?: string
          guidance?: Json
          notifications?: Json
          privacy?: Json
          updated_at?: string
          user_id?: string
          writing?: Json
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_interval: string
          created_at: string
          currency: string
          ends_at: string | null
          legacy_price_cents: number | null
          legacy_price_locked: boolean
          metadata: Json
          plan_code: string
          price_cents: number
          renews_at: string | null
          starts_at: string
          status: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          currency?: string
          ends_at?: string | null
          legacy_price_cents?: number | null
          legacy_price_locked?: boolean
          metadata?: Json
          plan_code?: string
          price_cents?: number
          renews_at?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          currency?: string
          ends_at?: string | null
          legacy_price_cents?: number | null
          legacy_price_locked?: boolean
          metadata?: Json
          plan_code?: string
          price_cents?: number
          renews_at?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      works: {
        Row: {
          archived_at: string | null
          cover_tone: string
          created_at: string
          genre: string
          id: string
          is_favorite: boolean
          is_primary: boolean
          owner_id: string
          status: Database["public"]["Enums"]["library_work_status"]
          subtitle: string
          synopsis: string
          title: string
          updated_at: string
          word_goal: number
        }
        Insert: {
          archived_at?: string | null
          cover_tone?: string
          created_at?: string
          genre?: string
          id?: string
          is_favorite?: boolean
          is_primary?: boolean
          owner_id: string
          status?: Database["public"]["Enums"]["library_work_status"]
          subtitle?: string
          synopsis?: string
          title?: string
          updated_at?: string
          word_goal?: number
        }
        Update: {
          archived_at?: string | null
          cover_tone?: string
          created_at?: string
          genre?: string
          id?: string
          is_favorite?: boolean
          is_primary?: boolean
          owner_id?: string
          status?: Database["public"]["Enums"]["library_work_status"]
          subtitle?: string
          synopsis?: string
          title?: string
          updated_at?: string
          word_goal?: number
        }
        Relationships: []
      }
      worldbuilding_profiles: {
        Row: {
          created_at: string
          foundation_assets: Json
          foundation_completed_at: string | null
          foundation_depth: string
          foundation_preset: string
          foundation_step: number
          genre_answers: Json
          genres: string[]
          incluing_enabled: boolean
          lore_answers: Json
          methodology: string
          mice_focus: string
          owner_id: string
          pov_mode: string
          psychic_distance: number
          updated_at: string
          work_id: string
        }
        Insert: {
          created_at?: string
          foundation_assets?: Json
          foundation_completed_at?: string | null
          foundation_depth?: string
          foundation_preset?: string
          foundation_step?: number
          genre_answers?: Json
          genres?: string[]
          incluing_enabled?: boolean
          lore_answers?: Json
          methodology?: string
          mice_focus?: string
          owner_id: string
          pov_mode?: string
          psychic_distance?: number
          updated_at?: string
          work_id: string
        }
        Update: {
          created_at?: string
          foundation_assets?: Json
          foundation_completed_at?: string | null
          foundation_depth?: string
          foundation_preset?: string
          foundation_step?: number
          genre_answers?: Json
          genres?: string[]
          incluing_enabled?: boolean
          lore_answers?: Json
          methodology?: string
          mice_focus?: string
          owner_id?: string
          pov_mode?: string
          psychic_distance?: number
          updated_at?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worldbuilding_profiles_work_owner_fk"
            columns: ["work_id", "owner_id"]
            isOneToOne: true
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      writing_documents: {
        Row: {
          content_html: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["writing_document_kind"]
          owner_id: string
          parent_id: string | null
          position: number
          status: Database["public"]["Enums"]["writing_document_status"]
          synopsis: string
          title: string
          updated_at: string
          word_goal: number
          work_id: string
        }
        Insert: {
          content_html?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["writing_document_kind"]
          owner_id: string
          parent_id?: string | null
          position?: number
          status?: Database["public"]["Enums"]["writing_document_status"]
          synopsis?: string
          title: string
          updated_at?: string
          word_goal?: number
          work_id: string
        }
        Update: {
          content_html?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["writing_document_kind"]
          owner_id?: string
          parent_id?: string | null
          position?: number
          status?: Database["public"]["Enums"]["writing_document_status"]
          synopsis?: string
          title?: string
          updated_at?: string
          word_goal?: number
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "writing_documents_parent_scope_fk"
            columns: ["parent_id", "work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "writing_documents"
            referencedColumns: ["id", "work_id", "owner_id"]
          },
          {
            foreignKeyName: "writing_documents_work_owner_fk"
            columns: ["work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      writing_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string | null
          goal_type: Database["public"]["Enums"]["writing_goal_type"]
          id: string
          owner_id: string
          target_value: number
          title: string
          updated_at: string
          work_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          goal_type: Database["public"]["Enums"]["writing_goal_type"]
          id?: string
          owner_id: string
          target_value?: number
          title: string
          updated_at?: string
          work_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          goal_type?: Database["public"]["Enums"]["writing_goal_type"]
          id?: string
          owner_id?: string
          target_value?: number
          title?: string
          updated_at?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "writing_goals_work_owner_fk"
            columns: ["work_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
      writing_snapshots: {
        Row: {
          content_html: string
          created_at: string
          document_id: string
          id: string
          owner_id: string
          status: Database["public"]["Enums"]["writing_document_status"]
          synopsis: string
          title: string
        }
        Insert: {
          content_html: string
          created_at?: string
          document_id: string
          id?: string
          owner_id: string
          status: Database["public"]["Enums"]["writing_document_status"]
          synopsis?: string
          title: string
        }
        Update: {
          content_html?: string
          created_at?: string
          document_id?: string
          id?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["writing_document_status"]
          synopsis?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "writing_snapshots_document_owner_fk"
            columns: ["document_id", "owner_id"]
            isOneToOne: false
            referencedRelation: "writing_documents"
            referencedColumns: ["id", "owner_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_initial_writing_documents: {
        Args: { target_work_id: string }
        Returns: undefined
      }
    }
    Enums: {
      admin_role:
        | "master"
        | "engineering"
        | "customer_experience"
        | "director"
        | "finance"
        | "product"
      admin_status: "active" | "suspended"
      audio_track_kind: "ambient" | "longform" | "audiobook" | "mixer_layer"
      encyclopedia_entry_type:
        | "character"
        | "location"
        | "organization"
        | "object"
        | "concept"
        | "event"
      library_work_status: "planning" | "drafting" | "revising" | "complete"
      writing_document_kind:
        | "folder"
        | "page"
        | "chapter"
        | "scene"
        | "note"
        | "draft"
      writing_document_status: "draft" | "review" | "final"
      writing_goal_type: "word_count" | "chapter_count" | "deadline"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      admin_role: [
        "master",
        "engineering",
        "customer_experience",
        "director",
        "finance",
        "product",
      ],
      admin_status: ["active", "suspended"],
      audio_track_kind: ["ambient", "longform", "audiobook", "mixer_layer"],
      encyclopedia_entry_type: [
        "character",
        "location",
        "organization",
        "object",
        "concept",
        "event",
      ],
      library_work_status: ["planning", "drafting", "revising", "complete"],
      writing_document_kind: [
        "folder",
        "page",
        "chapter",
        "scene",
        "note",
        "draft",
      ],
      writing_document_status: ["draft", "review", "final"],
      writing_goal_type: ["word_count", "chapter_count", "deadline"],
    },
  },
} as const
