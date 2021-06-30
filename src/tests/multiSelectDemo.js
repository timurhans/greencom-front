// import React, { useState, useEffect } from 'react';
// import { MultiSelect } from 'primereact/multiselect';
// import './MultiSelectDemo.css';
// import { Skeleton } from 'primereact/skeleton';

// export default function MultiSelectDemo(){

//     const [lazyItems, setLazyItems] = useState([]);
//     const [lazyLoading, setLazyLoading] = useState(false);
//     const [selectedCities1, setSelectedCities1] = useState(null);
//     const [selectedCities2, setSelectedCities2] = useState(null);
//     const [selectedCountries, setSelectedCountries] = useState(null);
//     const [selectedGroupedCities, setSelectedGroupedCities] = useState(null);
//     const [selectedItems1, setSelectedItems1] = useState(null);
//     const [selectedItems2, setSelectedItems2] = useState(null);
//     const [selectAll, setSelectAll] = useState(false);

//     const cities = [
//         { name: 'New York', code: 'NY' },
//         { name: 'Rome', code: 'RM' },
//         { name: 'London', code: 'LDN' },
//         { name: 'Istanbul', code: 'IST' },
//         { name: 'Paris', code: 'PRS' }
//     ];

//     const countries = [
//         { name: 'Australia', code: 'AU' },
//         { name: 'Brazil', code: 'BR' },
//         { name: 'China', code: 'CN' },
//         { name: 'Egypt', code: 'EG' },
//         { name: 'France', code: 'FR' },
//         { name: 'Germany', code: 'DE' },
//         { name: 'India', code: 'IN' },
//         { name: 'Japan', code: 'JP' },
//         { name: 'Spain', code: 'ES' },
//         { name: 'United States', code: 'US' }
//     ];

//     const groupedCities = [
//         {
//             label: 'Germany', code: 'DE',
//             items: [
//                 { label: 'Berlin', value: 'Berlin' },
//                 { label: 'Frankfurt', value: 'Frankfurt' },
//                 { label: 'Hamburg', value: 'Hamburg' },
//                 { label: 'Munich', value: 'Munich' }
//             ]
//         },
//         {
//             label: 'USA', code: 'US',
//             items: [
//                 { label: 'Chicago', value: 'Chicago' },
//                 { label: 'Los Angeles', value: 'Los Angeles' },
//                 { label: 'New York', value: 'New York' },
//                 { label: 'San Francisco', value: 'San Francisco' }
//             ]
//         },
//         {
//             label: 'Japan', code: 'JP',
//             items: [
//                 { label: 'Kyoto', value: 'Kyoto' },
//                 { label: 'Osaka', value: 'Osaka' },
//                 { label: 'Tokyo', value: 'Tokyo' },
//                 { label: 'Yokohama', value: 'Yokohama' }
//             ]
//         }
//     ];

//     const items = Array.from({ length: 100000 }).map((_, i) => ({ label: `Item #${i}`, value: i }));

//     useEffect(() => {
//         setLazyItems(Array.from({ length: 100000 }));
//         setLazyLoading(false)
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const countryTemplate = (option) => {
//         return (
//             <div className="country-item">
//                 <img alt={option.name} src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
//                 <div>{option.name}</div>
//             </div>
//         );
//     }

//     const selectedCountriesTemplate = (option) => {
//         if (option) {
//             return (
//                 <div className="country-item country-item-value">
//                     <img alt={option.name} src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
//                     <div>{option.name}</div>
//                 </div>
//             );
//         }

//         return "Select Countries";
//     }

//     const onLazyLoad = (event) => {
//         // setlazyLoading(true);

//         // if (loadLazyTimeout) {
//         //     clearTimeout(loadLazyTimeout);
//         // }

//         //imitate delay of a backend call
//         // loadLazyTimeout = setTimeout(() => {
//         //     const { first, last } = event;
//         //     const _lazyItems = [...lazyItems];

//         //     for (let i = first; i < last; i++) {
//         //         _lazyItems[i] = { label: `Item #${i}`, value: i };
//         //     }

//         //     setLazyItems(_lazyItems);
//         //     setLazyLoading(false);
//         // }, Math.random() * 1000 + 250);
//     }

//     const panelFooterTemplate = () => {
//         const selectedItems = selectedCountries;
//         const length = selectedItems ? selectedItems.length : 0;
//         return (
//             <div className="p-py-2 p-px-3">
//                 <b>{length}</b> item{length > 1 ? 's' : ''} selected.
//             </div>
//         );
//     }

//     const groupedItemTemplate = (option) => {
//         return (
//             <div className="p-d-flex p-ai-center country-item">
//                 <img alt={option.label} src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
//                 <div>{option.label}</div>
//             </div>
//         );
//     }

//     return (
//         <div className="card">
//             <h5>Basic</h5>
//             <MultiSelect value={selectedCities1} options={cities} onChange={(e) => setSelectedCities1(e.value)} optionLabel="name" placeholder="Select a City" />

//             <h5>Chips</h5>
//             <MultiSelect value={selectedCities2} options={cities} onChange={(e) => setSelectedCities2(e.value)} optionLabel="name" placeholder="Select a City" display="chip" />

//             <h5>Grouped</h5>
//             <MultiSelect value={selectedGroupedCities} options={groupedCities} onChange={(e) => selectedGroupedCities(e.value)} optionLabel="label" optionGroupLabel="label" optionGroupChildren="items"
//                 optionGroupTemplate={groupedItemTemplate} placeholder="Select Cities" />

//             <h5>Advanced with Templating and Filtering</h5>
//             <MultiSelect value={selectedCountries} options={countries} onChange={(e) => setSelectedCountries(e.value)} optionLabel="name" placeholder="Select Countries" filter className="multiselect-custom"
//                 itemTemplate={countryTemplate} selectedItemTemplate={selectedCountriesTemplate} panelFooterTemplate={panelFooterTemplate} />


//         </div>
//     );
// }