import { useState } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';

const fruitOptions = [
	{ value: 'Apple', label: 'Apple' },
	{ value: 'Banana', label: 'Banana' },
	{ value: 'Kiwi', label: 'Kiwi' },
];
const animalOptions = [
	{ value: 'Dog', label: 'Dog' },
	{ value: 'Cat', label: 'Cat' },
	{ value: 'Parrot', label: 'Parrot' },
];

function App() {
	const [selectedFruit, setSelectedFruit] = useState<{ value: string; label: string } | null>(null);
	const [selectedAnimal, setSelectedAnimal] = useState<{ value: string; label: string } | null>(null);

	return (
		<div className='flex gap-4'>
			<Dropdown options={fruitOptions} value={selectedFruit} onChange={setSelectedFruit} />
			<Dropdown
				options={animalOptions}
				value={selectedAnimal}
				onChange={setSelectedAnimal}
				renderOption={(opt) => (
					<b className='flex justify-between bg-yellow-100 px-3 py-2 hover:bg-yellow-200'>
						<span>🔥</span>
						{opt.label}
						<span>🔥</span>
					</b>
				)}
				renderValue={(opt) => (opt ? <i>{opt.label}</i> : 'Choose an animal')}
			/>
		</div>
	);
}

export default App;
