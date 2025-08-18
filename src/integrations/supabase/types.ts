export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      brindes: {
        Row: {
          cliente_cpf: string
          cliente_nome: string
          codigo_usado: string | null
          corretor_nome: string
          created_at: string
          data_validacao: string | null
          id: string
          pesquisa_satisfacao_id: string | null
          tipo_brinde: string
          validado: boolean | null
          visit_id: string | null
        }
        Insert: {
          cliente_cpf: string
          cliente_nome: string
          codigo_usado?: string | null
          corretor_nome: string
          created_at?: string
          data_validacao?: string | null
          id?: string
          pesquisa_satisfacao_id?: string | null
          tipo_brinde: string
          validado?: boolean | null
          visit_id?: string | null
        }
        Update: {
          cliente_cpf?: string
          cliente_nome?: string
          codigo_usado?: string | null
          corretor_nome?: string
          created_at?: string
          data_validacao?: string | null
          id?: string
          pesquisa_satisfacao_id?: string | null
          tipo_brinde?: string
          validado?: boolean | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brindes_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_fotos: {
        Row: {
          checklist_item_id: string | null
          created_at: string | null
          foto_url: string
          id: string
          nome_arquivo: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          created_at?: string | null
          foto_url: string
          id?: string
          nome_arquivo?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          created_at?: string | null
          foto_url?: string
          id?: string
          nome_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_fotos_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_itens: {
        Row: {
          ambiente: string
          created_at: string | null
          fotos: string[] | null
          id: string
          item_nome: string
          observacao: string | null
          status: string
          updated_at: string | null
          vistoria_id: string | null
        }
        Insert: {
          ambiente: string
          created_at?: string | null
          fotos?: string[] | null
          id?: string
          item_nome: string
          observacao?: string | null
          status?: string
          updated_at?: string | null
          vistoria_id?: string | null
        }
        Update: {
          ambiente?: string
          created_at?: string | null
          fotos?: string[] | null
          id?: string
          item_nome?: string
          observacao?: string | null
          status?: string
          updated_at?: string | null
          vistoria_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_itens_vistoria_id_fkey"
            columns: ["vistoria_id"]
            isOneToOne: false
            referencedRelation: "vistorias"
            referencedColumns: ["id"]
          },
        ]
      }
      corretor_links: {
        Row: {
          ativo: boolean
          corretor_id: string
          created_at: string
          id: string
          titulo: string
          token: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          corretor_id: string
          created_at?: string
          id?: string
          titulo?: string
          token: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          corretor_id?: string
          created_at?: string
          id?: string
          titulo?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      empreendimentos: {
        Row: {
          address: string | null
          created_at: string
          id: string
          idobra: string | null
          nome: string
          project_status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          idobra?: string | null
          nome: string
          project_status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          idobra?: string | null
          nome?: string
          project_status?: string | null
        }
        Relationships: []
      }
      faq_articles: {
        Row: {
          category_id: string
          content: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          keywords: string[] | null
          slug: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          keywords?: string[] | null
          slug?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          keywords?: string[] | null
          slug?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_uploads: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      lista_espera: {
        Row: {
          cliente_cpf: string
          cliente_nome: string
          cliente_whatsapp: string | null
          corretor_id: string | null
          corretor_nome: string | null
          created_at: string
          empreendimento: string | null
          id: string
          loja: string
          status: string
          updated_at: string
        }
        Insert: {
          cliente_cpf?: string
          cliente_nome: string
          cliente_whatsapp?: string | null
          corretor_id?: string | null
          corretor_nome?: string | null
          created_at?: string
          empreendimento?: string | null
          id?: string
          loja: string
          status?: string
          updated_at?: string
        }
        Update: {
          cliente_cpf?: string
          cliente_nome?: string
          cliente_whatsapp?: string | null
          corretor_id?: string | null
          corretor_nome?: string | null
          created_at?: string
          empreendimento?: string | null
          id?: string
          loja?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author_id: string
          author_name: string
          category_id: string
          content: string
          created_at: string
          description: string
          featured_image_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          author_name: string
          category_id: string
          content: string
          created_at?: string
          description: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          author_name?: string
          category_id?: string
          content?: string
          created_at?: string
          description?: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string | null
          id: number
          observacoes: string | null
          total_corretor: number
          total_gerente: number
          total_super: number
          unidade: string
          vendedor: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          observacoes?: string | null
          total_corretor: number
          total_gerente: number
          total_super: number
          unidade: string
          vendedor: string
        }
        Update: {
          created_at?: string | null
          id?: number
          observacoes?: string | null
          total_corretor?: number
          total_gerente?: number
          total_super?: number
          unidade?: string
          vendedor?: string
        }
        Relationships: []
      }
      pesquisas_satisfacao: {
        Row: {
          avaliacao_experiencia: string | null
          codigo_validacao: string
          comprou_empreendimento: boolean | null
          corretor_nome: string | null
          cpf: string
          created_at: string
          dicas_sugestoes: string | null
          email: string
          empreendimento_adquirido: string | null
          empreendimento_interesse: string | null
          id: string
          nome_completo: string
          nota_consultor: number | null
          onde_conheceu: string | null
          validado: boolean | null
        }
        Insert: {
          avaliacao_experiencia?: string | null
          codigo_validacao: string
          comprou_empreendimento?: boolean | null
          corretor_nome?: string | null
          cpf: string
          created_at?: string
          dicas_sugestoes?: string | null
          email: string
          empreendimento_adquirido?: string | null
          empreendimento_interesse?: string | null
          id?: string
          nome_completo: string
          nota_consultor?: number | null
          onde_conheceu?: string | null
          validado?: boolean | null
        }
        Update: {
          avaliacao_experiencia?: string | null
          codigo_validacao?: string
          comprou_empreendimento?: boolean | null
          corretor_nome?: string | null
          cpf?: string
          created_at?: string
          dicas_sugestoes?: string | null
          email?: string
          empreendimento_adquirido?: string | null
          empreendimento_interesse?: string | null
          id?: string
          nome_completo?: string
          nota_consultor?: number | null
          onde_conheceu?: string | null
          validado?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cover_url: string | null
          cpf: string
          created_at: string | null
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          cover_url?: string | null
          cpf: string
          created_at?: string | null
          id: string
          name: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          cover_url?: string | null
          cpf?: string
          created_at?: string | null
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          corretor_cpf: string | null
          id: number
          idobra: number
          sinal: number | null
          status: string
          unidade: string | null
          venda_data: string
        }
        Insert: {
          corretor_cpf?: string | null
          id?: number
          idobra: number
          sinal?: number | null
          status: string
          unidade?: string | null
          venda_data: string
        }
        Update: {
          corretor_cpf?: string | null
          id?: number
          idobra?: number
          sinal?: number | null
          status?: string
          unidade?: string | null
          venda_data?: string
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          created_at: string
          id: string
          results_count: number | null
          search_term: string
          user_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          results_count?: number | null
          search_term: string
          user_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          results_count?: number | null
          search_term?: string
          user_ip?: string | null
        }
        Relationships: []
      }
      unidades: {
        Row: {
          bloco: string
          created_at: string | null
          data_limpeza_agendada: string | null
          empreendimento_id: string | null
          id: string
          metragem: number | null
          numero: string
          status: string
          status_limpeza: string | null
          tipologia: string | null
          updated_at: string | null
        }
        Insert: {
          bloco: string
          created_at?: string | null
          data_limpeza_agendada?: string | null
          empreendimento_id?: string | null
          id?: string
          metragem?: number | null
          numero: string
          status?: string
          status_limpeza?: string | null
          tipologia?: string | null
          updated_at?: string | null
        }
        Update: {
          bloco?: string
          created_at?: string | null
          data_limpeza_agendada?: string | null
          empreendimento_id?: string | null
          id?: string
          metragem?: number | null
          numero?: string
          status?: string
          status_limpeza?: string | null
          tipologia?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unidades_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          apelido: string
          cpf: string
          created_at: string | null
          gerente: string
          id: string
          name: string
          role: string
          superintendente: string
        }
        Insert: {
          apelido: string
          cpf: string
          created_at?: string | null
          gerente: string
          id?: string
          name: string
          role: string
          superintendente: string
        }
        Update: {
          apelido?: string
          cpf?: string
          created_at?: string | null
          gerente?: string
          id?: string
          name?: string
          role?: string
          superintendente?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          andar: string
          cliente_cpf: string
          cliente_nome: string
          cliente_whatsapp: string | null
          corretor_id: string
          corretor_nome: string
          created_at: string | null
          empreendimento: string | null
          horario_entrada: string | null
          horario_saida: string | null
          id: string
          loja: string
          mesa: number
          status: string | null
        }
        Insert: {
          andar: string
          cliente_cpf: string
          cliente_nome: string
          cliente_whatsapp?: string | null
          corretor_id: string
          corretor_nome: string
          created_at?: string | null
          empreendimento?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          loja: string
          mesa: number
          status?: string | null
        }
        Update: {
          andar?: string
          cliente_cpf?: string
          cliente_nome?: string
          cliente_whatsapp?: string | null
          corretor_id?: string
          corretor_nome?: string
          created_at?: string | null
          empreendimento?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          loja?: string
          mesa?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_corretor_id_fkey"
            columns: ["corretor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vistorias: {
        Row: {
          created_at: string | null
          data_vistoria: string | null
          id: string
          observacoes: string | null
          status_final: string | null
          unidade_id: string | null
          updated_at: string | null
          vistoriador_id: string | null
          vistoriador_nome: string | null
        }
        Insert: {
          created_at?: string | null
          data_vistoria?: string | null
          id?: string
          observacoes?: string | null
          status_final?: string | null
          unidade_id?: string | null
          updated_at?: string | null
          vistoriador_id?: string | null
          vistoriador_nome?: string | null
        }
        Update: {
          created_at?: string | null
          data_vistoria?: string | null
          id?: string
          observacoes?: string | null
          status_final?: string | null
          unidade_id?: string | null
          updated_at?: string | null
          vistoriador_id?: string | null
          vistoriador_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vistorias_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      resume: {
        Row: {
          adiantamento: number | null
          antecipacao: number | null
          comissao: number | null
          cpf: string | null
          created_at: string | null
          distrato: number | null
          id: string | null
          outras: number | null
          outros: number | null
          pagar: number | null
          premio: number | null
          saldo_cef: number | null
          saldo_neg_periodos_anteriores: number | null
          saldo_permuta: number | null
          user_id: string | null
          valor_base: number | null
        }
        Insert: {
          adiantamento?: number | null
          antecipacao?: number | null
          comissao?: number | null
          cpf?: string | null
          created_at?: string | null
          distrato?: number | null
          id?: string | null
          outras?: number | null
          outros?: number | null
          pagar?: number | null
          premio?: number | null
          saldo_cef?: number | null
          saldo_neg_periodos_anteriores?: number | null
          saldo_permuta?: number | null
          user_id?: string | null
          valor_base?: number | null
        }
        Update: {
          adiantamento?: number | null
          antecipacao?: number | null
          comissao?: number | null
          cpf?: string | null
          created_at?: string | null
          distrato?: number | null
          id?: string | null
          outras?: number | null
          outros?: number | null
          pagar?: number | null
          premio?: number | null
          saldo_cef?: number | null
          saldo_neg_periodos_anteriores?: number | null
          saldo_permuta?: number | null
          user_id?: string | null
          valor_base?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_resume_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_cpf_fk"
            columns: ["cpf"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["cpf"]
          },
        ]
      }
      base_de_vendas: {
        Row: {
          id: number
          data_do_contrato: string
          tipo_venda: string
          data_sicaq: string | null
          data_pagto: string | null
          cliente: string
          empreendimento: string
          bl: string | null
          unid: string
          vlr_tabela: number
          vlr_venda: number
          perc_desconto: number | null
          vlr_contrato: number
          fluxo: number | null
          entrada: number | null
          recebido: number | null
          receber: number | null
          c_credito_baixada: number | null
          c_credito_em_aberto: number | null
          c_desconto_baixada: number | null
          c_desconto_em_aberto: number | null
          recebido_de_sinal: number | null
          perc_sinal_recebido: number | null
          assinatura_cef: string | null
          origem: string | null
          vendedor_parceiro: string | null
          supervisor_coord_parceiro: string | null
          gerente: string | null
          superintendente: string | null
          diretor: string | null
          comissao_sinal_perc: number | null
          comissao_vgv_pre_chaves_perc: number | null
          comissao_extra_perc: number | null
          comissao_integral_sinal: number | null
          comissao_integral_vgv_pre_chaves: number | null
          comissao_integral_extra: number | null
          sinal_comissao_extra_vendedor: number | null
          created_at: string
        }
      }
      v_comissoes: {
        Row: {
          apelido: string | null
          corretor: string | null
          empreendimento: string | null
          gerente: string | null
          superintendente: string | null
          total_corretor: number | null
          total_gerente: number | null
          total_super: number | null
          unidade: string | null
          venda_data: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      buscar_cliente_por_cpf: {
        Args: { p_cpf: string }
        Returns: {
          nome: string
          cpf: string
          whatsapp: string
          ultima_visita: string
          total_visitas: number
        }[]
      }
      check_mesa_disponivel: {
        Args: { p_loja: string; p_andar: string; p_mesa: number }
        Returns: boolean
      }
      check_tempo_espera: {
        Args: { created_time: string }
        Returns: boolean
      }
      finalizar_visita: {
        Args: { visit_id: string }
        Returns: undefined
      }
      fix_user_relations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gerar_link_corretor: {
        Args: { corretor_uuid: string; link_titulo?: string }
        Returns: string
      }
      get_champions_ranking: {
        Args: {
          ranking_type?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          user_id: string
          name: string
          nickname: string
          sales_count: number
          revenue: number
          visits_count: number
          contracts_count: number
          avatar_url: string
          role: string
          total_count: number
        }[]
      }
      get_champions_ranking_optimized: {
        Args: {
          ranking_type?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          user_id: string
          name: string
          nickname: string
          sales_count: number
          revenue: number
          visits_count: number
          contracts_count: number
          avatar_url: string
          role: string
          total_count: number
        }[]
      }
      get_corretor_stats: {
        Args: { corretor_uuid: string }
        Returns: {
          total_visitas: number
          visitas_ativas: number
          visitas_hoje: number
          tempo_medio_minutos: number
          agendamentos_confirmados: number
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_visitas_hoje: number
          visitas_ativas: number
          visitas_finalizadas_hoje: number
          mesas_ocupadas: number
        }[]
      }
      get_dashboard_stats_filtered: {
        Args: {
          start_date?: string
          end_date?: string
          superintendente?: string
        }
        Returns: {
          total_visitas_hoje: number
          visitas_ativas: number
          visitas_finalizadas_hoje: number
          mesas_ocupadas: number
          clientes_lista_espera: number
        }[]
      }
      get_profile_stats: {
        Args: { user_uuid: string }
        Returns: {
          user_id: string
          user_name: string
          user_apelido: string
          user_cpf: string
          user_gerente: string
          user_superintendente: string
          user_role: string
          avatar_url: string
          cover_url: string
          vendas_count: number
          recebimento: number
          contratos_count: number
          visitas_count: number
          ranking_position: number
          total_users: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      search_faq_articles: {
        Args: { search_term: string }
        Returns: {
          id: string
          category_id: string
          category_name: string
          title: string
          content: string
          relevance: number
        }[]
      }
      validate_cpf_and_create_profile: {
        Args: { user_cpf: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
