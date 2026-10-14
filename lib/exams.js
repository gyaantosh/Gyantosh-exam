// Nayi exam jodni ho to bas yahan EXAMS aur META mein ek line badhayein.
export const EXAMS = ['MP Police Constable', 'MP SI', 'SSC GD Constable', 'SSC MTS', 'MP Patwari', 'Railway Group D'];

export const META = {
  'MP Police Constable': { short: 'MP Police', grad: ['#1E3A8A', '#0B1437'], flag: 'MISSION VARDI' },
  'MP SI': { short: 'MP SI', grad: ['#7C2D12', '#2A0F05'], flag: 'NEW NOTES' },
  'SSC GD Constable': { short: 'SSC GD', grad: ['#0F766E', '#042F2E'] },
  'SSC MTS': { short: 'SSC MTS', grad: ['#B45309', '#451A03'] },
  'MP Patwari': { short: 'MP Patwari', grad: ['#166534', '#052E16'] },
  'Railway Group D': { short: 'Railway', grad: ['#6D28D9', '#2E1065'] },
};

export const TOPICS = ['Important Days', 'Awards', 'Geography', 'History', 'Hindi', 'Current Affairs', 'GK', 'Maths', 'Reasoning', 'Previous Paper', 'Mock Test', 'General'];

export const ICONS = {
  'MP Police Constable': '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6z"/><path d="M12 8.500l1.100 2.300 2.500.3-1.800 1.700.5 2.500-2.300-1.200-2.300 1.200.5-2.500-1.800-1.700 2.500-.3z"/>',
  'MP SI': '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6z"/><path d="M9 12l2 2 4-4.500"/>',
  'SSC MTS': '<rect x="3.500" y="8" width="17" height="11.500" rx="2"/><path d="M9 8V6.200A1.200 1.200 0 0110.200 5h3.600A1.200 1.200 0 0115 6.200V8"/><path d="M3.500 13.500h17"/>',
  'MP Patwari': '<path d="M3 6.500l6-2.200 6 2.200 6-2.200v13.200l-6 2.200-6-2.200-6 2.200z"/><path d="M9 4.300v13.200"/><path d="M15 6.500v13.200"/>',
  'Railway Group D': '<rect x="5.500" y="3" width="13" height="15" rx="3"/><path d="M5.500 11h13"/><path d="M9 14.500h.01"/><path d="M15 14.500h.01"/><path d="M8.500 18l-2 3"/><path d="M15.500 18l2 3"/>',
  'SSC GD Constable': '<path d="M12 3l2.600 5.500 6 .8-4.400 4.100 1.100 6L12 16.500 6.700 19.400l1.100-6L3.400 9.300l6-.8z"/>',
};

export function coverUrl(coverPath) {
  if (!coverPath) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${coverPath}`;
}
