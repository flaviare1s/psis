import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TERAPIAS, mockAssistidos, mockAtendimentos, mockAvaliacoes } from '@/lib/mock-data';
import { Users, CalendarCheck, TrendingUp, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    label: 'Assistidos Ativos',
    value: mockAssistidos.filter((a) => a.status === 'Ativo').length,
    icon: Users,
    color: 'text-primary',
  },
  {
    label: 'Atendimentos',
    value: mockAtendimentos.length,
    icon: CalendarCheck,
    color: 'text-accent',
  },
  {
    label: 'Avaliações',
    value: mockAvaliacoes.length,
    icon: TrendingUp,
    color: 'text-success',
  },
  {
    label: 'Taxa de Melhora',
    value: `${Math.round((mockAvaliacoes.filter((a) => a.statusEvolucao === 'Melhora').length / Math.max(mockAvaliacoes.length, 1)) * 100)}%`,
    icon: Heart,
    color: 'text-destructive',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground mt-1">Bem-vindo ao sistema de gestão PSIS</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terapias */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">Terapias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {TERAPIAS.map((t) => {
              const count = mockAtendimentos.filter((a) => a.tipoTerapia === t.nome).length;
              return (
                <Card
                  key={t.nome}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:scale-[1.02]"
                  onClick={() => navigate('/atendimentos')}
                >
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl ${t.cor} flex items-center justify-center text-2xl mb-3`}>
                      {t.icone}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{t.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{count} atendimento(s)</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Assistidos recentes */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">Assistidos Recentes</h2>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {mockAssistidos.slice(0, 5).map((a) => {
                  const atendimentos = mockAtendimentos.filter((at) => at.assistidoId === a.id);
                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/assistidos/${a.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {a.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{a.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {atendimentos.length > 0 ? atendimentos.map((at) => at.tipoTerapia).join(', ') : 'Sem terapia'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === 'Ativo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {a.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
