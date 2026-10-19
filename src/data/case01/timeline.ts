import type { TimelineEvent } from '../../case/CaseData';

export const CASE_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl_01',
    timeString: '8:00 PM',
    timestampMinutes: 1200,
    title: 'Charity Gala Commences',
    description: 'The St. Jude Children\'s Benefit Gala begins at the Grand Ballroom downtown. Marcus Sterling arrives in his chauffeur-driven Packard.',
    verified: true,
    source: 'Gala Guestbook'
  },
  {
    id: 'tl_02',
    timeString: '9:30 PM',
    timestampMinutes: 1290,
    title: 'Evelyn Visits Arthur Vance',
    description: 'Evelyn Cross arrives at Vance\'s 4th-floor apartment to demand co-byline credit on the Waterfront Grift story. Vance refuses and Evelyn leaves in anger.',
    verified: true,
    source: "Evelyn's Statement / Press Badge",
    requiredEvidenceId: 'clue_evelyn_badge'
  },
  {
    id: 'tl_03',
    timeString: '10:15 PM',
    timestampMinutes: 1335,
    title: 'Arthur Vance Arrives at Velvet Lounge',
    description: 'Arthur Vance sits at the bar and orders a double scotch. Vince Rossi pours it from a private decanter behind the counter.',
    verified: true,
    source: 'Velvet Lounge Cash Register Tape',
    requiredEvidenceId: 'clue_velvet_receipt'
  },
  {
    id: 'tl_04',
    timeString: '10:45 PM',
    timestampMinutes: 1365,
    title: 'Arthur Departs Velvet Lounge',
    description: 'Arthur pays his tab ($4.50) and leaves the lounge alone on foot towards his Riverview apartment. Vince claimed he stayed until 11:15 PM.',
    verified: true,
    source: 'Register Tape (Contradicts Rossi)',
    contradictedBy: 'clue_velvet_receipt',
    requiredEvidenceId: 'clue_velvet_receipt'
  },
  {
    id: 'tl_05',
    timeString: '11:15 PM (FALSIFIED)',
    timestampMinutes: 1395,
    title: "Vince's Fabricated Departure Time",
    description: 'Vince Rossi claims Vance remained at his bar drinking calmly until 11:15 PM. Proven false by the register receipt and toxicology.',
    verified: false,
    source: "Vince Rossi's Initial Statement",
    contradictedBy: 'clue_velvet_receipt'
  },
  {
    id: 'tl_06',
    timeString: '11:28 PM',
    timestampMinutes: 1408,
    title: 'Sterling Parks at Riverview Garage',
    description: "Marcus Sterling's luxury Packard Twelve enters the underground garage across from Vance's apartment building.",
    verified: true,
    source: 'Riverview Garage Ticket Stub',
    contradictedBy: 'clue_gala_invitation',
    requiredEvidenceId: 'clue_parking_ticket'
  },
  {
    id: 'tl_07',
    timeString: '11:35 PM',
    timestampMinutes: 1415,
    title: 'Aconite Poison Takes Effect',
    description: 'Arthur begins experiencing motor paralysis and numbness in his study. The scotch tumbler slips onto the desk.',
    verified: true,
    source: 'Coroner Toxicology & Scotch Glass',
    requiredEvidenceId: 'clue_whiskey_glass'
  },
  {
    id: 'tl_08',
    timeString: '11:42 PM',
    timestampMinutes: 1422,
    title: 'The Fatal Blow & Smashed Watch',
    description: 'Perpetrator strikes Vance on the temple with the brass falcon statuette. Vance collapses; watch glass shatters on the hardwood floor.',
    verified: true,
    source: "Smashed Gold Pocket Watch & Coroner's Report",
    requiredEvidenceId: 'clue_smashed_watch'
  },
  {
    id: 'tl_09',
    timeString: '11:45 PM - 11:52 PM',
    timestampMinutes: 1428,
    title: 'Scene Staged & Locked Room Illusion',
    description: 'Perpetrator searches Vance\'s desk, plants the forged suicide note using peacock ink, wipes prints, steps outside into the hallway, and throws deadbolt using nylon monofilament wire.',
    verified: true,
    source: 'Nylon Thread & Forged Note',
    requiredEvidenceId: 'clue_nylon_thread'
  },
  {
    id: 'tl_10',
    timeString: '11:58 PM',
    timestampMinutes: 1438,
    title: 'Sterling Leaves Parking Garage',
    description: 'Sterling\'s Packard Twelve clocks out of the Riverview Garage gate and speeds away back towards the downtown gala.',
    verified: true,
    source: 'Riverview Garage Ticket Stub',
    requiredEvidenceId: 'clue_parking_ticket'
  },
  {
    id: 'tl_11',
    timeString: '12:35 AM',
    timestampMinutes: 1475,
    title: 'Sterling Reappears at Gala',
    description: 'Councilman Sterling is photographed at the champagne fountain, after an unrecorded 95-minute absence from the event.',
    verified: true,
    source: 'Event Photographer Log',
    requiredEvidenceId: 'clue_gala_invitation'
  },
  {
    id: 'tl_12',
    timeString: '7:30 AM',
    timestampMinutes: 1890,
    title: 'Body Discovered',
    description: 'The apartment landlady unlocks the master hallway lock after noticing newspapers piling outside. Police Sergeant Reed arrives on scene.',
    verified: true,
    source: 'Police Incident Log'
  }
];
