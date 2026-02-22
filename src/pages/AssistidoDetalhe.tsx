import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getAssistido, updateAssistido } from "@/firebase/assistidos";
import {
  getAtendimentosByAssistido,
  createAtendimento,
  updateAtendimento,
} from "@/firebase/atendimentos";
import { getAvaliacoesByAssistido } from "@/firebase/avaliacoes";
import { getTerapias } from "@/firebase/terapias";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Assistido {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
  dataInicio: string;
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

interface Terapia {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export default function AssistidoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assistido, setAssistido] = useState<Assistido | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [terapias, setTerapias] = useState<Terapia[]>([]);
  const [loading, setLoading] = useState(true);
  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [isSavingObservacoes, setIsSavingObservacoes] = useState(false);

  // Estados para o dialog de sessão
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessaoEdit, setSessaoEdit] = useState<{
    terapiaNome: string;
    atendimentoId: string | null;
    sessaoIndex: number;
    sessao: Sessao | null;
  } | null>(null);
  const [dataTemporaria, setDataTemporaria] = useState("");
  const [observacoesTemporaria, setObservacoesTemporaria] = useState("");
  const [presenteTemporario, setPresenteTemporario] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      // Carregar assistido primeiro (essencial)
      const assistidoData = await getAssistido(id);
      setAssistido(assistidoData as Assistido);
      setObservacoesGerais(assistidoData?.observacoes || "");

      // Carregar terapias (essencial)
      const terapiasData = await getTerapias();
      setTerapias(terapiasData as Terapia[]);

      // Carregar atendimentos e avaliações de forma independente
      // Se falhar, não afeta o carregamento do assistido
      try {
        const atendimentosData = await getAtendimentosByAssistido(id);
        setAtendimentos(atendimentosData as Atendimento[]);
      } catch (error) {
        console.warn("Erro ao carregar atendimentos:", error);
        setAtendimentos([]);
      }

      try {
        const avaliacoesData = await getAvaliacoesByAssistido(id);
        setAvaliacoes(avaliacoesData as Avaliacao[]);
      } catch (error) {
        console.warn("Erro ao carregar avaliações:", error);
        setAvaliacoes([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados essenciais:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Circle;
  };

  const handleClickSessao = (
    terapiaNome: string,
    atendimentoId: string | null,
    sessaoIndex: number,
    sessao: Sessao | null,
  ) => {
    setSessaoEdit({ terapiaNome, atendimentoId, sessaoIndex, sessao });
    setDataTemporaria(sessao?.data || new Date().toISOString().split("T")[0]);
    setObservacoesTemporaria(sessao?.observacoes || "");
    setPresenteTemporario(sessao?.presente || false);
    setDialogOpen(true);
  };

  const handleSalvarSessao = async () => {
    if (!id || !sessaoEdit) return;

    try {
      let atendimentoId = sessaoEdit.atendimentoId;

      // Se não existe atendimento, criar um novo
      if (!atendimentoId) {
        atendimentoId = await createAtendimento({
          assistidoId: id,
          terapeutaId: user?.uid || "sistema",
          tipoTerapia: sessaoEdit.terapiaNome,
        });
      }

      // Buscar o atendimento atual
      const atendimentoAtual = atendimentos.find((a) => a.id === atendimentoId);
      const sessoesAtualizadas =
        atendimentoAtual?.sessoes ||
        Array.from({ length: 10 }, (_, i) => ({
          numero: i + 1,
          data: null,
          presente: false,
          observacoes: "",
        }));

      // Atualizar a sessão específica
      sessoesAtualizadas[sessaoEdit.sessaoIndex] = {
        numero: sessaoEdit.sessaoIndex + 1,
        data: dataTemporaria,
        presente: presenteTemporario,
        observacoes: observacoesTemporaria,
      };

      // Atualizar no Firebase
      await updateAtendimento(atendimentoId, {
        sessoes: sessoesAtualizadas,
      });

      toast({
        title: "Sucesso",
        description: "Sessão atualizada com sucesso.",
      });

      // Recarregar dados
      await loadData();
      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a sessão.",
        variant: "destructive",
      });
    }
  };

  const handleSalvarObservacoes = async () => {
    if (!id) return;

    setIsSavingObservacoes(true);
    try {
      await updateAssistido(id, {
        observacoes: observacoesGerais,
      });

      toast({
        title: "Sucesso",
        description: "Observações salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar observações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as observações.",
        variant: "destructive",
      });
    } finally {
      setIsSavingObservacoes(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Carregando...</div>
      </DashboardLayout>
    );
  }

  if (!assistido) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Assistido não encontrado.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {assistido.nome}
            </h1>
            <p className="text-sm text-muted-foreground">
              Início:{" "}
              {new Date(assistido.dataInicio).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <Badge
            variant={assistido.status === "Ativo" ? "default" : "secondary"}
            className="ml-auto"
          >
            {assistido.status}
          </Badge>
        </div>

        {/* Ficha de Atividades */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Ficha de Atividades
          </h2>
          <div className="space-y-4">
            {terapias.map((terapia) => {
              const atendimento = atendimentos.find(
                (a) => a.tipoTerapia === terapia.nome,
              );
              const sessoes = atendimento?.sessoes || [];
              const totalPresencas = sessoes.filter((s) => s.presente).length;
              const IconComponent = getIconComponent(terapia.icone);

              return (
                <Card key={terapia.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${terapia.cor} flex items-center justify-center text-lg`}
                        >
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-base font-semibold">
                          {terapia.nome}
                        </CardTitle>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Nº de sessões:{" "}
                        <strong className="text-foreground">
                          {totalPresencas}
                        </strong>
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }, (_, i) => {
                        const sessao = sessoes[i];
                        const presente = sessao?.presente;
                        return (
                          <div
                            key={i}
                            onClick={() =>
                              handleClickSessao(
                                terapia.nome,
                                atendimento?.id || null,
                                i,
                                sessao || null,
                              )
                            }
                            className={`flex flex-col items-center p-2 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                              presente
                                ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                                : "bg-muted/30 border-border/50 hover:bg-muted/50"
                            }`}
                          >
                            <span className="text-xs font-bold text-muted-foreground">
                              {i + 1}ª
                            </span>
                            {presente ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-primary my-1" />
                                <span className="text-[10px] text-muted-foreground">
                                  {sessao?.data
                                    ? new Date(sessao.data).toLocaleDateString(
                                        "pt-BR",
                                        { day: "2-digit", month: "2-digit" },
                                      )
                                    : ""}
                                </span>
                              </>
                            ) : (
                              <Circle className="h-5 w-5 text-border my-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Avaliações */}
        {avaliacoes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Avaliações de Evolução
            </h2>
            <div className="space-y-3">
              {avaliacoes.map((av) => (
                <Card key={av.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">
                        {av.tipoTerapia}
                      </span>
                      <Badge
                        variant={
                          av.statusEvolucao === "Melhora"
                            ? "default"
                            : av.statusEvolucao === "Piora"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {av.statusEvolucao}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {av.observacoes}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {av.encaminhamentos.map((e, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(av.dataAvaliacao).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Observações Gerais */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Observações Gerais
          </h2>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <Textarea
                placeholder="Adicione observações gerais sobre o assistido (opcional)..."
                value={observacoesGerais}
                onChange={(e) => setObservacoesGerais(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleSalvarObservacoes}
                  disabled={isSavingObservacoes}
                >
                  {isSavingObservacoes ? "Salvando..." : "Salvar Observações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog para editar sessão */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {sessaoEdit &&
                  `${sessaoEdit.terapiaNome} - ${sessaoEdit.sessaoIndex + 1}ª Sessão`}
              </DialogTitle>
              <DialogDescription>
                Registre a presença e adicione informações sobre esta sessão.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="presente"
                  checked={presenteTemporario}
                  onChange={(e) => setPresenteTemporario(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="presente">Marcar como presente</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data da sessão</Label>
                <Input
                  id="data"
                  type="date"
                  value={dataTemporaria}
                  onChange={(e) => setDataTemporaria(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione observações sobre esta sessão..."
                  value={observacoesTemporaria}
                  onChange={(e) => setObservacoesTemporaria(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarSessao}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
