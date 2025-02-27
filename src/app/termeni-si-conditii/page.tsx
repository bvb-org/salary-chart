import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții | Calculatorul de Salariu și Inflație",
  description: "Termenii și condițiile de utilizare pentru Calculatorul de Salariu și Inflație",
};

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      
      <main className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
              Termeni și Condiții
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
              
              <h2>1. Acceptarea Termenilor</h2>
              <p>Bine ați venit la Calculatorul de Salariu și Inflație. Prin accesarea și utilizarea acestui site web, sunteți de acord să respectați și să fiți obligat de acești Termeni și Condiții de utilizare. Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați acest site.</p>
              
              <h2>2. Descrierea Serviciului</h2>
              <p>Calculatorul de Salariu și Inflație este un instrument online care vă permite să analizați evoluția salariului dumneavoastră în raport cu inflația din România. Serviciul nostru oferă calcule și vizualizări bazate pe datele introduse de utilizator și pe datele oficiale privind inflația.</p>
              
              <h2>3. Utilizarea Serviciului</h2>
              <p>Sunteți responsabil pentru toate activitățile care au loc sub utilizarea dumneavoastră a Serviciului. Vă angajați să utilizați Serviciul doar în scopuri legale și în conformitate cu acești Termeni și Condiții.</p>
              <p>Nu veți:</p>
              <ul>
                <li>Utiliza Serviciul pentru a transmite conținut ilegal, dăunător, amenințător, abuziv, hărțuitor, defăimător, vulgar, obscen sau în alt mod inacceptabil</li>
                <li>Încerca să interferați sau să perturbați integritatea sau performanța Serviciului și a componentelor sale</li>
                <li>Încerca să obțineți acces neautorizat la Serviciu, la sistemele sau rețelele conexe</li>
              </ul>
              
              <h2>4. Proprietate Intelectuală</h2>
              <p>Conținutul, caracteristicile și funcționalitatea Serviciului, inclusiv, dar fără a se limita la text, grafică, logo-uri, icoane, imagini, clipuri audio, descărcări digitale și compilații de date, sunt proprietatea Calculatorului de Salariu și Inflație sau a licențiatorilor săi și sunt protejate de legile române și internaționale privind drepturile de autor, mărcile comerciale, brevetele, secretele comerciale și alte legi privind proprietatea intelectuală sau drepturile de proprietate.</p>
              
              <h2>5. Limitarea Răspunderii</h2>
              <p>Calculatorul de Salariu și Inflație nu garantează acuratețea, completitudinea sau actualitatea informațiilor disponibile prin intermediul Serviciului. Utilizați Serviciul pe propriul risc. Serviciul este furnizat &quot;așa cum este&quot; și &quot;după cum este disponibil&quot;, fără niciun fel de garanții, fie explicite, fie implicite.</p>
              <p>În niciun caz, Calculatorul de Salariu și Inflație nu va fi responsabil pentru daune directe, indirecte, incidentale, speciale, exemplare sau consecvente (inclusiv, dar fără a se limita la, procurarea de bunuri sau servicii substitutive, pierderea utilizării, a datelor sau a profiturilor, sau întreruperea afacerii) cauzate în orice mod și sub orice teorie a răspunderii, fie în contract, răspundere strictă sau delict (inclusiv neglijență sau altfel), care rezultă în orice fel din utilizarea Serviciului, chiar dacă a fost informat despre posibilitatea unor astfel de daune.</p>
              
              <h2>6. Modificări ale Serviciului</h2>
              <p>Calculatorul de Salariu și Inflație își rezervă dreptul de a modifica sau întrerupe, temporar sau permanent, Serviciul (sau orice parte a acestuia) cu sau fără notificare prealabilă. Calculatorul de Salariu și Inflație nu va fi răspunzător față de dumneavoastră sau față de orice terță parte pentru orice modificare, suspendare sau întrerupere a Serviciului.</p>
              
              <h2>7. Modificări ale Termenilor</h2>
              <p>Calculatorul de Salariu și Inflație își rezervă dreptul, la discreția sa, de a modifica sau înlocui acești Termeni în orice moment. Dacă o revizuire este semnificativă, vom încerca să oferim o notificare cu cel puțin 30 de zile înainte ca noii termeni să intre în vigoare. Ceea ce constituie o schimbare semnificativă va fi determinat la discreția noastră.</p>
              <p>Prin continuarea accesului sau utilizării Serviciului nostru după ce revizuirile devin efective, sunteți de acord să fiți obligat de termenii revizuiți. Dacă nu sunteți de acord cu noii termeni, vă rugăm să încetați utilizarea Serviciului.</p>
              
              <h2>8. Legea Aplicabilă</h2>
              <p>Acești Termeni vor fi guvernați și interpretați în conformitate cu legile României, fără a ține cont de conflictele de dispoziții legale.</p>
              
              <h2>9. Contact</h2>
              <p>Pentru orice întrebări despre acești Termeni și Condiții, vă rugăm să ne contactați la: bogdan.bujor08@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}