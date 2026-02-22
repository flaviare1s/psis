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

const CHART_COLORS = [
  "hsl(145,45%,32%)",
  "hsl(280,50%,55%)",
  "hsl(200,70%,45%)",
  "hsl(35,85%,55%)",
  "hsl(170,50%,42%)",
];

export default function Metricas() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [assistidos, setAssistidos] = useState<any[]>([]);
  const [terapias, setTerapias] = useState<any[]>([]);
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

  const atendimentosPorTerapia = terapias.map((t, i) => ({
    nome: t.nome.split(" ")[0],
    atendimentos: atendimentos.filter((a) => a.tipoTerapia === t.nome).length,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const evolucaoData = [
    {
      status: "Melhora",
      count: avaliacoes.filter((a) => a.statusEvolucao === "Melhora").length,
    },
    {
      status: "Estável",
      count: avaliacoes.filter((a) => a.statusEvolucao === "Estável").length,
    },
    {
      status: "Piora",
      count: avaliacoes.filter((a) => a.statusEvolucao === "Piora").length,
    },
  ];
  const pieColors = ["hsl(145,60%,40%)", "hsl(35,85%,55%)", "hsl(0,72%,51%)"];

  const totalSessoes = atendimentos.reduce(
    (acc, at) => acc + at.sessoes.filter((s: any) => s.presente).length,
    0,
  );

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
                {assistidos.filter((a: any) => a.status === "Ativo").length}
              </p>
              <p className="text-sm text-muted-foreground">Assistidos Ativos</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{totalSessoes}</p>
              <p className="text-sm text-muted-foreground">Total de Sessões</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {avaliacoes.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Avaliações Realizadas
              </p>
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
