# -*- coding: utf-8 -*-
"""
나경이 (중3) 영어 독해 50문항 세트 (20개 지문)
- 1지문당 2~3문항 연결 복합 독해 구조
- 10지문 x 3문항 = 30문항
- 10지문 x 2문항 = 20문항
- 총 50문항 (M3_ENG_041 ~ M3_ENG_090)
"""

NAKYUNG_ENG_PASSAGES = [
    # 지문 1 (3문항) - Growth Mindset & Overcoming Failure (Lesson 5)
    (
        "Many people believe that natural talent is the most important factor in achieving success. However, psychologist Carol Dweck introduced the concept of the 'growth mindset,' which suggests that intelligence and abilities can be developed through dedication and hard work. People with a fixed mindset often avoid challenges because they fear failure. In contrast, those with a growth mindset view mistakes not as a sign of weakness, but as valuable opportunities to learn. Research shows that students who embrace a growth mindset show greater persistence when facing difficult problems and achieve higher academic performance over time.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "What is the main topic of the passage?",
                [
                    "The history of modern educational psychology",
                    "The importance of natural talent over continuous practice",
                    "The concept of growth mindset and its positive impact on learning",
                    "Techniques for avoiding difficult challenges in daily life",
                    "How to prepare for competitive examinations without mistakes"
                ],
                3,
                "본문은 고정 마인드셋과 대비하여 도전과 실패를 성장의 기회로 삼는 성장 마인드셋의 개념과 긍정적 효과를 설명하고 있습니다."
            ),
            (
                "According to the passage, how do people with a growth mindset view mistakes?",
                [
                    "As permanent signs of personal weakness",
                    "As valuable opportunities to learn and grow",
                    "As reasons to immediately give up their goals",
                    "As proof that natural talent does not exist",
                    "As dangerous errors that must be hidden from others"
                ],
                2,
                "본문에서 'those with a growth mindset view mistakes not as a sign of weakness, but as valuable opportunities to learn'이라고 명시되어 있습니다."
            ),
            (
                "Which of the following is true according to the passage?",
                [
                    "People with a fixed mindset eagerly seek out new challenges.",
                    "Psychologist Carol Dweck proved that talent never changes.",
                    "Growth mindset students show greater persistence when facing difficulty.",
                    "Intelligence cannot be developed through dedication and effort.",
                    "Academic performance has no connection to how one views failure."
                ],
                3,
                "본문 마지막 문장에서 성장 마인드셋을 가진 학생들이 어려운 문제에 직면했을 때 더 큰 끈기(persistence)를 보인다고 서술되어 있습니다."
            )
        ]
    ),

    # 지문 2 (2문항) - Upcycling Art & Environmental Design (Lesson 6)
    (
        "Every year, billions of tons of municipal waste end up in landfills, causing severe environmental degradation. In response to this global crisis, artists and eco-conscious designers are turning to 'upcycling.' Unlike traditional recycling, which breaks down materials into raw components often with energy-intensive industrial processes, upcycling transforms discarded items into products of higher aesthetic or practical value. For example, old vinyl truck tarpaulins are converted into durable, trendy messenger bags, and discarded shipping containers are redesigned into modern community libraries. Through upcycling, waste is not merely disposed of, but creatively reborn as functional art.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What is the fundamental difference between upcycling and traditional recycling?",
                [
                    "Recycling creates more valuable art than upcycling.",
                    "Upcycling converts discarded objects into higher-value products through creative design.",
                    "Recycling requires no industrial processes or energy consumption.",
                    "Upcycling only deals with electronic waste from large factories.",
                    "Traditional recycling never breaks down materials into raw components."
                ],
                2,
                "재활용은 원료로 분해하는 반면, 업사이클링은 버려지는 물건을 더 높은 미적·실용적 가치를 지닌 제품으로 재탄생시키는 차이가 있습니다."
            ),
            (
                "Which example of upcycling is mentioned in the passage?",
                [
                    "Burning plastic bottles to produce thermal energy",
                    "Converting old truck tarpaulins into trendy messenger bags",
                    "Burying municipal waste deep inside desert landfills",
                    "Tearing down historical libraries to build modern glass towers",
                    "Melting aluminum cans back into raw metal ingots"
                ],
                2,
                "본문에서 트럭 방수포를 유행하는 메신저 가방으로 만든 사례가 구체적으로 언급되었습니다."
            )
        ]
    ),

    # 지문 3 (3문항) - Artificial Intelligence & Future Jobs (Lesson 7)
    (
        "As artificial intelligence and automation advance at an unprecedented pace, the global job market is undergoing a profound transformation. Repetitive tasks and routine administrative jobs are increasingly handled by intelligent algorithms. While some fear massive technological unemployment, experts emphasize that AI will also generate new occupations, such as AI ethicists, prompt engineers, and robotic data curators. To thrive in this future workforce, young people must cultivate uniquely human competencies that algorithms cannot easily replicate—critical thinking, emotional empathy, and creative problem-solving. Education must therefore shift from rote memorization toward collaborative creativity.",
        "Lesson 7. Prepare for the Future (Reading)",
        [
            (
                "What is the main argument expressed in the passage?",
                [
                    "All administrative jobs will disappear within the next few months.",
                    "Humans should completely halt the development of artificial intelligence.",
                    "Young people need to cultivate human qualities like empathy and creativity for the AI era.",
                    "Memorization of factual data remains the most valuable skill for the future.",
                    "Robots will replace human emotions in all professional fields."
                ],
                3,
                "인공지능 시대에 기계가 대체하기 어려운 공감 능력, 비판적 사고, 창의적 문제 해결력을 길러야 한다는 것이 중심 논지입니다."
            ),
            (
                "Which new profession is explicitly mentioned as an emerging job in the AI era?",
                [
                    "Manual factory assembler",
                    "Steam locomotive conductor",
                    "AI ethicist",
                    "Traditional postal letter carrier",
                    "Mechanical typewriter repairer"
                ],
                3,
                "본문에서 'AI ethicists, prompt engineers, and robotic data curators'가 새로운 직업군으로 명시되었습니다."
            ),
            (
                "According to the passage, how should the educational focus change?",
                [
                    "From collaborative creativity to strict individual rote memorization",
                    "From memorization toward critical thinking and collaborative creativity",
                    "From computer science to ancient classical language translation",
                    "By replacing all human teachers with automated robots immediately",
                    "By eliminating teamwork and focusing solely on standardized tests"
                ],
                2,
                "마지막 문장에서 단순 암기 위주에서 협력적 창의성과 비판적 사고로 교육의 초점이 바뀌어야 한다고 강조했습니다."
            )
        ]
    ),

    # 지문 4 (2문항) - Sherlock Holmes & Critical Observation (Lesson 8)
    (
        "Arthur Conan Doyle's famous detective, Sherlock Holmes, frequently remarked to his loyal companion Dr. Watson, 'You see, but you do not observe.' By this, Holmes meant that while the average person merely looks at their surroundings passively, an astute investigator actively analyzes subtle details that others overlook. For instance, Holmes could deduce a stranger's profession, recent travels, and emotional state simply by noticing the mud stains on their shoes, wear patterns on their cuffs, or slight calluses on their fingers. Holmes's brilliance lies not in supernatural intuition, but in disciplined, evidence-based logical deduction.",
        "Lesson 8. Who Is the Real Culprit? (Reading)",
        [
            (
                "What does Holmes mean by 'You see, but you do not observe'?",
                [
                    "People often have serious optical health problems.",
                    "Looking passively is different from actively noticing and analyzing details.",
                    "Watson should wear stronger reading glasses during investigations.",
                    "Observing physical objects is completely unnecessary for solving crimes.",
                    "Human beings can only perceive supernatural signals in dreams."
                ],
                2,
                "단순히 수동적으로 쳐다보는 것과 미세한 단서를 능동적으로 관찰하고 분석하는 것의 차이를 지적한 말입니다."
            ),
            (
                "According to the passage, what is the true source of Holmes's deductive genius?",
                [
                    "Supernatural magical powers granted at birth",
                    "Disciplined, evidence-based logical deduction and acute observation",
                    "Continuous guessing without inspecting any physical evidence",
                    "Relying entirely on confessions without looking at clues",
                    "Using advanced satellite tracking technologies in Victorian London"
                ],
                2,
                "본문 마지막 문장에서 홈즈의 뛰어남은 초자연적 직관이 아닌 철저한 증거 기반 논리적 연역과 훈련된 관찰력에 있다고 했습니다."
            )
        ]
    ),

    # 지문 5 (3문항) - The Science of Sleep and Brain Cleaning
    (
        "For decades, sleep was viewed as a passive state during which the body and mind merely rested. However, recent neurobiological research has revealed that sleep is a highly dynamic process essential for brain health. While we are in deep slumber, the brain activates the 'glymphatic system,' a specialized waste clearance network. Fluid rushes through the brain tissue, sweeping away metabolic toxins that accumulated during our waking hours, including beta-amyloid proteins associated with neurological disorders. Furthermore, sleep is crucial for memory consolidation; the hippocampus replays daily experiences, transferring key information into the cerebral cortex for long-term storage.",
        "Lesson 7. Prepare for the Future (Reading)",
        [
            (
                "What is the primary function of the 'glymphatic system' described in the passage?",
                [
                    "To generate extra body heat during cold winter nights",
                    "To clear away metabolic waste and toxic proteins from brain tissue during sleep",
                    "To prevent the stomach from digesting food while asleep",
                    "To accelerate physical muscle growth during morning exercise",
                    "To produce bright visual dreams in the cerebral cortex"
                ],
                2,
                "글림프계는 수면 중에 뇌 조직에서 대사 노폐물과 유해 단백질을 씻어내는 정화 시스템입니다."
            ),
            (
                "How does sleep contribute to memory consolidation according to the passage?",
                [
                    "By permanently erasing all memories formed during the previous day",
                    "By transferring key information from the hippocampus to the cortex for long-term storage",
                    "By completely disconnecting the brain from the central nervous system",
                    "By forcing the body to wake up every ninety minutes",
                    "By shrinking the total volume of brain tissue by half"
                ],
                2,
                "수면 중 해마가 낮 동안의 경험을 재생하여 대뇌 피질로 장기 기억을 전송·저장한다고 설명되어 있습니다."
            ),
            (
                "Which statement can be inferred from the text?",
                [
                    "Chronic lack of sleep may prevent proper clearance of toxins from the brain.",
                    "Sleeping for more than two hours per day is harmful to adolescents.",
                    "Beta-amyloid proteins are essential nutrients for physical exercise.",
                    "The brain completely shuts down all cellular activity during deep sleep.",
                    "Memory consolidation occurs only when a person is running or jogging."
                ],
                1,
                "수면 중에 뇌 노폐물과 베타아밀로이드가 정화되므로, 만성적 수면 부족은 뇌 노폐물 배출을 저해할 수 있음을 추론할 수 있습니다."
            )
        ]
    ),

    # 지문 6 (2문항) - Ocean Plastic and The Ocean Cleanup Project
    (
        "Millions of metric tons of plastic waste enter the world's oceans every year, breaking down into microplastics that threaten marine life and enter the human food chain. To combat this ecological disaster, young Dutch inventor Boyan Slat founded 'The Ocean Cleanup' project. Instead of chasing plastic boats across vast oceans, his team developed massive floating barriers that harness natural ocean currents to concentrate and capture floating debris. The collected plastics are then brought ashore and recycled into consumer goods. The initiative proves that youth-driven engineering innovation, combined with environmental passion, can tackle seemingly insurmountable global challenges.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What clever approach does Boyan Slat's ocean barrier use to collect plastic debris?",
                [
                    "Harnessing natural ocean currents to concentrate and capture floating plastics",
                    "Deploying thousands of diesel-powered vacuum ships simultaneously",
                    "Spraying chemical agents to dissolve all ocean plastics instantly",
                    "Building concrete seawalls along every continental coastline",
                    "Training marine animals to deliver plastic trash to coastal harbors"
                ],
                1,
                "자연적인 해류의 흐름을 활용하여 부유하는 플라스틱을 한곳으로 모아 포집하는 방식을 사용합니다."
            ),
            (
                "What is the ultimate message of the passage regarding global problems?",
                [
                    "Individual efforts are entirely useless against environmental pollution.",
                    "Youth-driven innovation and engineering can help resolve difficult global crises.",
                    "All plastic production should be legally shifted to the deep ocean.",
                    "Microplastics have no impact on marine life or the human food chain.",
                    "Natural ocean currents will eliminate plastic waste without human intervention."
                ],
                2,
                "청년 세대의 혁신적 기술과 환경에 대한 열정이 전 지구적인 난제를 해결하는 열쇠가 될 수 있음을 보여줍니다."
            )
        ]
    ),

    # 지문 7 (3문항) - The James Webb Space Telescope
    (
        "Launched in late 2021, the James Webb Space Telescope (JWST) represents the most sophisticated astronomical observatory ever built. Unlike the Hubble Space Telescope, which primarily observed visible and ultraviolet light, Webb is optimized to detect infrared radiation. Because the universe is expanding, light emitted by the earliest stars and galaxies billions of years ago has stretched into longer infrared wavelengths—a phenomenon known as cosmological redshift. Equipped with a gold-coated primary mirror measuring 6.5 meters across and a tennis-court-sized sunshield, Webb can peer through dense cosmic dust clouds to capture the earliest cosmic dawn and inspect the atmospheres of distant exoplanets.",
        "Lesson 7. Prepare for the Future (Reading)",
        [
            (
                "Why is the James Webb Space Telescope specifically designed to detect infrared light?",
                [
                    "Infrared light is much cheaper to process than visible light.",
                    "Cosmological redshift stretches ancient light from early galaxies into infrared wavelengths.",
                    "The Sun emits only infrared rays and no visible radiation.",
                    "Infrared detectors do not require mirrors or cooling systems in space.",
                    "Earth's atmosphere completely blocks visible light from reaching telescopes."
                ],
                2,
                "우주 팽창으로 인한 적색편이 현상으로 인해 초기 은하의 빛이 적외선 영역으로 늘어났기 때문입니다."
            ),
            (
                "What role does the tennis-court-sized sunshield play on the JWST?",
                [
                    "It powers the spacecraft by reflecting solar wind into electric generators.",
                    "It blocks intense heat from the Sun, Earth, and Moon to keep the instruments extremely cold.",
                    "It collects space debris to protect astronaut crews living inside the telescope.",
                    "It catches radio signals transmitted from intelligent extraterrestrial civilizations.",
                    "It acts as a giant parachute to slow down the telescope upon atmospheric reentry."
                ],
                2,
                "거대한 차광막은 태양열을 차단하여 적외선 관측 장비를 극저온 상태로 유지하는 필수적인 역할을 합니다."
            ),
            (
                "Which of the following is NOT mentioned as a capability of the JWST?",
                [
                    "Peering through dense clouds of cosmic dust",
                    "Observing the earliest stars and galaxies of the cosmic dawn",
                    "Inspecting the atmospheric compositions of distant exoplanets",
                    "Transporting human astronauts to establish permanent colonies on Mars",
                    "Detecting faint infrared radiation from ancient celestial bodies"
                ],
                4,
                "제임스 웹 망원경은 무인 우주 관측용 망원경이며, 우주비행사를 화성에 수송하는 기능은 언급되지 않았습니다."
            )
        ]
    ),

    # 지문 8 (2문항) - The Power of Empathy in Friendships
    (
        "True listening is far more than remaining silent while another person speaks. Genuine communication requires empathy—the ability to understand and share the feelings of another from their perspective. When a friend shares a difficult experience, our immediate instinct is often to offer quick advice or minimize their pain by saying, 'Cheer up, it could be worse.' However, what people need most during moments of distress is validation. Simply saying, 'I understand how painful that must be for you, and I am here for you,' builds authentic trust and emotional safety in a relationship.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "According to the passage, what is the core meaning of empathy in communication?",
                [
                    "Giving immediate advice without listening to the details",
                    "Understanding and sharing another person's feelings from their perspective",
                    "Pretending to agree with everyone to avoid arguments",
                    "Remaining completely silent and showing no facial expression",
                    "Telling friends that their problems are insignificant compared to yours"
                ],
                2,
                "상대방의 입장에서 감정을 이해하고 함께 공유하는 것이 공감(empathy)의 본질입니다."
            ),
            (
                "When a friend is going through a tough time, what response does the author recommend?",
                [
                    "'Cheer up, it could be much worse than this.'",
                    "'You should have followed my advice from the beginning.'",
                    "'I understand how painful that must be for you, and I am here for you.'",
                    "'Stop complaining because everyone has hard times.'",
                    "'Let us talk about my successful day instead.'"
                ],
                3,
                "섣부른 조언 대신 고통에 공감하고 곁에 있어 주는 지지의 표현(3번)이 신뢰를 쌓는 가장 바람직한 반응입니다."
            )
        ]
    ),

    # 지문 9 (3문항) - Cultural Heritage and UNESCO: Hanbok & Kimjang
    (
        "Culture is a living reflection of a nation's history, values, and communal spirit. Korea's traditional clothing, Hanbok, with its gentle curves and natural color harmony, reflects a deep philosophical connection to nature and seasonal harmony. Similarly, 'Kimjang,' the annual custom of preparing large quantities of kimchi before winter, is recognized as a UNESCO Intangible Cultural Heritage of Humanity. Kimjang is not merely about culinary preservation; it embodies communal cooperation, mutual aid, and generational transmission of culinary wisdom. Neighbors gather to chop vegetables, share seasoning secrets, and distribute food to elderly residents, reinforcing social bonds.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What is the cultural significance of 'Kimjang' emphasized in the passage?",
                [
                    "It is purely an economic activity to export pickled vegetables overseas.",
                    "It embodies communal solidarity, mutual assistance, and shared cultural wisdom.",
                    "It is a strict legal requirement enforced by regional governments.",
                    "It is designed solely to eliminate traditional Hanbok dress codes.",
                    "It requires modern automated kitchen robots to preserve flavor."
                ],
                2,
                "김장은 단순한 음식 조리를 넘어 이웃 간의 협동, 상부상조, 지혜의 전승이라는 공동체적 연대를 담고 있습니다."
            ),
            (
                "What design philosophy of Hanbok is highlighted in the text?",
                [
                    "Rigid military geometry and metallic synthetic fabrics",
                    "Gentle curves and harmonious colors reflecting a connection to nature",
                    "Dark monochromatic tones intended to hide daily dirt",
                    "Standardized Western fashion styles for office work",
                    "Heavy armor structures built for medieval combat"
                ],
                2,
                "한복의 곡선미와 자연스러운 색감 조화는 자연과의 교감 및 계절의 조화를 담고 있다고 설명했습니다."
            ),
            (
                "Which value is directly strengthened through the communal practice of Kimjang?",
                [
                    "Fierce commercial competition among neighboring families",
                    "Social cohesion and mutual care within the community",
                    "Isolation of elderly residents from family gatherings",
                    "Exclusive patenting of private family recipes",
                    "Total dependence on imported fast food products"
                ],
                2,
                "이웃들이 함께 모여 음식을 만들고 노인들에게 나누어 줌으로써 사회적 유대(social bonds)가 강화됩니다."
            )
        ]
    ),

    # 지문 10 (2문항) - Digital Footprints and Cyber Safety
    (
        "Every time you click a 'Like' button, search for a video, post a photograph, or submit an online comment, you leave behind a digital footprint. Unlike footprints in sand that wash away with the incoming tide, digital footprints can persist indefinitely in cloud servers and search indices. Future employers, university admissions officers, and acquaintances may inspect your public digital trail. Therefore, cultivating proactive digital hygiene—such as utilizing strong passwords, regularly updating privacy settings, and reflecting critically before clicking 'Share'—is vital for safeguarding your digital identity.",
        "Lesson 8. Who Is the Real Culprit? (Reading)",
        [
            (
                "Why are digital footprints compared unfavorably to footprints in the sand?",
                [
                    "Footprints in sand require expensive internet connections to form.",
                    "Digital footprints persist indefinitely instead of disappearing naturally like sand prints.",
                    "Sand footprints can be easily sold to international advertising firms.",
                    "Digital footprints can only be created by trained software engineers.",
                    "Footprints in sand are legally protected by copyright regulations."
                ],
                2,
                "모래 발자국은 파도에 씻겨 지워지지만, 디지털 발자국은 서버에 영구히 남아 사라지지 않는다는 대조입니다."
            ),
            (
                "Which proactive habit is recommended to safeguard one's digital identity?",
                [
                    "Sharing personal account passwords openly with online gaming friends",
                    "Accepting all unknown follow requests on social media automatically",
                    "Reflecting critically on content and consequences before clicking 'Share'",
                    "Disabling all privacy settings to maximize post visibility",
                    "Uploading high-resolution photos of official government identification"
                ],
                3,
                "게시물을 공유하기 전에 비판적으로 신중히 생각하고 공유하는 태도(3번)가 권장되는 디지털 위생 습관입니다."
            )
        ]
    ),

    # 지문 11 (3문항) - Renewable Energy and Smart Grids
    (
        "Traditional power grids were designed around centralized fossil-fuel power plants that generated electricity steadily in one direction toward passive consumers. However, the shift toward renewable energy sources like solar and wind introduces variability, as sunlight and wind fluctuate depending on weather conditions. To resolve this intermittency, engineers are developing 'Smart Grids.' A smart grid integrates digital communication technology, energy storage systems (ESS), and predictive AI algorithms. It monitors electricity demand in real time, automatically rerouting excess renewable energy to charging stations or battery banks, ensuring stable power delivery while minimizing greenhouse gas emissions.",
        "Lesson 7. Prepare for the Future (Reading)",
        [
            (
                "What challenge of solar and wind energy does a smart grid help overcome?",
                [
                    "Excessive carbon emissions during daily electricity generation",
                    "Intermittency and variability caused by fluctuating weather conditions",
                    "The inability of solar panels to generate power during summer afternoons",
                    "The high radiation toxicity of wind turbine blades",
                    "The requirement of building massive coal furnaces inside cities"
                ],
                2,
                "날씨에 따라 발전량이 달라지는 재생에너지의 간헐성(intermittency)과 변동성을 해결해 줍니다."
            ),
            (
                "Which technology is incorporated into smart grids to balance electricity supply and demand?",
                [
                    "Steam-powered mechanical printing presses",
                    "Real-time digital communication, energy storage systems, and predictive AI",
                    "Manual telephone switchboards operated by city clerks",
                    "Traditional wooden windmills without electrical wires",
                    "Underground coal gasification chambers without safety valves"
                ],
                2,
                "디지털 통신, 에너지 저장 장치(ESS), 예측 AI 알고리즘을 융합하여 실시간으로 수급을 조절합니다."
            ),
            (
                "What is the ultimate environmental benefit of implementing smart grids?",
                [
                    "Doubling the consumption of petroleum fuel in public buses",
                    "Ensuring stable clean power delivery while minimizing greenhouse gas emissions",
                    "Eliminating the need for all renewable energy research",
                    "Banning households from using electric home appliances",
                    "Increasing urban air pollution to keep winter temperatures high"
                ],
                2,
                "온실가스 배출을 최소화하면서 재생 에너지를 안정적으로 공급할 수 있다는 점이 궁극적 환경적 혜택입니다."
            )
        ]
    ),

    # 지문 12 (2문항) - The Power of Habit and the 21-Day Myth
    (
        "A popular self-help myth claims that it takes exactly 21 days to form a new habit. However, rigorous behavioral research conducted at University College London paints a more nuanced picture. Scientists discovered that forming a lasting habit actually takes an average of 66 days, depending on the complexity of the behavior and individual psychology. The secret to sustainable habit formation is not extraordinary willpower, but designing a supportive environment and linking small, manageable micro-habits to existing daily routines—such as doing ten push-ups immediately after brushing your teeth.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "What did scientific research at University College London reveal about habit formation?",
                [
                    "Habits can only be formed before the age of seven.",
                    "It takes an average of 66 days to form a habit, rather than exactly 21 days.",
                    "Willpower alone is 100% sufficient to build any complex habit overnight.",
                    "Physical habits take less than five seconds to become permanent.",
                    "Daily routines have no psychological influence on behavioral changes."
                ],
                2,
                "연구 결과 습관 형성에 걸리는 실제 평균 기간은 21일이 아니라 약 66일인 것으로 나타났습니다."
            ),
            (
                "Which strategy is recommended for building sustainable habits effectively?",
                [
                    "Attempting five massive lifestyle overhauls simultaneously",
                    "Linking manageable micro-habits to existing daily routines",
                    "Relying entirely on intense guilt and self-punishment",
                    "Ignoring one's surrounding environment completely",
                    "Changing wake-up times randomly every single morning"
                ],
                2,
                "이미 정착된 일상 루틴에 작고 실천하기 쉬운 미세 습관(micro-habits)을 연결하는 전략이 권장됩니다."
            )
        ]
    ),

    # 지문 13 (3문항) - Honeybees and Global Biodiversity
    (
        "Although small in stature, honeybees perform an indispensable ecological function: pollination. More than one-third of the crops that feed the global human population—including apples, almonds, tomatoes, and berries—depend directly on insect pollination. In recent decades, however, beekeepers have reported catastrophic declines in bee colonies, a crisis known as Colony Collapse Disorder (CCD). Factors contributing to this disaster include habitat loss, chemical pesticide overuse, parasitic mites, and climate disruption. Without healthy pollinator populations, agricultural productivity will plummet, triggering widespread biodiversity collapse and food shortages worldwide.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "Why are honeybees considered ecologically vital for human survival?",
                [
                    "They produce all modern plastic packaging materials.",
                    "They pollinate more than one-third of crops feeding the global population.",
                    "They scare away harmful predatory birds from urban parks.",
                    "They maintain the salinity balance of the world's deep oceans.",
                    "They purify polluted groundwater through underground tunneling."
                ],
                2,
                "인류가 소비하는 전 세계 농작물의 3분의 1 이상이 꿀벌의 꽃가루받이(수분)에 의존하기 때문입니다."
            ),
            (
                "Which factor is identified as a cause of Colony Collapse Disorder (CCD)?",
                [
                    "Excessive winter snowfall in polar ice caps",
                    "Overuse of chemical pesticides and loss of natural habitats",
                    "Bees learning to fly too fast across metropolitan highways",
                    "A global shortage of wooden beehives in rural areas",
                    "Bees choosing to hibernate permanently underwater"
                ],
                2,
                "화학 농약의 과도한 사용, 서식지 파괴, 기후 교란 등이 군집 붕괴 현상의 원인으로 지목되었습니다."
            ),
            (
                "What would be a catastrophic consequence if bee populations continue to decline?",
                [
                    "Global agricultural yields would plunge, threatening food security and biodiversity.",
                    "All flowering plants would instantly transform into tall pine trees.",
                    "Sea levels would immediately fall by several meters.",
                    "The human digestive system would stop requiring dietary nutrition.",
                    "Freshwater rivers would turn into saline ocean water."
                ],
                1,
                "꿀벌 개체수 감소는 농업 생산성 급락, 식량 안보 위기 및 생물 다양성 붕괴를 초래합니다."
            )
        ]
    ),

    # 지문 14 (2문항) - The Architecture of the Eiffel Tower
    (
        "When French engineer Gustave Eiffel unveiled his soaring wrought-iron tower for the 1889 Paris Exposition, it faced fierce backlash from leading intellectuals who called it a 'monstrous metal skeleton.' Yet, Eiffel's revolutionary design was a masterpiece of structural engineering. Standing over 300 meters tall, its open lattice-work structure allowed fierce gale-force winds to pass straight through with minimal lateral pressure. Over time, Parisians embraced the silhouette, and the Eiffel Tower became the ultimate global symbol of Paris, proving that bold architectural innovation often triumphs over conservative criticism.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What structural advantage did the Eiffel Tower's open lattice-work design provide?",
                [
                    "It allowed the tower to float easily during river floods.",
                    "It allowed strong winds to pass through, minimizing wind pressure on the structure.",
                    "It made the iron completely invisible from the streets of Paris.",
                    "It prevented any birds from perching on the metal girders.",
                    "It generated geothermal electricity from deep beneath the Seine."
                ],
                2,
                "격자 구조(open lattice-work) 덕분에 거센 바람이 통과하여 구조물에 가해지는 풍압을 최소화할 수 있었습니다."
            ),
            (
                "How did the public perception of the Eiffel Tower change over time?",
                [
                    "It was initially beloved but later torn down due to structural failure.",
                    "Initial fierce intellectual criticism gave way to global admiration as a cultural icon.",
                    "It was sold to a private railway company for scrap metal recycling.",
                    "It remained completely ignored by tourists for over a century.",
                    "It was converted into a military fortress during the 1889 Exposition."
                ],
                2,
                "처음에는 흉물스럽다는 비판을 받았으나, 시간이 흐르며 파리를 상징하는 세계적 문화 아이콘으로 찬사를 받게 되었습니다."
            )
        ]
    ),

    # 지문 15 (3문항) - Deep-Sea Creatures and Bioluminescence
    (
        "In the deep ocean—below 1,000 meters—sunlight cannot penetrate, creating a world of pitch-black darkness, bone-chilling cold, and crushing hydrostatic pressure. Despite these extreme conditions, deep-sea organisms thrive through remarkable evolutionary adaptations. Over 75% of deep-sea creatures possess bioluminescence, the biochemical ability to produce their own light via enzyme-catalyzed chemical reactions. Some species use pulsating flashes of blue-green light to attract prey, others to distract hungry predators with glowing 'smoke screens,' and still others to communicate with potential mates in the abyss.",
        "Lesson 7. Prepare for the Future (Reading)",
        [
            (
                "What is 'bioluminescence' as described in the passage?",
                [
                    "The ability to absorb sunlight and store it for weeks",
                    "The biochemical capability of living organisms to produce their own light",
                    "An artificial lighting device used exclusively by submarine crews",
                    "A rare thermal disease caused by freezing deep-sea temperatures",
                    "The reflection of moonlight off glistening fish scales"
                ],
                2,
                "생물 발광은 생명체가 효소 반응을 통해 화학적으로 스스로 빛을 내는 능력입니다."
            ),
            (
                "For which purpose do deep-sea creatures use bioluminescence?",
                [
                    "Attracting prey, confusing predators, and finding mates",
                    "Cooking food before swallowing it in the dark",
                    "Heating ocean water to tropical temperatures",
                    "Growing green plant crops on the deep ocean floor",
                    "Signaling commercial aircraft flying thousands of meters above"
                ],
                1,
                "먹이 유인, 포식자 교란(연막), 짝과의 소통 등 생존을 위한 다채로운 용도로 발광을 활용합니다."
            ),
            (
                "Which physical condition is characteristic of the deep ocean habitat?",
                [
                    "Abundant tropical warmth and intense ultraviolet sunlight",
                    "Extreme hydrostatic pressure, complete darkness, and near-freezing cold",
                    "Rapidly fluctuating air pressure with stormy winds",
                    "Shallow coral reefs with clear turquoise water",
                    "A high concentration of gaseous oxygen bubbles"
                ],
                2,
                "수심 1,000m 아래 심해는 완전한 암흑, 빙점 가까운 냉기, 엄청난 수압을 특징으로 합니다."
            )
        ]
    ),

    # 지문 16 (2문항) - The Origin of the Olympic Truce
    (
        "The ancient Olympic Games, inaugurated in Olympia in 776 BCE, were more than just athletic competitions; they were a sacred sanctuary of peace. During the games, Greek city-states honored the 'Ekecheiria,' or Olympic Truce. All armed conflicts and military actions were strictly suspended so that athletes, artists, and spectators could travel safely across contested territories to participate. Today, the International Olympic Committee and the United Nations revive this ancient tradition before every modern Olympiad, reminding humanity that sports can build bridges across political divides.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "What was the primary purpose of the ancient Greek 'Ekecheiria' (Olympic Truce)?",
                [
                    "To collect heavy war taxes from participating athletes",
                    "To halt all military conflicts so participants could travel and compete safely",
                    "To train soldiers for upcoming invasions under the guise of sports",
                    "To permanently abolish all armies in the Mediterranean world",
                    "To enforce Greek religious beliefs upon neighboring foreign empires"
                ],
                2,
                "선수와 관람객들이 안전하게 이동하여 경기에 참여할 수 있도록 모든 군사 분쟁을 일시 중단하는 평화 협정이었습니다."
            ),
            (
                "What modern ideal is reflected in the continued revival of the Olympic Truce?",
                [
                    "Sports can transcend political rivalries and foster international peace.",
                    "Commercial sponsorships are the most vital element of international athletics.",
                    "Only victorious nations should be allowed to speak in international forums.",
                    "Athletic records should be decided by military strength rather than skill.",
                    "Every nation must boycott sporting events during diplomatic disagreements."
                ],
                1,
                "스포츠가 정치적 갈등을 뛰어넘어 평화와 소통의 가교 역할을 할 수 있다는 이상을 반영합니다."
            )
        ]
    ),

    # 지문 17 (3문항) - Food Waste and Global Food Security
    (
        "According to the United Nations Food and Agriculture Organization (FAO), roughly one-third of all food produced worldwide—approximately 1.3 billion tons—is wasted or lost each year. In developing nations, waste predominantly occurs post-harvest due to inadequate refrigeration and poor transport infrastructure. Conversely, in affluent industrialized societies, waste occurs at the consumer level, where households discard cosmetically imperfect produce or excess groceries. Food waste squanders precious freshwater, arable land, and labor, while decomposing waste in landfills generates potent methane gas. Minimizing food waste through smarter meal planning and food recovery banks is essential for climate action.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What is a primary cause of food loss in developing nations according to the text?",
                [
                    "Consumers discarding slightly bruised fruit at supermarkets",
                    "Inadequate refrigeration and poor transportation infrastructure post-harvest",
                    "Strict government quotas prohibiting the sale of fresh grain",
                    "Excessive food production exceeding national storage by tenfold",
                    "Lack of interest among local populations in consuming fresh vegetables"
                ],
                2,
                "개발도상국에서는 수확 후 냉장 시설 부족과 열악한 운송 인프라로 인해 농작물 손실이 주로 발생합니다."
            ),
            (
                "How does food waste directly exacerbate the climate crisis?",
                [
                    "Decomposing food in landfills generates potent methane gas, a potent greenhouse emission.",
                    "Food waste cools down the atmosphere too rapidly during summer.",
                    "It causes ocean tides to stop flowing naturally.",
                    "It depletes solar radiation from reaching agricultural fields.",
                    "It causes heavy metal contamination in the upper stratosphere."
                ],
                1,
                "매립지에서 썩는 음식물 쓰레기는 강력한 온실가스인 메탄을 방출하여 기후 위기를 악화시킵니다."
            ),
            (
                "Which action is suggested to curb consumer-level food waste in industrialized nations?",
                [
                    "Buying double the amount of perishable groceries every weekend",
                    "Practicing smarter meal planning and supporting food recovery banks",
                    "Throwing away all groceries that pass their cosmetic prime immediately",
                    "Banning all refrigeration technologies in residential homes",
                    "Ending all local agricultural production completely"
                ],
                2,
                "식단계획을 현명하게 세우고 잉여 식품 나눔 은행(푸드뱅크)을 활용하는 실천이 제시되었습니다."
            )
        ]
    ),

    # 지문 18 (2문항) - Music Therapy and Mental Wellbeing
    (
        "Music has possessed therapeutic power across human civilizations, but modern clinical medicine now embraces 'music therapy' as an evidence-based clinical discipline. Listening to harmonious melodies stimulates the brain to release dopamine and endorphins—neurochemicals that alleviate anxiety and elevate mood. Concurrently, soothing rhythms slow down elevated heart rates, lower cortisol stress hormone levels, and stabilize blood pressure. In pediatric wards and elderly care centers, music therapy offers non-pharmacological comfort, showing that melody can heal emotional wounds that words cannot touch.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "What physiological change occurs in the body when listening to soothing music?",
                [
                    "Blood pressure rises rapidly to dangerously high levels.",
                    "Heart rate slows down and cortisol stress hormone levels decrease.",
                    "The brain stops producing all neurochemicals indefinitely.",
                    "Muscles become completely rigid and unable to move.",
                    "Body temperature drops below freezing point."
                ],
                2,
                "차분한 리듬은 심박수를 안정시키고 스트레스 호르몬인 코르티솔 수치와 혈압을 낮추어 줍니다."
            ),
            (
                "Why is music therapy increasingly valued in modern clinical settings?",
                [
                    "It completely eliminates the need for doctors and nurses in hospitals.",
                    "It provides safe, non-pharmacological relief for anxiety and emotional distress.",
                    "It teaches patients how to manufacture commercial brass instruments.",
                    "It forces patients to memorize classical symphony scores for tests.",
                    "It replaces nutritious meals with audio recordings."
                ],
                2,
                "약물을 쓰지 않고도 불안을 줄이고 정서적 안정을 돕는 비약물적 치료법이기 때문입니다."
            )
        ]
    ),

    # 지문 19 (3문항) - Sustainable Fashion and Synthetic Microfibers
    (
        "The rise of 'fast fashion'—inexpensive clothing produced rapidly to mirror fleeting catwalk trends—has come at a staggering environmental toll. Modern synthetic fabrics such as polyester, nylon, and acrylic are essentially petroleum-derived plastics. When these garments are washed in household laundry machines, friction sheds hundreds of thousands of microscopic plastic fibers. Wastewater treatment facilities cannot filter these microscopic particles, allowing them to wash into rivers and oceans, where they are consumed by plankton and fish. Transitioning to organic natural fibers, washing clothes less frequently at lower temperatures, and choosing enduring quality over disposable quantity are crucial steps toward sustainable wardrobes.",
        "Lesson 6. Make the World Beautiful (Reading)",
        [
            (
                "What hidden environmental hazard of synthetic clothing is highlighted in the text?",
                [
                    "Synthetic shirts explode when exposed to direct sunlight.",
                    "Washing synthetic garments releases microscopic plastic fibers into aquatic ecosystems.",
                    "Synthetic dyes make household washing machines rust immediately.",
                    "Synthetic fabrics cause cotton farms to expand indefinitely.",
                    "Synthetic clothes are impossible to dye with any color."
                ],
                2,
                "합성 섬유 옷을 세탁할 때 수십만 개의 미세 플라스틱 섬유가 배출되어 수생태계로 유입됩니다."
            ),
            (
                "Why can't standard municipal wastewater plants stop microfiber pollution?",
                [
                    "The plants are designed to pump synthetic plastics directly into drinking taps.",
                    "The microfibers are too microscopic for standard filtration screens to trap.",
                    "Water treatment plants operate only once every few years.",
                    "Microfibers transform into heavy iron bars during filtration.",
                    "Municipal regulations strictly forbid filtering any laundry runoff."
                ],
                2,
                "미세 섬유의 크기가 너무 미세하여 하수처리장의 일반 필터망으로 걸러낼 수 없기 때문입니다."
            ),
            (
                "Which consumer habit supports the transition toward sustainable fashion?",
                [
                    "Buying new cheap outfits every week and discarding them after one wear",
                    "Prioritizing durable quality, natural fibers, and mindful garment care",
                    "Washing clothes with boiling water and harsh bleach every day",
                    "Throwing unworn synthetic clothes into mountain streams",
                    "Refusing to wear clothes made from organic linen or wool"
                ],
                2,
                "일회용 패스트 패션 대신 오래 입을 수 있는 품질과 천연 섬유를 선택하는 것이 지속 가능한 패션입니다."
            )
        ]
    ),

    # 지문 20 (2문항) - The Power of Kindness in Everyday Life
    (
        "In a busy world focused on personal achievement, small acts of kindness often seem insignificant. However, psychological studies show that kindness creates a powerful 'ripple effect.' When you hold the door for a stranger or give an unexpected compliment to a classmate, the recipient experiences a surge in oxytocin, which promotes empathy and generosity. More remarkably, witnesses of kind acts also experience an emotional lift, making them significantly more likely to help others. Thus, a single compassionate gesture can initiate a chain reaction of positive goodwill that transforms an entire school community.",
        "Lesson 5. Believe in Yourself (Reading)",
        [
            (
                "What is the psychological 'ripple effect' of kindness described in the text?",
                [
                    "Kind acts cause people to become suspicious of others' motives.",
                    "One small compassionate act inspires recipients and witnesses to treat others kindly.",
                    "Kindness causes students to stop caring about their school assignments.",
                    "Complimenting friends guarantees immediate financial rewards from the school.",
                    "Acts of kindness can only spread through online social media algorithms."
                ],
                2,
                "작은 친절이 수혜자는 물론 이를 지켜본 사람들에게도 전달되어 친절의 연쇄 반응을 일으키는 효과입니다."
            ),
            (
                "What chemical hormone is associated with experiencing generosity and empathy in the text?",
                [
                    "Adrenaline",
                    "Oxytocin",
                    "Insulin",
                    "Melatonin",
                    "Hemoglobin"
                ],
                2,
                "친절한 행동을 경험할 때 분비되어 공감과 너그러움을 촉진하는 호르몬으로 옥시토신(oxytocin)이 명시되었습니다."
            )
        ]
    )
]

def get_nakyung_eng_questions():
    questions = []
    q_counter = 41 # M3_ENG_041 ~ M3_ENG_090
    for p_text, chap, items in NAKYUNG_ENG_PASSAGES:
        for it in items:
            questions.append({
                "question_id": f"M3_ENG_{q_counter:03d}",
                "grade": 3,
                "subject": "영어",
                "chapter": chap,
                "difficulty": "medium" if q_counter % 2 == 1 else "hard",
                "passage": p_text.strip(),
                "question_text": it[0].strip(),
                "options": it[1],
                "correct_answer": it[2],
                "explanation": it[3].strip()
            })
            q_counter += 1
    return questions

if __name__ == "__main__":
    qs = get_nakyung_eng_questions()
    print(f"Generated {len(qs)} questions for Nakyung English (IDs {qs[0]['question_id']} ~ {qs[-1]['question_id']})")
