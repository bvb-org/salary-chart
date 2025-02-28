"use client";

import React from "react";

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

const Testimonial = ({ quote, author, role, company }: TestimonialProps) => {
  return (
    <div className="testimonial-card">
      <div className="mb-4 text-indigo-500 dark:text-indigo-400">
        <svg width="45" height="36" className="fill-current">
          <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
        </svg>
      </div>
      <p className="text-slate-700 dark:text-slate-300 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xl">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-slate-900 dark:text-white">{author}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            Ce Spun Utilizatorii Noștri
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Descoperiți cum Calculatorul de Salariu și Inflație ajută profesioniștii să ia decizii financiare mai bune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial
            quote="Acest calculator mi-a deschis ochii asupra impactului real al inflației asupra salariului meu. Am folosit datele pentru a negocia o mărire salarială care să compenseze inflația."
            author="Andrei Popescu"
            role="Inginer Software"
            company="TechRO"
          />
          <Testimonial
            quote="Ca manager de resurse umane, folosesc acest instrument pentru a explica angajaților de ce politica noastră de creștere salarială ține cont de inflație. Este un instrument excelent pentru transparență."
            author="Maria Ionescu"
            role="Manager HR"
            company="ConsultaRO"
          />
          <Testimonial
            quote="Simplu, intuitiv și foarte util. Mi-a arătat clar că, deși salariul meu a crescut în ultimii ani, puterea de cumpărare a scăzut din cauza inflației. Acum pot lua decizii financiare mai informate."
            author="Cristian Dumitrescu"
            role="Analist Financiar"
            company="FinanceVision"
          />
        </div>
      </div>
    </section>
  );
};