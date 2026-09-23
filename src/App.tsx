/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MotorcycleDeliveryScene } from './components/MotorcycleDeliveryScene';

export default function App() {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 select-none selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* PURE ANIMATION STAGE ADAPTED TO IPHONE & SAMSUNG S24 */}
      <main className="w-full max-w-5xl h-[100dvh] sm:h-auto flex flex-col items-center justify-center">
        <MotorcycleDeliveryScene />
      </main>
    </div>
  );
}
