import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR | Calculatorul de Salariu și Inflație",
  description: "Informații despre conformitatea GDPR pentru Calculatorul de Salariu și Inflație",
};

export default function GDPRPage() {
  return (
    <>
      <Header />
      
      <main className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
              GDPR - Regulamentul General privind Protecția Datelor
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
              
              <h2>1. Introducere</h2>
              <p>Calculatorul de Salariu și Inflație respectă dreptul dumneavoastră la confidențialitate și se angajează să protejeze datele dumneavoastră personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) al Uniunii Europene.</p>
              <p>Acest document explică modul în care respectăm principiile GDPR și drepturile dumneavoastră în ceea ce privește datele personale.</p>
              
              <h2>2. Principiile GDPR pe care le respectăm</h2>
              <p>În conformitate cu GDPR, ne asigurăm că datele personale sunt:</p>
              <ul>
                <li><strong>Prelucrate în mod legal, echitabil și transparent</strong> - Vă informăm clar despre datele pe care le colectăm și cum le folosim.</li>
                <li><strong>Colectate în scopuri determinate, explicite și legitime</strong> - Nu folosim datele în moduri incompatibile cu scopurile inițiale.</li>
                <li><strong>Adecvate, relevante și limitate</strong> la ceea ce este necesar pentru scopurile pentru care sunt prelucrate.</li>
                <li><strong>Exacte și actualizate</strong> - Luăm măsuri rezonabile pentru a ne asigura că datele inexacte sunt rectificate sau șterse.</li>
                <li><strong>Păstrate pentru o perioadă limitată</strong> - Nu păstrăm datele mai mult decât este necesar.</li>
                <li><strong>Prelucrate într-un mod care asigură securitatea adecvată</strong> - Protejăm împotriva prelucrării neautorizate sau ilegale și împotriva pierderii, distrugerii sau deteriorării accidentale.</li>
              </ul>
              
              <h2>3. Datele pe care le colectăm</h2>
              <p>Calculatorul de Salariu și Inflație este proiectat pentru a funcționa cu un minim de date personale. Toate calculele legate de salariu se efectuează direct în browser-ul dumneavoastră, fără a trimite aceste informații către serverele noastre.</p>
              <p>Putem colecta următoarele tipuri de date:</p>
              <ul>
                <li><strong>Date tehnice</strong>: Adresa IP, tipul de browser, versiunea browserului, sistemul de operare și alte informații tehnice similare.</li>
                <li><strong>Date de utilizare</strong>: Informații despre cum utilizați site-ul nostru, inclusiv paginile vizitate și funcțiile utilizate.</li>
                <li><strong>Cookie-uri</strong>: Utilizăm cookie-uri pentru a îmbunătăți experiența dumneavoastră pe site. Pentru mai multe informații, consultați <a href="/politica-de-cookie-uri" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Politica noastră de Cookie-uri</a>.</li>
              </ul>
              
              <h2>4. Temeiul juridic pentru prelucrarea datelor</h2>
              <p>Prelucrăm datele dumneavoastră personale pe baza următoarelor temeiuri juridice:</p>
              <ul>
                <li><strong>Consimțământul dumneavoastră</strong> - Atunci când v-ați dat acordul explicit pentru prelucrarea datelor dumneavoastră personale.</li>
                <li><strong>Interesele noastre legitime</strong> - Pentru a ne îmbunătăți serviciile, a asigura securitatea site-ului și a înțelege cum este utilizat site-ul nostru.</li>
                <li><strong>Obligații legale</strong> - Atunci când suntem obligați prin lege să prelucrăm datele dumneavoastră personale.</li>
              </ul>
              
              <h2>5. Drepturile dumneavoastră conform GDPR</h2>
              <p>În conformitate cu GDPR, aveți următoarele drepturi în ceea ce privește datele dumneavoastră personale:</p>
              <ul>
                <li><strong>Dreptul de acces</strong> - Aveți dreptul de a solicita o copie a datelor personale pe care le deținem despre dumneavoastră.</li>
                <li><strong>Dreptul la rectificare</strong> - Aveți dreptul de a solicita corectarea datelor personale inexacte sau incomplete.</li>
                <li><strong>Dreptul la ștergere</strong> - Aveți dreptul de a solicita ștergerea datelor dumneavoastră personale în anumite circumstanțe.</li>
                <li><strong>Dreptul la restricționarea prelucrării</strong> - Aveți dreptul de a solicita restricționarea prelucrării datelor dumneavoastră personale în anumite circumstanțe.</li>
                <li><strong>Dreptul la portabilitatea datelor</strong> - Aveți dreptul de a primi datele dumneavoastră personale într-un format structurat, utilizat în mod curent și care poate fi citit automat.</li>
                <li><strong>Dreptul la opoziție</strong> - Aveți dreptul de a vă opune prelucrării datelor dumneavoastră personale în anumite circumstanțe.</li>
                <li><strong>Dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrarea automată</strong> - Aveți dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrarea automată, inclusiv crearea de profiluri, care produce efecte juridice care vă privesc sau vă afectează în mod similar într-o măsură semnificativă.</li>
              </ul>
              <p>Pentru a vă exercita oricare dintre aceste drepturi, vă rugăm să ne contactați la adresa de email: bogdan.bujor08@gmail.com</p>
              
              <h2>6. Transferuri internaționale de date</h2>
              <p>Nu transferăm datele dumneavoastră personale în afara Spațiului Economic European (SEE) fără a implementa garanții adecvate pentru a asigura un nivel similar de protecție.</p>
              
              <h2>7. Măsuri de securitate</h2>
              <p>Am implementat măsuri de securitate adecvate pentru a proteja datele dumneavoastră personale împotriva pierderii, accesului neautorizat, divulgării, alterării sau distrugerii. Aceste măsuri includ:</p>
              <ul>
                <li>Utilizarea criptării pentru a proteja datele sensibile</li>
                <li>Implementarea de controale de acces pentru a limita accesul la date</li>
                <li>Monitorizarea regulată a sistemelor pentru a detecta vulnerabilitățile</li>
                <li>Instruirea personalului cu privire la practicile de securitate a datelor</li>
              </ul>
              
              <h2>8. Încălcări ale securității datelor</h2>
              <p>În cazul unei încălcări a securității datelor care poate duce la un risc ridicat pentru drepturile și libertățile dumneavoastră, vă vom notifica fără întârzieri nejustificate, în conformitate cu obligațiile noastre legale.</p>
              
              <h2>9. Responsabilul cu protecția datelor</h2>
              <p>Deși nu suntem obligați legal să desemnăm un responsabil cu protecția datelor, puteți adresa orice întrebări legate de prelucrarea datelor dumneavoastră personale sau de această politică GDPR la: bogdan.bujor08@gmail.com</p>
              
              <h2>10. Modificări ale politicii GDPR</h2>
              <p>Putem actualiza această politică GDPR din când în când pentru a reflecta modificările în practicile noastre sau pentru alte motive operaționale, legale sau de reglementare. Vă încurajăm să revizuiți periodic această pagină pentru a rămâne informat despre modul în care protejăm datele dumneavoastră personale.</p>
              
              <h2>11. Contact</h2>
              <p>Dacă aveți întrebări sau preocupări cu privire la această politică GDPR sau la practicile noastre de protecție a datelor, vă rugăm să ne contactați la: bogdan.bujor08@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}