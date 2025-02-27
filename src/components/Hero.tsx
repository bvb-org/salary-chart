"use client";

import React from "react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-background py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">
            Calculează Impactul Inflației Asupra Salariului Tău
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8">
            Află cât de mult ți-a afectat inflația puterea de cumpărare și ce salariu ai nevoie pentru a-ți menține nivelul de trai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#calculator"
              className="btn btn-primary px-8 py-3 text-base font-medium rounded-lg"
            >
              Începe Calculul
            </Link>
            <Link 
              href="#faq"
              className="btn btn-outline px-8 py-3 text-base font-medium rounded-lg"
            >
              Află Mai Multe
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Calcul Precis</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Folosim date oficiale despre inflație din România pentru a-ți oferi o analiză exactă a puterii tale de cumpărare.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Confidențialitate Totală</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Toate calculele se fac direct în browser-ul tău. Datele tale salariale nu sunt stocate pe serverele noastre.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Vizualizare Grafică</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Înțelege evoluția salariului tău în raport cu inflația prin grafice interactive și ușor de înțeles.
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent transition-colors duration-300"></div>
    </div>
  );
};