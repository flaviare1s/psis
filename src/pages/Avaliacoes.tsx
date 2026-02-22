import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAvaliacoes, createAvaliacao } from "@/firebase/avaliacoes";
import { getAssistidos } from "@/firebase/assistidos";
import { getTerapias } from "@/firebase/terapias";
import { useToast } from "@/hooks/use-toast";

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
  status: string;
}

interface Terapia {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [terapias, setTerapias] = useState<Terapia[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const { toast } = useToast();

  // Form states
  const [assistidoId, setAssistidoId] = useState("");
  const [tipoTerapia, setTipoTerapia] = useState("");
  const [statusEvolucao, setStatusEvolucao] = useState<
    "Melhora" | "Estável" | "Piora"
  >("Melhora");
  const [dataAvaliacao, setDataAvaliacao] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [observacoes, setObservacoes] = useState("");
  const [encaminhamentos, setEncaminhamentos] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [avaliacoesData, assistidosData, terapiasData] = await Promise.all([
        getAvaliacoes(),
        getAssistidos(),
        getTerapias(),
      ]);

      setAvaliacoes(avaliacoesData as Avaliacao[]);
      setAssistidos(assistidosData as Assistido[]);
      setTerapias(terapiasData as Terapia[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCadastrar = async () => {
    if (!assistidoId || !tipoTerapia) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createAvaliacao({
        assistidoId,
        tipoTerapia,
        statusEvolucao,
        dataAvaliacao,
        observacoes,
        encaminhamentos: encaminhamentos
          ? encaminhamentos.split(",").map((e) => e.trim())
          : [],
      });

      toast({
        title: "Sucesso",
        description: "Avaliação cadastrada com sucesso.",
      });

      // Limpar form
      setAssistidoId("");
      setTipoTerapia("");
      setStatusEvolucao("Melhora");
      setDataAvaliacao(new Date().toISOString().split("T")[0]);
      setObservacoes("");
      setEncaminhamentos("");
      setOpen(false);

      loadData();
    } catch (error) {
      console.error("Erro ao cadastrar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAssistidoNome = (id: string) => {
    const assistido = assistidos.find((a) => a.id === id);
    return assistido?.nome || "Desconhecido";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Melhora":
        return <TrendingUp className="h-4 w-4" />;
      case "Piora":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Melhora":
        return "default";
      case "Piora":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Ordenar avaliações alfabeticamente por nome do assistido
  const avaliacoesOrdenadas = [...avaliacoes].sort((a, b) => {
    const nomeA = getAssistidoNome(a.assistidoId);
    const nomeB = getAssistidoNome(b.assistidoId);
    return nomeA.localeCompare(nomeB);
  });

  // Paginação
  const totalPages = Math.ceil(avaliacoesOrdenadas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const avaliacoesPaginadas = avaliacoesOrdenadas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Avaliações
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Registre e acompanhe a evolução dos assistidos
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Avaliação</DialogTitle>
                <DialogDescription>
                  Registre a evolução do assistido em uma terapia específica
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assistido">
                      Assistido <span className="text-destructive">*</span>
                    </Label>
                    <Select value={assistidoId} onValueChange={setAssistidoId}>
                      <SelectTrigger id="assistido">
                        <SelectValue placeholder="Selecione o assistido" />
                      </SelectTrigger>
                      <SelectContent>
                        {assistidos
                          .filter((a) => a.status === "Ativo")
                          .map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terapia">
                      Terapia <span className="text-destructive">*</span>
                    </Label>
                    <Select value={tipoTerapia} onValueChange={setTipoTerapia}>
                      <SelectTrigger id="terapia">
                        <SelectValue placeholder="Selecione a terapia" />
                      </SelectTrigger>
                      <SelectContent>
                        {terapias.map((t) => (
                          <SelectItem key={t.id} value={t.nome}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status de Evolução{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={statusEvolucao}
                      onValueChange={(value) =>
                        setStatusEvolucao(
                          value as "Melhora" | "Estável" | "Piora",
                        )
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Melhora">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-success" />
                            <span>Melhora</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Estável">
                          <div className="flex items-center gap-2">
                            <Minus className="h-4 w-4 text-muted-foreground" />
                            <span>Estável</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Piora">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-destructive" />
                            <span>Piora</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">Data da Avaliação</Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataAvaliacao}
                      onChange={(e) => setDataAvaliacao(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Descreva a evolução observada..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encaminhamentos">
                    Encaminhamentos (separados por vírgula)
                  </Label>
                  <Input
                    id="encaminhamentos"
                    placeholder="Ex: Acupuntura, Reiki..."
                    value={encaminhamentos}
                    onChange={(e) => setEncaminhamentos(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCadastrar} disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar Avaliação"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3">
          {avaliacoes.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma avaliação registrada ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {avaliacoesPaginadas.map((av) => (
                <Card
                  key={av.id}
                  className="border-border/50 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <p className="font-semibold text-foreground truncate">
                            {getAssistidoNome(av.assistidoId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {av.tipoTerapia}
                          </p>
                        </div>

                        {av.observacoes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {av.observacoes}
                          </p>
                        )}

                        {av.encaminhamentos.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {av.encaminhamentos.map((enc, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground"
                              >
                                {enc}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          {new Date(av.dataAvaliacao).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>

                      <Badge
                        variant={getStatusVariant(av.statusEvolucao)}
                        className="flex items-center justify-center h-8 w-8 p-0 shrink-0"
                      >
                        {getStatusIcon(av.statusEvolucao)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Legenda */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                  </Badge>
                  <span className="text-muted-foreground">Melhora</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Minus className="h-3 w-3" />
                  </Badge>
                  <span className="text-muted-foreground">Estável</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <TrendingDown className="h-3 w-3" />
                  </Badge>
                  <span className="text-muted-foreground">Piora</span>
                </div>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
