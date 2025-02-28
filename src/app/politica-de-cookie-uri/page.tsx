import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Cookie-uri | Calculatorul de Salariu și Inflație",
  description: "Politica de cookie-uri pentru Calculatorul de Salariu și Inflație",
};

export default function CookiePolicy() {
  return (
    <>
      <Header />
      
      <main className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
              Politica de Cookie-uri
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
              
              <h2>1. Ce sunt cookie-urile?</h2>
              <p>Cookie-urile sunt fișiere text mici care sunt stocate pe dispozitivul dumneavoastră (computer, tabletă, telefon mobil) atunci când vizitați un site web. Cookie-urile sunt utilizate pe scară largă pentru a face site-urile web să funcționeze sau să funcționeze mai eficient, precum și pentru a furniza informații proprietarilor site-ului.</p>
              
              <h2>2. Cum utilizăm cookie-urile</h2>
              <p>Calculatorul de Salariu și Inflație utilizează cookie-uri pentru a îmbunătăți experiența dumneavoastră pe site-ul nostru. Utilizăm următoarele tipuri de cookie-uri:</p>
              
              <h3>Cookie-uri strict necesare</h3>
              <p>Aceste cookie-uri sunt esențiale pentru a vă permite să utilizați funcționalitățile de bază ale site-ului nostru, cum ar fi accesarea zonelor securizate. Fără aceste cookie-uri, serviciile pe care le-ați solicitat nu pot fi furnizate.</p>
              
              <h3>Cookie-uri de performanță</h3>
              <p>Aceste cookie-uri colectează informații despre modul în care vizitatorii utilizează un site web, de exemplu, care pagini vizitează cel mai des și dacă primesc mesaje de eroare de pe paginile web. Aceste cookie-uri nu colectează informații care identifică un vizitator. Toate informațiile pe care le colectează aceste cookie-uri sunt agregate și, prin urmare, anonime. Sunt utilizate doar pentru a îmbunătăți modul în care funcționează un site web.</p>
              
              <h3>Cookie-uri de funcționalitate</h3>
              <p>Aceste cookie-uri permit site-ului web să rețină alegerile pe care le faceți (cum ar fi numele de utilizator, limba sau regiunea în care vă aflați) și să ofere caracteristici îmbunătățite și mai personale. De exemplu, un site web poate să vă furnizeze știri locale sau informații despre vreme prin stocarea într-un cookie a regiunii în care vă aflați în prezent. Aceste cookie-uri pot fi, de asemenea, utilizate pentru a reține modificările pe care le-ați făcut la dimensiunea textului, fonturilor și altor părți ale paginilor web pe care le puteți personaliza. De asemenea, pot fi utilizate pentru a furniza servicii pe care le-ați solicitat, cum ar fi vizionarea unui videoclip sau comentarea pe un blog.</p>
              
              <h3>Cookie-uri de targetare sau de publicitate</h3>
              <p>Aceste cookie-uri sunt utilizate pentru a livra reclame mai relevante pentru dumneavoastră și interesele dumneavoastră. De asemenea, sunt utilizate pentru a limita numărul de afișări ale unei reclame, precum și pentru a ajuta la măsurarea eficacității campaniei publicitare. Acestea sunt de obicei plasate de rețelele de publicitate cu permisiunea operatorului site-ului web. Ele rețin că ați vizitat un site web și această informație este împărtășită cu alte organizații, cum ar fi agenții de publicitate.</p>
              
              <h2>3. Cookie-uri utilizate pe site-ul nostru</h2>
              <p>Site-ul nostru utilizează următoarele cookie-uri:</p>
              
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700 my-4">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Nume</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Scop</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Durata</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left">Tip</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">theme-preference</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Salvează preferința de temă (lumină/întuneric)</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">1 an</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Funcționalitate</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">_ga</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Utilizat de Google Analytics pentru a distinge utilizatorii</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">2 ani</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Performanță</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">_gid</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Utilizat de Google Analytics pentru a distinge utilizatorii</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">24 ore</td>
                    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Performanță</td>
                  </tr>
                </tbody>
              </table>
              
              <h2>4. Cum să controlați cookie-urile</h2>
              <p>Puteți controla și/sau șterge cookie-urile după cum doriți. Puteți șterge toate cookie-urile care sunt deja pe computerul dumneavoastră și puteți seta majoritatea browserelor să împiedice plasarea acestora. Dacă faceți acest lucru, este posibil să trebuiască să setați manual unele preferințe de fiecare dată când vizitați un site, iar unele servicii și funcționalități s-ar putea să nu funcționeze.</p>
              
              <p>Puteți afla mai multe despre cum să gestionați cookie-urile pentru fiecare browser web accesând următoarele linkuri:</p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647?hl=ro" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/ro/kb/cookie-informatii-site-uri-stocheaza-pe-computerul" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergeți-cookie-urile-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Microsoft Edge</a></li>
                <li><a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Safari</a></li>
              </ul>
              
              <h2>5. Modificări ale politicii de cookie-uri</h2>
              <p>Putem actualiza această politică de cookie-uri din când în când pentru a reflecta, de exemplu, modificări ale cookie-urilor pe care le folosim sau din alte motive operaționale, legale sau de reglementare. Vă rugăm să vizitați această Politică de Cookie-uri în mod regulat pentru a rămâne informat despre utilizarea noastră a cookie-urilor și a tehnologiilor conexe.</p>
              <p>Data la care a fost actualizată ultima dată această Politică de Cookie-uri este indicată la începutul acestui document.</p>
              
              <h2>6. Contact</h2>
              <p>Dacă aveți întrebări despre utilizarea cookie-urilor sau a altor tehnologii, vă rugăm să ne contactați la: bogdan.bujor08@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}