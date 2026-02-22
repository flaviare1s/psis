import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getAssistidos, createAssistido } from "@/firebase/assistidos";
import { getAtendimentosByAssistido } from "@/firebase/atendimentos";
import { useToast } from "@/hooks/use-toast";

interface Assistido {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
  dataInicio: string;
}

export default function Assistidos() {
  const [busca, setBusca] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [open, setOpen] = useState(false);
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [atendimentosCount, setAtendimentosCount] = useState<
    Record<string, number>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAssistidos();
  }, []);

  const loadAssistidos = async () => {
    try {
      const data = await getAssistidos();
      setAssistidos(data as Assistido[]);

      // Carregar contagem de atendimentos para cada assistido
      const counts: Record<string, number> = {};
      for (const assistido of data) {
        const atendimentos = await getAtendimentosByAssistido(assistido.id);
        counts[assistido.id] = atendimentos.length;
      }
      setAtendimentosCount(counts);
    } catch (error) {
      console.error("Erro ao carregar assistidos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os assistidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = async () => {
    if (!novoNome.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do assistido.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createAssistido({ nome: novoNome });
      toast({
        title: "Sucesso",
        description: "Assistido cadastrado com sucesso.",
      });
      setNovoNome("");
      setOpen(false);
      loadAssistidos();
    } catch (error) {
      console.error("Erro ao cadastrar assistido:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o assistido.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filtrados = assistidos
    .filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const assistidosPaginados = filtrados.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
              Assistidos
            </h1>
            <p className="text-muted-foreground text-base mt-1">
              Gerenciar assistidos do programa
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Assistido
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Assistido</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Nome do assistido"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCadastrar} disabled={submitting}>
                  {submitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar assistido..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="grid gap-3">
          {assistidosPaginados.map((a) => {
            const count = atendimentosCount[a.id] || 0;
            return (
              <Card
                key={a.id}
                className="cursor-pointer hover:shadow-md transition-all border-border/50"
                onClick={() => navigate(`/assistidos/${a.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {a.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{a.nome}</p>
                      <p className="text-base text-muted-foreground">
                        Início:{" "}
                        {new Date(a.dataInicio).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-base px-2 py-1 rounded-full font-medium ${a.status === "Ativo" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                  >
                    {a.status}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
