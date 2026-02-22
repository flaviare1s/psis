import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarCheck, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTerapias } from "@/firebase/terapias";
import { getAtendimentos } from "@/firebase/atendimentos";
import { getAvaliacoes } from "@/firebase/avaliacoes";
import { getAssistidos } from "@/firebase/assistidos";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Terapia {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

interface Sessao {
  numero: number;
  data: string | null;
  presente: boolean;
  observacoes: string;
}

interface Atendimento {
  id: string;
  assistidoId: string;
  terapeutaId: string;
  tipoTerapia: string;
  sessoes: Sessao[];
  criadoEm: string;
  atualizadoEm?: string;
}

interface Avaliacao {
  id: string;
  assistidoId: string;
  tipoTerapia: string;
  statusEvolucao: "Melhora" | "Estável" | "Piora";
  dataAvaliacao: string;
  observacoes: string;
  encaminhamentos: string[];
}

interface Assistido {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
}

export default function TerapiaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [terapia, setTerapia] = useState<Terapia | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [terapiasData, atendimentosData, avaliacoesData, assistidosData] =
        await Promise.all([
          getTerapias(),
          getAtendimentos(),
          getAvaliacoes(),
          getAssistidos(),
        ]);

      const terapiaEncontrada = (terapiasData as Terapia[]).find(
        (t) => t.id === id,
      );

      if (!terapiaEncontrada) {
        toast({
          title: "Erro",
          description: "Terapia não encontrada",
          variant: "destructive",
        });
        navigate("/terapias");
        return;
      }

      setTerapia(terapiaEncontrada);

      // Filtrar atendimentos e avaliações dessa terapia
      const atendimentosFiltrados = atendimentosData.filter(
        (a) => a.tipoTerapia === terapiaEncontrada.nome,
      );
      const avaliacoesFiltradas = avaliacoesData.filter(
        (a) => a.tipoTerapia === terapiaEncontrada.nome,
      );

      setAtendimentos(atendimentosFiltrados);
      setAvaliacoes(avaliacoesFiltradas);
      setAssistidos(assistidosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da terapia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Carregando...</div>
      </DashboardLayout>
    );
  }

  if (!terapia) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Terapia não encontrada</div>
      </DashboardLayout>
    );
  }

  // Calcular métricas
  const totalAvaliacoes = avaliacoes.length;

  // Pacientes únicos atendidos
  const pacientesUnicos = new Set(atendimentos.map((a) => a.assistidoId));
  const totalPacientes = pacientesUnicos.size;

  // Total de sessões realizadas (apenas sessões com data preenchida)
  const totalAtendimentos = atendimentos.reduce(
    (acc, atendimento) =>
      acc + atendimento.sessoes.filter((s) => s.data !== null).length,
    0,
  );

  // Avaliações por status
  const avaliacoesMelhora = avaliacoes.filter(
    (a) => a.statusEvolucao === "Melhora",
  ).length;
  const avaliacoesEstavel = avaliacoes.filter(
    (a) => a.statusEvolucao === "Estável",
  ).length;
  const avaliacoesPiora = avaliacoes.filter(
    (a) => a.statusEvolucao === "Piora",
  ).length;

  // Dados para o gráfico de pizza
  const chartData = [
    { name: "Melhora", value: avaliacoesMelhora, color: "#22c55e" },
    { name: "Estável", value: avaliacoesEstavel, color: "#eab308" },
    { name: "Piora", value: avaliacoesPiora, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const stats = [
    {
      label: "Total de Atendimentos",
      value: totalAtendimentos,
      icon: CalendarCheck,
      color: "text-blue-500",
    },
    {
      label: "Pacientes Atendidos",
      value: totalPacientes,
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Total de Avaliações",
      value: totalAvaliacoes,
      icon: TrendingUp,
      color: "text-indigo-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {terapia.nome}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} opacity-80 flex-shrink-0`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de Avaliações */}
        {totalAvaliacoes > 0 ? (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Distribuição de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Avaliações</CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Não há avaliações registradas para esta terapia
              </p>
            </CardContent>
          </Card>
        )}

        {/* Atendimentos Recentes */}
        {atendimentos.length > 0 ? (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Atendimentos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {atendimentos.map((atendimento) => {
                  const assistido = assistidos.find(
                    (a) => a.id === atendimento.assistidoId,
                  );
                  const numSessoes = atendimento.sessoes.filter(
                    (s) => s.data !== null,
                  ).length;
                  return (
                    <div
                      key={atendimento.id}
                      className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/assistidos/${atendimento.assistidoId}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {assistido?.nome || "Assistido não encontrado"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {numSessoes}{" "}
                            {numSessoes === 1 ? "sessão" : "sessões"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(atendimento.criadoEm).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Atendimentos</CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Não há atendimentos registrados para esta terapia
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
