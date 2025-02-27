"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Calculatorul de Salariu și Inflație</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-md">
              Instrumentul care te ajută să înțelegi cum inflația îți afectează puterea de cumpărare și să iei decizii financiare informate.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/qSharpy/salary-chart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resurse</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#calculator" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Calculator Salariu
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Întrebări Frecvente
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.bnr.ro/Inflation-Targets-3241.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  BNR - Ținte de Inflație
                </a>
              </li>
              <li>
                <a 
                  href="https://data.ecb.europa.eu/data/datasets/ICP/ICP.M.RO.N.000000.4.ANR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Eurostat - Date IAPC
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Informații Legale</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/termeni-si-conditii" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookie-uri" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Politica de Cookie-uri
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © {currentYear} Calculatorul de Salariu și Inflație. Toate drepturile rezervate.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 md:mt-0">
              Toate calculele se fac direct în browser-ul tău, fără a stoca date personale.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};