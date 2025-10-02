import React, { useState } from "react";

export default function Hero({ onSearch , user}) {
  const [q, setQ] = useState("");
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Order Restaurant food, takeaway and groceries.
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Feast Your Senses,{' '}
            <p className="text-yellow-500">
              Fast and Fresh
            </p>
          </h1>
          <div className="mt-6 max-w-md">
            <div className="flex items-center gap-0">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-l-full focus:outline-none"
                placeholder="e.g. Pizza"
              />
              <button
                onClick={() => onSearch(q)}
                className="bg-yellow-500 px-6 py-3 rounded-r-full font-medium shadow hover:bg-yellow-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        
          <div className="flex h-72 w-full bg-yellow-500 rounded-l-[120px] items-center justify-center">
            <h1 className="flex text-6xl sm:text-5xl xs:text-1xl font-bold text-white">
              {user?`Welcome, ${user.name.split(' ')[0]}`:'Welcome'}
            </h1>
          </div>
      </div>
    </section>
  );
}