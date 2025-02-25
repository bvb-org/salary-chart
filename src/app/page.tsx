import SalaryChart from '@/components/SalaryChart';

export default function Home() {
  return (
    <main className="min-h-screen py-8 md:py-12 px-4 flex flex-col items-center justify-start bg-background">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Calculatorul de Salariu și Inflație
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analizează impactul inflației asupra salariului tău și descoperă cum să-ți menții puterea de cumpărare în timp
          </p>
        </header>
        
        <SalaryChart />
      </div>
    </main>
  );
}