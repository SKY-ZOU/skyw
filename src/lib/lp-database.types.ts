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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'fund_manager' | 'lp' | 'compliance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'fund_manager' | 'lp' | 'compliance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'fund_manager' | 'lp' | 'compliance'
          created_at?: string
          updated_at?: string
        }
      }
      funds: {
        Row: {
          id: string
          name: string
          description: string | null
          currency: string
          status: 'active' | 'closed' | 'pending'
          nav: number
          nav_date: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          currency?: string
          status?: 'active' | 'closed' | 'pending'
          nav: number
          nav_date: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          currency?: string
          status?: 'active' | 'closed' | 'pending'
          nav?: number
          nav_date?: string
          created_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          user_id: string
          fund_id: string
          shares: number
          nav_at_purchase: number
          total_value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fund_id: string
          shares: number
          nav_at_purchase: number
          total_value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fund_id?: string
          shares?: number
          nav_at_purchase?: number
          total_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          fund_id: string
          type: 'subscribe' | 'redeem' | 'dividend'
          amount: number
          shares: number
          nav: number | null
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          notes: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          fund_id: string
          type: 'subscribe' | 'redeem' | 'dividend'
          amount: number
          shares: number
          nav?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          fund_id?: string
          type?: 'subscribe' | 'redeem' | 'dividend'
          amount?: number
          shares?: number
          nav?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          fund_id: string | null
          title: string
          description: string | null
          file_url: string
          file_type: string
          category: 'report' | 'contract' | 'notice' | 'other'
          created_at: string
        }
        Insert: {
          id?: string
          fund_id?: string | null
          title: string
          description?: string | null
          file_url: string
          file_type: string
          category?: 'report' | 'contract' | 'notice' | 'other'
          created_at?: string
        }
        Update: {
          id?: string
          fund_id?: string | null
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          category?: 'report' | 'contract' | 'notice' | 'other'
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          is_important: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          is_important?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          is_important?: boolean
          created_at?: string
        }
      }
      nav_history: {
        Row: {
          id: string
          fund_id: string
          nav: number
          nav_date: string
          created_at: string
        }
        Insert: {
          id?: string
          fund_id: string
          nav: number
          nav_date: string
          created_at?: string
        }
        Update: {
          id?: string
          fund_id?: string
          nav?: number
          nav_date?: string
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Fund = Database['public']['Tables']['funds']['Row']
export type Holding = Database['public']['Tables']['holdings']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type NavHistory = Database['public']['Tables']['nav_history']['Row']
