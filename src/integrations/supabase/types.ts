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
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          source: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          source: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          source?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      coin_wallets: {
        Row: {
          created_at: string
          id: string
          total_coins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_coins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_coins?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          can_mine_next: string | null
          coins_mined: number
          created_at: string
          id: string
          last_mining_time: string | null
          mining_progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          can_mine_next?: string | null
          coins_mined?: number
          created_at?: string
          id?: string
          last_mining_time?: string | null
          mining_progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          can_mine_next?: string | null
          coins_mined?: number
          created_at?: string
          id?: string
          last_mining_time?: string | null
          mining_progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_by: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          referral_code: string
          referred_by?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          coins_earned: number
          correct_answers: number
          created_at: string
          id: string
          last_quiz_date: string | null
          questions_answered: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coins_earned?: number
          correct_answers?: number
          created_at?: string
          id?: string
          last_quiz_date?: string | null
          questions_answered?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coins_earned?: number
          correct_answers?: number
          created_at?: string
          id?: string
          last_quiz_date?: string | null
          questions_answered?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          coins_spent: number
          created_at: string
          id: string
          item_description: string
          item_name: string
          status: string
          user_id: string
        }
        Insert: {
          coins_spent: number
          created_at?: string
          id?: string
          item_description: string
          item_name: string
          status?: string
          user_id: string
        }
        Update: {
          coins_spent?: number
          created_at?: string
          id?: string
          item_description?: string
          item_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed_count: number
          created_at: string
          id: string
          last_reset_date: string
          task_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_count?: number
          created_at?: string
          id?: string
          last_reset_date?: string
          task_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_count?: number
          created_at?: string
          id?: string
          last_reset_date?: string
          task_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      process_referral_bonus: {
        Args: { referrer_code: string; new_user_id: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
