// Deno Deploy Edge Function: pagamentos
// Returns payments summary for the authenticated user

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentsResumeRow {
  id: string;
  user_id: string;
  period_start: string; // date
  period_end: string;   // date
  valor_base: number;
  pagar: number;
  comissao: number;
  premio: number;
  saldo_cef: number;
  outras: number;
  adiantamento: number;
  antecipacao: number;
  distrato: number;
  outros_desc: number;
  saldo_permuta: number;
  saldo_neg_periodos_anteriores: number;
}

interface ApiResponse {
  period_start: string;
  period_end: string;
  receita: {
    valor_base: number;
    pagar: number;
    comissao: number;
    premio: number;
    saldo_cef: number;
    outras: number;
  };
  descontos: {
    adiantamento: number;
    antecipacao: number;
    distrato: number;
    outros: number; // mapped from outros_desc
    saldo_permuta: number;
    saldo_neg_periodos_anteriores: number;
  };
  saldo_negativo_total: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userId = authData.user.id;

    // Get the most recent payments_resume record for the user
    const { data, error } = await supabase
      .from("payments_resume")
      .select("*")
      .eq("user_id", userId)
      .order("period_end", { ascending: false })
      .limit(1);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const row: PaymentsResumeRow | undefined = data?.[0];

    if (!row) {
      // No data yet for user – return zeros with empty period
      const empty: ApiResponse = {
        period_start: "",
        period_end: "",
        receita: {
          valor_base: 0,
          pagar: 0,
          comissao: 0,
          premio: 0,
          saldo_cef: 0,
          outras: 0,
        },
        descontos: {
          adiantamento: 0,
          antecipacao: 0,
          distrato: 0,
          outros: 0,
          saldo_permuta: 0,
          saldo_neg_periodos_anteriores: 0,
        },
        saldo_negativo_total: 0,
      };

      return new Response(JSON.stringify(empty), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const response: ApiResponse = {
      period_start: row.period_start,
      period_end: row.period_end,
      receita: {
        valor_base: Number(row.valor_base || 0),
        pagar: Number(row.pagar || 0),
        comissao: Number(row.comissao || 0),
        premio: Number(row.premio || 0),
        saldo_cef: Number(row.saldo_cef || 0),
        outras: Number(row.outras || 0),
      },
      descontos: {
        adiantamento: Number(row.adiantamento || 0),
        antecipacao: Number(row.antecipacao || 0),
        distrato: Number(row.distrato || 0),
        outros: Number(row.outros_desc || 0),
        saldo_permuta: Number(row.saldo_permuta || 0),
        saldo_neg_periodos_anteriores: Number(row.saldo_neg_periodos_anteriores || 0),
      },
      saldo_negativo_total: Number(row.adiantamento || 0)
        + Number(row.antecipacao || 0)
        + Number(row.distrato || 0)
        + Number(row.outros_desc || 0)
        + Number(row.saldo_permuta || 0)
        + Number(row.saldo_neg_periodos_anteriores || 0),
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("Unexpected error in pagamentos function", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
