import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate | Calculatorul de Salariu și Inflație",
  description: "Politica de confidențialitate pentru Calculatorul de Salariu și Inflație",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      
      <main className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
              Politica de Confidențialitate
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
              
              <h2>1. Introducere</h2>
              <p>Bine ați venit la Politica de Confidențialitate a Calculatorului de Salariu și Inflație. Respectăm confidențialitatea dumneavoastră și ne angajăm să protejăm datele dumneavoastră personale. Această politică de confidențialitate vă va informa despre modul în care tratăm datele dumneavoastră personale atunci când utilizați site-ul nostru și vă informează despre drepturile dumneavoastră de confidențialitate și despre modul în care legea vă protejează.</p>
              
              <h2>2. Datele pe care le colectăm despre dumneavoastră</h2>
              <p>Datele personale sau informațiile personale înseamnă orice informație despre un individ din care acea persoană poate fi identificată. Nu include date în care identitatea a fost eliminată (date anonime).</p>
              <p>Calculatorul de Salariu și Inflație este proiectat pentru a funcționa fără a colecta date personale. Toate calculele și procesările se realizează direct în browser-ul dumneavoastră, fără a trimite datele salariale sau alte informații personale către serverele noastre.</p>
              <p>Putem colecta, utiliza, stoca și transfera diferite tipuri de date despre dumneavoastră, pe care le-am grupat după cum urmează:</p>
              <ul>
                <li><strong>Date tehnice</strong> includ adresa de protocol Internet (IP), datele de localizare, tipul și versiunea browserului, setarea fusului orar și locația, tipurile și versiunile plugin-urilor browserului, sistemul de operare și platforma, și alte tehnologii pe dispozitivele pe care le utilizați pentru a accesa acest site web.</li>
                <li><strong>Date de utilizare</strong> includ informații despre modul în care utilizați site-ul nostru web.</li>
              </ul>
              <p>Nu colectăm nicio categorie specială de date personale despre dumneavoastră (aceasta include detalii despre rasa sau etnia dumneavoastră, credințele religioase sau filozofice, viața sexuală, orientarea sexuală, opiniile politice, calitatea de membru al sindicatului, informații despre sănătatea dumneavoastră și date genetice și biometrice).</p>
              
              <h2>3. Cum colectăm datele dumneavoastră personale</h2>
              <p>Utilizăm diferite metode pentru a colecta date de la și despre dumneavoastră, inclusiv prin:</p>
              <ul>
                <li><strong>Interacțiuni automate.</strong> Pe măsură ce interacționați cu site-ul nostru, putem colecta automat Date tehnice despre echipamentul, acțiunile și modelele de navigare. Colectăm aceste date personale prin utilizarea cookie-urilor și a altor tehnologii similare.</li>
              </ul>
              
              <h2>4. Cum utilizăm datele dumneavoastră personale</h2>
              <p>Vom utiliza datele dumneavoastră personale numai atunci când legea ne permite. Cel mai frecvent, vom utiliza datele dumneavoastră personale în următoarele circumstanțe:</p>
              <ul>
                <li>Pentru a administra și proteja afacerea noastră și acest site web (inclusiv depanare, analiza datelor, testare, întreținerea sistemului, asistență, raportare și găzduirea datelor).</li>
                <li>Pentru a livra conținut și reclame relevante pentru site-ul web către dumneavoastră și pentru a măsura sau înțelege eficacitatea publicității pe care v-o servim.</li>
                <li>Pentru a utiliza analiza datelor pentru a îmbunătăți site-ul nostru web, produsele/serviciile, marketingul, relațiile cu clienții și experiențele.</li>
              </ul>
              
              <h2>5. Divulgarea datelor dumneavoastră personale</h2>
              <p>Nu vom partaja datele dumneavoastră personale cu terțe părți în scopuri de marketing.</p>
              <p>Putem partaja datele dumneavoastră personale cu următoarele categorii de destinatari:</p>
              <ul>
                <li>Furnizori de servicii care furnizează servicii IT și de administrare a sistemului.</li>
                <li>Consultanți profesioniști, inclusiv avocați, bancheri, auditori și asigurători.</li>
                <li>Autorități fiscale, autorități de reglementare și alte autorități.</li>
              </ul>
              <p>Solicităm tuturor terților să respecte securitatea datelor dumneavoastră personale și să le trateze în conformitate cu legea. Nu permitem furnizorilor noștri de servicii terțe să utilizeze datele dumneavoastră personale în scopurile proprii și le permitem doar să proceseze datele dumneavoastră personale în scopuri specificate și în conformitate cu instrucțiunile noastre.</p>
              
              <h2>6. Securitatea datelor</h2>
              <p>Am implementat măsuri de securitate adecvate pentru a preveni pierderea accidentală, utilizarea sau accesul neautorizat, modificarea sau divulgarea datelor dumneavoastră personale. În plus, limităm accesul la datele dumneavoastră personale acelor angajați, agenți, contractori și alte terțe părți care au o nevoie de afaceri de a le cunoaște. Aceștia vor procesa datele dumneavoastră personale numai conform instrucțiunilor noastre și sunt supuși unei obligații de confidențialitate.</p>
              <p>Am implementat proceduri pentru a trata orice suspiciune de încălcare a datelor personale și vă vom notifica pe dumneavoastră și orice autoritate de reglementare aplicabilă cu privire la o încălcare atunci când suntem obligați legal să facem acest lucru.</p>
              
              <h2>7. Retenția datelor</h2>
              <p>Vom păstra datele dumneavoastră personale numai atât timp cât este necesar pentru a îndeplini scopurile pentru care le-am colectat, inclusiv în scopul satisfacerii oricăror cerințe legale, contabile sau de raportare.</p>
              <p>Pentru a determina perioada adecvată de retenție pentru datele personale, luăm în considerare cantitatea, natura și sensibilitatea datelor personale, riscul potențial de prejudiciu din utilizarea neautorizată sau divulgarea datelor dumneavoastră personale, scopurile pentru care procesăm datele dumneavoastră personale și dacă putem atinge aceste scopuri prin alte mijloace, precum și cerințele legale aplicabile.</p>
              
              <h2>8. Drepturile dumneavoastră legale</h2>
              <p>În anumite circumstanțe, aveți drepturi în conformitate cu legile de protecție a datelor în legătură cu datele dumneavoastră personale, inclusiv dreptul de a:</p>
              <ul>
                <li><strong>Solicita accesul</strong> la datele dumneavoastră personale.</li>
                <li><strong>Solicita corectarea</strong> datelor dumneavoastră personale.</li>
                <li><strong>Solicita ștergerea</strong> datelor dumneavoastră personale.</li>
                <li><strong>Obiecta la procesarea</strong> datelor dumneavoastră personale.</li>
                <li><strong>Solicita restricționarea procesării</strong> datelor dumneavoastră personale.</li>
                <li><strong>Solicita transferul</strong> datelor dumneavoastră personale.</li>
                <li><strong>Dreptul de a retrage consimțământul</strong> în orice moment.</li>
              </ul>
              <p>Nu veți trebui să plătiți o taxă pentru a accesa datele dumneavoastră personale (sau pentru a vă exercita oricare dintre celelalte drepturi). Cu toate acestea, putem percepe o taxă rezonabilă dacă cererea dumneavoastră este în mod clar nefondată, repetitivă sau excesivă. Alternativ, putem refuza să ne conformăm cererii dumneavoastră în aceste circumstanțe.</p>
              
              <h2>9. Modificări ale politicii de confidențialitate</h2>
              <p>Putem actualiza această politică de confidențialitate din când în când. Vă vom notifica cu privire la orice modificări prin postarea noii politici de confidențialitate pe această pagină.</p>
              <p>Vă recomandăm să revizuiți periodic această politică de confidențialitate pentru orice modificări. Modificările acestei politici de confidențialitate sunt efective atunci când sunt postate pe această pagină.</p>
              
              <h2>10. Contact</h2>
              <p>Dacă aveți întrebări despre această politică de confidențialitate, vă rugăm să ne contactați la: bogdan.bujor08@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}