import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAtendimentos } from "@/firebase/atendimentos";
import { getAvaliacoes } from "@/firebase/avaliacoes";
import { getAssistidos } from "@/firebase/assistidos";
import { getTerapias } from "@/firebase/terapias";

interface Assistido {
  status: string;
  [key: string]: string | number | boolean | null;
}

interface Atendimento {
  tipoTerapia: string;
  sessoes: Array<{ presente: boolean; data: string }>;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Array<{ presente: boolean; data: string }>;
}

interface Avaliacao {
  statusEvolucao: string;
  [key: string]: string | number | boolean | null;
}

interface Terapia {
  nome: string;
  [key: string]: string | number | boolean | null;
}

const CHART_COLORS = [
  "hsl(145,45%,32%)",
  "hsl(280,50%,55%)",
  "hsl(200,70%,45%)",
  "hsl(35,85%,55%)",
  "hsl(170,50%,42%)",
];

export default function Metricas() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [terapias, setTerapias] = useState<Terapia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [atendimentosData, avaliacoesData, assistidosData, terapiasData] =
        await Promise.all([
          getAtendimentos(),
          getAvaliacoes(),
          getAssistidos(),
          getTerapias(),
        ]);

      setAtendimentos(atendimentosData);
      setAvaliacoes(avaliacoesData);
      setAssistidos(assistidosData);
      setTerapias(terapiasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const atendimentosPorTerapia = terapias.map((t: Terapia, i) => ({
    nome: t.nome.split(" ")[0],
    atendimentos: atendimentos.filter(
      (a: Atendimento) => a.tipoTerapia === t.nome,
    ).length,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const evolucaoData = [
    {
      status: "Melhora",
      count: avaliacoes.filter((a: Avaliacao) => a.statusEvolucao === "Melhora")
        .length,
    },
    {
      status: "Estável",
      count: avaliacoes.filter((a: Avaliacao) => a.statusEvolucao === "Estável")
        .length,
    },
    {
      status: "Piora",
      count: avaliacoes.filter((a: Avaliacao) => a.statusEvolucao === "Piora")
        .length,
    },
  ];
  const pieColors = ["hsl(145,60%,40%)", "hsl(35,85%,55%)", "hsl(0,72%,51%)"];

  // Calcular sessões do mês atual
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth(); // 0-11
  const anoAtual = dataAtual.getFullYear();
  const nomeMes = dataAtual.toLocaleDateString("pt-BR", { month: "long" });
  const nomeMesCapitalizado =
    nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  const totalSessoesDoMes = atendimentos.reduce((acc, at: Atendimento) => {
    const sessoesDoMes = at.sessoes.filter(
      (s: { presente: boolean; data: string }) => {
        if (!s.presente || !s.data) return false;
        const dataSessao = new Date(s.data);
        return (
          dataSessao.getMonth() === mesAtual &&
          dataSessao.getFullYear() === anoAtual
        );
      },
    );
    return acc + sessoesDoMes.length;
  }, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Métricas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visão geral da eficácia do programa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {
                  assistidos.filter((a: Assistido) => a.status === "Ativo")
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">Assistidos Ativos</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">
                {totalSessoesDoMes}
              </p>
              <p className="text-sm text-muted-foreground">
                Atendimentos ({nomeMesCapitalizado}/{anoAtual})
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {avaliacoes.length}
              </p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Atendimentos por Terapia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={atendimentosPorTerapia}>
                  <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="atendimentos" radius={[6, 6, 0, 0]}>
                    {atendimentosPorTerapia.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Indicador de Evolução</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {avaliacoes.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={evolucaoData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {evolucaoData.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma avaliação registrada ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
