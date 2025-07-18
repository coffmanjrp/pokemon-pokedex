export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pokemon: {
        Row: {
          id: number;
          name: string;
          height: number | null;
          weight: number | null;
          base_experience: number | null;
          types: Json;
          stats: Json;
          abilities: Json;
          sprites: Json;
          moves: Json | null;
          species_data: Json;
          form_data: Json | null;
          generation: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          height?: number | null;
          weight?: number | null;
          base_experience?: number | null;
          types: Json;
          stats: Json;
          abilities: Json;
          sprites: Json;
          moves?: Json | null;
          species_data: Json;
          form_data?: Json | null;
          generation: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          height?: number | null;
          weight?: number | null;
          base_experience?: number | null;
          types?: Json;
          stats?: Json;
          abilities?: Json;
          sprites?: Json;
          moves?: Json | null;
          species_data?: Json;
          form_data?: Json | null;
          generation?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      evolution_chains: {
        Row: {
          id: number;
          chain_data: Json;
          created_at: string;
        };
        Insert: {
          id: number;
          chain_data: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          chain_data?: Json;
          created_at?: string;
        };
      };
      pokemon_forms: {
        Row: {
          id: number;
          pokemon_id: number;
          form_name: string;
          form_data: Json;
          is_regional_variant: boolean;
          is_mega_evolution: boolean;
          is_gigantamax: boolean;
          created_at: string;
        };
        Insert: {
          id: number;
          pokemon_id: number;
          form_name: string;
          form_data: Json;
          is_regional_variant?: boolean;
          is_mega_evolution?: boolean;
          is_gigantamax?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          pokemon_id?: number;
          form_name?: string;
          form_data?: Json;
          is_regional_variant?: boolean;
          is_mega_evolution?: boolean;
          is_gigantamax?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
