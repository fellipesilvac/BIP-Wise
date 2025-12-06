'use client';

import {
  ArrowRight,
  Lock
} from 'lucide-react';

// Use same ServiceCard component definition or import it if I moved it.
// I'll keep it here for now to avoid moving file complexity, but normally I'd extract it.

type ServiceCardProps = {
  subtitle: string;
  title: string;
  bgColor: string;
  isLocked?: boolean;
  className?: string;
};

function ServiceCard({ subtitle, title, bgColor, isLocked = false, className = "" }: ServiceCardProps) {
  return (
    <div className={`group flex-1 box-border flex flex-col gap-1.5 items-end justify-end overflow-hidden pl-6 pr-16 py-6 relative rounded-[16px] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_5px_rgba(0,0,0,0.25)] cursor-pointer ${className}`} style={{ backgroundColor: bgColor }}>
      <p className="font-inter font-bold leading-none opacity-40 relative shrink-0 text-[#e8ebe6] text-xs uppercase w-full">
        {subtitle}
      </p>
      <p className={`flex-1 font-manrope font-bold leading-[1.1] relative shrink-0 text-[#e8ebe6] text-[23px] w-full transition-opacity ${isLocked ? 'opacity-40 group-hover:opacity-100' : ''}`}>
        {title}
      </p>

      {isLocked && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2b2b2b] w-[72px] h-[72px] rounded-full flex items-center justify-center transition-opacity group-hover:opacity-0">
          <Lock className="w-[30px] h-[30px] text-[#e8ebe6]" />
        </div>
      )}

      <div className={`absolute bg-[rgba(255,255,255,0.1)] bottom-4 flex gap-2.5 items-center justify-center right-4 rounded-[130px] w-14 h-14 transition-all ${!isLocked ? 'hover:bg-[rgba(255,255,255,0.15)] cursor-pointer' : 'group-hover:opacity-100 group-hover:bg-[rgba(255,255,255,0.15)]'}`}>
        <ArrowRight className={`w-8 h-8 text-[#e8ebe6] transition-opacity ${isLocked ? 'opacity-40 group-hover:opacity-100' : ''}`} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-[42px] items-start relative shrink-0 w-full z-[2] py-8 px-4 md:px-0" data-node-id="28:100">
        <div className="flex flex-col gap-2 items-start relative shrink-0 w-full" data-node-id="28:101">
          <p className="font-manrope font-bold leading-[1.2] relative shrink-0 text-2xl md:text-[32px] text-white tracking-[-0.64px]" data-node-id="28:102">
            Olá Fellipe Tavares,
          </p>
          <p className="font-inter font-medium leading-[1.4] relative shrink-0 text-[#e8ebe6] text-base md:text-lg" data-node-id="28:103">
            <span>Sua assinatura está </span>
            <span className="text-[#9fe870]">ativa</span>
            <span>, você possui </span>
            <span className="text-[#9fe870]">214 indicações ativas</span>
            <span> e 31 inativas</span>
          </p>
        </div>
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full" data-node-id="28:104">
          {/* Cards Container - Horizontal Scroll on Mobile */}
          <div className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 gap-4 pt-2 pb-6 items-start relative shrink-0 w-[calc(100%+32px)] md:w-full" data-node-id="28:105">
            <ServiceCard
              subtitle="Serviço 1"
              title="Agora você pode cadastrar uma Chave Pix na Wise"
              bgColor="#204900"
              className="hover:bg-[#1f4a00] min-w-[85vw] md:min-w-0 w-auto md:w-auto h-[300px] snap-center shrink-0"
            />
            <ServiceCard
              subtitle="Serviço 2"
              title="Descubra como enviar dinheiro sem taxas"
              bgColor="#163300"
              className="hover:bg-[#153200] min-w-[85vw] md:min-w-0 w-auto md:w-auto h-[300px] snap-center shrink-0"
            />
            <ServiceCard
              subtitle="Serviço 3"
              title="Aproveite empréstimos com juros reduzidos"
              bgColor="#171916" // Darker background for locked state
              isLocked={true}
              className="hover:!bg-[#2A2C29] min-w-[85vw] md:min-w-0 w-auto md:w-auto h-[300px] snap-center shrink-0"
            />
          </div>
          <div className="box-border flex gap-2.5 items-start justify-start px-0 relative shrink-0 w-full" data-node-id="28:142">
            <p className="font-inter font-normal leading-[1.4] opacity-40 relative shrink-0 text-[#e8ebe6] text-sm w-full max-w-[700px]" data-node-id="28:143">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full" data-node-id="28:144">
          <p className="font-inter font-semibold leading-[1.4] relative shrink-0 text-[#e8ebe6] text-[22px] whitespace-nowrap" data-node-id="28:145">
            Graduação mensal
          </p>
          <div className="bg-[rgba(255,255,255,0.1)] h-[375px] rounded-[18px] shrink-0 w-full" data-name="Component 1" data-node-id="28:146" />
          <div className="box-border flex gap-2.5 items-start justify-start px-0 relative shrink-0 w-full" data-node-id="28:148">
            <p className="font-inter font-normal leading-[1.4] opacity-60 relative shrink-0 text-[#e8ebe6] text-sm w-full max-w-[700px]" data-node-id="28:149">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full" data-node-id="28:218">
          <p className="font-inter font-semibold leading-[1.4] relative shrink-0 text-[#e8ebe6] text-[22px] whitespace-nowrap" data-node-id="28:219">
            Graduação mensal
          </p>
          <div className="bg-[rgba(255,255,255,0.1)] h-[375px] rounded-[18px] shrink-0 w-full" data-name="Component 1" data-node-id="28:220" />
          <div className="box-border flex gap-2.5 items-start justify-start px-0 relative shrink-0 w-full" data-node-id="28:221">
            <p className="font-inter font-normal leading-[1.4] opacity-60 relative shrink-0 text-[#e8ebe6] text-sm w-full max-w-[700px]" data-node-id="28:222">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[140px] shrink-0 w-full z-[1]" data-node-id="28:150" />
    </>
  );
}
