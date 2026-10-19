import type { EvidenceItem } from '../../case/EvidenceData';

export const CASE_EVIDENCE: Record<string, EvidenceItem> = {
  clue_whiskey_glass: {
    id: 'clue_whiskey_glass',
    name: 'Half-Empty Scotch Glass',
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - Study Desk",
    description: 'A heavy crystal tumbler with remaining amber liquid. Chemical residue clings to the rim.',
    details:
      'Forensic test reveals traces of Aconitine (monkshood poison), an odorless neurotoxin causing swift motor paralysis within 5 to 10 minutes. The exterior glass has been wiped clean of fingerprints except for Arthur\'s single thumbprint near the bottom.',
    relevantCharacters: ['suspect_sterling', 'suspect_rossi'],
    relatedEvidenceIds: ['clue_autopsy_report', 'clue_poison_phial'],
    investigationRelevance: 'Proves the victim was drugged before the attack, preventing him from defending himself or reaching his gun.',
    examined: false,
    iconName: 'glass',
    tags: ['Forensics', 'Toxin', 'Crime Scene']
  },

  clue_brass_trophy: {
    id: 'clue_brass_trophy',
    name: 'Brass Falcon Trophy',
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - Behind Radiator",
    description: 'A heavy brass journalism excellence award with sharp wings and a weighted base.',
    details:
      'The base matches the cranial depression on the victim\'s left temple. Faint traces of wiped blood and cleaning solvent remain in the engraved lettering: "Arthur Vance - Integrity in Journalism 1938".',
    relevantCharacters: ['suspect_sterling', 'suspect_evelyn'],
    relatedEvidenceIds: ['clue_autopsy_report'],
    investigationRelevance: 'The confirmed murder weapon used for the fatal blunt trauma. Stashed hastily behind the heating radiator.',
    examined: false,
    iconName: 'trophy',
    tags: ['Murder Weapon', 'Bloodied']
  },

  clue_nylon_thread: {
    id: 'clue_nylon_thread',
    name: 'Nylon Thread & Scratched Deadbolt',
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - Front Doorway",
    description: 'A fragment of 30lb monofilament fishing line caught in the strike plate, with fresh brass scratches on the interior deadbolt thumbturn.',
    details:
      'The killer used a classic locked-room illusion: looped high-tensile nylon wire around the deadbolt lever, closed the door from the outer hallway, pulled the wire through the weatherstripping gap to throw the lock from outside, then yanked the wire free. A friction burn mark on the door seal confirms the technique.',
    relevantCharacters: ['suspect_sterling', 'suspect_reed'],
    relatedEvidenceIds: ['clue_forged_suicide_note'],
    investigationRelevance: 'Disproves the "locked room suicide" theory. Proves an intruder exited the room and locked it from the exterior hallway.',
    examined: false,
    iconName: 'key',
    tags: ['Locked Room', 'Method', 'Entry/Exit']
  },

  clue_autopsy_report: {
    id: 'clue_autopsy_report',
    name: "Coroner's Autopsy Report",
    category: 'documents',
    discoveryLocation: 'Police Station - Sergeant Reed\'s Desk',
    description: 'Official medical examiner report detailing the physical condition of Arthur Vance.',
    details:
      'Time of death established between 11:35 PM and 11:50 PM. Cause of death: cranial trauma resulting in fatal subdural hematoma. Crucial toxicology: lethal dose of aconite detected in bloodstream, likely ingested 15-20 minutes before death. Stomach contents show expensive single-malt scotch.',
    relevantCharacters: ['suspect_reed', 'suspect_sterling', 'suspect_rossi'],
    relatedEvidenceIds: ['clue_whiskey_glass', 'clue_smashed_watch'],
    investigationRelevance: 'Pins down the narrow 15-minute murder window and confirms double-assault: chemical incapacitation followed by blunt strike.',
    examined: false,
    iconName: 'document',
    tags: ['Official', 'Medical', 'Timeline']
  },

  clue_smashed_watch: {
    id: 'clue_smashed_watch',
    name: 'Smashed Gold Pocket Watch',
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - Victim's Vest Pocket",
    description: 'An antique gold pocket watch with shattered glass crystal.',
    details:
      'The balance wheel is stopped cold by the violent impact with the floorboards. Both watch hands are locked frozen at exactly 11:42 PM.',
    relevantCharacters: ['suspect_sterling', 'suspect_rossi'],
    relatedEvidenceIds: ['clue_autopsy_report', 'clue_parking_ticket'],
    investigationRelevance: 'Establishes the exact minute of the violent struggle: 11:42 PM.',
    examined: false,
    iconName: 'watch',
    tags: ['Time of Death', 'Physical Clue']
  },

  clue_forged_suicide_note: {
    id: 'clue_forged_suicide_note',
    name: 'Forged Suicide Note',
    category: 'documents',
    discoveryLocation: "Arthur Vance's Apartment - Under Typewriter",
    description: 'A typed note on Vance\'s personal letterhead with a shaky fountain pen signature.',
    details:
      'Text reads: "I can no longer bear the mounting debts and the lies. Forgive me." However: Arthur was known to be strictly right-handed; the handwriting slant is sharp leftward (left-handed grip). The signature was written in an ultra-rare peacock-blue archival ink, not Vance\'s standard black ink.',
    relevantCharacters: ['suspect_sterling', 'suspect_evelyn'],
    relatedEvidenceIds: ['clue_sterling_pen', 'clue_nylon_thread'],
    investigationRelevance: 'Staged by the killer to disguise assassination as despair. Points directly to a left-handed perpetrator using rare ink.',
    examined: false,
    iconName: 'letter',
    tags: ['Document', 'Forgery', 'Handwriting']
  },

  clue_harbor_draft: {
    id: 'clue_harbor_draft',
    name: 'Harbor Scandal Dossier (Draft)',
    category: 'documents',
    discoveryLocation: 'The Metro Herald - Vance\'s Locked Filing Cabinet',
    description: 'Typescript investigative notes titled: "The Waterfront Grift: Public Land, Private Pockets".',
    details:
      'Details a $500,000 illicit kickback scheme wherein Councilman Marcus Sterling arranged the sale of city docklands to dummy shell corporations. The key evidence mentioned is an offshore bank transfer slip and an audio confession tape.',
    relevantCharacters: ['suspect_sterling', 'suspect_evelyn'],
    relatedEvidenceIds: ['clue_bank_transfer', 'clue_audio_tape'],
    investigationRelevance: 'The primary motive for murder. Vance was preparing to print this story on the morning front page.',
    examined: false,
    iconName: 'folder',
    tags: ['Motive', 'Exposé', 'Corruption']
  },

  clue_cigar_ash: {
    id: 'clue_cigar_ash',
    name: 'Rare Bolivar Cigar Ash',
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - Balcony Window Ledge",
    description: 'A cylinder of grey-white tobacco ash sheltered from the rain under the metal window awning.',
    details:
      'Chemical and botanical analysis identifies it as a Cuban Bolivar Corona Especial. Only twelve boxes were legally imported into the city this year, all delivered to Marcus Sterling\'s private club account.',
    relevantCharacters: ['suspect_sterling'],
    relatedEvidenceIds: ['clue_parking_ticket'],
    investigationRelevance: 'Places Marcus Sterling directly at Vance\'s apartment on the night of the murder.',
    examined: false,
    iconName: 'cigar',
    tags: ['Trace Evidence', 'Luxury']
  },

  clue_evelyn_badge: {
    id: 'clue_evelyn_badge',
    name: "Evelyn's Press Badge",
    category: 'physical',
    discoveryLocation: "Arthur Vance's Apartment - 3rd Floor Staircase",
    description: 'A laminated Metro Herald press pass issued to Junior Reporter Evelyn Cross.',
    details:
      'Slightly bent clip. Evelyn claims she lost it earlier in the week, but fresh rain droplets and grease marks on the clip show it was dropped on the wet exterior staircase recently.',
    relevantCharacters: ['suspect_evelyn'],
    relatedEvidenceIds: ['clue_harbor_draft'],
    investigationRelevance: 'Confirms Evelyn was at Vance\'s apartment building on the evening of the crime.',
    examined: false,
    iconName: 'badge',
    tags: ['Press', 'Suspect Link']
  },

  clue_velvet_receipt: {
    id: 'clue_velvet_receipt',
    name: 'Velvet Lounge Cash Register Tape',
    category: 'documents',
    discoveryLocation: 'The Velvet Lounge - Behind Bar Cash Register',
    description: 'A thermal register roll showing receipts and customer tabs from the night of the murder.',
    details:
      'Line item #142 shows Arthur Vance ordered two neat scotches at 10:15 PM and paid his final bill at 10:45 PM. This directly demolishes Vince Rossi\'s sworn statement that Arthur was drinking and chatting at the bar until 11:15 PM.',
    relevantCharacters: ['suspect_rossi', 'suspect_sterling'],
    relatedEvidenceIds: ['clue_autopsy_report'],
    investigationRelevance: 'Crucial contradiction. Proves Vince Rossi lied about Vance\'s departure time to fabricate an alibi window.',
    examined: false,
    iconName: 'receipt',
    tags: ['Alibi', 'Contradiction', 'Timeline']
  },

  clue_parking_ticket: {
    id: 'clue_parking_ticket',
    name: 'Riverview Garage Parking Ticket',
    category: 'documents',
    discoveryLocation: 'Riverview Underground Garage - Attendant Booth',
    description: 'A time-stamped garage entry and exit stub found in the attendant\'s night log.',
    details:
      'Vehicle: Black Packard Twelve, License Plate: "EXEC-01" (registered to Marcus Sterling). Entry time: 11:28 PM. Exit time: 11:58 PM. The garage is located across the street from Vance\'s apartment building.',
    relevantCharacters: ['suspect_sterling'],
    relatedEvidenceIds: ['clue_smashed_watch', 'clue_gala_invitation'],
    investigationRelevance: 'Conclusive proof that Councilman Marcus Sterling was parked next to Vance\'s apartment between 11:28 PM and 11:58 PM, precisely when Vance was killed (11:42 PM).',
    examined: false,
    iconName: 'ticket',
    tags: ['Timeline', 'Irrefutable', 'Alibi Contradiction']
  },

  clue_gala_invitation: {
    id: 'clue_gala_invitation',
    name: 'Charity Gala Program & Attendance Log',
    category: 'documents',
    discoveryLocation: "Marcus Sterling's Office - Reception Desk",
    description: 'Official program for the St. Jude Children\'s Benefit Gala at the Grand Hotel downtown.',
    details:
      'Councilman Sterling claims he was at the charity ball all evening from 8:00 PM to 2:00 AM. However, the event photographer\'s roll has a 90-minute gap with no photos of Sterling between 11:00 PM and 12:35 AM.',
    relevantCharacters: ['suspect_sterling'],
    relatedEvidenceIds: ['clue_parking_ticket'],
    investigationRelevance: 'Reveals the window where Sterling secretly slipped away from the gala.',
    examined: false,
    iconName: 'calendar',
    tags: ['Alibi', 'Suspect']
  },

  clue_bank_transfer: {
    id: 'clue_bank_transfer',
    name: 'Torn $50,000 Offshore Transfer Slip',
    category: 'documents',
    discoveryLocation: 'The Velvet Lounge - Vince Rossi\'s Office Safe',
    description: 'A wire transfer confirmation receipt from Grand Cayman Meridian Bank.',
    details:
      'Sender: "Sterling Capital Holdings Ltd." Beneficiary: "VR Maritime Services" (Vince Rossi\'s shell company). Amount: $50,000. Date: October 18 (the morning before the murder). Memo line coded: "Consulting - Special Project Vance".',
    relevantCharacters: ['suspect_sterling', 'suspect_rossi'],
    relatedEvidenceIds: ['clue_poison_phial', 'clue_harbor_draft'],
    investigationRelevance: 'Hard financial evidence proving Sterling paid Vince Rossi $50,000 to coordinate the hit and silence Vance.',
    examined: false,
    iconName: 'money',
    tags: ['Bribery', 'Conspiracy', 'Motive']
  },

  clue_audio_tape: {
    id: 'clue_audio_tape',
    name: "Arthur Vance's Dictaphone Tape",
    category: 'digital',
    discoveryLocation: "Arthur Vance's Apartment - Hidden inside Hollow Book",
    description: 'A mini-cassette recorder with a cassette labeled "STERLING WATERFRONT - CONFIDENTIAL".',
    details:
      'Audio recording of Arthur Vance: "October 18, 9:00 PM. Councilman Sterling visited the newsroom today in a fury. He swore if I ran the waterfront docklands story tomorrow, I wouldn\'t live to see sunrise. He thinks buying Vince Rossi and city hall makes him untouchable. I have hidden the second copy of the Cayman ledger. If anything happens to me, look at Sterling."',
    relevantCharacters: ['suspect_sterling', 'suspect_rossi'],
    relatedEvidenceIds: ['clue_harbor_draft', 'clue_bank_transfer'],
    investigationRelevance: 'The victim\'s dying declaration directly naming Sterling as the person who threatened his life over the exposé.',
    examined: false,
    iconName: 'tape',
    tags: ['Audio', 'Threat', 'Key Evidence']
  },

  clue_sterling_pen: {
    id: 'clue_sterling_pen',
    name: "Sterling's Gold Fountain Pen",
    category: 'physical',
    discoveryLocation: "Marcus Sterling's Office - Desk Inkwell",
    description: 'A heavy 14k gold Meisterstück fountain pen with customized peacock-blue ink cartridge.',
    details:
      'Spectroscopic analysis confirms the ink is an exclusive batch formulated by a boutique German ink-maker for Marcus Sterling. It matches the ink on the forged suicide note found at the crime scene perfectly down to the chemical dye composition.',
    relevantCharacters: ['suspect_sterling'],
    relatedEvidenceIds: ['clue_forged_suicide_note'],
    investigationRelevance: 'Directly ties Sterling to the forged suicide note left in Vance\'s typewriter.',
    examined: false,
    iconName: 'pen',
    tags: ['Forensic Match', 'Smoking Gun']
  },

  clue_poison_phial: {
    id: 'clue_poison_phial',
    name: 'Discarded Amber Poison Dropper',
    category: 'physical',
    discoveryLocation: 'Velvet Lounge - Back Alley Waste Bin',
    description: 'A small brown glass apothecary dropper bottle tossed into a soggy cardboard box in the alley.',
    details:
      'Residue inside matches aconite neurotoxin. Fingerprints on the dropper belong to Vincent Rossi. A pharmacy label from the docks shows it was bought 3 days ago.',
    relevantCharacters: ['suspect_rossi', 'suspect_sterling'],
    relatedEvidenceIds: ['clue_whiskey_glass', 'clue_bank_transfer'],
    investigationRelevance: 'Connects Vince Rossi directly to the poison used on Arthur Vance\'s drink.',
    examined: false,
    iconName: 'phial',
    tags: ['Poison', 'Accomplice', 'Physical Clue']
  }
};
