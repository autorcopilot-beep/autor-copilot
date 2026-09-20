export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Contrato inicial do banco. O comando `npm run db:types` substitui este
 * arquivo pelos tipos gerados pelo Supabase quando as primeiras migrations
 * forem criadas.
 */
export type Database = {
  public: {
    Tables: { [_ in never]: never };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
