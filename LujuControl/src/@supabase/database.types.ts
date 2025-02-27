export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          birthdate: string
          city: string
          country: string
          created_at: string | null
          email: string
          end_date: string
          first_name: string
          id: string
          last_name: string
          membership_id: string | null
          phone: string | null
          postal_code: string
          start_date: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          birthdate: string
          city: string
          country: string
          created_at?: string | null
          email: string
          end_date: string
          first_name: string
          id?: string
          last_name: string
          membership_id?: string | null
          phone?: string | null
          postal_code: string
          start_date: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          birthdate?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          end_date?: string
          first_name?: string
          id?: string
          last_name?: string
          membership_id?: string | null
          phone?: string | null
          postal_code?: string
          start_date?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          birthdate: string
          city: string
          country: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          postal_code: string
          role: string
          schedule: Json | null
          state: string
          updated_at: string | null
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          birthdate: string
          city: string
          country: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          postal_code: string
          role: string
          schedule?: Json | null
          state: string
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          birthdate?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string
          role?: string
          schedule?: Json | null
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_users: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          birthdate: string
          city: string
          country: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          password_hash: string
          phone: string | null
          postal_code: string
          role: string
          state: string
          updated_at: string | null
          username: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          birthdate: string
          city: string
          country: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          password_hash: string
          phone?: string | null
          postal_code: string
          role: string
          state: string
          updated_at?: string | null
          username: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          birthdate?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password_hash?: string
          phone?: string | null
          postal_code?: string
          role?: string
          state?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
