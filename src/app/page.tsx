import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import SalaryChart from "@/components/SalaryChart";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      
      <Features />
      
      <section id="calculator" className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Calculator Salariu și Inflație
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Introdu istoricul salariului tău pentru a vedea cum a fost afectat de inflație și ce salariu ai nevoie pentru a-ți menține puterea de cumpărare.
            </p>
          </div>
          
          <div className="w-full max-w-7xl mx-auto">
            <SalaryChart />
          </div>
        </div>
      </section>
      
      <FAQ />
      
      <section className="py-16 bg-indigo-50 dark:bg-indigo-950 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Ia decizii financiare informate
            </h2>
            <p className="text-lg mb-8 text-slate-600 dark:text-slate-300">
              Folosește calculatorul nostru pentru a înțelege cum inflația îți afectează veniturile și pentru a planifica viitorul financiar.
            </p>
            <a
              href="#calculator"
              className="btn btn-primary px-8 py-3 text-base font-medium rounded-lg"
            >
              Începe Acum
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}