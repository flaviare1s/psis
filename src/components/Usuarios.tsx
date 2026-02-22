import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Pencil, Trash2, Shield, User } from "lucide-react";

export const Usuarios = ({
  usuarios,
  openEditDialog,
  openDeleteDialog,
  currentUser,
}) => {
  // Ordenar usuários: usuário logado primeiro, depois por nome
  const sortedUsuarios = [...usuarios].sort((a, b) => {
    if (a.id === currentUser?.id) return -1;
    if (b.id === currentUser?.id) return 1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Usuários Cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {sortedUsuarios.map((u) => {
            const isCurrentUser = u.id === currentUser?.id;
            const isAdmin = u.role === "admin";

            return (
              <div
                key={u.id}
                className="px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isAdmin ? (
                      <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base text-foreground truncate">
                        {u.nome}
                      </p>
                      <p className="text-base text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(u)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {!isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(u)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
