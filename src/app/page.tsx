import { Header } from "@/components/Header";
import SalaryChart from "@/components/SalaryChart";

export default function Home() {
  return (
    <main className="min-h-screen py-8 md:py-12 px-4 flex flex-col items-center justify-start bg-background">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <SalaryChart />
      </div>
    </main>
  );
}