export const loanStatus = [
  {"value": "", "label": "None"},
  {"value": "Pending Validation", "label": "Pending Validation"},
  {"value": "Overdue", "label": "Overdue"},
  {"value": "Borrowed", "label": "Borrowed"},
  {"value": "Closed", "label": "Closed"},
  {"value": "Canceled", "label": "Canceled"},
  {"value": "Rejected", "label": "Rejected"},
  {"value": "Booked", "label": "Booked"}
];


export const statusMap = {
  'Pending Validation': 'blue',
  'Overdue': 'warning',
  'Borrowed': 'primary',
  'Closed': 'teal',
  'Canceled': 'amber',
  'Rejected': 'warning',
  'Booked': 'secondary'
};

export const availabityStatus = [
  {"value": "", "label": "None"}, 
  {"value": "available", "label": "Available"}, 
  {"value": "not_available", "label": "Not Available"}
];

export const availabityMap = {
  'available': 'green',
  'not_available': 'red'
};

export const teams = [
    'MOVE', 
    'LAME', 
    'BIOP', 
    'MICROTISS',
    'ECCEL', 
    'MC2', 
    'PSM', 
    'MODI', 
    'OPTIMA',
    'KAPAH', 
    'FORGE',
    'SECR', 
    'IT'
];

export const materialTypes = [
  { value: 'LAB_SUPPLIES', label: 'Lab Supplies' },
  { value: 'CONSUMABLES', label: 'Consumables' },
];

export const consumableTypes = [
  { value: 'FILTERS_FILTRATION_SUPPLIES', label: 'Filters and Filtration Supplies' },
  { value: 'BIOLOGICAL_CONSUMABLES', label: 'Biological Consumables' },
  { value: 'CHEMICALS', label: 'Chemicals' },
  { value: 'SAFETY_EQUIPMENT', label: 'Safety Equipment' },
  { value: 'LAB_FURNITURE_FIXTURES', label: 'Lab Fixtures' },
  { value: 'CLEANING_MAINTENANCE_SUPPLIES', label: 'Cleaning and Maintenance Supplies' },
];

export const lab_supplyTypes = [
  { value: 'COMPUTING', label: 'Computing' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'MECHANICAL', label: 'Mechanical' },
  { value: 'OPTICS_LASER', label: 'Optics or Laser' },
  { value: 'GAS_FLUIDS', label: 'Gas or Fluids' },
  { value: 'BIOLOGICAL', label: 'Biological' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'BOOKS', label: 'Books' },
  { value: 'OFFICE_BUILDING', label: 'Office and Building' },
  { value: 'Others', label: 'Others' }
];


export const unitList = [
  { value: 'M', label: 'Meter' },
  { value: 'KG', label: 'Kilogram' },
  { value: 'G', label: 'Gram' },
  { value: 'L', label: 'Liter' },
  { value: 'ML', label: 'Milliliter' },
  { value: 'PC', label: 'Piece' }
];

export const requestTypes = [
  {
    value: 'MATERIAL_REQUEST',
    label: 'Request a Material',
  },
  {
    value: 'ACCOUNT_HELP',
    label: 'Account Help',
  },
  {
    value: 'GENERAL_INQUIRY',
    label: 'General Inquiry',
  },
  {
    value: 'REPORT_ISSUE',
    label: 'Report an Issue',
  },
  {
    value: 'FORMATION_INQUIRY',
    label: 'Inquiry about Formations',
  },
];
