import React, { useState, useRef, useEffect } from 'react';
import ChevronIcon from '../assets/chevron-down.svg?react';

type Option = { value: string; label: string };

interface DropdownProps {
	options: Option[];
	value: Option | null;
	onChange: (option: Option) => void;
	renderOption?: (option: Option) => React.ReactNode;
	renderValue?: (option: Option | null) => React.ReactNode;
	searchFunction?: (query: string) => Option[] | Promise<Option[]>;
	asyncSearch?: boolean;
	placeholder?: string;
	className?: string;
}

let openDropdown: ((state: boolean) => void) | null = null;

export default function Dropdown({
	options,
	value,
	onChange,
	renderOption = (opt: Option) => (
		<span className='block hover:bg-[#F5F5F5] text-[14px] text-[#6B7280] pl-4 py-[3px]'>{opt.label}</span>
	),
	renderValue = (opt: Option | null) => (opt ? opt.label : 'Choose...'),
	searchFunction,
	asyncSearch = false,
	placeholder = 'Search...',
	className = '',
}: DropdownProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

	const ref = useRef<HTMLDivElement | null>(null);
	const ignoreFocusRef = useRef(false);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (!ref.current) return;
			if (!ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleMouseDown);
		return () => document.removeEventListener('mousedown', handleMouseDown);
	}, []);

	useEffect(() => {
		if (open) {
			if (openDropdown && openDropdown !== setOpen) openDropdown(false);
			openDropdown = setOpen;
		} else {
			if (openDropdown === setOpen) openDropdown = null;
		}
	}, [open]);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (searchFunction) {
			const res = asyncSearch ? await searchFunction(query) : (searchFunction(query) as Option[]);
			setFilteredOptions(res);
		} else {
			setFilteredOptions(options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())));
		}
	};

	return (
		<div ref={ref} className={`relative ${className} min-w-[295px] h-12 `}>
			<button
				type='button'
				onMouseDown={() => {
					ignoreFocusRef.current = true;
				}}
				onFocus={() => {
					if (ignoreFocusRef.current) {
						ignoreFocusRef.current = false;
						return;
					}
					setOpen(true);
				}}
				onClick={() => setOpen((prev) => !prev)}
				className={`w-full  px-4 py-3 bg-[#F9FAFB] flex justify-between items-baseline cursor-pointer text-[14px] ${
					open ? 'rounded-t-[8px] border border-[#000]' : 'rounded-[8px] border border-[#D1D5DB]'
				} ${value ? 'text-[#000]' : 'text-[#999999]'}`}
			>
				<span>{renderValue(value)}</span>
				<ChevronIcon width='8px' height='6px' />
			</button>

			{open && (
				<div className={`absolute mt-[-1px] w-full border rounded-b bg-white z-10 pt-[10px] pb-4`}>
					<input
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder={placeholder}
						className='w-[275px] px-2 py-1 mb-4 border border-[#D1D5DB99] rounded-[6px] mx-[10px] outline-none h-[26px] text-[14px] bg-[#F9FAFB99]'
					/>
					<div className='max-h-48 overflow-auto flex flex-col gap-4'>
						{filteredOptions.map((opt, idx) => (
							<div
								key={idx}
								onClick={() => {
									onChange(opt);
									setOpen(false);
								}}
								className='cursor-pointer'
							>
								{renderOption(opt)}
							</div>
						))}
						{filteredOptions.length === 0 && <div className='text-gray-400 text-center'>No match</div>}
					</div>
				</div>
			)}
		</div>
	);
}
