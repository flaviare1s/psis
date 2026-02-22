import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import {
  getTerapias,
  createTerapia,
  updateTerapia,
  deleteTerapia,
} from "@/firebase/terapias";

interface Terapia {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  criadoEm?: string;
}

export default function Terapias() {
  const [terapias, setTerapias] = useState<Terapia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTerapia, setEditingTerapia] = useState<Terapia | null>(null);
  const [deletingTerapia, setDeletingTerapia] = useState<Terapia | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cor: "",
    icone: "",
  });
  const { toast } = useToast();

  const loadTerapias = useCallback(async () => {
    try {
      const data = await getTerapias();
      setTerapias(data as Terapia[]);
    } catch (error) {
      console.error("Erro ao carregar terapias:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as terapias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTerapias();
  }, [loadTerapias]);

  const handleOpenDialog = (terapia?: Terapia) => {
    if (terapia) {
      setEditingTerapia(terapia);
      setFormData({
        nome: terapia.nome,
        cor: terapia.cor,
        icone: terapia.icone,
      });
    } else {
      setEditingTerapia(null);
      setFormData({ nome: "", cor: "", icone: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTerapia(null);
    setFormData({ nome: "", cor: "", icone: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome da terapia é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTerapia) {
        await updateTerapia(editingTerapia.id, formData);
        toast({
          title: "Sucesso",
          description: "Terapia atualizada com sucesso",
        });
      } else {
        await createTerapia(formData);
        toast({
          title: "Sucesso",
          description: "Terapia criada com sucesso",
        });
      }
      handleCloseDialog();
      loadTerapias();
    } catch (error) {
      console.error("Erro ao salvar terapia:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a terapia",
        variant: "destructive",
      });
    }
  };

  const handleOpenDeleteDialog = (terapia: Terapia) => {
    setDeletingTerapia(terapia);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTerapia) return;

    try {
      await deleteTerapia(deletingTerapia.id);
      toast({
        title: "Sucesso",
        description: "Terapia excluída com sucesso",
      });
      setDeleteDialogOpen(false);
      setDeletingTerapia(null);
      loadTerapias();
    } catch (error) {
      console.error("Erro ao deletar terapia:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a terapia",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Terapias</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as terapias oferecidas
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Terapia
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Carregando terapias...
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Terapias Cadastradas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {terapias.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma terapia cadastrada ainda
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {terapias.map((terapia) => (
                    <div
                      key={terapia.id}
                      className="px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {terapia.nome}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {terapia.cor && (
                                <p className="text-xs text-muted-foreground">
                                  Cor: {terapia.cor}
                                </p>
                              )}
                              {terapia.icone && (
                                <p className="text-xs text-muted-foreground">
                                  Ícone: {terapia.icone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(terapia)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(terapia)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog de Criar/Editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTerapia ? "Editar Terapia" : "Nova Terapia"}
              </DialogTitle>
              <DialogDescription>
                {editingTerapia
                  ? "Edite as informações da terapia"
                  : "Crie uma nova terapia"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Acupuntura, Reiki..."
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTerapia ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a terapia "
                {deletingTerapia?.nome}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
