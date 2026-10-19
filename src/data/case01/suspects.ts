import type { Suspect } from '../../case/SuspectData';

export const CASE_SUSPECTS: Record<string, Suspect> = {
  suspect_reed: {
    id: 'suspect_reed',
    name: 'Sergeant Thomas Reed',
    title: 'Precinct Homicide Detective',
    avatar: 'reed',
    bio: 'A 20-year veteran of the city police force, tired, cynical, and weary of City Hall politics. He respected Vance\'s reporting but knows when powerful people want a case buried.',
    relationshipToVictim: 'Former informant and contact for Vance\'s police beat stories.',
    knownAlibi: 'On duty at the central precinct during the night.',
    hiddenInformation: 'Was ordered directly by Deputy Commissioner to treat Vance\'s death as an open-and-shut suicide or robbery.',
    currentLocation: 'loc_crime_scene',
    initialDialogueNodeId: 'reed_intro',
    dialogueNodes: {
      reed_intro: {
        id: 'reed_intro',
        speaker: 'Sergeant Reed',
        text: 'Alex. Glad you got here. Higher-ups already want me to stamp this as a tragic suicide and call it a day. Locked door, note by the machine. Clean and tidy.',
        portraitMood: 'neutral',
        choices: [
          {
            id: 'c_reed_locked',
            text: 'A locked door doesn\'t mean suicide, Tom. What did the medical examiner say?',
            nextNodeId: 'reed_autopsy'
          },
          {
            id: 'c_reed_ransacked',
            text: 'The desk looks turned upside down. If it\'s suicide, who searched the room?',
            nextNodeId: 'reed_scene_details'
          },
          {
            id: 'c_reed_press',
            text: 'Who else has been in and out of this building tonight?',
            nextNodeId: 'reed_witnesses'
          }
        ]
      },
      reed_autopsy: {
        id: 'reed_autopsy',
        speaker: 'Sergeant Reed',
        text: 'Here\'s the preliminary autopsy sheet. Doc says skull fracture from blunt trauma, but there\'s also strange chemical paralysis in the blood. Doesn\'t make sense for a self-inflicted wound.',
        portraitMood: 'nervous',
        awardEvidenceId: 'clue_autopsy_report',
        choices: [
          {
            id: 'c_reed_autopsy_thanks',
            text: 'I\'ll examine the room myself. Keep the press outside.',
            nextNodeId: 'reed_stay'
          }
        ]
      },
      reed_scene_details: {
        id: 'reed_scene_details',
        speaker: 'Sergeant Reed',
        text: 'Good eye. The drawers were yanked out and the wall safe behind the maritime painting was left swinging wide open. Someone took files, not jewelry.',
        portraitMood: 'neutral',
        choices: [
          {
            id: 'c_reed_to_autopsy',
            text: 'Give me the coroner\'s report.',
            nextNodeId: 'reed_autopsy'
          }
        ]
      },
      reed_witnesses: {
        id: 'reed_witnesses',
        speaker: 'Sergeant Reed',
        text: 'The landlady saw Arthur\'s junior reporter, Evelyn Cross, storming down the stairs around nine-thirty. Later, around ten, Arthur was seen walking toward the Velvet Lounge on 4th Street.',
        portraitMood: 'neutral',
        unlockLocation: 'loc_newspaper_office',
        choices: [
          {
            id: 'c_reed_unlock_herald',
            text: 'I should pay Miss Cross a visit at the Herald newsroom.',
            nextNodeId: 'reed_stay'
          }
        ]
      },
      reed_stay: {
        id: 'reed_stay',
        speaker: 'Sergeant Reed',
        text: 'Take your time looking around the crime scene, Morgan. Let me know if you find anything that blows this suicide story out of the water.',
        portraitMood: 'neutral',
        isEndNode: true
      }
    },
    evidenceReactions: {
      clue_nylon_thread: {
        response: 'Nylon line in the strike plate? Damn it... they threw the deadbolt from the hallway! That blows the locked-room theory completely open!',
        mood: 'shocked',
        unlocksTopicId: 'reed_breakthrough'
      },
      clue_whiskey_glass: {
        response: 'Poison residue on the scotch glass? So Vance was paralyzed before he was struck. Cold-blooded premeditation.',
        mood: 'nervous'
      },
      clue_cigar_ash: {
        response: 'Bolivar cigar ash? Only the fat cats in the Harbor Commission smoke those. Sterling was Vance\'s biggest target.',
        mood: 'nervous'
      }
    },
    contradictions: []
  },

  suspect_evelyn: {
    id: 'suspect_evelyn',
    name: 'Evelyn Cross',
    title: 'Investigative Reporter at Metro Herald',
    avatar: 'evelyn',
    bio: 'Sharp, fiercely ambitious, and eager to prove herself in a male-dominated newsroom. Arthur Vance was her mentor and rival.',
    relationshipToVictim: 'Protege and co-investigator on municipal corruption beats.',
    knownAlibi: 'Claims she was working in the Herald newspaper archives all evening until past midnight.',
    hiddenInformation: 'Visited Arthur at 9:30 PM and stole a duplicate key to his filing cabinet.',
    currentLocation: 'loc_newspaper_office',
    initialDialogueNodeId: 'evelyn_intro',
    dialogueNodes: {
      evelyn_intro: {
        id: 'evelyn_intro',
        speaker: 'Evelyn Cross',
        text: 'Detective Morgan. Please tell me you don\'t believe Arthur killed himself. He was twelve hours away from publishing the biggest exposé of his life!',
        portraitMood: 'angry',
        choices: [
          {
            id: 'c_evelyn_story',
            text: 'Tell me about this story he was working on.',
            nextNodeId: 'evelyn_expose'
          },
          {
            id: 'c_evelyn_alibi',
            text: 'Where were you last night between nine and midnight?',
            nextNodeId: 'evelyn_claim_alibi'
          },
          {
            id: 'c_evelyn_threats',
            text: 'Did Arthur receive any specific threats recently?',
            nextNodeId: 'evelyn_threats_node'
          }
        ]
      },
      evelyn_expose: {
        id: 'evelyn_expose',
        speaker: 'Evelyn Cross',
        text: 'The Waterfront Grift. Councilman Marcus Sterling was pocketing kickbacks to rezone the public docks for offshore syndicate front-companies. Arthur had the financial transfers locked in his office cabinet.',
        portraitMood: 'neutral',
        choices: [
          {
            id: 'c_evelyn_cabinet_key',
            text: 'The cabinet is locked. Do you know where the key is?',
            nextNodeId: 'evelyn_cabinet'
          }
        ]
      },
      evelyn_cabinet: {
        id: 'evelyn_cabinet',
        speaker: 'Evelyn Cross',
        text: 'Arthur kept the spare brass key taped underneath the archive index desk drawer. Here, take it. Take the dossier before the editor buries it!',
        portraitMood: 'nervous',
        awardEvidenceId: 'clue_harbor_draft',
        choices: [
          {
            id: 'c_evelyn_return',
            text: 'I have the dossier. Now tell me about your movements last night.',
            nextNodeId: 'evelyn_claim_alibi'
          }
        ]
      },
      evelyn_claim_alibi: {
        id: 'evelyn_claim_alibi',
        speaker: 'Evelyn Cross',
        text: 'I stayed right here in the Herald archives sorting microfilm until two in the morning. I never left this newsroom the entire night.',
        portraitMood: 'neutral',
        triggerContradictionId: 'contra_evelyn_alibi',
        choices: [
          {
            id: 'c_evelyn_end',
            text: 'I\'ll look around the newsroom.',
            nextNodeId: 'evelyn_stay'
          }
        ]
      },
      evelyn_threats_node: {
        id: 'evelyn_threats_node',
        speaker: 'Evelyn Cross',
        text: 'Sterling came here two days ago. He looked like he wanted to strangle Arthur on the newsroom floor. He muttered something about "dock accidents" if the presses rolled.',
        portraitMood: 'angry',
        choices: [
          {
            id: 'c_evelyn_back_intro',
            text: 'Understood.',
            nextNodeId: 'evelyn_stay'
          }
        ]
      },
      evelyn_confronted_badge: {
        id: 'evelyn_confronted_badge',
        speaker: 'Evelyn Cross',
        text: 'All right! Stop! Yes, I was there at nine-thirty! I went to Arthur\'s apartment to beg him to share the byline—I spent six months digging up the dock records! We yelled, he told me to get out, and I stormed off. But he was alive, drinking scotch and typing when I left! I swear on my life!',
        portraitMood: 'shocked',
        choices: [
          {
            id: 'c_evelyn_rossi_lead',
            text: 'Did Arthur mention where he was going next?',
            nextNodeId: 'evelyn_rossi_mention'
          }
        ]
      },
      evelyn_rossi_mention: {
        id: 'evelyn_rossi_mention',
        speaker: 'Evelyn Cross',
        text: 'He said he had an appointment with Vince Rossi at the Velvet Lounge to get an audio confirmation of the payoff. Check the Velvet Lounge on 4th Street!',
        portraitMood: 'neutral',
        unlockLocation: 'loc_velvet_lounge',
        choices: [
          {
            id: 'c_evelyn_done',
            text: 'Stay in the city, Miss Cross. Don\'t leave town.',
            nextNodeId: 'evelyn_stay'
          }
        ]
      },
      evelyn_stay: {
        id: 'evelyn_stay',
        speaker: 'Evelyn Cross',
        text: 'Find whoever did this, Morgan. Arthur was stubborn as hell, but he believed in the truth.',
        portraitMood: 'neutral',
        isEndNode: true
      }
    },
    evidenceReactions: {
      clue_evelyn_badge: {
        response: 'My... my press pass? Oh god... you found it in Arthur\'s stairwell, didn\'t you?',
        mood: 'shocked',
        unlocksTopicId: 'evelyn_confronted_badge'
      },
      clue_harbor_draft: {
        response: 'That\'s Arthur\'s draft! Look at section 3: it names Vince Rossi\'s shell company as the bagman for Councilman Sterling!',
        mood: 'neutral',
        unlocksLocationId: 'loc_velvet_lounge'
      },
      clue_forged_suicide_note: {
        response: 'This handwriting is ridiculous! Arthur always used a heavy black fountain pen and wrote in tiny upright cursive. This slant is left-handed!',
        mood: 'angry'
      }
    },
    contradictions: [
      {
        id: 'contra_evelyn_alibi',
        statementId: 'evelyn_claim_alibi',
        statementText: 'I stayed right here in the Herald archives sorting microfilm until two in the morning. I never left this newsroom the entire night.',
        expectedEvidenceId: 'clue_evelyn_badge',
        successDialogueNodeId: 'evelyn_confronted_badge',
        failureDialogueNodeId: 'evelyn_claim_alibi',
        breakthroughTitle: 'CONTRADICTION: STAIRWELL PRESS BADGE',
        breakthroughDescription: 'Evelyn claimed she never left the Herald newsroom, but her fresh press badge was found on the wet stairwell of Arthur\'s building!'
      }
    ]
  },

  suspect_rossi: {
    id: 'suspect_rossi',
    name: 'Vincent "Vince" Rossi',
    title: 'Owner of the Velvet Lounge',
    avatar: 'rossi',
    bio: 'Smooth-talking speakeasy operator with sleek pomade hair, expensive suits, and deep ties to waterfront smuggling syndicates.',
    relationshipToVictim: 'Informal source and bar host for Arthur Vance.',
    knownAlibi: 'Behind the bar at the Velvet Lounge all evening.',
    hiddenInformation: 'Was bribed $50,000 by Sterling to poison Vance\'s scotch and lie about the departure timeline.',
    currentLocation: 'loc_velvet_lounge',
    initialDialogueNodeId: 'rossi_intro',
    dialogueNodes: {
      rossi_intro: {
        id: 'rossi_intro',
        speaker: 'Vince Rossi',
        text: 'Afternoon, detective. Sad business about Vance. Poor guy looked stressed to the bone. Have a drink on the house while we reminisce.',
        portraitMood: 'smug',
        choices: [
          {
            id: 'c_rossi_timeline',
            text: 'I\'m not drinking, Rossi. Tell me about Vance\'s visit last night.',
            nextNodeId: 'rossi_timeline_lie'
          },
          {
            id: 'c_rossi_sterling',
            text: 'What business does Councilman Sterling have in your back room?',
            nextNodeId: 'rossi_sterling_deflect'
          },
          {
            id: 'c_rossi_inspect',
            text: 'Mind if I take a look around your bar and alley?',
            nextNodeId: 'rossi_inspect_node'
          }
        ]
      },
      rossi_timeline_lie: {
        id: 'rossi_timeline_lie',
        speaker: 'Vince Rossi',
        text: 'Arthur was sitting right on stool three, nursing his scotch until eleven-fifteen at night. He said goodnight at eleven-fifteen sharp and walked out healthy as a bull.',
        portraitMood: 'smug',
        triggerContradictionId: 'contra_rossi_timeline',
        choices: [
          {
            id: 'c_rossi_end_lie',
            text: 'Eleven-fifteen. You\'re sure about that time?',
            nextNodeId: 'rossi_stay'
          }
        ]
      },
      rossi_sterling_deflect: {
        id: 'rossi_sterling_deflect',
        speaker: 'Vince Rossi',
        text: 'Councilman Sterling? He\'s a high-class civic leader, Morgan. Doesn\'t frequent a modest neighborhood joint like mine. I only see him in the newspapers.',
        portraitMood: 'neutral',
        choices: [
          {
            id: 'c_rossi_back_intro',
            text: 'Let\'s see if your financial records agree.',
            nextNodeId: 'rossi_stay'
          }
        ]
      },
      rossi_inspect_node: {
        id: 'rossi_inspect_node',
        speaker: 'Vince Rossi',
        text: 'Be my guest, Detective. Just don\'t disturb the patrons. A man\'s privacy is sacred in my establishment.',
        portraitMood: 'neutral',
        choices: [
          {
            id: 'c_rossi_to_stay',
            text: 'I\'ll be watching you, Vince.',
            nextNodeId: 'rossi_stay'
          }
        ]
      },
      rossi_confronted_receipt: {
        id: 'rossi_confronted_receipt',
        speaker: 'Vince Rossi',
        text: 'The... the register tape? Look, so maybe my clock was fast by a half-hour, okay? Arthur paid at ten-forty-five. So what if he left earlier? That doesn\'t make me a killer!',
        portraitMood: 'nervous',
        choices: [
          {
            id: 'c_rossi_poison_press',
            text: 'Who told you to lie about the departure time, Vince?',
            nextNodeId: 'rossi_sweating'
          }
        ]
      },
      rossi_sweating: {
        id: 'rossi_sweating',
        speaker: 'Vince Rossi',
        text: 'Nobody! It was an honest mistake, I swear to God! I just misremembered the hour!',
        portraitMood: 'nervous',
        choices: [
          {
            id: 'c_rossi_sweat_stay',
            text: 'We\'ll see what forensic analysis turns up in your back alley.',
            nextNodeId: 'rossi_stay'
          }
        ]
      },
      rossi_confesses_conspiracy: {
        id: 'rossi_confesses_conspiracy',
        speaker: 'Vince Rossi',
        text: 'Don\'t pin murder on me! Sterling set it all up! He wired fifty grand to my Cayman account and handed me the poison dropper! He told me to spike Vance\'s flask with three drops of monkshood! Sterling said he was going to Vance\'s apartment at eleven-thirty to take back the dossier himself! I just followed orders!',
        portraitMood: 'shocked',
        awardEvidenceId: 'clue_bank_transfer',
        unlockLocation: 'loc_parking_garage',
        choices: [
          {
            id: 'c_rossi_turn_state',
            text: 'You just confessed to accessory to murder, Vince. You\'re going down.',
            nextNodeId: 'rossi_stay'
          }
        ]
      },
      rossi_stay: {
        id: 'rossi_stay',
        speaker: 'Vince Rossi',
        text: 'Talk to my lawyer, Morgan. I\'ve said all I\'m saying.',
        portraitMood: 'nervous',
        isEndNode: true
      }
    },
    evidenceReactions: {
      clue_velvet_receipt: {
        response: 'Ten-forty-five on my register? A-ah, well, maybe my register time was miscalibrated...',
        mood: 'nervous',
        unlocksTopicId: 'rossi_confronted_receipt'
      },
      clue_poison_phial: {
        response: 'Where did you get that vial?! That... that was just rat poison for the basement! You have no right digging through my trash!',
        mood: 'shocked',
        unlocksTopicId: 'rossi_confesses_conspiracy'
      },
      clue_bank_transfer: {
        response: 'Fifty grand from Sterling Holdings... How did you crack my safe?! Please, Morgan, Sterling will have me whacked if I talk!',
        mood: 'shocked',
        unlocksTopicId: 'rossi_confesses_conspiracy'
      }
    },
    contradictions: [
      {
        id: 'contra_rossi_timeline',
        statementId: 'rossi_timeline_lie',
        statementText: 'Arthur was sitting right on stool three, nursing his scotch until eleven-fifteen at night. He said goodnight at eleven-fifteen sharp and walked out healthy as a bull.',
        expectedEvidenceId: 'clue_velvet_receipt',
        successDialogueNodeId: 'rossi_confronted_receipt',
        failureDialogueNodeId: 'rossi_timeline_lie',
        breakthroughTitle: 'CONTRADICTION: CASH REGISTER RECEIPT',
        breakthroughDescription: 'Vince claimed Arthur Vance drank at the bar until 11:15 PM, but the register roll proves Arthur closed his tab and departed at 10:45 PM!'
      }
    ]
  },

  suspect_sterling: {
    id: 'suspect_sterling',
    name: 'Councilman Marcus Sterling',
    title: 'City Council Member & Real Estate Mogul',
    avatar: 'sterling',
    bio: 'Polished, wealthy, influential, and utterly ruthless. Wears bespoke tailored suits, smokes imported Bolivar cigars, and wields immense political leverage over city hall and law enforcement.',
    relationshipToVictim: 'Target of Vance\'s front-page anti-corruption investigation.',
    knownAlibi: 'Claims he was in plain sight at the St. Jude Charity Gala downtown from 8:00 PM until 2:00 AM.',
    hiddenInformation: 'Personally slipped away from the gala at 11:15 PM, drove to Riverview Garage, murdered Vance, staged the scene, and returned to the ball.',
    currentLocation: 'loc_sterling_office',
    initialDialogueNodeId: 'sterling_intro',
    dialogueNodes: {
      sterling_intro: {
        id: 'sterling_intro',
        speaker: 'Councilman Sterling',
        text: 'Detective Morgan. To what do I owe this intrusion? I am a busy man preparing the municipal harbor redevelopment package.',
        portraitMood: 'smug',
        choices: [
          {
            id: 'c_sterling_vance',
            text: 'Arthur Vance was murdered last night, Councilman.',
            nextNodeId: 'sterling_vance_mock'
          },
          {
            id: 'c_sterling_alibi',
            text: 'I need to verify your whereabouts between eleven and midnight.',
            nextNodeId: 'sterling_alibi_claim'
          },
          {
            id: 'c_sterling_threat',
            text: 'Vance recorded an audio memo stating you threatened his life.',
            nextNodeId: 'sterling_threat_deny'
          }
        ]
      },
      sterling_vance_mock: {
        id: 'sterling_vance_mock',
        speaker: 'Councilman Sterling',
        text: 'A shame. Vance was a sensationalist tabloid hack who chased phantom conspiracies. Suicide was the logical end for a man drowned in his own delusions.',
        portraitMood: 'smug',
        choices: [
          {
            id: 'c_sterling_ask_alibi',
            text: 'Account for your movements last night.',
            nextNodeId: 'sterling_alibi_claim'
          }
        ]
      },
      sterling_alibi_claim: {
        id: 'sterling_alibi_claim',
        speaker: 'Councilman Sterling',
        text: 'I was the keynote guest of honor at the St. Jude Charity Gala at the Grand Ballroom from eight in the evening until two past midnight. Two hundred civic luminaries can testify I never left the ballroom for a single minute.',
        portraitMood: 'smug',
        triggerContradictionId: 'contra_sterling_gala',
        choices: [
          {
            id: 'c_sterling_leave_stay',
            text: 'Two hundred guests? We\'ll see about that.',
            nextNodeId: 'sterling_stay'
          }
        ]
      },
      sterling_threat_deny: {
        id: 'sterling_threat_deny',
        speaker: 'Councilman Sterling',
        text: 'A fabricated tape from a dying drunkard. No court in this state would admit such hearsay. Watch your step, Detective. Mayors come and go; my family built this skyline.',
        portraitMood: 'angry',
        choices: [
          {
            id: 'c_sterling_to_alibi',
            text: 'Let\'s talk about your alibi instead.',
            nextNodeId: 'sterling_alibi_claim'
          }
        ]
      },
      sterling_confronted_parking: {
        id: 'sterling_confronted_parking',
        speaker: 'Councilman Sterling',
        text: 'What is this rubbish? A parking stub?! Anyone could have borrowed my Packard! My chauffeur... my assistant...',
        portraitMood: 'shocked',
        choices: [
          {
            id: 'c_sterling_press_cigar',
            text: 'Your chauffeur doesn\'t smoke custom imported Bolivar cigars on Vance\'s balcony.',
            nextNodeId: 'sterling_trapped'
          }
        ]
      },
      sterling_trapped: {
        id: 'sterling_trapped',
        speaker: 'Councilman Sterling',
        text: 'You insolent street cop... you have no idea the forces you are unleashing! You think Arthur Vance was a martyr? He wanted to burn down a thirty-million-dollar harbor revitalisation over a technicality!',
        portraitMood: 'angry',
        choices: [
          {
            id: 'c_sterling_final_warning',
            text: 'Prepare your lawyers, Sterling. The evidence is ready for the indictment.',
            nextNodeId: 'sterling_stay'
          }
        ]
      },
      sterling_stay: {
        id: 'sterling_stay',
        speaker: 'Councilman Sterling',
        text: 'Get out of my office, Morgan. Before I have your badge melted for scrap.',
        portraitMood: 'angry',
        isEndNode: true
      }
    },
    evidenceReactions: {
      clue_parking_ticket: {
        response: 'A garage ticket from Riverview? How did you... that proves nothing! A towncar can be driven by anyone!',
        mood: 'shocked',
        unlocksTopicId: 'sterling_confronted_parking'
      },
      clue_cigar_ash: {
        response: 'Bolivar ash? Half the gentlemen\'s club smokes those! You\'re reaching, detective!',
        mood: 'nervous'
      },
      clue_sterling_pen: {
        response: 'That is my personal pen! Put that down immediately, that is private property!',
        mood: 'angry'
      },
      clue_audio_tape: {
        response: 'Arthur\'s voice... he recorded our conversation?! That ungrateful bastard!',
        mood: 'shocked'
      }
    },
    contradictions: [
      {
        id: 'contra_sterling_gala',
        statementId: 'sterling_alibi_claim',
        statementText: 'I was the keynote guest of honor at the St. Jude Charity Gala at the Grand Ballroom from eight in the evening until two past midnight. Two hundred civic luminaries can testify I never left the ballroom for a single minute.',
        expectedEvidenceId: 'clue_parking_ticket',
        successDialogueNodeId: 'sterling_confronted_parking',
        failureDialogueNodeId: 'sterling_alibi_claim',
        breakthroughTitle: 'CONTRADICTION: GARAGE PARKING STUB',
        breakthroughDescription: 'Sterling claimed he never left the downtown gala for a single minute, but his private Packard Twelve was logged into Riverview Garage right across from Vance\'s apartment from 11:28 PM to 11:58 PM!'
      }
    ]
  }
};
