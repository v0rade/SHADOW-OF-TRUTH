import type { CaseDefinition } from '../../case/CaseData';
import { CASE_EVIDENCE } from './evidence';
import { CASE_SUSPECTS } from './suspects';
import { CASE_TIMELINE } from './timeline';
import { CASE_DEDUCTIONS } from './deductions';

export const CASE_01: CaseDefinition = {
  id: 'case_01',
  title: 'SHADOWS OF TRUTH: THE FALL OF ARTHUR VANCE',
  subtitle: 'A Locked-Room Murder in the Heart of New Noir City',
  victimName: 'Arthur Vance',
  date: 'October 19, 1948',
  synopsis:
    'Prominent investigative journalist Arthur Vance is found dead inside his deadbolted 4th-floor study. What City Hall desperately calls an open-and-shut suicide quickly unravels into an intricate conspiracy of poisoned scotch, forged notes, secret payoffs, and high-level political corruption.',
  briefing: [
    'Victim: Arthur Vance, senior investigative journalist for the Metro Herald.',
    'Location: 404 Riverview Apartments, West Docks District.',
    'Initial Assessment: Found slumped over his study floor. Deadbolt locked from the inside. Suicide note typed by the machine.',
    'Discrepancies: Signs of ransacked filing cabinets; heavy blunt trauma on left temple inconsistent with suicide; coroner reports anomalous chemical toxicity.',
    'Your Objective: Secure the scene, interview suspects, collect hard evidence, assemble deductions on your murder board, and bring the true killer to justice.'
  ],
  locations: {
    loc_office: {
      id: 'loc_office',
      name: "Morgan's Detective Agency",
      description: 'Your private office. Neon signs blink through the rain-streaked Venetian blinds. The city hums outside.',
      sceneKey: 'OfficeScene',
      isUnlocked: true,
      inspectionPoints: [
        {
          id: 'inspect_office_desk',
          name: 'Detective Desk & Case File',
          x: 280,
          y: 420,
          width: 90,
          height: 70,
          evidenceId: '',
          interactPrompt: 'Review Case File',
          flavorText: 'Your mahogany desk cluttered with case files, an old Remington typewriter, and a warm brass gooseneck lamp.',
          examinedText: 'The morning headlines scream: "HERALD ACE REPORTER FOUND DEAD IN STUDY". Time to get to work.'
        },
        {
          id: 'inspect_office_board',
          name: 'Case Pinboard',
          x: 480,
          y: 350,
          width: 80,
          height: 80,
          evidenceId: '',
          interactPrompt: 'Open Investigation Board (Press B)',
          flavorText: 'A large corkboard with red yarn and pushpins. Useful for mapping out suspect connections and deductions.',
          examinedText: 'Connect clues here to uncover hidden truths.'
        }
      ],
      npcs: [],
      doors: [
        {
          x: 720,
          y: 430,
          targetLocationId: 'loc_crime_scene',
          prompt: 'Travel to Crime Scene (Riverview Apts)'
        }
      ]
    },

    loc_crime_scene: {
      id: 'loc_crime_scene',
      name: "Arthur Vance's Apartment (Crime Scene)",
      description: 'Room 404. Police tape flutters in the drafty hallway. The study smells of aged paper, spilled single-malt, and damp plaster.',
      sceneKey: 'CrimeScene',
      isUnlocked: true,
      inspectionPoints: [
        {
          id: 'inspect_door_latch',
          name: 'Front Door Deadbolt',
          x: 190,
          y: 400,
          width: 60,
          height: 100,
          evidenceId: 'clue_nylon_thread',
          interactPrompt: 'Examine Deadbolt & Threshold',
          flavorText: 'The heavy brass deadbolt was locked when the landlady arrived. Fresh scratches glint around the cylinder.',
          examinedText: 'You discover a strand of monofilament nylon fishing line trapped in the strike plate!'
        },
        {
          id: 'inspect_scotch_glass',
          name: 'Study Desk & Scotch Glass',
          x: 340,
          y: 430,
          width: 70,
          height: 60,
          evidenceId: 'clue_whiskey_glass',
          interactPrompt: 'Inspect Tumbler & Chemical Residue',
          flavorText: 'A tumbler of 18-year scotch rests precariously on the blotter. Strange white powder traces coat the glass rim.',
          examinedText: 'Collected: Half-Empty Scotch Glass with aconite toxin residue.'
        },
        {
          id: 'inspect_typewriter_note',
          name: 'Typewriter & Paper',
          x: 430,
          y: 430,
          width: 60,
          height: 50,
          evidenceId: 'clue_forged_suicide_note',
          interactPrompt: 'Read Document in Carriage',
          flavorText: 'An Underwood typewriter with a freshly typed sheet titled "To Whom It May Concern".',
          examinedText: 'Collected: Forged Suicide Note signed with unusual peacock-blue ink.'
        },
        {
          id: 'inspect_body_outline',
          name: 'Victim Chalk Outline',
          x: 540,
          y: 450,
          width: 80,
          height: 40,
          evidenceId: 'clue_smashed_watch',
          interactPrompt: 'Inspect Floor around Outline',
          flavorText: 'Chalk outline where Arthur Vance fell. A dark pool of dried blood stains the oak floorboards.',
          examinedText: 'Collected: Smashed Gold Pocket Watch jammed at exactly 11:42 PM.'
        },
        {
          id: 'inspect_radiator_weapon',
          name: 'Cast Iron Radiator',
          x: 660,
          y: 430,
          width: 50,
          height: 60,
          evidenceId: 'clue_brass_trophy',
          interactPrompt: 'Look Behind Radiator',
          flavorText: 'Steam hisses gently through the radiator pipes. Something metallic glints in the shadowy gap behind.',
          examinedText: 'Collected: Bloodied Brass Falcon Trophy stashed behind the heater.'
        },
        {
          id: 'inspect_balcony_ledge',
          name: 'Rainy Balcony Window',
          x: 770,
          y: 390,
          width: 60,
          height: 90,
          evidenceId: 'clue_cigar_ash',
          interactPrompt: 'Examine Balcony Ledge',
          flavorText: 'A French door leading to a narrow fire escape balcony. Rain patters against the metal awning.',
          examinedText: 'Collected: Rare Bolivar Cigar Ash preserved under the window awning.'
        },
        {
          id: 'inspect_hollow_book',
          name: 'Bookshelf & Hidden Safe',
          x: 230,
          y: 390,
          width: 60,
          height: 80,
          evidenceId: 'clue_audio_tape',
          interactPrompt: 'Inspect Hollow Law Volume',
          flavorText: 'A heavy leatherbound law tome with a cut-out interior compartment.',
          examinedText: 'Collected: Arthur Vance\'s Dictaphone Audio Tape.'
        }
      ],
      npcs: [
        {
          suspectId: 'suspect_reed',
          x: 620,
          y: 420,
          name: 'Sergeant Thomas Reed'
        }
      ],
      doors: [
        {
          x: 80,
          y: 420,
          targetLocationId: 'loc_office',
          prompt: 'Return to Detective Office'
        },
        {
          x: 880,
          y: 420,
          targetLocationId: 'loc_newspaper_office',
          prompt: 'Go to The Metro Herald'
        }
      ]
    },

    loc_newspaper_office: {
      id: 'loc_newspaper_office',
      name: 'The Metro Herald Newsroom',
      description: 'Printing presses clatter in the basement below. Teletype machines chatter amid clouds of cigarette smoke.',
      sceneKey: 'LocationScene',
      isUnlocked: true,
      inspectionPoints: [
        {
          id: 'inspect_vance_cabinet',
          name: "Vance's Filing Cabinet",
          x: 220,
          y: 420,
          width: 60,
          height: 80,
          evidenceId: 'clue_harbor_draft',
          interactPrompt: 'Unlock Investigative Archive',
          flavorText: 'A four-drawer olive steel filing cabinet with Arthur Vance\'s nameplate.',
          examinedText: 'Collected: Harbor Scandal Dossier Draft exposing Councilman Sterling.'
        },
        {
          id: 'inspect_hallway_stairs',
          name: 'Herald Exit Stairwell',
          x: 780,
          y: 420,
          width: 60,
          height: 80,
          evidenceId: 'clue_evelyn_badge',
          interactPrompt: 'Inspect Stairway Landing',
          flavorText: 'The fire door leading out to the back alley.',
          examinedText: 'Found: Evelyn Cross\'s dropped press pass.'
        }
      ],
      npcs: [
        {
          suspectId: 'suspect_evelyn',
          x: 440,
          y: 420,
          name: 'Evelyn Cross'
        }
      ],
      doors: [
        {
          x: 80,
          y: 420,
          targetLocationId: 'loc_crime_scene',
          prompt: 'Return to Crime Scene'
        },
        {
          x: 880,
          y: 420,
          targetLocationId: 'loc_velvet_lounge',
          prompt: 'Go to The Velvet Lounge'
        }
      ]
    },

    loc_velvet_lounge: {
      id: 'loc_velvet_lounge',
      name: 'The Velvet Lounge (Speakeasy Bar)',
      description: 'Dim red lamps, a jazz saxophone playing softly from a jukebox, and the heavy aroma of gin and bourbon.',
      sceneKey: 'LocationScene',
      isUnlocked: false,
      unlockReason: 'Unlocked by interviewing Evelyn Cross or examining the autopsy report.',
      inspectionPoints: [
        {
          id: 'inspect_bar_register',
          name: 'Cash Register & Receipt Roll',
          x: 320,
          y: 420,
          width: 60,
          height: 60,
          evidenceId: 'clue_velvet_receipt',
          interactPrompt: 'Check Register Audit Tape',
          flavorText: 'An ornate brass National Cash Register on the back bar counter.',
          examinedText: 'Collected: Velvet Lounge Register Tape proving Vance departed at 10:45 PM.'
        },
        {
          id: 'inspect_bar_alley',
          name: 'Back Alley Waste Bin',
          x: 820,
          y: 420,
          width: 60,
          height: 60,
          evidenceId: 'clue_poison_phial',
          interactPrompt: 'Search Alley Waste Bin',
          flavorText: 'A metal trash bin behind the bar kitchen door.',
          examinedText: 'Collected: Discarded Amber Poison Dropper with Rossi\'s prints.'
        }
      ],
      npcs: [
        {
          suspectId: 'suspect_rossi',
          x: 460,
          y: 420,
          name: 'Vincent "Vince" Rossi'
        }
      ],
      doors: [
        {
          x: 80,
          y: 420,
          targetLocationId: 'loc_newspaper_office',
          prompt: 'Return to Metro Herald'
        },
        {
          x: 880,
          y: 420,
          targetLocationId: 'loc_parking_garage',
          prompt: 'Go to Riverview Garage'
        }
      ]
    },

    loc_parking_garage: {
      id: 'loc_parking_garage',
      name: 'Riverview Underground Garage',
      description: 'Dripping concrete ceilings, harsh fluorescent bulbs buzzing in cages, and the rumble of exhaust.',
      sceneKey: 'LocationScene',
      isUnlocked: false,
      unlockReason: 'Unlocked by breaking Vince Rossi\'s timeline statement.',
      inspectionPoints: [
        {
          id: 'inspect_garage_booth',
          name: 'Attendant Booth Night Log',
          x: 360,
          y: 420,
          width: 70,
          height: 70,
          evidenceId: 'clue_parking_ticket',
          interactPrompt: 'Examine Time-Stamped Parking Log',
          flavorText: 'The glass booth where night parking tickets are validated.',
          examinedText: 'Collected: Riverview Garage Ticket showing Sterling\'s Packard logged 11:28 PM - 11:58 PM.'
        }
      ],
      npcs: [],
      doors: [
        {
          x: 80,
          y: 420,
          targetLocationId: 'loc_velvet_lounge',
          prompt: 'Return to Velvet Lounge'
        },
        {
          x: 880,
          y: 420,
          targetLocationId: 'loc_sterling_office',
          prompt: "Go to Councilman Sterling's Office"
        }
      ]
    },

    loc_sterling_office: {
      id: 'loc_sterling_office',
      name: "Marcus Sterling's Executive Suite",
      description: 'Floor 32 of Sterling Tower. Walnut paneling, panoramic view of the harbor piers, and the scent of expensive Cuban tobacco.',
      sceneKey: 'LocationScene',
      isUnlocked: false,
      unlockReason: 'Unlocked by deducing Sterling\'s broken alibi or confronting Vince Rossi.',
      inspectionPoints: [
        {
          id: 'inspect_sterling_pen',
          name: 'Art-Deco Walnut Desk & Pen',
          x: 280,
          y: 420,
          width: 80,
          height: 60,
          evidenceId: 'clue_sterling_pen',
          interactPrompt: 'Inspect Gold Meisterstück Pen',
          flavorText: 'An imported German fountain pen filled with custom peacock-blue ink.',
          examinedText: 'Collected: Sterling\'s Gold Fountain Pen matching the forged note.'
        },
        {
          id: 'inspect_gala_invitation',
          name: 'Charity Gala Program on Table',
          x: 680,
          y: 420,
          width: 60,
          height: 60,
          evidenceId: 'clue_gala_invitation',
          interactPrompt: 'Read Gala Schedule & Photos',
          flavorText: 'The silver-embossed program for the St. Jude Charity Gala.',
          examinedText: 'Collected: Gala Attendance Log showing the 90-minute gap.'
        }
      ],
      npcs: [
        {
          suspectId: 'suspect_sterling',
          x: 480,
          y: 420,
          name: 'Councilman Marcus Sterling'
        }
      ],
      doors: [
        {
          x: 80,
          y: 420,
          targetLocationId: 'loc_parking_garage',
          prompt: 'Return to Riverview Garage'
        },
        {
          x: 880,
          y: 420,
          targetLocationId: 'loc_office',
          prompt: 'Return to Detective Office'
        }
      ]
    }
  },
  evidence: CASE_EVIDENCE,
  suspects: CASE_SUSPECTS,
  timeline: CASE_TIMELINE,
  deductionRules: CASE_DEDUCTIONS,
  objectives: [
    {
      id: 'obj_examine_crime_scene',
      title: 'Forensic Sweep of the Crime Scene',
      description: 'Examine Arthur Vance\'s apartment for weapon, toxins, entry traces, and personal effects.',
      completed: false,
      requiredEvidenceIds: ['clue_whiskey_glass', 'clue_brass_trophy', 'clue_nylon_thread']
    },
    {
      id: 'obj_disprove_suicide',
      title: 'Disprove the Locked-Room Suicide',
      description: 'Find evidence that the door was locked from outside and the suicide note was forged.',
      completed: false,
      requiredDeductionIds: ['deduction_locked_room']
    },
    {
      id: 'obj_investigate_bar',
      title: 'Trace Arthur\'s Final Movements',
      description: 'Investigate The Velvet Lounge on 4th Street to verify Arthur\'s last confirmed hours.',
      completed: false,
      requiredEvidenceIds: ['clue_velvet_receipt']
    },
    {
      id: 'obj_break_alibi',
      title: 'Shatter the Key Suspect\'s Alibi',
      description: 'Obtain physical proof contradicting Councilman Sterling\'s charity gala alibi.',
      completed: false,
      requiredEvidenceIds: ['clue_parking_ticket']
    },
    {
      id: 'obj_find_motive',
      title: 'Uncover the True Motive & Conspiracy',
      description: 'Locate the Harbor Scandal dossier and proof of financial payoff.',
      completed: false,
      requiredEvidenceIds: ['clue_harbor_draft', 'clue_bank_transfer']
    },
    {
      id: 'obj_prepare_accusation',
      title: 'Build Airtight Deduction Board',
      description: 'Complete key deductions on the Murder Board to assemble a flawless case for prosecution.',
      completed: false,
      requiredDeductionIds: ['deduction_sterling_alibi_broken', 'deduction_rossi_conspiracy', 'deduction_forgery_link']
    }
  ],
  correctAccusation: {
    culpritId: 'suspect_sterling',
    motiveId: 'motive_silence_expose',
    methodId: 'method_poison_blunt_locked',
    requiredKeyEvidenceIds: [
      'clue_parking_ticket',
      'clue_sterling_pen',
      'clue_whiskey_glass',
      'clue_bank_transfer',
      'clue_cigar_ash'
    ]
  }
};
