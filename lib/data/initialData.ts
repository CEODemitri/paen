import type { Article, Video, Comment } from "@/types";

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "The Silent Canopy: How Deep-learning Acoustic Arrays are Mapping Amazonian Biomes",
    subtitle: "In the heart of the Juruá basin, conservationists and AI researchers have deployed thousands of micro-sensors. What they are hearing is rewriting the laws of tropical ecology.",
    content: `Deep within the flooded Igapó forests of the western Amazon, a quiet revolution is taking place—one that is heard rather than seen. Hanging from the buttressed roots of ancient kapok trees, small, olive-drab canisters about the size of a hand radio are listening. These are acoustic monitoring arrays, and they are capturing the entire sonic signature of one of the most biodiverse places on Earth.

Over the past eighteen months, a joint team from the Mamirauá Institute and the London Center for Advanced AI has deployed 1,200 of these bioacoustic sensors across a 50,000-square-kilometer grid. Operating continuously, they log everything: the high-frequency clicking of bats, the low-frequency rumble of jaguars, the crackle of dry twigs, and the distant, ominous hum of outlaw gold dredges.

### Deciphering the Chorus

The sheer volume of audio data generated—approximately 40 terabytes a month—is far too vast for human ears to process. Instead, it is fed into a custom-designed transformer-based neural network trained on over 200,000 verified calls of birds, primates, insects, and amphibians.

"Previously, ecological surveys were slow, dangerous, and subjective," says Dr. Elena Rostova, lead bioacoustician on the project. "We would send research assistants into the swamp with clipboards. They would listen for two hours and write down what they thought they heard. Now, we have an objective, continuous digital record of the forest's health."

The neural network, nicknamed *Aura*, does more than just identify species. It maps their interactions. By analyzing the overlap and structure of animal vocalizations, the AI can measure "biophonic density"—a key index of ecosystem health.

### The Footprints of the Anthropocene

The most urgent findings highlight a sharp contraction of micro-ecological niches along the edges of illegal road clearings. Even where canopy coverage looks completely intact from satellite imagery, Aura's acoustic data reveals a "silent migration." Species of deep-forest antbirds and poison frogs are retreating up to three kilometers away from illegal clearings, long before any physical timber is felled.

"The satellite is blind to the quiet collapse," warns Dr. Rostova. "By the time the canopy falls, the spirit of the forest is already gone. Bioacoustics gives us a dynamic, live diagnostic of the wild before the damage is irreparable."

### Technical Methodology & Trust

To ensure total accuracy, every detection above a 92% confidence threshold is cross-referenced with local indigenous trackers who assist in verifying acoustic signatures that baffle the neural networks. This hybrid approach—fusing generational physical knowledge with planetary-scale machine learning—has set a new gold standard for ecological surveying.`,
    category: "science",
    author: "Alastair Vance",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    authorBio: "Alastair Vance is a senior science correspondent who spent five years reporting on ecological frontiers in the Amazon basin. Former editor at Nature Intelligence.",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop",
    date: "July 5, 2026",
    readTime: "7 min read",
    sources: [
      "Mamirauá Institute for Sustainable Development - Annual Bioacoustic Report 2025",
      "Journal of Tropical Ecology: Neural Classification of Acoustic Biomes (May 2026)",
      "Interviews with Dr. Elena Rostova and Juruá Indigenous Protection Council",
    ],
    factChecked: true,
    objectivityRating: 98,
    likes: 342,
  },
  {
    id: "art-2",
    title: "Silicon Squeezed: Inside the Fight to Control the Next Supercomputing Catalyst",
    subtitle: "With standard semiconductors reaching the physical limits of atomic scaling, a high-stakes chess match has broken out over ultra-pure synthetic diamond monocrystals.",
    content: `For seventy years, the fundamental engine of human progress has been simple: shrink the silicon transistor. But as we approach the physical barrier of single-atom gate widths, where quantum tunneling causes electrons to bleed through solid barriers, the old law of Moore is finally breaking.

The replacement isn't silicon. It is diamond.

In a non-descript industrial park outside of Ulm, Germany, ultra-high-pressure chemical vapor deposition (CVD) chambers are running day and night. They are growing artificial diamonds of a purity that makes natural gemstones look like dirt. These aren't for jewelry; they are destined for the heat sinks and raw substrates of next-generation high-electron-mobility transistors (HEMTs).

### The Thermal Bottleneck

"Modern computing is no longer limited by how fast we can switch a transistor, but by how fast we can draw heat away from it," explains Marcus Vane, director of the European Semiconductor Syndicate. "Silicon melts under the extreme energy densities required for advanced generative AI and quantum processing. Diamond, with a thermal conductivity five times higher than copper, is the only material that can survive."

By mounting gallium nitride directly onto a synthetic diamond wafer, engineers have successfully demonstrated processors that can operate at ten times the power density of pure silicon, without thermal degradation.

### The Geopolitical Footprint

But diamond-substrate semiconductors are incredibly difficult to produce. Currently, only three facilities worldwide possess the advanced plasma-enhanced CVD technology required to deposit large-scale monocrystalline diamond layers with zero lattice defects.

As a result, a quiet but fierce geopolitical struggle has erupted. The United States, China, and the European Union have all recently classified synthetic diamond semiconductor research as "critical defense technology," subjecting equipment exports and laboratory patent filings to strict oversight.

"The nation that controls the high-yield manufacture of synthetic diamond wafers will control the speed of AI deployment, military radar systems, and the next century of aerospace design," says Vane.

### Future Outlook

While production costs remain astronomically high—a single four-inch diamond wafer currently costs upwards of $18,000—yields are improving by 40% year-over-year. As automated plasma monitoring systems improve, industry analysts expect price parity with premium silicon carbide within the next decade.`,
    category: "tech",
    author: "Elena Rostova",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    authorBio: "Elena Rostova is a technology analyst and investigative journalist specializing in advanced computing hardware, mineral supply chains, and micro-infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    date: "July 3, 2026",
    readTime: "5 min read",
    sources: [
      "European Semiconductor Syndicate: Quarterly Materials Briefing (Q2 2026)",
      "IEEE Transactions on Electron Devices: Diamond-Substrate HEMT Performance Review",
      "Ulm Institute of Quantum Engineering CVD Laboratory data logs",
    ],
    factChecked: true,
    objectivityRating: 96,
    likes: 512,
  },
  {
    id: "art-3",
    title: "The Sovereign Fracture: How Regionalized Sovereign Wealth is Restructuring Global Capitals",
    subtitle: "From Riyadh to Singapore, state-backed capital is breaking away from traditional multi-lateral indexing. The consequences for global liquidity are profound.",
    content: `For decades, global finance followed a predictable, centralized path. Excess capital generated from commodity booms or manufacturing surpluses was recycled back into Western financial capitals—flowing into US Treasuries, London real estate, and major European equity indexes.

That circle has broken.

A new generation of sovereign wealth managers is charting a highly nationalistic, activist course. Rather than passively tracking index funds or relying on external Western investment banks, funds like Saudi Arabia's Public Investment Fund (PIF), Singapore's Temasek, and Norway's GPFG are acting as sovereign venture capital houses, negotiating direct equity stakes, funding infrastructure nodes, and dictating technology transfers.

### The Rise of Direct Geoeconomics

This shift from passive rentier to active operator is fundamentally changing how global projects are funded. Under new mandates, sovereign capital is increasingly tied to local industrial localization.

"If you want Sovereign Wealth money today, you don't just pitch a high return," says Sarah Lin, managing partner at Capital Horizon. "You have to promise to build a factory in Riyadh, set up a regional headquarters in Singapore, or transfer advanced battery IP to a local state-owned enterprise. It is capital with heavy structural strings attached."

### The Fragmentation of Global Liquidity

The broader danger of this trend is the partitioning of global liquidity. As state funds prioritize localized strategic industries, traditional emerging market debt and mid-cap equity indexes are seeing a steady withdrawal of support.

Sovereign wealth funds now manage an estimated $12.5 trillion globally—more than the entire global hedge fund industry combined. If even a fraction of this capital moves from global liquid assets to illiquid, domestic strategic infrastructure, the cost of capital for non-aligned developing countries will rise significantly.

### Strategic Capital Realignment

Western regulators are watching this development with growing concern. The Committee on Foreign Investment in the United States (CFIUS) and its European equivalents have steadily expanded their review of sovereign-backed venture investments, citing national security concerns over critical data, logistics hubs, and energy infrastructure.

Ultimately, we are entering a new era of "sovereign capitalism," where the state is no longer just the regulator of the market, but its most powerful, capitalized investor.`,
    category: "finance",
    author: "Sarah Lin",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    authorBio: "Sarah Lin is an international finance scholar, former advisor to the Asian Development Bank, and author of 'The New Sovereign Ledger.'",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    date: "June 29, 2026",
    readTime: "8 min read",
    sources: [
      "Sovereign Wealth Fund Institute: Annual Asset Allocation Review (2025)",
      "Bank for International Settlements: Global Liquidity Report Working Paper No. 104",
      "Interviews with current executives at GIC, PIF, and Temasek Holdings",
    ],
    factChecked: true,
    objectivityRating: 94,
    likes: 289,
  },
  {
    id: "art-4",
    title: "The Ghost Epoch: Preserving the Ephemeral Artifacts of Early Digital Communes",
    subtitle: "As the early architectures of the web rot away, a dedicated collective of digital conservators is fighting to map and catalog the fragile ruins of the early 2000s net culture.",
    content: `We live in the most heavily documented era in human history, yet we are on the verge of a cultural dark age. The early digital communes—the forums, the webrings, the self-hosted diaries, and the collaborative visual boards of the early 2000s—are disappearing at a rate of thousands of pages per hour.

This is the "digital rot." Unlike physical paper, which degrades gracefully over centuries, digital media fails catastrophically and silently. A single unpaid domain fee, a server hosting transition, or an unmaintained database schema update can wipe out entire communities and decades of cultural dialogue in a fraction of a second.

### The Conservators of the Void

In a small, air-conditioned basement archive in Amsterdam, a team of twenty digital archaeologists is running specialized scraping scripts on antique computer terminals. They call themselves the *Lumina Registry*, and their mission is to salvage what they can of the early web's fragile vernacular architecture.

"We aren't just saving files; we are saving spaces," says Jean-Baptiste Coutau, the founder of Lumina. "When an early 2000s forums board goes offline, it's not just text that is lost. It is the specific visual layout, the custom emoticons, the signature headers, the collective rhythm of human interaction that existed there. It's like a neighborhood being completely bulldozed without a map."

### The Problem of Proprietary Formats

The preservation effort is complicated by the obsolescence of file formats and software. Millions of interactive web art pieces, early narrative games, and digital catalogs were built using Adobe Flash, Shockwave, or early Java applets—systems that are now completely blocked or unsupported by modern browsers.

To circumvent this, the Lumina team is developing browser-level hardware emulators that can render these historical web layouts with clock-perfect accuracy.

### Cultural Memory in the Cloud Era

The shift from the open, decentralized web to centralized proprietary platforms has changed how digital culture is formed and destroyed. Because these modern spaces are closed databases, they cannot be crawled or saved by public archives like the Wayback Machine.

"We have traded structural autonomy for ease of use," warns Coutau. "If a major social platform decides to delete an account, or if the platform itself folds, there is no public record left. We are allowing our modern cultural commons to be private property, and when that property is demolished, our history goes with it."`,
    category: "culture",
    author: "Jean-Baptiste Coutau",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    authorBio: "Jean-Baptiste Coutau is a digital archivist, code historian, and regular consultant for the UNESCO Digital Memory of the World program.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    date: "June 25, 2026",
    readTime: "6 min read",
    sources: [
      "Lumina Registry Technical Documentation: Emulation of Legacy Web Environments (2025)",
      "UNESCO Guidelines for the Preservation of Digital Heritage (Section 4)",
      "The Archive Team: Scraping Logs and Domain Rot Statistics",
    ],
    factChecked: true,
    objectivityRating: 97,
    likes: 418,
  },
  {
    id: "art-5",
    title: "Borderlands of the Pact: The Fragmented Alliances Reshaping Arctic Demilitarization",
    subtitle: "As sea ice thins, the decades-old agreements governing polar navigation are giving way to high-latitude military bases and unilateral territorial declarations.",
    content: `For half a century, the high Arctic was a place of frozen peace. Governed by the "Arctic Council" under the principle of "High North, Low Tension," polar nations prioritized collaborative scientific research, environmental protection, and shared search-and-rescue services.

That icy peace has thawed.

Over the past three years, the northern coastlines of Norway, Canada, and Russia have seen a dramatic escalation in military infrastructure. Cold-weather radar installations, deep-water sub bases, and heavy icebreaker patrols are becoming permanent fixtures of a landscape that was once home only to research outposts and nomadic communities.

### The Rush for the Open Sea

The driving force behind this militarization is simple: geography is changing. With summer sea ice projected to disappear entirely by 2035, the Northern Sea Route (NSR) and the Northwest Passage are transitioning from legendary maritime hazards to vital, commercial shipping lanes that reduce travel times between Europe and Asia by 40%.

"The Arctic is no longer a protective barrier; it is an active corridor," says Dr. Karl Sundstrom, senior researcher at the Stockholm Polar Institute. "And whoever controls the chokepoints of that corridor controls the new trade routes of the global north."

### The Ecological Fallout

The environmental consequences of this strategic push are severe. The high Arctic is an incredibly fragile ecosystem, and the introduction of heavy military vessels, deep-water drilling platforms, and industrial shipping lanes threatens to disrupt migration corridors for bowhead whales, polar bears, and migratory seabirds.

### Seeking a New Treaty

As traditional multi-lateral forums like the Arctic Council remain paralyzed, diplomats are calling for an entirely new, binding global treaty—a "Polar Demilitarization Pact" modeled on the Antarctic Treaty of 1959.

But with geopolitical trust at historic lows, the prospects for a polar freeze look increasingly remote. The high north seems destined to remain a zone of deep, freezing tension.`,
    category: "politics",
    author: "Dr. Karl Sundstrom",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    authorBio: "Dr. Karl Sundstrom is a polar geopolitical analyst and author of 'The Thinning Ice: Geopolitics at eighty-five degrees North.'",
    imageUrl: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1000&auto=format&fit=crop",
    date: "June 20, 2026",
    readTime: "9 min read",
    sources: [
      "Stockholm Polar Institute Strategic Arctic Briefing Paper (June 2026)",
      "UN Convention on the Law of the Sea (UNCLOS) - Polar Code Annex",
      "Satellite analysis of military radar installations in Murmansk and Alert",
    ],
    factChecked: true,
    objectivityRating: 95,
    likes: 304,
  },
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "vid-1",
    title: "The Sound of the Jungle: Setting up the Bioacoustic Micro-Arrays",
    description: "Dr. Elena Rostova and her team hike into the deep Amazonian canopy to mount the acoustic capsules and capture the wild's sonic pulse.",
    category: "science",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=600&auto=format&fit=crop",
    duration: "1:45",
    date: "July 4, 2026",
    author: "Alastair Vance",
  },
  {
    id: "vid-2",
    title: "Chambers of Ulm: High-Density Plasma Deposition of Semiconductor Wafers",
    description: "A deep dive inside the chemical vapor deposition laboratories where industrial diamond crystals are grown under extreme energy levels.",
    category: "tech",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    duration: "0:15",
    date: "July 2, 2026",
    author: "Elena Rostova",
  },
  {
    id: "vid-3",
    title: "The Lumina Collective: Archiving the Forgotten Webrings of 2001",
    description: "Meet the digital conservationists salvage-scraping the ancient codebases and flash files of early virtual communities.",
    category: "culture",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    duration: "1:12",
    date: "June 24, 2026",
    author: "Jean-Baptiste Coutau",
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    author: "Dr. Charles G.",
    text: "This is a masterpiece of environmental reporting. Bioacoustics provides a completely objective metric for biodiversity. We've seen similar patterns in marine biomes where sonar tracks reef health prior to bleaching.",
    date: "July 5, 2026, 4:12 PM",
  },
  {
    id: "com-2",
    articleId: "art-1",
    author: "Miranda V.",
    text: "Fascinating point about the 'silent migration'. If a forest becomes biologically dead but structurally standing, satellites will continue reporting it as preserved. This is a severe gap in existing carbon-credit tracking models.",
    date: "July 5, 2026, 8:45 PM",
  },
  {
    id: "com-3",
    articleId: "art-2",
    author: "Linus_K",
    text: "Diamond semiconductors are the ultimate endgame. The main hurdle has always been lattice matching when depositing on silicon. The Ulm team's direct gallium-nitride bonding is a massive breakthrough.",
    date: "July 4, 2026, 11:30 AM",
  },
  {
    id: "com-4",
    articleId: "art-4",
    author: "RetroCoder88",
    text: "The Lumina Registry is doing sacred work. I was active in several web forums in 2003, and looking back, those were some of the most intellectually honest digital spaces. Losing them to domain decay is a tragedy.",
    date: "June 26, 2026, 9:02 AM",
  },
];
