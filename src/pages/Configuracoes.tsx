import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth, Usuario } from "@/lib/auth-context";
import { getUsuarios, updateUsuario, deleteUsuario } from "@/firebase/usuarios";
import { createUser } from "@/firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"admin" | "colaborador">("colaborador");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data as Usuario[]);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createUser(email, senha, nome, role);
      toast({
        title: "Sucesso",
        description: "Usuário cadastrado com sucesso.",
      });
      setOpenCreate(false);
      resetForm();
      loadUsuarios();
    } catch (error: unknown) {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = "Não foi possível criar o usuário.";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message?: string };
        if (firebaseError.code === "auth/email-already-in-use") {
          errorMessage = "Este e-mail já está cadastrado no sistema.";
        } else if (firebaseError.code === "auth/invalid-email") {
          errorMessage = "E-mail inválido.";
        } else if (firebaseError.code === "auth/weak-password") {
          errorMessage = "A senha deve ter no mínimo 6 caracteres.";
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser || !nome.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await updateUsuario(selectedUser.id, { nome, role });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });
      setOpenEdit(false);
      resetForm();
      loadUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await deleteUsuario(selectedUser.id);
      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso.",
      });
      setOpenDelete(false);
      setSelectedUser(null);
      loadUsuarios();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o usuário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setRole(usuario.role);
    setOpenEdit(true);
  };

  const openDeleteDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setOpenDelete(true);
  };

  const resetForm = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setRole("colaborador");
    setSelectedUser(null);
  };

  // Apenas admins podem gerenciar usuários
  const isAdmin = currentUser?.role === "admin";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Carregando...</div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Configurações
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerenciar usuários e permissões
            </p>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha inicial"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={role}
                    onValueChange={(val) =>
                      setRole(val as "admin" | "colaborador")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colaborador">Colaborador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {usuarios.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {u.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {u.role === "admin" ? "Admin" : "Colaborador"}
                    </Badge>
                    {u.id !== currentUser?.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(u)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(u)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome completo</Label>
                <Input
                  id="edit-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do usuário"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Função</Label>
                <Select
                  value={role}
                  onValueChange={(val) =>
                    setRole(val as "admin" | "colaborador")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEdit} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário{" "}
                <strong>{selectedUser?.nome}</strong>? Esta ação não pode ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={submitting}
                className="bg-destructive text-destructive-foreground"
              >
                {submitting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
