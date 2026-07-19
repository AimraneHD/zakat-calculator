"use client";

import { useState, useRef, useEffect } from "react";

// this is a way of saying "hello, this 'dropdown' thingy requires a label or something idk"
interface DropdownProps {
	options: string[];
	isOpen: boolean;
	onSelect: (selectedOption: any) => void;
}

const premium_dropdown = "overflow-y-auto max-h-60 list-none text-left bg-[#2a2a2a] p-3 text-white border border-emerald-500 rounded-lg";
const premium_dropdown_option = "transition-all hover:bg-emerald-500 cursor-pointer pt-2 pb-2 rounded-sm w-full";

export default function Dropdown({options, isOpen, onSelect} : DropdownProps) {
	if (!isOpen) return null;

	return (
		<div
			className={`absolute top-full left-0 w-full z-30 box-border`}
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
		</div>
	);
}