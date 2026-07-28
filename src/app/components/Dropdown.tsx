"use client";

import { forwardRef } from "react";

// this is a way of saying "hello, this 'dropdown' thingy requires a label or something idk"
interface DropdownProps {
	options: string[];
	isOpen: boolean;
	onSelect: (selectedOption: any) => void;
}

const premium_dropdown = "overflow-y-auto max-h-60 list-none text-left bg-[#2a2a2a] p-3 text-white border border-emerald-500 rounded-lg";
const premium_dropdown_option = "transition-all hover:bg-emerald-500 cursor-pointer pt-2 pb-2 rounded-sm w-full";

const FadeupBlock = forwardRef<HTMLDivElement, {isVisible: boolean, extraClasses?: string, children: React.ReactNode, style?: React.CSSProperties}>( // idk what typescript's name equivalent is of what python calls "dictionary";
  ({isVisible, extraClasses = "", children, style}, ref) => {
    return (
      <div ref={ref} style={style} className={`${isVisible ? "opacity-100 -translate-y-2" : "opacity-0 -translate-y-5 pointer-events-none"} transition-all duration-200 ease-out ${extraClasses}`}> {/* manually adding -translate-y-2 just to adjust its position a little bit the lazy way for now*/}
        {children}
      </div>
    );
  }
);

export default function Dropdown({options, isOpen, onSelect} : DropdownProps) {

	return (
		<FadeupBlock
		isVisible={isOpen}
			extraClasses="absolute top-full left-0 w-full z-30 box-border"
		>
			<ul
				className={`${premium_dropdown}`}
			>
				{options.map((option) => {
					return (
						<li
							key={option}
							className={`${premium_dropdown_option}`}
							onClick={() => onSelect(option)}
						>{option}</li>
					);
				})}
			</ul>
		</FadeupBlock>
		
	);
}