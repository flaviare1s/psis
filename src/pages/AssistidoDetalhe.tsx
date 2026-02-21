import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockAssistidos,
  mockAtendimentos,
  mockAvaliacoes,
  TERAPIAS,
} from "@/lib/mock-data";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

export default function AssistidoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const assistido = mockAssistidos.find((a) => a.id === id);
  const atendimentos = mockAtendimentos.filter((a) => a.assistidoId === id);
  const avaliacoes = mockAvaliacoes.filter((a) => a.assistidoId === id);

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
            <h1 className="text-2xl font-display font-bold text-foreground">
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

        {/* Ficha de Atividades - replicating the paper form */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Ficha de Atividades
          </h2>
          <div className="space-y-4">
            {TERAPIAS.map((terapia) => {
              const atendimento = atendimentos.find(
                (a) => a.tipoTerapia === terapia.nome,
              );
              const sessoes = atendimento?.sessoes || [];
              const totalPresencas = sessoes.filter((s) => s.presente).length;

              return (
                <Card key={terapia.nome} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${terapia.cor} flex items-center justify-center text-lg`}
                        >
                          <terapia.icone className="h-4 w-4 text-white" />
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
                            className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                              presente
                                ? "bg-primary/10 border-primary/30"
                                : "bg-muted/30 border-border/50"
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
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
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
                      {av.encaminhamentos.map((e) => (
                        <span
                          key={e}
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
      </div>
    </DashboardLayout>
  );
}
