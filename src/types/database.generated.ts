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
          created_at: string
          id: string
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          title?: string
          updated_at?: string
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
      [_ in never]: never
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
      writing_document_kind:
        | "folder"
        | "page"
        | "chapter"
        | "scene"
        | "note"
        | "draft"
      writing_document_status: "draft" | "review" | "final"
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
      writing_document_kind: [
        "folder",
        "page",
        "chapter",
        "scene",
        "note",
        "draft",
      ],
      writing_document_status: ["draft", "review", "final"],
    },
  },
} as const

