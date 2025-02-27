"use client";

import React, { useState } from "react";

type FAQItemProps = {
  question: string;
  answer: React.ReactNode;
};

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0 transition-colors duration-300">
      <button
        className="flex justify-between items-center w-full py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">{question}</h3>
        <svg
          className={`w-6 h-6 text-indigo-600 dark:text-indigo-400 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <div className="text-slate-600 dark:text-slate-300 prose dark:prose-invert">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  return (
    <div id="faq" className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Întrebări Frecvente
          </h2>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md transition-colors duration-300">
            <FAQItem
              question="Ce este inflația și cum îmi afectează salariul?"
              answer={
                <p>
                  Inflația reprezintă creșterea generală a prețurilor bunurilor și serviciilor într-o economie, ceea ce duce la scăderea puterii de cumpărare a banilor. Chiar dacă salariul tău nominal (suma de bani primită) rămâne același sau crește ușor, inflația poate face ca valoarea reală a salariului tău să scadă, reducând astfel cantitatea de bunuri și servicii pe care le poți cumpăra.
                </p>
              }
            />

            <FAQItem
              question="Cum calculați impactul inflației asupra salariului meu?"
              answer={
                <>
                  <p>
                    Calculatorul nostru folosește datele oficiale privind inflația din România pentru a determina puterea de cumpărare a salariului tău de-a lungul timpului. Procesul implică:
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Ajustarea salariului tău nominal în funcție de rata inflației pentru fiecare perioadă</li>
                    <li>Calcularea valorii reale a salariului tău (puterea de cumpărare) în fiecare moment</li>
                    <li>Determinarea salariului necesar în prezent pentru a menține aceeași putere de cumpărare pe care o aveai inițial</li>
                  </ol>
                </>
              }
            />

            <FAQItem
              question="Ce înseamnă 'puterea de cumpărare'?"
              answer={
                <p>
                  Puterea de cumpărare reprezintă cantitatea de bunuri și servicii pe care o poți achiziționa cu salariul tău. Când prețurile cresc (inflație), puterea de cumpărare scade, chiar dacă salariul tău nominal rămâne același. De exemplu, dacă prețurile cresc cu 10%, dar salariul tău crește doar cu 5%, puterea ta de cumpărare a scăzut cu aproximativ 5%.
                </p>
              }
            />

            <FAQItem
              question="Sunt datele mele salariale în siguranță?"
              answer={
                <p>
                  Da, toate calculele se efectuează direct în browser-ul tău. Datele tale salariale nu sunt trimise sau stocate pe serverele noastre, cu excepția cazului în care alegi să te conectezi și să le salvezi. Chiar și atunci, informațiile sunt stocate în mod securizat și nu sunt partajate cu terțe părți.
                </p>
              }
            />

            <FAQItem
              question="Cum pot afla dacă salariul meu ține pasul cu inflația?"
              answer={
                <p>
                  Pentru a determina dacă salariul tău ține pasul cu inflația, compară procentul de creștere a salariului tău cu rata inflației din aceeași perioadă. Dacă creșterea salarială este mai mică decât rata inflației, puterea ta de cumpărare scade. Calculatorul nostru face această comparație automat și îți arată grafic evoluția puterii tale de cumpărare de-a lungul timpului.
                </p>
              }
            />

            <FAQItem
              question="Ce pot face dacă salariul meu nu ține pasul cu inflația?"
              answer={
                <>
                  <p>
                    Dacă descoperi că salariul tău nu ține pasul cu inflația, ai câteva opțiuni:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Negociază o creștere salarială bazată pe datele despre inflație</li>
                    <li>Caută oportunități de dezvoltare profesională care pot duce la un salariu mai mare</li>
                    <li>Explorează opțiuni de venit suplimentar</li>
                    <li>Revizuiește-ți bugetul personal pentru a optimiza cheltuielile</li>
                    <li>Investește o parte din venit pentru a te proteja împotriva inflației pe termen lung</li>
                  </ul>
                </>
              }
            />

            <FAQItem
              question="Cât de actualizate sunt datele despre inflație folosite în calculator?"
              answer={
                <p>
                  Folosim datele oficiale despre inflație din România, care sunt actualizate periodic. Sursa noastră principală este Indicele Armonizat al Prețurilor de Consum (IAPC) pentru România, publicat de Eurostat și Institutul Național de Statistică. Aceste date sunt considerate standardul pentru măsurarea inflației și sunt folosite de instituțiile financiare și guvernamentale.
                </p>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};