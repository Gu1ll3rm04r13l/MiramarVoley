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
      app_config: {
        Row: {
          id: number
          objetivo: string | null
          paleta: Json | null
          temporada: string | null
          usar_numero_nuevo: boolean | null
        }
        Insert: {
          id?: number
          objetivo?: string | null
          paleta?: Json | null
          temporada?: string | null
          usar_numero_nuevo?: boolean | null
        }
        Update: {
          id?: number
          objetivo?: string | null
          paleta?: Json | null
          temporada?: string | null
          usar_numero_nuevo?: boolean | null
        }
        Relationships: []
      }
      club_aliases: {
        Row: {
          alias: string
          canonical: string
        }
        Insert: {
          alias: string
          canonical: string
        }
        Update: {
          alias?: string
          canonical?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          aliases: string[] | null
          ciudad: string | null
          es_propio: boolean | null
          escudo_url: string | null
          id: string
          nombre: string
          nombre_corto: string | null
          nombre_en_tablas: string | null
        }
        Insert: {
          aliases?: string[] | null
          ciudad?: string | null
          es_propio?: boolean | null
          escudo_url?: string | null
          id: string
          nombre: string
          nombre_corto?: string | null
          nombre_en_tablas?: string | null
        }
        Update: {
          aliases?: string[] | null
          ciudad?: string | null
          es_propio?: boolean | null
          escudo_url?: string | null
          id?: string
          nombre?: string
          nombre_corto?: string | null
          nombre_en_tablas?: string | null
        }
        Relationships: []
      }
      divisions: {
        Row: {
          actualizado: string | null
          id: string
          nombre: string
          temporada: string | null
        }
        Insert: {
          actualizado?: string | null
          id: string
          nombre: string
          temporada?: string | null
        }
        Update: {
          actualizado?: string | null
          id?: string
          nombre?: string
          temporada?: string | null
        }
        Relationships: []
      }
      match_reports: {
        Row: {
          categoria: string | null
          destacados: Json | null
          duracion_min: number | null
          efectividad: number | null
          equipo_errores: number | null
          equipo_puntos: number | null
          fecha: string | null
          fundamentos: Json | null
          id: string
          match_id: string | null
          mvp_foto: string | null
          mvp_nombre: string | null
          mvp_num: number | null
          mvp_posicion: string | null
          resultado_por_set: Json | null
          rival_errores: number | null
          rival_nombre: string | null
          rival_puntos: number | null
          sets_local: number | null
          sets_visitante: number | null
          torneo: string | null
        }
        Insert: {
          categoria?: string | null
          destacados?: Json | null
          duracion_min?: number | null
          efectividad?: number | null
          equipo_errores?: number | null
          equipo_puntos?: number | null
          fecha?: string | null
          fundamentos?: Json | null
          id: string
          match_id?: string | null
          mvp_foto?: string | null
          mvp_nombre?: string | null
          mvp_num?: number | null
          mvp_posicion?: string | null
          resultado_por_set?: Json | null
          rival_errores?: number | null
          rival_nombre?: string | null
          rival_puntos?: number | null
          sets_local?: number | null
          sets_visitante?: number | null
          torneo?: string | null
        }
        Update: {
          categoria?: string | null
          destacados?: Json | null
          duracion_min?: number | null
          efectividad?: number | null
          equipo_errores?: number | null
          equipo_puntos?: number | null
          fecha?: string | null
          fundamentos?: Json | null
          id?: string
          match_id?: string | null
          mvp_foto?: string | null
          mvp_nombre?: string | null
          mvp_num?: number | null
          mvp_posicion?: string | null
          resultado_por_set?: Json | null
          rival_errores?: number | null
          rival_nombre?: string | null
          rival_puntos?: number | null
          sets_local?: number | null
          sets_visitante?: number | null
          torneo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_reports_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          division_id: string | null
          estado: string | null
          fecha: string | null
          hora: string | null
          id: string
          jornada: string | null
          local: string
          nota: string | null
          parciales: string | null
          sets_local: number | null
          sets_visitante: number | null
          visitante: string
        }
        Insert: {
          division_id?: string | null
          estado?: string | null
          fecha?: string | null
          hora?: string | null
          id: string
          jornada?: string | null
          local: string
          nota?: string | null
          parciales?: string | null
          sets_local?: number | null
          sets_visitante?: number | null
          visitante: string
        }
        Update: {
          division_id?: string | null
          estado?: string | null
          fecha?: string | null
          hora?: string | null
          id?: string
          jornada?: string | null
          local?: string
          nota?: string | null
          parciales?: string | null
          sets_local?: number | null
          sets_visitante?: number | null
          visitante?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          club_id: string | null
          estado: string | null
          foto_url: string | null
          id: string
          nombre: string
          numero_actual: number | null
          numero_nuevo: number | null
          orden: number | null
          posicion: string | null
        }
        Insert: {
          club_id?: string | null
          estado?: string | null
          foto_url?: string | null
          id: string
          nombre: string
          numero_actual?: number | null
          numero_nuevo?: number | null
          orden?: number | null
          posicion?: string | null
        }
        Update: {
          club_id?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          nombre?: string
          numero_actual?: number | null
          numero_nuevo?: number | null
          orden?: number | null
          posicion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      report_players: {
        Row: {
          ata: number | null
          bloq: number | null
          cata: number | null
          def: number | null
          err: number | null
          id: number
          mas_menos: number | null
          nombre: string | null
          num: number | null
          rating: number | null
          rec: number | null
          report_id: string | null
          saq: number | null
        }
        Insert: {
          ata?: number | null
          bloq?: number | null
          cata?: number | null
          def?: number | null
          err?: number | null
          id?: never
          mas_menos?: number | null
          nombre?: string | null
          num?: number | null
          rating?: number | null
          rec?: number | null
          report_id?: string | null
          saq?: number | null
        }
        Update: {
          ata?: number | null
          bloq?: number | null
          cata?: number | null
          def?: number | null
          err?: number | null
          id?: never
          mas_menos?: number | null
          nombre?: string | null
          num?: number | null
          rating?: number | null
          rec?: number | null
          report_id?: string | null
          saq?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "report_players_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "match_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      standings: {
        Row: {
          division_id: string | null
          ds: number | null
          equipo: string
          id: number
          pg: number | null
          pj: number | null
          pos: number | null
          pp: number | null
          psc: number | null
          psf: number | null
          pts: number | null
          rp: number | null
          rs: number | null
          sc: number | null
          sf: number | null
        }
        Insert: {
          division_id?: string | null
          ds?: number | null
          equipo: string
          id?: never
          pg?: number | null
          pj?: number | null
          pos?: number | null
          pp?: number | null
          psc?: number | null
          psf?: number | null
          pts?: number | null
          rp?: number | null
          rs?: number | null
          sc?: number | null
          sf?: number | null
        }
        Update: {
          division_id?: string | null
          ds?: number | null
          equipo?: string
          id?: never
          pg?: number | null
          pj?: number | null
          pos?: number | null
          pp?: number | null
          psc?: number | null
          psf?: number | null
          pts?: number | null
          rp?: number | null
          rs?: number | null
          sc?: number | null
          sf?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      replace_division_standings: {
        Args: { p_actualizado: string; p_division_id: string; p_rows: Json }
        Returns: undefined
      }
      replace_report_players: {
        Args: { p_report_id: string; p_rows: Json }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
