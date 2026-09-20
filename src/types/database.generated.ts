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
  public: {
    Tables: {
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
        Relationships: []
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
        Relationships: []
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
