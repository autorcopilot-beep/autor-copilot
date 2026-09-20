export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          experience_level: 'starting' | 'returning' | 'published' | null;
          id: string;
          onboarding_completed_at: string | null;
          pen_name: string | null;
          updated_at: string;
          writing_focus: 'fiction' | 'nonfiction' | 'poetry' | 'screenplay' | 'other' | null;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          experience_level?: 'starting' | 'returning' | 'published' | null;
          id: string;
          onboarding_completed_at?: string | null;
          pen_name?: string | null;
          updated_at?: string;
          writing_focus?: 'fiction' | 'nonfiction' | 'poetry' | 'screenplay' | 'other' | null;
        };
        Update: {
          display_name?: string;
          experience_level?: 'starting' | 'returning' | 'published' | null;
          onboarding_completed_at?: string | null;
          pen_name?: string | null;
          writing_focus?: 'fiction' | 'nonfiction' | 'poetry' | 'screenplay' | 'other' | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
