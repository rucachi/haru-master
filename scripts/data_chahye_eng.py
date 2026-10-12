# -*- coding: utf-8 -*-
"""
차혜 (중1) 영어 독해 50문항 세트 (20개 지문)
- 1지문당 2~3문항 연결 복합 독해 구조
- 10지문 x 3문항 = 30문항
- 10지문 x 2문항 = 20문항
- 총 50문항 (M1_ENG_041 ~ M1_ENG_090)
"""

CHAHYE_ENG_PASSAGES = [
    # 지문 1 (3문항) - Introducing My Family and Weekend Routine (Lesson 1/2)
    (
        "Hello, my name is Minho and I am a middle school freshman. On Saturdays, my family enjoys a special morning routine together. My mother makes warm pancakes with fresh strawberries, while my father brews delicious coffee. After breakfast, my sister and I take our puppy, Bori, for a walk in the nearby park. Bori loves chasing yellow butterflies across the green grass. Spending quality time with my family on weekends gives me great energy for the upcoming school week.",
        "Lesson 1. New School, New Friends (Reading)",
        [
            (
                "What does Minho's family do together on Saturday mornings?",
                [
                    "They travel abroad by airplane every weekend.",
                    "They enjoy breakfast together and walk their puppy in the park.",
                    "They take difficult math examinations at school.",
                    "They sleep until late evening without eating.",
                    "They clean the school classrooms all day."
                ],
                2,
                "민호 가족은 토요일 아침에 팬케이크를 함께 먹고 공원에서 강아지 보리를 산책시킵니다."
            ),
            (
                "According to the passage, what does Minho's puppy, Bori, enjoy doing?",
                [
                    "Chasing yellow butterflies on the grass",
                    "Brewing morning coffee for father",
                    "Reading english storybooks in bed",
                    "Cooking warm strawberry pancakes",
                    "Riding a bicycle to the library"
                ],
                1,
                "본문에서 'Bori loves chasing yellow butterflies across the green grass'라고 설명하고 있습니다."
            ),
            (
                "Why is weekend family time important to Minho?",
                [
                    "It gives him lots of pocket money.",
                    "It gives him energy and happiness for the new school week.",
                    "It helps him skip all of his homework.",
                    "It makes his puppy fall asleep permanently.",
                    "It teaches him how to repair old computers."
                ],
                2,
                "주말에 가족과 보내는 시간이 다가오는 학교생활에 큰 활력과 에너지를 주기 때문입니다."
            )
        ]
    ),

    # 지문 2 (2문항) - The School Club Festival (Lesson 3)
    (
        "Our school held its annual club festival last Friday. There were dozens of colorful booths in the gymnasium. At the science club booth, students created miniature erupting volcanoes using baking soda and vinegar. Next door, the cooking club offered handmade chocolate cookies that smelled amazing. I joined the photography club and exhibited three photos of our school garden in autumn. Participating in club activities is a wonderful way to discover new hobbies and make lifelong friends.",
        "Lesson 3. School Life and Clubs (Reading)",
        [
            (
                "What exciting experiment was demonstrated at the science club booth?",
                [
                    "Building a rocket ship to travel to Mars",
                    "Creating erupting miniature volcanoes with baking soda and vinegar",
                    "Growing giant trees inside glass bottles",
                    "Making synthetic diamonds from sea salt",
                    "Freezing warm water with an electric guitar"
                ],
                2,
                "과학 동아리에서는 베이킹소다와 식초를 이용해 화산 분출 모형 실험을 진행했습니다."
            ),
            (
                "What is a key benefit of participating in school clubs mentioned in the text?",
                [
                    "Winning large amounts of gold coins",
                    "Discovering new hobbies and making great friends",
                    "Avoiding all physical education classes",
                    "Never having to take any school tests",
                    "Leaving school before lunchtime every day"
                ],
                2,
                "동아리 활동을 통해 새로운 취미를 발견하고 좋은 친구를 사귈 수 있는 이점이 있습니다."
            )
        ]
    ),

    # 지문 3 (3문항) - Upcycling Old Clothes into Fashion Bags (Lesson 6)
    (
        "Do you have old blue jeans that are too small to wear? Don't throw them into the trash! In our art club, we learned how to turn old denim pants into stylish shoulder bags. First, we cut the legs off the jeans with sharp fabric scissors. Next, we used colorful threads and buttons to sew the bottom edges securely. Finally, we decorated the front pockets with bright patches. Upcycling is not only fun and creative, but it also helps reduce textile waste and protects our planet.",
        "Lesson 6. Save the Earth (Reading)",
        [
            (
                "What did the students make from their old denim jeans?",
                [
                    "A large camping tent for rainy days",
                    "Stylish handmade shoulder bags",
                    "A heavy winter blanket for their puppy",
                    "A pair of leather running shoes",
                    "A wooden dining table cover"
                ],
                2,
                "학생들은 작아진 청바지를 활용하여 멋진 숄더백(어깨가방)을 만들었습니다."
            ),
            (
                "What was the first step in making the denim bag?",
                [
                    "Decorating the pockets with glitter stickers",
                    "Cutting the legs off the jeans with fabric scissors",
                    "Washing the bag with boiling seawater",
                    "Selling the finished product at a market",
                    "Sewing five metal zippers onto the sleeves"
                ],
                2,
                "가장 먼저 가위로 청바지의 다리 부분을 잘라내는 작업(First, we cut the legs off...)을 수행했습니다."
            ),
            (
                "According to the passage, why is upcycling beneficial?",
                [
                    "It makes all clothing brands close down.",
                    "It is creative and fun while reducing waste to protect the Earth.",
                    "It requires no scissors, needles, or time.",
                    "It turns cheap cotton into pure gold thread.",
                    "It makes old clothes five times larger in size."
                ],
                2,
                "창의적이고 재미있을 뿐 아니라 섬유 쓰레기를 줄여 지구를 보호할 수 있기 때문입니다."
            )
        ]
    ),

    # 지문 4 (2문항) - How Animals Hibernate in Winter (Lesson 4)
    (
        "Winter is a harsh season with freezing temperatures and scarce food. To survive these cold months, many animals, such as brown bears, hedgehogs, and ground squirrels, enter a deep sleep called hibernation. During autumn, they consume large quantities of nuts, berries, and fish to build thick layers of body fat. When they hibernate, their heart rate slows dramatically, and their body temperature drops to match the cool den. By sleeping through the winter, these clever animals conserve vital energy until warm spring arrives.",
        "Lesson 4. Wonders of Nature (Reading)",
        [
            (
                "Why do animals like brown bears hibernate during the winter?",
                [
                    "Because they hate playing in white snow",
                    "To survive freezing temperatures and severe food shortages by conserving energy",
                    "Because human hunters invite them to sleep indoors",
                    "To change the color of their fur to bright pink",
                    "Because they are bored with running around forests"
                ],
                2,
                "겨울철 혹독한 추위와 먹이 부족을 견디기 위해 에너지를 보존하며 겨울잠을 잡니다."
            ),
            (
                "What physiological change happens to hibernating animals during deep sleep?",
                [
                    "Their heart rate accelerates to extreme speeds.",
                    "Their heart rate slows down and body temperature drops significantly.",
                    "Their body weight increases by ten times while asleep.",
                    "They open their eyes and eat fresh berries every hour.",
                    "They migrate thousands of miles across the ocean."
                ],
                2,
                "동면 중에는 심박수가 극적으로 느려지고 체온이 떨어져 에너지 소모를 최소화합니다."
            )
        ]
    ),

    # 지문 5 (3문항) - A Day in London: Big Ben and Museums (Lesson 7)
    (
        "Last summer, Sarah visited London with her aunt. Her favorite landmark was the Elizabeth Tower, famously known as Big Ben. She stood on Westminster Bridge and listened to the deep chimes echoing across the River Thames. In the afternoon, they explored the British Museum. Sarah was amazed by ancient Egyptian mummies and stone sculptures from Greece. The best part was that general admission to most major museums in London was completely free for visitors. Sarah bought a red double-decker bus postcard to send to her grandmother.",
        "Lesson 7. Discover the World (Reading)",
        [
            (
                "What is the famous clock tower on Westminster Bridge known as?",
                [
                    "The Eiffel Tower",
                    "Big Ben (Elizabeth Tower)",
                    "The Leaning Tower of Pisa",
                    "The Statue of Liberty",
                    "The Empire State Building"
                ],
                2,
                "웨스트민스터 다리 옆의 유명한 시계탑은 빅벤(엘리자베스 타워)입니다."
            ),
            (
                "What surprised Sarah pleasantly about London's major museums?",
                [
                    "They were closed every single afternoon.",
                    "General admission was completely free for visitors.",
                    "All exhibits were made out of edible chocolate.",
                    "Visitors were required to wear medieval knight armor.",
                    "Photography was strictly prohibited in the gift shop."
                ],
                2,
                "런던 주요 박물관의 일반 입장이 방문객에게 완전 무료라는 점에 놀라워했습니다."
            ),
            (
                "What souvenir did Sarah purchase for her grandmother?",
                [
                    "A real Egyptian stone sarcophagus",
                    "A red double-decker bus postcard",
                    "An expensive vintage wristwatch",
                    "A small wooden rowboat from the Thames",
                    "A box of frozen strawberries"
                ],
                2,
                "할머니께 보내드릴 런던의 빨간 2층 버스 엽서를 구매했습니다."
            )
        ]
    ),

    # 지문 6 (2문항) - Healthy Eating: The Rainbow Plate (Lesson 2)
    (
        "Nutritionists recommend filling your plate with a 'rainbow' of colorful fruits and vegetables every day. Red foods like tomatoes and strawberries protect your heart. Orange carrots and yellow bell peppers are rich in vitamin A, which supports clear vision. Green vegetables like broccoli and spinach contain iron that keeps your muscles strong. Purple blueberries and eggplants contain antioxidants that sharpen your memory. By eating foods of diverse colors, you ensure that your body receives all the vitamins necessary for healthy growth.",
        "Lesson 2. Healthy Living, Happy Life (Reading)",
        [
            (
                "According to the passage, why are orange carrots and yellow bell peppers good for health?",
                [
                    "They turn your teeth into bright gold.",
                    "They are rich in vitamin A, which supports healthy vision.",
                    "They help you run faster than a sports car.",
                    "They make your fingernails glow in the dark.",
                    "They eliminate the need for drinking water."
                ],
                2,
                "당근과 노란 파프리카에 풍부한 비타민 A는 시력 건강을 돕습니다."
            ),
            (
                "What is the main advice given by the author about daily meals?",
                [
                    "Eat only sweet brown chocolate candies for lunch.",
                    "Eat a rainbow of diverse colorful fruits and vegetables every day.",
                    "Drink five cups of soda with every meal.",
                    "Avoid eating any green vegetables like broccoli.",
                    "Skip dinner to save preparation time."
                ],
                2,
                "매일 무지개처럼 다양한 색상의 채소와 과일을 골고루 섭취하라는 조언입니다."
            )
        ]
    ),

    # 지문 7 (3문항) - Thomas Edison and Never Giving Up (Lesson 5)
    (
        "Thomas Edison was one of history's greatest inventors, holding over one thousand patents. When he was trying to invent the long-lasting incandescent electric light bulb, he tested thousands of different materials for the filament. Many assistants grew tired and discouraged, but Edison never lost his enthusiasm. When a reporter asked him about his failures, Edison famously replied, 'I have not failed 10,000 times. I have successfully found 10,000 ways that will not work.' Eventually, he found that carbonized bamboo thread could glow for hundreds of hours, illuminating the entire world.",
        "Lesson 5. Think Outside the Box (Reading)",
        [
            (
                "How did Thomas Edison view his thousands of unsuccessful experiments?",
                [
                    "As humiliating proof that he was untalented",
                    "As finding thousands of ways that do not work on the path to success",
                    "As wasted time that he deeply regretted",
                    "As reasons to burn down his entire laboratory",
                    "As an excuse to stop inventing new gadgets"
                ],
                2,
                "에디슨은 실패가 아니라 성공으로 가는 길에서 작동하지 않는 방법들을 찾아낸 것이라고 긍정적으로 바라보았습니다."
            ),
            (
                "Which material finally succeeded as a durable filament for Edison's light bulb?",
                [
                    "Pure frozen water crystals",
                    "Carbonized bamboo thread",
                    "Fresh green pine needles",
                    "Heavy iron railroad tracks",
                    "Soft wool from newborn lambs"
                ],
                2,
                "수백 시간 동안 빛을 낼 수 있었던 필라멘트 소재는 탄화 대나무 섬유였습니다."
            ),
            (
                "What character trait made Edison such a successful inventor?",
                [
                    "Giving up quickly whenever a problem occurred",
                    "Relentless perseverance and an optimistic view toward trial and error",
                    "Refusing to work with any assistants or laboratory helpers",
                    "Only conducting experiments that took less than five minutes",
                    "Copying other scientists' blueprints without permission"
                ],
                2,
                "시행착오를 두려워하지 않는 끈질긴 인내심과 낙관적인 태도가 에디슨의 성공 비결이었습니다."
            )
        ]
    ),

    # 지문 8 (2문항) - Walking My Dog Toto: Friendship (Lesson 1)
    (
        "Every afternoon after finishing my school homework, I take my dog Toto out for some fresh air. Toto is a fluffy white Maltese with big black eyes. Whenever I pick up his red leash, he wags his tail excitedly and jumps into the air. In the park, we meet other neighbors and their friendly pets. Walking with Toto helps me clear my mind after hours of studying math and English. Pets are not just animals; they are loyal companions who share our daily joys and sadness.",
        "Lesson 1. New School, New Friends (Reading)",
        [
            (
                "What does Toto do when his owner picks up the red leash?",
                [
                    "He runs under the bed and hides quietly.",
                    "He wags his tail excitedly and jumps into the air.",
                    "He barks angrily and bites the sofa.",
                    "He falls asleep immediately on the floor.",
                    "He drinks all the water from the fishbowl."
                ],
                2,
                "빨간 목줄을 들면 꼬리를 신나게 흔들며 공중으로 펄쩍 뛰어오른다고 했습니다."
            ),
            (
                "How does walking Toto benefit the author after school?",
                [
                    "It makes the author forget how to write Korean.",
                    "It helps clear the author's mind and relieves study stress.",
                    "It ruins the author's favorite running sneakers.",
                    "It causes the author to fail English tests.",
                    "It forces the author to buy expensive dog food daily."
                ],
                2,
                "공부 후 머리를 맑게 식혀주고 학업 스트레스를 해소해 준다고 서술되어 있습니다."
            )
        ]
    ),

    # 지문 9 (3문항) - Solar Panels on the School Roof (Lesson 6)
    (
        "Our middle school recently installed shiny solar panels on the gymnasium rooftop. These modern photovoltaic panels capture bright sunlight and convert it directly into clean electricity. On sunny days, the panels generate enough electrical energy to power all the classroom lights, smartboards, and hallway computers. A digital display screen in the main lobby shows how much carbon dioxide emission our school has prevented each day. By embracing solar energy, our school is actively contributing to the fight against climate change.",
        "Lesson 6. Save the Earth (Reading)",
        [
            (
                "Where were the new solar panels installed at the school?",
                [
                    "Deep underground inside the science basement",
                    "On the gymnasium rooftop",
                    "Behind the cafeteria kitchen refrigerator",
                    "Around the outdoor basketball hoop nets",
                    "Inside the school principal's office desk"
                ],
                2,
                "학교 체육관 옥상에 태양광 패널이 설치되었습니다."
            ),
            (
                "What information is displayed on the screen in the main school lobby?",
                [
                    "The daily cafeteria lunch menu prices",
                    "The amount of carbon dioxide emission prevented by the solar panels",
                    "The final test scores of all graduating seniors",
                    "The bus departure schedule for downtown trains",
                    "The temperature of the deep ocean seabed"
                ],
                2,
                "태양광 발전을 통해 감축한 이산화탄소 배출량이 로비 전광판에 표시됩니다."
            ),
            (
                "What is the primary ecological purpose of using solar panels?",
                [
                    "To generate clean electricity and combat global climate change",
                    "To make the school gym darker during sunny afternoons",
                    "To melt winter snow quickly so students can play soccer",
                    "To increase the school's electricity bills tenfold",
                    "To attract colorful birds from South America"
                ],
                1,
                "청정 전력을 생산하여 기후 변화를 막고 탄소 배출을 줄이는 것이 주요 목적입니다."
            )
        ]
    ),

    # 지문 10 (2문항) - Songkran Water Festival in Thailand (Lesson 7)
    (
        "Every April, the people of Thailand celebrate Songkran, the traditional Thai New Year festival. During Songkran, people take to the streets armed with water guns, buckets, and hoses to splash cool water on friends and strangers alike. Splashing water is not just a way to beat the scorching tropical heat; it carries deep symbolic meaning. The water symbolizes washing away bad luck, sorrow, and misdeeds from the past year, welcoming the new year with a refreshed spirit and good fortune.",
        "Lesson 7. Discover the World (Reading)",
        [
            (
                "What do people in Thailand do on the streets during the Songkran festival?",
                [
                    "They build giant snowmen with frozen ice cubes.",
                    "They playfully splash cool water on friends and strangers.",
                    "They paint every building with glowing black paint.",
                    "They hold silent reading contests throughout the night.",
                    "They plant thousands of tall coconut palms along roads."
                ],
                2,
                "송끄란 축제 기간에는 거리에서 서로에게 시원한 물을 뿌리며 축제를 즐깁니다."
            ),
            (
                "What is the symbolic meaning of splashing water during Songkran?",
                [
                    "Washing away bad luck and greeting the new year with a fresh start",
                    "Punishing people who woke up late in the morning",
                    "Showing off the most expensive modern water pistols",
                    "Testing whether clothes are waterproof or not",
                    "Inviting sea monsters to visit urban street markets"
                ],
                1,
                "지난해의 액운과 슬픔을 씻어내고 새로운 한 해의 행운을 맞이하는 상징적 의미가 있습니다."
            )
        ]
    ),

    # 지문 11 (3문항) - Planting a Tree: Gardening (Lesson 6)
    (
        "Planting a tree is one of the most rewarding outdoor activities you can do for the environment. To plant a sapling successfully, first select a sunny spot with rich, loose soil. Dig a hole twice as wide as the root ball and just as deep. Gently place the young tree in the center, keeping it straight. Refill the hole with soil, pressing lightly with your boots to eliminate large air pockets. Finally, pour a generous bucket of water around the base. Over the years, your tree will provide cooling shade, fresh oxygen, and a welcoming home for singing birds.",
        "Lesson 6. Save the Earth (Reading)",
        [
            (
                "How wide should the planting hole be when preparing to plant a young sapling?",
                [
                    "As narrow as a pencil",
                    "Twice as wide as the tree's root ball",
                    "Ten meters deep and fifty meters wide",
                    "Exactly the same size as an apple",
                    "No hole is required at all"
                ],
                2,
                "묘목을 심을 때는 뿌리 흙덩이(root ball) 너비의 2배로 구덩이를 파야 합니다."
            ),
            (
                "Why should you press the refilled soil lightly with your boots?",
                [
                    "To break all the delicate roots of the tree",
                    "To eliminate large air pockets in the soil",
                    "To make the ground hard as concrete rocks",
                    "To prevent any water from entering the roots",
                    "To create deep footprints for bird nests"
                ],
                2,
                "흙 속의 큰 공기 구멍(air pockets)을 없애 뿌리가 흙과 잘 밀착되도록 하기 위함입니다."
            ),
            (
                "Which long-term environmental benefit of trees is mentioned in the text?",
                [
                    "Producing fresh oxygen, cooling shade, and habitats for birds",
                    "Absorbing all rainfall so rivers completely dry out",
                    "Preventing sunlight from ever reaching the planet",
                    "Generating plastic packaging material naturally",
                    "Turning soil into salty ocean sand"
                ],
                1,
                "나무는 신선한 산소, 시원한 그늘, 새들의 서식지를 제공하는 소중한 혜택을 줍니다."
            )
        ]
    ),

    # 지문 12 (2문항) - The Power of Evening Reading (Lesson 3)
    (
        "Spending thirty minutes reading a good book before bed has numerous benefits for both your mind and body. Unlike glowing smartphone screens, printed paper does not emit blue light, allowing your brain to produce melatonin naturally. Reading a captivating story slows your breathing, relaxes tense shoulder muscles, and distracts you from daily worries. Studies also show that reading regularly before sleep expands your vocabulary and improves your concentration during morning classes.",
        "Lesson 3. School Life and Clubs (Reading)",
        [
            (
                "Why is reading a paper book before bed healthier than scrolling through a smartphone?",
                [
                    "Books are much heavier than smartphones.",
                    "Paper books do not emit blue light that disrupts melatonin production.",
                    "Paper books have built-in Wi-Fi speakers.",
                    "Smartphones cannot display any English words.",
                    "Books automatically turn off your room lights."
                ],
                2,
                "종이책은 멜라토닌 분비를 방해하는 블루라이트를 내뿜지 않기 때문입니다."
            ),
            (
                "What academic benefit of regular bedtime reading is noted in the passage?",
                [
                    "It guarantees that you never have to do homework.",
                    "It expands vocabulary and improves daytime classroom concentration.",
                    "It makes your school bag fifty pounds lighter.",
                    "It turns all test questions into multiple choice.",
                    "It allows you to sleep through all morning classes."
                ],
                2,
                "어휘력을 넓혀주고 낮 시간 수업 집중력을 향상해 주는 학업적 이점이 있습니다."
            )
        ]
    ),

    # 지문 13 (3문항) - The Northern Lights (Aurora Borealis) (Lesson 4)
    (
        "Near the Earth's polar regions, fortunate travelers can witness one of nature's most dazzling spectacles: the Aurora Borealis, or Northern Lights. In the dark winter night, vibrant curtains of green, purple, and violet light wave across the starry sky. This breathtaking phenomenon occurs when charged particles blown from the Sun collide with gases in Earth's upper atmosphere. When solar particles hit oxygen atoms, they create glowing emerald green; when they collide with nitrogen, they generate dazzling purple hues. Seeing the auroras dance above snow-covered forests is an unforgettable adventure.",
        "Lesson 4. Wonders of Nature (Reading)",
        [
            (
                "What causes the spectacular Northern Lights (Aurora Borealis)?",
                [
                    "Giant mirrors placed on top of Arctic mountains",
                    "Charged solar particles colliding with gases in Earth's atmosphere",
                    "Reflections of city street lamps off polar glaciers",
                    "Fireworks launched by arctic polar research stations",
                    "Lightning strikes occurring beneath ocean ice"
                ],
                2,
                "태양에서 날아온 하전 입자가 지구 대기 속의 산소와 질소 등 기체와 충돌할 때 발생합니다."
            ),
            (
                "What glowing color is produced when solar particles collide with oxygen atoms?",
                [
                    "Pitch black",
                    "Glowing emerald green",
                    "Bright neon yellow",
                    "Dark brownish gray",
                    "Metallic silver"
                ],
                2,
                "본문에서 태양 입자가 산소 원자와 부딪힐 때 에메랄드 녹색(emerald green) 빛을 낸다고 했습니다."
            ),
            (
                "Where is the Aurora Borealis most commonly observed on Earth?",
                [
                    "Near the equator in tropical rainforests",
                    "Near the polar regions in dark winter skies",
                    "In dry sandy desert valleys near the equator",
                    "Deep inside active volcanic craters",
                    "On tropical sandy beaches during sunny afternoons"
                ],
                2,
                "지구의 극지방 부근 캄캄한 겨울 밤하늘에서 주로 관측됩니다."
            )
        ]
    ),

    # 지문 14 (2문항) - Making a Healthy Sandwich (Lesson 2)
    (
        "Making a nutritious sandwich at home is quick and fun. Start with two slices of whole-wheat bread, which provide long-lasting fiber and energy. Spread a thin layer of mashed avocado instead of mayonnaise for healthy fats. Layer crisp green lettuce, sweet red tomatoes, and lean grilled chicken breast between the slices. Add a slice of low-sodium cheddar cheese for calcium. Cut the sandwich diagonally across the middle, and you have a balanced, colorful meal packed with protein, vitamins, and minerals.",
        "Lesson 2. Healthy Living, Happy Life (Reading)",
        [
            (
                "What healthier alternative to mayonnaise is suggested in the recipe?",
                [
                    "Sweet chocolate syrup",
                    "Mashed avocado",
                    "Melted vanilla ice cream",
                    "Heavy whipping cream",
                    "Salty soy sauce"
                ],
                2,
                "마요네즈 대신 건강한 지방을 제공하는 으깬 아보카도(mashed avocado)를 바르라고 제안했습니다."
            ),
            (
                "What makes whole-wheat bread a good choice for breakfast or lunch?",
                [
                    "It has no taste whatsoever.",
                    "It provides long-lasting fiber and steady energy.",
                    "It melts like soup when exposed to room temperature.",
                    "It costs a thousand dollars per loaf.",
                    "It is made entirely out of refined white sugar."
                ],
                2,
                "통밀빵은 풍부한 식이섬유와 지속적인 에너지를 공급해 주기 때문입니다."
            )
        ]
    ),

    # 지문 15 (3문항) - Smart and Friendly Dolphins (Lesson 4)
    (
        "Dolphins are celebrated as some of the most intelligent creatures on our planet. Living in social pods, they communicate through an intricate repertoire of clicks, whistles, and tail slaps. Each dolphin even possesses a unique 'signature whistle,' which functions just like a human name! Dolphins also use echolocation—bouncing high-frequency sound waves off surrounding objects—to navigate murky waters and hunt fish in the dark. Known for their playful and altruistic nature, wild dolphins have frequently been documented protecting human swimmers from dangerous sharks.",
        "Lesson 4. Wonders of Nature (Reading)",
        [
            (
                "How does each individual dolphin identify itself to others in its pod?",
                [
                    "By wearing colorful sea shells on its nose",
                    "With a unique 'signature whistle' that works like a name",
                    "By swimming upside down during the full moon",
                    "By changing its skin color from gray to bright red",
                    "By splashing water exactly twenty-five times"
                ],
                2,
                "돌고래는 사람의 이름처럼 고유한 '서명 휘파람(signature whistle)'을 가지고 있습니다."
            ),
            (
                "What is 'echolocation' used for by dolphins according to the passage?",
                [
                    "Bouncing sound waves to navigate murky water and hunt fish",
                    "Singing lullabies to sleep on shallow coral reefs",
                    "Measuring the salt content of surface seawater",
                    "Warning passing boats to turn off their engines",
                    "Freezing small fish with ultrasonic heat waves"
                ],
                1,
                "음파를 쏘아 반사되는 파동으로 흐린 물속에서 길을 찾고 먹이를 사냥하는 반향위치측정입니다."
            ),
            (
                "Which altruistic behavior of wild dolphins is highlighted in the text?",
                [
                    "Building underwater shelters for hermit crabs",
                    "Guarding human swimmers from dangerous predatory sharks",
                    "Teaching sea turtles how to fly in the air",
                    "Delivering fresh coconuts to deserted island beaches",
                    "Stealing fishing nets from wooden sailing boats"
                ],
                2,
                "위험한 상어로부터 바다 수영객(인간)을 보호해 준 일화가 언급되었습니다."
            )
        ]
    ),

    # 지문 16 (2문항) - Bicycle Safety Rules (Lesson 3)
    (
        "Riding a bicycle is an eco-friendly and enjoyable way to travel, but road safety must always come first. Before pedaling off, always fasten an approved safety helmet securely under your chin; helmets reduce the risk of severe head injuries by over seventy percent. Check that your brakes grip firmly and your tires have adequate air pressure. When riding on streets, travel in the same direction as traffic and use clear hand signals before turning left or right. Lastly, wear bright or reflective clothing so drivers can spot you easily at dusk.",
        "Lesson 3. School Life and Clubs (Reading)",
        [
            (
                "Why is wearing an approved helmet the most crucial bicycle safety rule?",
                [
                    "It makes you look like a professional racing champion.",
                    "It reduces the risk of severe head injury by over seventy percent.",
                    "It plays your favorite music through invisible speakers.",
                    "It prevents rain from ever falling on your bicycle frame.",
                    "It increases your bicycle speed by fifty miles per hour."
                ],
                2,
                "헬멧은 심각한 머리 부상 위험을 70% 이상 줄여주는 가장 중요한 안전 장비입니다."
            ),
            (
                "Which rule should cyclists follow when riding on public roads?",
                [
                    "Ride against traffic and ignore all red traffic lights.",
                    "Travel in the same direction as traffic and signal turns with hand gestures.",
                    "Wear all-black clothing without any reflective gear at night.",
                    "Look exclusively at your smartphone screen while steering.",
                    "Ride on the hood of moving automobiles."
                ],
                2,
                "교통 흐름과 같은 방향으로 주행하고, 좌우 회전 시 수신호를 사용하는 규칙을 준수해야 합니다."
            )
        ]
    ),

    # 지문 17 (3문항) - The Wright Brothers and the First Flight (Lesson 5)
    (
        "For centuries, humans gazed at soaring birds and dreamt of flight. In December 1903, at Kitty Hawk, North Carolina, two American bicycle makers—Orville and Wilbur Wright—turned that impossible dream into reality. Unlike other experimenters who focused purely on powerful engines, the Wright brothers realized that 'three-axis control'—allowing the pilot to balance and steer the aircraft in three dimensions—was the true key to flight. Their fabric-covered flyer remained aloft for only 12 seconds and covered 36 meters on its historic first run, but it marked the dawn of modern aviation.",
        "Lesson 5. Think Outside the Box (Reading)",
        [
            (
                "What breakthrough did the Wright brothers achieve that other inventors had neglected?",
                [
                    "Installing a jet rocket engine on wooden gliders",
                    "Developing three-axis control to steer and balance the aircraft in flight",
                    "Using feathers from wild ducks to coat the wings",
                    "Replacing pilots with automatic computer sensors",
                    "Flying only during severe thunderstorms"
                ],
                2,
                "비행기를 공중에서 균형 잡고 조종할 수 있는 '3축 제어 기술'을 개발한 점이 핵심 돌파구였습니다."
            ),
            (
                "How long did the Wright Flyer stay in the air during its historic first powered flight?",
                [
                    "Three full days",
                    "Twelve seconds",
                    "Five hours and twenty minutes",
                    "Over two months without landing",
                    "Less than half a millisecond"
                ],
                2,
                "인류 역사상 최초의 동력 비행 지속 시간은 12초(12 seconds)였습니다."
            ),
            (
                "What was the original profession of Orville and Wilbur Wright?",
                [
                    "Bicycle shop mechanics and makers",
                    "Deep-sea naval submarine captains",
                    "Astronomical telescope lenses grinders",
                    "Commercial steam locomotive engineers",
                    "University professors of ancient Latin"
                ],
                1,
                "라이트 형제는 원래 자전거점을 운영하며 자전거를 수리하고 제작하던 기술자들이었습니다."
            )
        ]
    ),

    # 지문 18 (2문항) - Simple Ways to Save Water at Home (Lesson 6)
    (
        "Fresh drinking water is one of the most precious resources on Earth, yet much of it is squandered through careless daily habits. You can make a meaningful difference without spending any money. Turn off the tap while brushing your teeth, which saves up to eight liters of clean water every single minute. Take brisk five-minute showers instead of filling deep bathtubs. When washing vegetables, collect the rinse water in a basin and use it to water household potted plants. Every saved drop helps protect our freshwater lakes and rivers.",
        "Lesson 6. Save the Earth (Reading)",
        [
            (
                "How much clean water can you conserve each minute by turning off the tap while brushing teeth?",
                [
                    "Less than one milliliter",
                    "Up to eight liters of water",
                    "Over ten thousand gallons",
                    "Exactly zero drops",
                    "Fifty bathtubs full of water"
                ],
                2,
                "양치할 때 물을 잠그면 1분당 최대 8리터의 깨끗한 물을 절약할 수 있습니다."
            ),
            (
                "What eco-friendly tip for reusing rinse water is recommended?",
                [
                    "Pouring it over electrical outlets to cool them down",
                    "Using vegetable rinse water to irrigate household potted plants",
                    "Dumping it into clean drinking milk bottles",
                    "Freezing it into giant ice sculptures in the hallway",
                    "Boiling it for three days until it disappears completely"
                ],
                2,
                "채소를 씻고 남은 물을 모아 화분의 식물에 주는 지혜로운 재활용 방법입니다."
            )
        ]
    ),

    # 지문 19 (3문항) - Traditional Korean Game: Yutnori (Lesson 7)
    (
        "During Seollal (Korean Lunar New Year), families across Korea gather around a board mat to play 'Yutnori.' The game is played with four wooden sticks called 'yut,' which are flat on one side and curved on the other. Players cast the sticks into the air, and depending on how many flat sides face upward, tokens advance around the board: do (1), gae (2), geol (3), yut (4), or mo (5). Landing on an opponent's marker sends it back to the starting line, while rolling yut or mo grants an extra turn. Yutnori is filled with laughter, strategic teamwork, and warm holiday cheers.",
        "Lesson 7. Discover the World (Reading)",
        [
            (
                "What special rule applies when a player rolls a 'yut' (4 flat sides) or 'mo' (4 curved sides)?",
                [
                    "The player must immediately leave the game.",
                    "The player earns an additional turn to throw the sticks again.",
                    "All tokens on the board are removed permanently.",
                    "The opponent wins the entire match instantly.",
                    "The game board is flipped upside down."
                ],
                2,
                "윷이나 모가 나오면 막대를 한 번 더 던질 수 있는 보너스 기회가 주어집니다."
            ),
            (
                "What happens when a player's token lands on an opponent's marker on the board?",
                [
                    "Both players share the same token until the end.",
                    "The opponent's marker is captured and returned to the starting point.",
                    "The game must be restarted from the very beginning.",
                    "The player must pay ten coins to the referee.",
                    "The board is replaced with a chess set."
                ],
                2,
                "상대방의 말을 잡으면 상대방 말은 시작점으로 되돌아가게 됩니다."
            ),
            (
                "When is Yutnori traditionally enjoyed in Korea?",
                [
                    "During Seollal (Lunar New Year) family gatherings",
                    "Only on Halloween night with costumes",
                    "During summer thunderstorm warnings",
                    "On the first day of high school graduation",
                    "Inside empty school libraries at midnight"
                ],
                1,
                "설날 명절에 온 가족이 둘러앉아 즐기는 대표적인 전통 민속놀이입니다."
            )
        ]
    ),

    # 지문 20 (2문항) - The Three Compliments Daily Challenge (Lesson 1)
    (
        "Words possess immense power to brighten someone's day or drag down their spirit. Our homeroom teacher recently initiated the 'Three Compliments Challenge.' Every student tries to offer three genuine, heartfelt compliments to classmates before the final bell rings. You might compliment a friend's creative artwork, appreciate someone who shared notes, or praise a peer's sportsmanship during gym class. This simple habit replaced hallway gossip with warm smiles and turned our classroom into a supportive, encouraging learning family.",
        "Lesson 1. New School, New Friends (Reading)",
        [
            (
                "What is the daily objective of the 'Three Compliments Challenge'?",
                [
                    "Writing three long complaints about cafeteria food",
                    "Offering three sincere, heartfelt compliments to classmates each day",
                    "Scoring three consecutive goals in soccer class",
                    "Memorizing three pages of an English encyclopedia",
                    "Borrowing three pens from the teacher's desk"
                ],
                2,
                "매일 친구들에게 세 번의 진심 어린 따뜻한 칭찬을 건네는 도전 과제입니다."
            ),
            (
                "What positive transformation occurred in the classroom after starting the challenge?",
                [
                    "Students refused to talk to each other completely.",
                    "Gossip was replaced with smiles and a supportive, warm community atmosphere.",
                    "Classrooms became noisier with frequent shouting matches.",
                    "All school clubs were cancelled for the remainder of the year.",
                    "Students competed angrily for teacher praise."
                ],
                2,
                "뒷말 대신 미소와 서로를 응원하고 지지하는 따뜻한 학급 분위기로 바뀌었습니다."
            )
        ]
    )
]

def get_chahye_eng_questions():
    questions = []
    q_counter = 41 # M1_ENG_041 ~ M1_ENG_090
    for p_text, chap, items in CHAHYE_ENG_PASSAGES:
        for it in items:
            questions.append({
                "question_id": f"M1_ENG_{q_counter:03d}",
                "grade": 1,
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
    qs = get_chahye_eng_questions()
    print(f"Generated {len(qs)} questions for Chahye English (IDs {qs[0]['question_id']} ~ {qs[-1]['question_id']})")
