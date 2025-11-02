export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      replies: {
        Row: {
          id: string
          user_id: string
          original_email: string
          ai_response: string
          action_type: 'reply' | 'summarize'
          tone: 'friendly' | 'professional' | 'concise' | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_email: string
          ai_response: string
          action_type: 'reply' | 'summarize'
          tone?: 'friendly' | 'professional' | 'concise' | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_email?: string
          ai_response?: string
          action_type?: 'reply' | 'summarize'
          tone?: 'friendly' | 'professional' | 'concise' | null
          created_at?: string
        }
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
  }
}
