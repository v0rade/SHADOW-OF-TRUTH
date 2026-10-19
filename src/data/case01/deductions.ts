import type { DeductionRule } from '../../case/CaseData';

export const CASE_DEDUCTIONS: DeductionRule[] = [
  {
    id: 'deduction_locked_room',
    title: 'Staged Locked Room Suicide',
    description: 'How did the killer exit an apartment deadbolted from the inside?',
    clueAId: 'clue_nylon_thread',
    clueBId: 'clue_forged_suicide_note',
    resultingFact: 'The killer threw the deadbolt from outside the hallway using monofilament nylon line and planted a forged note.',
    explanation: 'The scratches on the brass deadbolt and scorched weatherstripping reveal the classic wire trick. An intruder exited and locked it from the exterior corridor.',
    hint: 'Examine physical traces around the apartment door and the suspicious note left by the typewriter.',
    unlocksObjectiveId: 'obj_find_motive'
  },
  {
    id: 'deduction_poison_incapacitation',
    title: 'Pre-Assault Poisoning',
    description: 'Why was Arthur Vance unable to defend himself or reach his desk revolver?',
    clueAId: 'clue_whiskey_glass',
    clueBId: 'clue_autopsy_report',
    resultingFact: 'Aconite neurotoxin in the single-malt scotch paralyzed Vance before the killer delivered the fatal blow with the brass trophy.',
    explanation: 'Toxicology and chemical residue on the glass rim reveal a lethal dose of aconite was ingested 15-20 minutes before death, incapacitating his motor reflexes.',
    hint: 'Connect the chemical residue in the glass with the medical examiner\'s toxicology findings.',
    unlocksObjectiveId: 'obj_investigate_bar'
  },
  {
    id: 'deduction_sterling_alibi_broken',
    title: "Sterling's Broken Alibi",
    description: 'Can Councilman Sterling\'s charity gala alibi withstand scrutiny against the crime timeline?',
    clueAId: 'clue_parking_ticket',
    clueBId: 'clue_smashed_watch',
    resultingFact: 'Sterling was parked across from Vance\'s apartment from 11:28 PM to 11:58 PM, precisely during the 11:42 PM murder.',
    explanation: 'The Riverview Garage ticket timestamp places Sterling\'s car right across from the victim\'s building during the exact minute Arthur\'s pocket watch stopped.',
    hint: 'Compare the garage attendant\'s time ticket with the time frozen on the victim\'s pocket watch.',
    unlocksLocationId: 'loc_sterling_office'
  },
  {
    id: 'deduction_rossi_conspiracy',
    title: 'The $50,000 Payoff Conspiracy',
    description: 'What was the relationship between Vince Rossi and Marcus Sterling regarding Vance?',
    clueAId: 'clue_bank_transfer',
    clueBId: 'clue_poison_phial',
    resultingFact: 'Sterling wired $50,000 to Rossi\'s offshore account to supply aconite poison and provide false testimony.',
    explanation: 'The wire transfer memo "Special Project Vance" matches the aconite dropper found in Rossi\'s alleyway waste bin.',
    hint: 'Link the wire transfer slip from the safe with the poison container found in the alley.',
    unlocksObjectiveId: 'obj_confront_rossi'
  },
  {
    id: 'deduction_forgery_link',
    title: 'The Forger Unmasked',
    description: 'Who wrote the forged suicide note found in Vance\'s typewriter?',
    clueAId: 'clue_forged_suicide_note',
    clueBId: 'clue_sterling_pen',
    resultingFact: 'Sterling authored the forged suicide note using his exclusive boutique peacock-blue fountain pen.',
    explanation: 'Dye analysis proves the note was written using the proprietary ink blend exclusively imported for Marcus Sterling\'s gold Meisterstück pen.',
    hint: 'Look at the unusual colored ink on the suicide note and compare it with personal stationery items.',
    unlocksObjectiveId: 'obj_prepare_accusation'
  }
];
