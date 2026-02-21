import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import logoMeimei from '@/assets/logo_meimei.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Tente: admin@greme.org');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex items-center justify-center gap-4">
            <img src={logoMeimei} alt="GREME" className="h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">PSIS</h1>
            <p className="text-sm text-muted-foreground mt-1">Programa Saúde Integral do Ser</p>
            <p className="text-xs text-muted-foreground">Grupo Espírita Meimei</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo: admin@greme.org / qualquer senha
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
