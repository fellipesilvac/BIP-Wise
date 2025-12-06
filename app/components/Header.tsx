'use client';

import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';

const imgImage1 = "/wise-logo.png";

export default function Header() {
    return (
        <div className="bg-gradient-to-b flex from-[#121511] gap-4 md:gap-8 h-[100px] md:h-[140px] items-center justify-between md:justify-end shrink-0 sticky to-[rgba(18,21,17,0)] top-0 w-full z-30 px-4 md:px-0" data-node-id="28:93">

            {/* Mobile Logo */}
            <div className="md:hidden h-6 relative shrink-0 w-[106px]">
                <img alt="Wise Logo" className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full" src={imgImage1} />
            </div>

            <div className="flex items-center gap-3 md:gap-8">
                <Link href="/indique">
                    <div className="bg-[#9fe870] box-border flex gap-3.5 items-center px-3.5 h-[30px] relative rounded-[60px] shrink-0 cursor-pointer hover:bg-[#8fd860] transition-colors" data-name="Component 2" data-node-id="28:94">
                        <p className="font-semibold leading-[1.4] relative shrink-0 text-[#163300] text-xs md:text-sm whitespace-nowrap" data-node-id="I28:94;1:8">
                            Indique e ganhe
                        </p>
                    </div>
                </Link>
                <div className="flex gap-3 items-center justify-center relative shrink-0" data-node-id="28:95">
                    <ProfileDropdown />
                </div>
            </div>
        </div>
    );
}
