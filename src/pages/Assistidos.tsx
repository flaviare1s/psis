import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAssistidos, mockAtendimentos } from '@/lib/mock-data';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Assistidos() {
  const [busca, setBusca] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filtrados = mockAssistidos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleCadastrar = () => {
    if (novoNome.trim()) {
      // In a real app, this would persist
      setNovoNome('');
      setOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Assistidos</h1>
            <p className="text-muted-foreground text-sm mt-1">Gerenciar assistidos do programa</p>
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
                  <Input id="nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do assistido" />
                </div>
                <Button onClick={handleCadastrar} className="w-full">Cadastrar</Button>
              </div>
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

        <div className="grid gap-3">
          {filtrados.map((a) => {
            const atendimentos = mockAtendimentos.filter((at) => at.assistidoId === a.id);
            return (
              <Card
                key={a.id}
                className="cursor-pointer hover:shadow-md transition-all border-border/50"
                onClick={() => navigate(`/assistidos/${a.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {a.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{a.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Início: {new Date(a.dataInicio).toLocaleDateString('pt-BR')} · {atendimentos.length} terapia(s)
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === 'Ativo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
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
