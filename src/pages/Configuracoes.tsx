import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsuarios } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

export default function Configuracoes() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerenciar terapeutas e configurações</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Terapeutas Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockUsuarios.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-sm text-foreground">{u.nome}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
