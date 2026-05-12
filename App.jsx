import { useState, useRef } from "react";

const IMG={
  logo:"/logo.jpg",
  warning_cmp:"/warning-cmp.jpg",
  fan:"/fan.jpg",
  open_pf:"/open-pf.jpg",
  box_open:"/box-open.jpg",
  prints_line:"/prints-line.jpg",
  inside:"/inside.jpg",
  inside_blur:"/inside_blur.jpg",
  outside:"/outside.jpg",
  outside_blur:"/outside_blur.jpg",
  // ── vues coffret studio ──
  coffrets_flat:"/coffrets-flat.jpg",
  coffret_gf_closed:"/coffret-gf-closed.jpg",
  coffret_pf_print:"/coffret-pf-print.jpg",
  coffret_detail:"/coffret-detail.jpg",
  open_pf_2:"/open-pf-2.jpg",
  // ── portraits bio ──
  portrait_sm:"/portrait-sm.jpg",
  portrait_av:"/portrait-av.jpg",
  portrait_duo:"/portrait-duo.jpg",
};
const VID={gate:"/gate.mp4",full:"/full.mp4"};
const LANGS=["FR","EN","ES","PT","DE","IT","中","日"];

const PRINTS=[
  {id:1,num:"I",   src:"/tirage-01.jpg",title:"To Whom It May Concern",          tech:"Poème · Croix dorée",                                origLangs:["FR","PT","EN"],bz:[{t:42,l:52,w:34,h:30,lb:"— Je suis Moneypenis —"}]},
  {id:2,num:"II",  src:"/tirage-02.jpg",title:"Dear Sir",                         tech:"Lettre manuscrite · Encre marine · Sculpture",       origLangs:["FR","EN"],     bz:[{t:5,l:30,w:50,h:38,lb:"— dear sir —"}]},
  {id:3,num:"III", src:"/tirage-03.jpg",title:"J'ai Tant Voyagé",                 tech:"Photographie couleur · Texte jaune",                 origLangs:["FR","PT","EN"],bz:[{t:2,l:8,w:84,h:52,lb:"— j'ai tant voyagé —"}]},
  {id:4,num:"IV",  src:"/tirage-04.jpg",title:"Été 2023",                         tech:"Tirage argentique · Encre verte manuscrite",         origLangs:["FR"],          bz:[{t:5,l:15,w:70,h:52,lb:"— été 2023 —"}]},
  {id:5,num:"V",   src:"/tirage-05.jpg",title:"Je Déguise Mes Désirs",            tech:"Photo couleur · Texte rouge · Cravate Hermès",       origLangs:["FR","PT","EN"],bz:[{t:10,l:30,w:50,h:40,lb:"— je déguise mes désirs —"}]},
  {id:6,num:"VI",  src:"/tirage-06.jpg",title:"Open Air",                         tech:"Photographie couleur · Jean ouvert · Nature",        origLangs:["FR"],          bz:[{t:15,l:28,w:44,h:38,lb:"— open air —"}]},
  {id:7,num:"VII", src:"/tirage-07.jpg",title:"Moneypenis, Je N'ai Pas Les Mots", tech:"Photo teintée cyan · Lettre manuscrite orange",      origLangs:["FR","EN"],     bz:[{t:18,l:28,w:56,h:75,lb:""}]},
  {id:8,num:"VIII",src:"/tirage-08.jpg",title:"WARNING!",                         tech:"Texte rouge · NB · Avertissement multilingue",       origLangs:["FR","PT"],     bz:[{t:36,l:25,w:62,h:50,lb:"— WARNING! —"}]},
  {id:9,num:"IX",  src:"/tirage-09.jpg",title:"Moneypenis Mon Amour",             tech:"Lettre manuscrite · Billets 50€ · Mains",            origLangs:["FR"],          bz:[{t:38,l:28,w:55,h:62,lb:""}]},
  {id:10,num:"X",  src:"/tirage-10.jpg",title:"Je Suis Moneypenis",               tech:"Texte rouge · NB · Manifeste",                       origLangs:["FR","PT","EN"],bz:[{t:20,l:38,w:48,h:45,lb:"— je suis moneypenis —"}]},
  {id:11,num:"XI", src:"/tirage-11.jpg",title:"Noël 2023",                        tech:"Lettre manuscrite · Fond fleuri · Encre marine",     origLangs:["FR"],          bz:[]},
];

// ─── Caractéristiques communes à tous les tirages ────────────────────────────
const EDITION={
  year:2024,
  pf:{cm:"30 × 40 cm", in:"11 ¹³⁄₁₆ × 15 ¾ in", count:50},  // Petit Format
  gf:{cm:"50 × 70 cm", in:"19 ¹¹⁄₁₆ × 27 ⁹⁄₁₆ in", count:15}, // Grand Format
  lab:"Traphot, Montrouge",
};
const T={
  FR:{aw:"Contenu Explicite · Adultes Avertis",am:"Ce site présente des œuvres photographiques destinées exclusivement aux adultes avertis.",ap:"+ 18 ans — Version complète",am2:"− 18 ans — Version grand public",nav:["Portfolio","Vidéo","Coffret","In Situ","Shop","Bio & Signature","Presse","Ils en parlent","Contact"],hl:"Édition Limitée · Tirages Argentiques Originaux",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Un Conte de Fées Pop Porn Gay, destiné aux adultes avertis.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Découvrir l'œuvre",pt:"Les 11 Tirages",ps:"Tirages argentiques originaux · Traphot, Montrouge\nSignés et numérotés par Sébastien Moreu & André Vaszkievicz",mg:"Cliquer pour agrandir",tx:"Texte",pr:"Œuvre protégée · Filigrane numérique",ct:"Le Coffret",cs:"Portfolio complet · 11 tirages argentiques · Signés & numérotés · Gants inclus",zt:"Chez Vous",zs:"Les œuvres en situation",vt:"Film",vs:"Contenu réservé aux adultes avertis",st:"Acquérir",pft:"Petit Format  30 × 40 cm",pfc:"50 portfolios numérotés 01/50 → 50/50",pfi:"ISBN : 978-2-492649-21-9",gft:"Grand Format  50 × 70 cm",gfc:"15 portfolios numérotés 01/15 → 15/15",gfi:"ISBN : 978-2-492649-20-2",sg:"Signés S.M. & A.V. · Numéro sur chaque tirage · Gants inclus",pd:"Traphot, Montrouge",p1:"Portfolio PF complet",p2:"Tirage séparé PF",p3:"Portfolio GF complet",p4:"Tirage séparé GF",sh:"Transport & Assurance",sb:"Emballage muséal · DHL Express\nFrance 45 € · Europe 95 € · International 180 €\nAssurance incluse",py:"Paiement",pb:"Virement · Carte · PayPal · 3× sans frais",co:"Conditions",cb:"Certificat d'authenticité · Retour 14 jours · TVA selon pays",rv:"Réserver",by:"Acquérir",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — qui rappelle, comme une forme de résignation stylistique, que tout le monde l'a toujours appelé Sébastien — est ce qui arrive quand la discipline et la volonté se refusent à domestiquer l'obsession.\n\nNé le 25 décembre 1972 dans un décor trop parfait pour être innocent — Saint-Tropez — il grandit dans l'ombre de la précision, un père dentiste façonnant des bouches, et du mythe : résistants, marins, disparus, fantômes familiaux qui refusent de rester enterrés. À dix ans, on lui remet un arsenal complet de peinture. Pas un jouet. Une première arme chargée — début d'une collection baroque, celle d'un fou de guerres intimes.\n\nIl ne les rendra jamais. Préférant multiplier ses champs de bataille.\n\nIl avance par déplacements successifs : peinture, livres, images, relations humaines — tout devient matériau, tout peut être réassemblé. Ce qu'il construit n'est pas une œuvre au sens classique, mais un champ de tensions : entre mémoire et invention, fidélité et trahison, contrôle et perte.\n\nIl ne travaille pas pour les institutions. Il les infiltre. Depuis les années 90, dans l'orbite du galeriste Enrico Navarra, il construit une carrière qui refuse les étiquettes : ni tout à fait salarié, ni tout à fait artiste, ni simple éditeur — plutôt une anomalie productive, capable de générer livres, expositions, liens, archives, idées, communication, événements, à une cadence aussi époustouflante que discontinue. Un désordre qui sert de camouflage à cet homme qui détruit méthodiquement tous les cadres censés le contenir.\n\nIl participe activement à la conception et au développement de la collection Made By…, projet éditorial international consacré à la création contemporaine à travers différentes scènes culturelles. Dans ce cadre, il collabore étroitement avec le photographe Simon Schwyzer.\n\nSa relation avec Simon Schwyzer en est le cœur instable : une collaboration devenue dépendance, une amitié transformée en système amoureux. Un couple ? Depuis la mort brutale du photographe suisse, Moreu répond : « Demandez-lui. » Toujours est-il qu'après sa disparition, rien ne s'arrête — au contraire, tout s'intensifie. Travailler devient une manière de retenir, éditer une manière de prolonger, écrire une manière de ne pas céder. Il s'engage dans la préservation et la valorisation de son œuvre, notamment à travers la préparation de la publication de la monographie Made by… Simon Schwyzer.\n\nEn 2017, avec le soutien d'Enrico Navarra, il avait fondé les Éditions Sébastien Moreu, structure indépendante dédiée aux livres d'art, essais et projets éditoriaux transversaux. La mémoire du photographe suisse détruira l'entreprise. Pas les projets.\n\nPlus tard, avec André Vaszkievicz, l'intime change encore de forme. I Love You Moneypenis n'est pas un projet décoratif posé sur leur relation : c'est une collision de texte, d'image, de désir, d'argent, de corps. Une œuvre conçue depuis l'intérieur du lien, sans filtre protecteur. Leur mariage, le 19 octobre 2024 à Saint-Tropez, ne stabilise rien : il rend officiel ce qui débordait déjà.\n\nSon propre travail — collages, textes, dispositifs éditoriaux — relève d'une esthétique de l'exposition. Journaux ouverts, images découpées, mémoire traitée comme matière première. Rien n'est neutre. Tout est impliqué.\n\nPhysiquement, il porte un corps qui ne coopère pas toujours : cœur rapide, tension capricieuse, système sous pression. Et pourtant, il continue, avec des habitudes qui ressemblent parfois à de la défiance, parfois à une indifférence aux conséquences. Pas de récit propre de rédemption ici. Seulement la persistance.\n\nIl aime intensément, archive obsessionnellement, travaille compulsivement, et refuse de simplifier quoi que ce soit.\n\nS'il existe un principe unificateur, c'est celui-ci : Sébastien Moreu ne résout pas ses contradictions, tant il vénère celles des autres.\n\nLes siennes, il les organise — puis il vit à l'intérieur de l'exposition. Cette galerie est sa maison et celle qu'il offre toute entière à ceux qu'il aime, rien n'est jamais pour lui.\n\nPour conclure, il citerait Desproges : « Étonnant non? »",vn:"André Vaszkievicz",vb:"Nom d'artiste d'un créateur protéiforme d'origine slave, né au début des années 90 en Amérique du Sud. Littérature, art contemporain, musique, performance. Sébastien Moreu et André Vaszkievicz se sont mariés le 19 octobre 2024.",prst:"Dossier de Presse",prss:"Dossier de presse en préparation",prsc:"contact@moneypenis.com",plt:"Ils en Parlent",pls:"Revue de presse en préparation",nt:"Contact",ns:"Envoyer",n1:"Nom",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024 · © ESM Saint-Tropez 2024\nISBN PF: 978-2-492649-21-9 · ISBN GF: 978-2-492649-20-2 · INPI n° 4999735 & 4999726 · Filigrane numérique",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Je déclare sur l'honneur être âgé(e) de 18 ans ou plus et être majeur(e) selon la législation de mon pays de résidence.",ck2:"Je reconnais que ce site présente des œuvres photographiques artistiques à caractère explicite, incluant la vente de tirages originaux, et j'accepte d'y accéder en connaissance de cause."},
  EN:{aw:"Explicit Content · For Adults Only",am:"This site presents photographic artworks for informed adults only.",ap:"+ 18 — Full version",am2:"− 18 — Public version",nav:["Portfolio","Film","Box Set","In Situ","Shop","Bio & Signature","Press","Reviews","Contact"],hl:"Limited Edition · Original Silver Gelatin Prints",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"A Gay Pop Porn Fairy Tale, for informed adults.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Discover the work",pt:"The 11 Prints",ps:"Original silver gelatin prints · Traphot, Montrouge\nSigned and numbered by Sébastien Moreu & André Vaszkievicz",mg:"Click to enlarge",tx:"Text",pr:"Protected artwork · Digital watermark",ct:"The Box Set",cs:"Complete portfolio · 11 silver gelatin prints · Signed & numbered · Gloves included",zt:"In Situ",zs:"The works in situ",vt:"Film",vs:"Content for informed adults only",st:"Acquire",pft:"Small Format  30 × 40 cm",pfc:"50 portfolios numbered 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Large Format  50 × 70 cm",gfc:"15 portfolios numbered 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signed S.M. & A.V. · Number on each print · Gloves included",pd:"Traphot, Montrouge",p1:"Complete SF portfolio",p2:"Single SF print",p3:"Complete LF portfolio",p4:"Single LF print",sh:"Shipping & Insurance",sb:"Museum packaging · DHL Express\nFrance €45 · Europe €95 · International €180\nInsurance included",py:"Payment",pb:"Bank transfer · Credit card · PayPal · 3× interest-free",co:"Terms",cb:"Certificate of authenticity · 14-day return · VAT by country",rv:"Reserve",by:"Acquire",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — who reminds us, as a kind of stylistic resignation, that everyone has always called him Sébastien — is what happens when discipline and will refuse to domesticate obsession.\n\nBorn on December 25, 1972 in a setting too perfect to be innocent — Saint-Tropez — he grew up in the shadow of precision (a dentist father shaping mouths) and of myth: resistance fighters, sailors, missing men, family ghosts refusing to stay buried. At ten, he is handed a full painting arsenal. Not a toy. A first loaded weapon — the beginning of a baroque collection, that of a man mad for intimate wars.\n\nHe will never return them. Preferring to multiply his battlefields.\n\nHe advances through successive displacements: painting, books, images, human relations — everything becomes material, everything can be reassembled. What he builds is not a work in the classical sense, but a field of tensions: between memory and invention, fidelity and betrayal, control and loss.\n\nHe doesn't work for institutions. He infiltrates them. Since the nineties, in the orbit of gallerist Enrico Navarra, he has built a career that refuses labels: neither quite employee, nor quite artist, nor mere editor — rather a productive anomaly, capable of generating books, exhibitions, links, archives, ideas, communication, events, at a pace as breathtaking as it is discontinuous. A disorder that serves as camouflage for this man who methodically destroys every frame meant to contain him.\n\nHe actively participates in the conception and development of the Made By… collection, an international editorial project devoted to contemporary creation across different cultural scenes. In this context, he collaborates closely with photographer Simon Schwyzer.\n\nHis relationship with Simon Schwyzer is the unstable heart of it: a collaboration become dependency, a friendship transformed into a love system. A couple? Since the brutal death of the Swiss photographer, Moreu answers: \"Ask him.\" Still, after his disappearance, nothing stops — on the contrary, everything intensifies. Working becomes a way of holding on, editing a way of prolonging, writing a way of not giving in. He commits to preserving and promoting Schwyzer's work, notably through the preparation of the monograph Made by… Simon Schwyzer.\n\nIn 2017, with the support of Enrico Navarra, he had founded Éditions Sébastien Moreu, an independent imprint dedicated to art books, essays and transversal editorial projects. The memory of the Swiss photographer will destroy the enterprise. Not the projects.\n\nLater, with André Vaszkievicz, the intimate changes form again. I Love You Moneypenis is not a decorative project laid over their relationship: it is a collision of text, image, desire, money, body. A work conceived from inside the bond, without protective filter. Their marriage, on October 19, 2024 in Saint-Tropez, stabilizes nothing: it makes official what was already overflowing.\n\nHis own work — collages, texts, editorial devices — belongs to an aesthetics of exposure. Open newspapers, cut-out images, memory treated as raw material. Nothing is neutral. Everything is implicated.\n\nPhysically, he carries a body that doesn't always cooperate: rapid heart, capricious tension, system under pressure. And yet he continues, with habits that sometimes resemble defiance, sometimes indifference to consequences. No proper redemption narrative here. Only persistence.\n\nHe loves intensely, archives obsessively, works compulsively, and refuses to simplify anything.\n\nIf there is a unifying principle, it is this: Sébastien Moreu does not resolve his contradictions, so much does he venerate those of others.\n\nHis own, he organizes — then lives inside the exhibition. This gallery is his home and the one he offers entirely to those he loves; nothing is ever for himself.\n\nTo conclude, he would quote Desproges: \"Astonishing, isn't it?\" ",vn:"André Vaszkievicz",vb:"Artist name of a protean creator of Slavic origin, born early 1990s in South America. Literature, contemporary art, music, performance. Sébastien Moreu and André Vaszkievicz were married on October 19, 2024.",prst:"Press Kit",prss:"Press kit in preparation",prsc:"contact@moneypenis.com",plt:"Reviews",pls:"Press review in preparation",nt:"Contact",ns:"Send",n1:"Name",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024 · © ESM Saint-Tropez 2024\nISBN SF: 978-2-492649-21-9 · ISBN LF: 978-2-492649-20-2 · INPI no. 4999735 & 4999726",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"I hereby declare that I am 18 years of age or older and of legal age according to the laws of my country of residence.",ck2:"I acknowledge that this site presents explicit artistic photographic works, including the sale of original prints, and I consent to access it knowingly."},
  ES:{aw:"Contenido Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versión completa",am2:"− 18 — Versión pública",nav:["Portfolio","Vídeo","Caja","In Situ","Tienda","Bio & Signature","Prensa","Reseñas","Contacto"],hl:"Edición Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"París, 2024",hd:"Un Cuento de Hadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descubrir",pt:"Los 11 Tirajes",ps:"Copias en plata · Traphot · Firmadas y numeradas",mg:"Clic para ampliar",tx:"Texto",pr:"Obra protegida",ct:"La Caja",cs:"Portfolio completo · 11 copias · Firmadas · Guantes",zt:"In Situ",zs:"Las obras en situación",vt:"Vídeo",vs:"Contenido para adultos",st:"Adquirir",pft:"Pequeño Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Gran Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmadas · Numeradas · Guantes",pd:"Traphot",p1:"Portfolio PF",p2:"Copia PF",p3:"Portfolio GF",p4:"Copia GF",sh:"Transporte",sb:"DHL · Francia 45€ · Europa 95€ · Internacional 180€",py:"Pago",pb:"Transferencia · Tarjeta · PayPal",co:"Condiciones",cb:"Certificado · Devolución 14 días",rv:"Reservar",by:"Adquirir",bt:"Bio & Firmas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que recuerda, como una resignación estilística, que todos siempre lo han llamado Sébastien — es lo que ocurre cuando la disciplina y la voluntad se niegan a domesticar la obsesión.\n\nNacido el 25 de diciembre de 1972 en Saint-Tropez, crece a la sombra de la precisión y del mito familiar. A los diez años recibe un arsenal de pintura: una primera arma cargada, inicio de una colección barroca de guerras íntimas.\n\nDesde los años 90, en la órbita del galerista Enrico Navarra, construye una carrera que rechaza las etiquetas. Participa en la colección Made By…, donde colabora estrechamente con el fotógrafo Simon Schwyzer. Su muerte brutal no detiene nada: al contrario, todo se intensifica.\n\nEn 2017 funda Éditions Sébastien Moreu. Más tarde, con André Vaszkievicz, lo íntimo cambia de forma: I Love You Moneypenis no es decorativo, es una colisión de texto, imagen, deseo, dinero, cuerpo. Su matrimonio el 19 de octubre de 2024 en Saint-Tropez no estabiliza nada: hace oficial lo que ya desbordaba.\n\nSi existe un principio unificador es éste: Sébastien Moreu no resuelve sus contradicciones, tanto venera las de los demás. Las suyas, las organiza — y vive dentro de la exposición.",vn:"André Vaszkievicz",vb:"Creador de origen eslavo, nacido en América del Sur. Casados el 19 de octubre de 2024.",prst:"Prensa",prss:"En preparación",prsc:"contact@moneypenis.com",plt:"Reseñas",pls:"En preparación",nt:"Contacto",ns:"Enviar",n1:"Nombre",n2:"Email",n3:"Mensaje",lg:"© Sébastien Moreu · © André Vaszkievicz · París 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro bajo mi responsabilidad tener 18 años o más y ser mayor de edad según la legislación de mi país de residencia.",ck2:"Reconozco que este sitio presenta obras fotográficas artísticas de carácter explícito, incluyendo la venta de copias originales, y acepto acceder a él con pleno conocimiento."},
  PT:{aw:"Conteúdo Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versão completa",am2:"− 18 — Versão pública",nav:["Portfolio","Vídeo","Coffret","In Situ","Loja","Bio & Signature","Imprensa","Críticas","Contacto"],hl:"Edição Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Um Conto de Fadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descobrir",pt:"As 11 Cópias",ps:"Cópias em prata · Traphot · Assinadas e numeradas",mg:"Clique para ampliar",tx:"Texto",pr:"Obra protegida",ct:"O Coffret",cs:"Portfolio completo · 11 cópias · Assinadas · Luvas",zt:"In Situ",zs:"As obras em situação",vt:"Vídeo",vs:"Conteúdo para adultos",st:"Adquirir",pft:"Pequeno Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Assinadas · Numeradas · Luvas",pd:"Traphot",p1:"Portfolio PF",p2:"Cópia PF",p3:"Portfolio GF",p4:"Cópia GF",sh:"Transporte",sb:"DHL · França 45€ · Europa 95€ · Internacional 180€",py:"Pagamento",pb:"Transferência · Cartão · PayPal",co:"Condições",cb:"Certificado · Devolução 14 dias",rv:"Reservar",by:"Adquirir",bt:"Bio & Assinaturas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que lembra, como uma resignação estilística, que toda a gente sempre lhe chamou Sébastien — é o que acontece quando a disciplina e a vontade se recusam a domesticar a obsessão.\n\nNascido a 25 de dezembro de 1972 em Saint-Tropez, cresce à sombra da precisão e do mito familiar. Aos dez anos recebe um arsenal de pintura: uma primeira arma carregada, início de uma coleção barroca de guerras íntimas.\n\nDesde os anos 90, na órbita do galerista Enrico Navarra, constrói uma carreira que recusa rótulos. Participa na coleção Made By…, onde colabora estreitamente com o fotógrafo Simon Schwyzer. A morte brutal do fotógrafo suíço não detém nada: pelo contrário, tudo se intensifica.\n\nEm 2017 funda as Éditions Sébastien Moreu. Mais tarde, com André Vaszkievicz, o íntimo muda de forma: I Love You Moneypenis não é decorativo, é uma colisão de texto, imagem, desejo, dinheiro, corpo. O casamento a 19 de outubro de 2024 em Saint-Tropez não estabiliza nada: torna oficial o que já transbordava.\n\nSe existe um princípio unificador é este: Sébastien Moreu não resolve as suas contradições, tanto venera as dos outros. As suas, organiza-as — e vive dentro da exposição.",vn:"André Vaszkievicz",vb:"Criador de origem eslava, nascido na América do Sul. Casados a 19 de outubro de 2024.",prst:"Imprensa",prss:"Em preparação",prsc:"contact@moneypenis.com",plt:"Críticas",pls:"Em preparação",nt:"Contacto",ns:"Enviar",n1:"Nome",n2:"Email",n3:"Mensagem",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro sob minha responsabilidade ter 18 anos ou mais e ser maior de idade segundo a legislação do meu país de residência.",ck2:"Reconheço que este site apresenta obras fotográficas artísticas de carácter explícito, incluindo a venda de tiragens originais, e aceito aceder a ele com pleno conhecimento."},
  DE:{aw:"Expliziter Inhalt",am:"Fotografien für Erwachsene.",ap:"+ 18 — Vollständige Version",am2:"− 18 — Öffentliche Version",nav:["Portfolio","Film","Set","In Situ","Shop","Bio & Signature","Presse","Rezensionen","Kontakt"],hl:"Limitierte Auflage",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Ein Gay Pop Porn Märchen.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entdecken",pt:"Die 11 Drucke",ps:"Silbergelatinedrucke · Traphot · Signiert",mg:"Zum Vergrößern klicken",tx:"Text",pr:"Geschütztes Kunstwerk",ct:"Das Set",cs:"Vollständiges Portfolio · 11 Drucke · Handschuhe",zt:"In Situ",zs:"Die Werke in situ",vt:"Film",vs:"Nur für Erwachsene",st:"Erwerben",pft:"Kleinformat 30×40",pfc:"50 Portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Großformat 50×70",gfc:"15 Portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signiert · Nummeriert · Handschuhe",pd:"Traphot",p1:"Portfolio KF",p2:"Einzeldruck KF",p3:"Portfolio GF",p4:"Einzeldruck GF",sh:"Versand",sb:"DHL · Frankreich 45€ · Europa 95€ · International 180€",py:"Zahlung",pb:"Überweisung · Kreditkarte · PayPal",co:"Bedingungen",cb:"Echtheitszertifikat · 14-tägiges Rückgaberecht",rv:"Reservieren",by:"Erwerben",bt:"Bio & Signaturen",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — der wie eine stilistische Resignation daran erinnert, dass ihn immer alle Sébastien genannt haben — ist das, was geschieht, wenn Disziplin und Wille sich weigern, die Obsession zu zähmen.\n\nGeboren am 25. Dezember 1972 in Saint-Tropez, wächst er im Schatten der Präzision und des Familienmythos auf. Mit zehn erhält er ein vollständiges Malarsenal: eine erste geladene Waffe, Beginn einer barocken Sammlung intimer Kriege.\n\nSeit den 90er Jahren, im Umkreis des Galeristen Enrico Navarra, baut er eine Karriere auf, die Etiketten ablehnt. Er beteiligt sich an der Sammlung Made By…, wo er eng mit dem Fotografen Simon Schwyzer zusammenarbeitet. Dessen brutaler Tod stoppt nichts — im Gegenteil, alles intensiviert sich.\n\n2017 gründet er die Éditions Sébastien Moreu. Später, mit André Vaszkievicz, verändert sich das Intime erneut: I Love You Moneypenis ist nicht dekorativ, sondern eine Kollision aus Text, Bild, Begehren, Geld, Körper. Die Hochzeit am 19. Oktober 2024 in Saint-Tropez stabilisiert nichts — sie offizialisiert, was bereits überlief.\n\nFalls es ein vereinigendes Prinzip gibt, dann dieses: Sébastien Moreu löst seine Widersprüche nicht auf, so sehr verehrt er die der anderen. Seine eigenen ordnet er — und lebt dann im Inneren der Ausstellung.",vn:"André Vaszkievicz",vb:"Vielseitiger Schöpfer slawischer Herkunft. Heirat am 19. Oktober 2024.",prst:"Presse",prss:"In Vorbereitung",prsc:"contact@moneypenis.com",plt:"Rezensionen",pls:"In Vorbereitung",nt:"Kontakt",ns:"Senden",n1:"Name",n2:"Email",n3:"Nachricht",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Ich erkläre hiermit, dass ich 18 Jahre oder älter bin und nach den Gesetzen meines Wohnsitzlandes volljährig bin.",ck2:"Ich erkenne an, dass diese Website explizite künstlerische Fotografien präsentiert, einschließlich des Verkaufs von Originaldrucken, und willige wissentlich in den Zugang ein."},
  IT:{aw:"Contenuto Esplicito",am:"Opere fotografiche per adulti.",ap:"+ 18 — Versione completa",am2:"− 18 — Versione pubblica",nav:["Portfolio","Film","Cofanetto","In Situ","Shop","Bio & Signature","Stampa","Recensioni","Contatto"],hl:"Edizione Limitata",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Parigi, 2024",hd:"Una Fiaba Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Scoprire",pt:"Le 11 Stampe",ps:"Stampe all'argento · Traphot · Firmate",mg:"Clic per ingrandire",tx:"Testo",pr:"Opera protetta",ct:"Il Cofanetto",cs:"Portfolio completo · 11 stampe · Guanti",zt:"In Situ",zs:"Le opere in situazione",vt:"Film",vs:"Contenuto per adulti",st:"Acquisire",pft:"Piccolo Formato 30×40",pfc:"50 portfolio 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolio 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmate · Numerate · Guanti",pd:"Traphot",p1:"Portfolio PF",p2:"Stampa PF",p3:"Portfolio GF",p4:"Stampa GF",sh:"Spedizione",sb:"DHL · Francia 45€ · Europa 95€ · Internazionale 180€",py:"Pagamento",pb:"Bonifico · Carta · PayPal",co:"Condizioni",cb:"Certificato · Reso 14 giorni",rv:"Prenotare",by:"Acquisire",bt:"Bio & Firme",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — che ricorda, come una rassegnazione stilistica, che tutti l'hanno sempre chiamato Sébastien — è ciò che accade quando la disciplina e la volontà si rifiutano di addomesticare l'ossessione.\n\nNato il 25 dicembre 1972 a Saint-Tropez, cresce all'ombra della precisione e del mito familiare. A dieci anni gli consegnano un arsenale completo di pittura: una prima arma carica, inizio di una collezione barocca di guerre intime.\n\nDagli anni '90, nell'orbita del gallerista Enrico Navarra, costruisce una carriera che rifiuta le etichette. Partecipa alla collezione Made By…, dove collabora strettamente con il fotografo Simon Schwyzer. La morte brutale del fotografo svizzero non ferma nulla — al contrario, tutto si intensifica.\n\nNel 2017 fonda le Éditions Sébastien Moreu. Più tardi, con André Vaszkievicz, l'intimo cambia di nuovo forma: I Love You Moneypenis non è decorativo, è una collisione di testo, immagine, desiderio, denaro, corpo. Il matrimonio il 19 ottobre 2024 a Saint-Tropez non stabilizza nulla: rende ufficiale ciò che già traboccava.\n\nSe esiste un principio unificatore è questo: Sébastien Moreu non risolve le proprie contraddizioni, tanto venera quelle altrui. Le sue, le organizza — e vive all'interno dell'esposizione.",vn:"André Vaszkievicz",vb:"Creatore di origine slava, nato in Sud America. Sposati il 19 ottobre 2024.",prst:"Stampa",prss:"In preparazione",prsc:"contact@moneypenis.com",plt:"Recensioni",pls:"In preparazione",nt:"Contatto",ns:"Inviare",n1:"Nome",n2:"Email",n3:"Messaggio",lg:"© Sébastien Moreu · © André Vaszkievicz · Parigi 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Dichiaro sotto la mia responsabilità di avere 18 anni o più e di essere maggiorenne secondo la legislazione del mio paese di residenza.",ck2:"Riconosco che questo sito presenta opere fotografiche artistiche di carattere esplicito, inclusa la vendita di stampe originali, e accetto di accedervi consapevolmente."},
  "中":{aw:"限制级内容",am:"成人摄影艺术作品。",ap:"+ 18岁 — 完整版",am2:"− 18岁 — 公开版",nav:["作品集","影片","套装","In Situ","商店","传记 & 签名","新闻","评论","联系"],hl:"限量版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"巴黎，2024",hd:"同志流行色情童话。\nCollection La Grande Librairie de Saint-Tropez®",hc:"探索",pt:"11幅印刷品",ps:"银盐照片 · Traphot · 签名编号",mg:"点击放大",tx:"文字",pr:"受保护作品",ct:"套装",cs:"完整作品集 · 11幅 · 手套",zt:"In Situ",zs:"作品展示",vt:"影片",vs:"成人内容",st:"购买",pft:"小格式 30×40",pfc:"50份 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大格式 50×70",gfc:"15份 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"签名 · 编号 · 手套",pd:"Traphot",p1:"小格式套装",p2:"小格式单幅",p3:"大格式套装",p4:"大格式单幅",sh:"运输",sb:"DHL · 法国45€ · 欧洲95€ · 国际180€",py:"支付",pb:"转账 · 信用卡 · PayPal",co:"条款",cb:"证书 · 14天退货",rv:"预订",by:"购买",bt:"传记 & 签名",sn:"Sébastien Moreu",sb2:"让·塞巴斯蒂安·莫罗（Jean Sébastien Moreu）——他以一种风格化的认命姿态提醒人们：大家一直叫他塞巴斯蒂安——是纪律与意志拒绝驯服执念时所诞生的产物。\n\n1972年12月25日生于圣特罗佩，在精确与家族神话的阴影中长大。十岁时获赠一整套绘画工具：第一件上膛的武器，巴洛克式私人战争收藏的开端。\n\n九十年代以来，他在画廊主恩里科·纳瓦拉的轨道上构建了一种拒绝标签的职业生涯。他参与 Made By… 丛书的策划，与摄影师西蒙·施维泽密切合作。瑞士摄影师的猝然离世并未让一切停止——恰恰相反，一切都被加剧。\n\n2017年创立 Éditions Sébastien Moreu。后来与安德烈·瓦兹基耶维奇相遇，亲密关系再度变形：《I Love You Moneypenis》不是装饰性的作品，而是文本、图像、欲望、金钱与身体的碰撞。2024年10月19日在圣特罗佩的婚礼并未让一切稳定，而是将早已溢出的现实正式化。\n\n若存在一个统一原则，那便是：塞巴斯蒂安·莫罗从不解决自己的矛盾，因他过于崇敬他人的矛盾。他将自己的矛盾加以整理——然后住进展览的内部。",vn:"André Vaszkievicz",vb:"斯拉夫裔，南美出生。2024年10月19日结婚。",prst:"新闻",prss:"准备中",prsc:"contact@moneypenis.com",plt:"评论",pls:"准备中",nt:"联系",ns:"发送",n1:"姓名",n2:"邮箱",n3:"留言",lg:"© Sébastien Moreu · © André Vaszkievicz · 巴黎 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"本人郑重声明已满18周岁，并符合本人居住国法律规定的成年年龄。",ck2:"本人知悉本网站展示含露骨内容的艺术摄影作品，包括出售原版印刷品，并自愿访问。"},
  "日":{aw:"成人向",am:"成人向け作品。",ap:"+ 18歳 — 完全版",am2:"− 18歳 — 公開版",nav:["ポートフォリオ","映像","ボックス","In Situ","ショップ","略歴 & 署名","プレス","レビュー","お問合せ"],hl:"限定版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"パリ、2024",hd:"大人のためのゲイ童話。\nCollection La Grande Librairie de Saint-Tropez®",hc:"発見する",pt:"11点のプリント",ps:"銀塩プリント · Traphot · 署名番号",mg:"クリックで拡大",tx:"テキスト",pr:"保護作品",ct:"ボックスセット",cs:"完全ポートフォリオ · 11点 · 手袋",zt:"In Situ",zs:"作品の展示",vt:"映像",vs:"成人向け",st:"購入",pft:"小サイズ 30×40",pfc:"50部 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大サイズ 50×70",gfc:"15部 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"署名 · 番号 · 手袋",pd:"Traphot",p1:"小セット",p2:"小単品",p3:"大セット",p4:"大単品",sh:"輸送",sb:"DHL · フランス45€ · 欧州95€ · 国際180€",py:"支払い",pb:"振込 · カード · PayPal",co:"条件",cb:"証明書 · 14日返品",rv:"予約",by:"購入",bt:"略歴 & 署名",sn:"Sébastien Moreu",sb2:"ジャン・セバスチャン・モロー — まるで様式的な諦めのように、皆が常に彼を「セバスチャン」と呼んできたと告げる男 — は、規律と意志が執念を飼い慣らすことを拒んだときに生まれるものである。\n\n1972年12月25日、サン＝トロペにて誕生。歯科医の父が形作る口腔の精密さと、家族神話の影のもとで育つ。十歳のとき、絵画道具一式を与えられる。玩具ではない。装填された最初の武器であり、私的な戦争を求める男のバロック的コレクションの始まりである。\n\n90年代以降、ギャラリスト、エンリコ・ナヴァラの軌道上で、彼はあらゆるラベルを拒むキャリアを築く。Made By… コレクションの企画に参画し、スイス人写真家シモン・シュヴァイツァーと深く協働する。彼の急逝は何も停止させない — むしろすべてを加速させる。\n\n2017年、Éditions Sébastien Moreu を設立。のちにアンドレ・ヴァシュキェヴィッチと出会い、親密さは再び形を変える。《I Love You Moneypenis》は装飾的な作品ではなく、テクスト、イメージ、欲望、金銭、身体の衝突である。2024年10月19日、サン＝トロペでの婚姻は何も安定させない — 既に溢れ出ていたものを公式化するに過ぎない。\n\nもし統一原理があるならば、それはこうだ：セバスチャン・モローは自らの矛盾を解決しない。他者の矛盾をあまりに崇めているために。自らの矛盾は整理し — そして、展覧会の内側に住む。",vn:"André Vaszkievicz",vb:"スラブ系クリエーター、南米生まれ。2024年10月19日に結婚。",prst:"プレス",prss:"準備中",prsc:"contact@moneypenis.com",plt:"レビュー",pls:"準備中",nt:"お問合せ",ns:"送信",n1:"名前",n2:"メール",n3:"メッセージ",lg:"© Sébastien Moreu · © André Vaszkievicz · パリ 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"私は18歳以上であり、居住国の法律に基づく成年年齢に達していることを宣言します。",ck2:"本サイトが露骨な内容を含む芸術的写真作品を掲載し、オリジナルプリントの販売を行うことを認識した上で、自らの意志でアクセスすることに同意します。"},
};


const EDS=[{key:"pf",pr:{port:590,single:110},rm:{port:37,tot:50}},{key:"gf",pr:{port:1190,single:180},rm:{port:12,tot:15}}];
const TEXTS = {
  I: {
    FR: `TO WHOM IT MAY CONCERN

Je suis la solitude qui soigne ta tristesse
Je suis l'habit de l'amour
Je suis ce corps déguisé de désirs
Je suis ce désir qui soigne le tien
Je suis ce désir dans l'abîme du tien.
Je suis ce totem, le plus ancien de tous,
Je suis la chair et le sang,
Je suis la peau sans les os.
Je suis ce tabou qu'on veut taire,
Je suis aussi le rire et le sourire.
Je suis ce sexe que tu vénères,
Je suis cette statue primitive.
Je suis le bois sensuel,
Je suis le repos et la tension.
Je suis l'outil du travailleur.
Je suis le cierge qui coule,
Je suis brûlant sous la croix et
Je suis cette bite que tu adores.
Je suis cette éponge de douceur infinie,
Je suis celui qui dure le temps que le temps passe.

JE SUIS MONEYPENIS

Tu peux m'appeler "Crazy Willy", "GogoDicky",
"Dollars Doll Fantasy"... Et alors ?
Je n'aurai pas d'épitaphe !

De ma dépouille il ne restera rien...
Sous la croix, je serai absent de la tombe de mon maître, c'est le destin des sans os.
"True Love Leaves No Traces"
Psalmodiait le chanteur
Je suis Moneypenis
Seul mon cœur est à vendre, et toi, tu m'aimes...`,

    EN: `TO WHOM IT MAY CONCERN

I am the solitude that heals your sadness
I am the garment of love
I am this body disguised as desires
I am this desire that heals yours
I am this desire in the abyss of yours.
I am this totem, the oldest of all,
I am flesh and blood,
I am skin without bones.
I am this taboo that must be silenced,
I am also the laughter and the smile.
I am this sex that you worship,
I am this primitive statue.
I am sensual wood,
I am rest and tension.
I am the worker's tool.
I am the burning candle,
I am burning under the cross and
I am this cock that you adore.
I am this sponge of infinite sweetness,
I am the one who lasts as long as time passes.

I AM MONEYPENIS

You can call me "Crazy Willy", "GogoDicky",
"Dollars Doll Fantasy"... Who cares?
I will have no epitaph!

Nothing will remain of my remains...
Under the cross, I will be absent from my master's grave, that is the destiny of the boneless.
"True Love Leaves No Traces"
The singer would psalm
I am Moneypenis
Only my heart is for sale, and you, you love me...`,

    ES: `PARA QUIEN CORRESPONDA

Soy la soledad que cura tu tristeza
Soy el traje del amor
Soy este cuerpo disfrazado de deseos
Soy este deseo que cura el tuyo
Soy este deseo en el abismo del tuyo.
Soy este tótem, el más antiguo de todos,
Soy carne y sangre,
Soy la piel sin huesos.
Soy este tabú que quieren silenciar,
Soy también la risa y la sonrisa.
Soy este sexo que veneras,
Soy esta estatua primitiva.
Soy madera sensual,
Soy el descanso y la tensión.
Soy la herramienta del trabajador.
Soy la vela que se derrite,
Soy ardiente bajo la cruz y
Soy esta polla que adoras.
Soy esta esponja de dulzura infinita,
Soy aquel que dura mientras pasa el tiempo.

SOY MONEYPENIS

Puedes llamarme "Crazy Willy", "GogoDicky",
"Dollars Doll Fantasy"... ¿A quién le importa?
¡No tendré epitafio!

Nada quedará de mis restos...
"True Love Leaves No Traces"
Solo mi corazón está en venta, y tú, tú me amas...`,

    PT: `PARA QUEM POSSA INTERESSAR

Eu sou a solidão que cuida da tua tristeza
Eu sou o hábito do amor
Eu sou este corpo disfarçado de desejos
Eu sou este desejo que cuida do teu
Eu sou este desejo no abismo do teu.
Eu sou este totem, o mais antigo de todos,
Eu sou a carne e o sangue,
Eu sou a pele sem os ossos.
Eu sou este tabu que querem calar,
Eu também sou o riso e o sorriso.
Eu sou este sexo que veneras,
Eu sou esta estátua primitiva.
Eu sou a madeira sensual,
Eu sou o repouso e a tensão.
Eu sou o instrumento do trabalhador.
Eu sou o círio que derrete,
Eu sou ardente sob a cruz e
Eu sou este pénis que adoras.
Eu sou esta esponja de doçura infinita,
Eu sou aquele que dura o tempo que o tempo passa.

EU SOU MONEYPENIS

Podes chamar-me "Crazy Willy", "GogoDicky",
"Dollars Doll Fantasy"... E daí?
Não terei epitáfio!

Nada ficará dos meus restos...
"True Love Leaves No Traces"
Salmodiava o cantor
Eu sou Moneypenis
Só o meu coração está à venda, e tu, tu me amas...`,

    DE: `AN WEN AUCH IMMER

Ich bin die Einsamkeit, die deine Traurigkeit heilt
Ich bin das Gewand der Liebe
Ich bin dieser als Begehren verkleidete Körper
Ich bin dieses Begehren, das deins heilt
Ich bin dieses Totem, das älteste von allen,
Ich bin Fleisch und Blut,
Ich bin die Haut ohne Knochen.
Ich bin dieses Tabu, das verschwiegen werden soll,
Ich bin auch das Lachen und das Lächeln.
Ich bin dieses Geschlecht, das du verehrst,
Ich bin diese primitive Statue.
Ich bin sinnliches Holz,
Ich bin Ruhe und Spannung.
Ich bin das Werkzeug des Arbeiters.
Ich bin die brennende Kerze,
Ich bin dieser Schwanz, den du anbetest.

ICH BIN MONEYPENIS

Du kannst mich "Crazy Willy", "GogoDicky" nennen... Egal!
Ich werde kein Epitaph haben!

"True Love Leaves No Traces"
Nur mein Herz steht zum Verkauf, und du, du liebst mich...`,

    IT: `A CHI DI COMPETENZA

Sono la solitudine che guarisce la tua tristezza
Sono il vestito dell'amore
Sono questo corpo travestito da desideri
Sono questo totem, il più antico di tutti,
Sono carne e sangue,
Sono la pelle senza ossa.
Sono questo tabù che vogliono tacere,
Sono anche la risata e il sorriso.
Sono questo sesso che veneri,
Sono questa statua primitiva.
Sono legno sensuale,
Sono il riposo e la tensione.
Sono lo strumento dell'operaio.
Sono la candela che brucia,
Sono questo cazzo che adori.

SONO MONEYPENIS

Puoi chiamarmi "Crazy Willy", "GogoDicky"... Chi se ne frega!
Non avrò epitaffio!

"True Love Leaves No Traces"
Solo il mio cuore è in vendita, e tu, tu mi ami...`,

    "中": `致有关人士

我是治愈你悲伤的孤独
我是爱的外衣
我是这个伪装成欲望的身体
我是这个最古老的图腾，
我是血肉，
我是没有骨头的皮肤。
我是想要沉默的禁忌，
我也是笑声和微笑。
我是你崇拜的性，
我是这座原始雕像。
我是感性的木头，
我是休息和张力。
我是工人的工具。
我是燃烧的蜡烛，
我是你崇拜的那根。

我是MONEYPENIS

你可以叫我"Crazy Willy"、"GogoDicky"……无所谓！
我不会有墓志铭！

"True Love Leaves No Traces"
只有我的心在出售，而你，你爱我……`,

    "日": `関係各位へ

私はあなたの悲しみを癒す孤独
私は愛の衣
私は欲望に変装したこの体
私は最も古いトーテム、
私は肉と血、
私は骨のない皮膚。
私は沈黙させたいこのタブー、
私は笑いと微笑みでもある。
私はあなたが崇拝するこの性、
私はこの原始的な彫像。
私は官能的な木材、
私は休息と緊張。
私は労働者の道具。
私は燃えるろうそく、
私はあなたが崇拝するその器官。

私はMONEYPENIS

"Crazy Willy"「GogoDicky」何でも呼んでいい…どうでもいい！
私には墓碑銘がない！

"True Love Leaves No Traces"
売っているのは私の心だけ、そしてあなたは私を愛している……`,
  },

  II: {
    FR: `Cher Monsieur,

Moneypenis mon amour,
mon cœur, mon ange,
je ne trouve pas les mots, je ne trouve pas les mots...
je t'aime voilà tout. Et puis que répondre à une bite qui écrit ?
Un pénis littéraire, un correspondant étranger.
Je ne peux qu'oublier toute pudeur et dignité,
et te répondre je t'aime à bien vouloir le croire.
Je t'aime à en accepter l'impossible, à imaginer que tu t'adresses
à moi. À en rougir un peu, de cette petite honte qui chauffe le visage.

Au point où j'en suis, Moneypenis mon tendre cœur, ma belle bite,
je peux bien te répondre...

Mon épais et faible, mon long et dur tour de passe-passe, pour une semaine ou jusqu'à la fin...

Et puisque tu écris tu dois bien pouvoir lire. Je peux même t'écrire
comme une bite s'il le faut... à en salir ma plume !

Mais tes mots n'existent-ils qu'à mes yeux ?
Une simple politesse poétique qui habille nos échanges ?
Une vue de l'esprit malade et de l'âme triste qui m'habitent ?

Je sais... je sais je sais... seul ton cœur est à vendre !
Seul ton cœur est à vendre et moi je t'aime.
Mais du prix affiché je ne connais ni chiffre ni devise.
I love you Moneypenis... voilà tout !

Ton autre ♥`,

    EN: `Dear Sir,

Moneypenis my love,
my heart, my angel,
I cannot find the words, I cannot find the words...
I love you, that is all. And what to reply to a cock that writes?
A literary penis, a foreign correspondent.
I can only forget all modesty and dignity,
and reply I love you, willing to believe it.
I love you enough to accept the impossible, to imagine that you address yourself
to me. To blush a little, from that small shame that warms the face.

At the point where I am, Moneypenis my tender heart, my beautiful cock,
I can well reply to you...

My thick & weak, my long hard trick, for a week or to the end...

And since you write you must be able to read. I can even write to you
like a cock if need be... enough to dirty my pen!

But do your words only exist in my eyes?
A simple poetic courtesy that dresses our exchanges?
A view of the sick mind and sad soul that inhabit me?

I know... i know i know... your heart only is for sale!
Only your heart is for sale and I love you.
But the price displayed I know neither figure nor currency.
I love you Moneypenis... that is all!

Your other ♥`,

    ES: `Querido Señor,

Moneypenis mi amor,
mi corazón, mi ángel,
no encuentro las palabras, no encuentro las palabras...
te quiero y punto. ¿Y qué responder a una polla que escribe?
Un pene literario, un corresponsal extranjero.
Solo puedo olvidar todo pudor y dignidad,
y responderte te quiero queriendo creerlo.
Te quiero hasta aceptar lo imposible, imaginar que te diriges a mí.
Hasta ruborizarme un poco, de esa pequeña vergüenza que calienta el rostro.

Mi grueso y débil, mi largo y duro truco, por una semana o hasta el final...

Pero ¿tus palabras solo existen ante mis ojos?
¿Una simple cortesía poética que viste nuestros intercambios?

Sé... sé sé... ¡solo tu corazón está en venta!
I love you Moneypenis... ¡y punto!

Tu otro ♥`,

    PT: `Caro Senhor,

Moneypenis meu amor,
meu coração, meu anjo,
não encontro as palavras, não encontro as palavras...
eu te amo, só isso. E o que responder a um pénis que escreve?
Um pénis literário, um correspondente estrangeiro.
Só posso esquecer todo o pudor e dignidade,
e te responder eu te amo querendo acreditar nisso.
Eu te amo a ponto de aceitar o impossível, de imaginar que te diriges a mim.
A ponto de corar um pouco, dessa pequena vergonha que aquece o rosto.

O meu espesso e fraco, o meu longo e duro truque, por uma semana ou até ao fim...

Mas as tuas palavras só existem aos meus olhos?
Uma simples cortesia poética que veste as nossas trocas?
Uma visão do espírito doente e da alma triste que me habitam?

Eu sei... eu sei eu sei... só o teu coração está à venda!
Só o teu coração está à venda e eu te amo.
Mas do preço afixado não conheço nem número nem moeda.
I love you Moneypenis... só isso!

O teu outro ♥`,

    DE: `Sehr geehrter Herr,

Moneypenis meine Liebe,
mein Herz, mein Engel,
ich finde die Worte nicht, ich finde die Worte nicht...
ich liebe dich, das ist alles. Und was einem Schwanz antworten, der schreibt?
Ein literarischer Penis, ein ausländischer Korrespondent.
Ich kann nur alle Scham und Würde vergessen,
und dir antworten ich liebe dich, es glauben wollen.

Mein dicker und schwacher, mein langer harter Trick, für eine Woche oder bis zum Ende...

Aber existieren deine Worte nur in meinen Augen?
Ich weiß... ich weiß ich weiß... nur dein Herz steht zum Verkauf!
I love you Moneypenis... das ist alles!

Dein anderes ♥`,

    IT: `Caro Signore,

Moneypenis amore mio,
il mio cuore, il mio angelo,
non trovo le parole, non trovo le parole...
ti amo, ecco tutto. E cosa rispondere a un cazzo che scrive?
Un pene letterario, un corrispondente straniero.
Posso solo dimenticare ogni pudore e dignità,
e risponderti ti amo volendolo credere.

Il mio spesso e debole, il mio lungo duro trucco, per una settimana o fino alla fine...

Ma le tue parole esistono solo ai miei occhi?
So... so so... solo il tuo cuore è in vendita!
I love you Moneypenis... ecco tutto!

Il tuo altro ♥`,

    "中": `亲爱的先生，

Moneypenis我的爱，
我的心，我的天使，
我找不到词语，我找不到词语……
我爱你，就这样。怎么回复一个会写作的阴茎？
一个文学阴茎，一个外国通讯员。
我只能忘记所有的羞耻和尊严，
回答你我爱你，相信这是真的。

我肥厚而软弱，我漫长而坚硬的把戏，持续一周或直到终点……

但你的话语只存在于我眼中吗？
我知道……只有你的心在出售！
I love you Moneypenis……就这样！

你的另一个♥`,

    "日": `拝啓、

Moneypenis 私の愛、
私の心、私の天使、
言葉が見つからない、言葉が見つからない……
あなたを愛している、それだけ。書くペニスに何と返事をすれば？
文学的なペニス、外国の通信員。
あらゆる慎みと尊厳を忘れるしかない、
あなたを愛していると返事する、信じながら。

私の太くて弱い、長くて硬いトリック、一週間か最後まで…

でもあなたの言葉は私の目にしか存在しないの？
分かっている……売っているのはあなたの心だけ！
I love you Moneypenis……それだけ！

あなたのもう一つ♥`,
  },

  III: {
    FR: `J'AI TANT VOYAGÉ, les chambres avec vue se ressemblent toutes. J'ai tant voyagé, visité des bouches, pénétré des visages, caressé des langues. J'ai tant voyagé, j'ai dansé dans les cavités les plus sombres qui ressemblent aux cavités les plus sombres. J'ai tant voyagé, je mérite d'être douché plus souvent qu'à mon tour. J'ai tant voyagé, balancé souple entre ces cuisses puissantes qui me portent et supportent. J'ai tant voyagé, sans vraiment fuir. J'ai tant voyagé, s'enfuir parfois. J'ai tant voyagé, savonné par respect pour moi-même, j'ai tant voyagé, parfumé sans honte de vous autres. J'ai tant voyagé, soumis au rythme chaloupé d'un frère agonisant dans mon dos. J'ai tant voyagé, j'ai connu les tremblements les plus désespérés. J'ai tant voyagé, toujours lavé, toujours choyé. J'ai tant voyagé, mais c'est le sens de nos vies : danser, mourir en bavant et recommencer. J'ai tant voyagé, miraculé, ressuscité, sentant glisser mon dû dans sa poche tout contre moi. J'ai parcouru le monde connu sous tant de noms différents : "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"... J'ai parcouru le monde, parfois je me suis perdu. J'ai tant voyagé que, parfois, il ne reste de moi que cette sensation qui résulte des "eaux de mars"...
J'ai tant voyagé, je suis Moneypenis et toi tu m'aimes.`,

    EN: `I HAVE TRAVELLED SO MUCH, hotel rooms with a view all look the same. I have travelled so much, visited mouths, penetrated faces, caressed tongues. I have travelled so much, danced in the darkest cavities that resemble the darkest cavities. I have travelled so much, I deserve to be showered more often than my turn. I have travelled so much, swaying gently between those powerful thighs that carry and support me. I have travelled so much, without really fleeing. I have travelled so much, fleeing sometimes. I have travelled so much, soaped out of self-respect, perfumed without shame for the rest of you. I have travelled so much, subjected to the swaying rhythm of a dying brother on my back. I have travelled so much, I have known the most desperate tremors. I have travelled so much, always washed, always pampered. I have travelled so much, but that is the meaning of our lives: dance, die drooling and start again. I have travelled so much, miraculously saved, resurrected, feeling my due sliding into its pocket right against me. I have travelled the world known by so many different names: "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"... I have travelled the world, sometimes I lost myself. I have travelled so much that, sometimes, all that remains of me is that sensation resulting from "the waters of march"...
I have travelled so much, I am Moneypenis and you love me.`,

    ES: `HE VIAJADO TANTO, las habitaciones con vistas se parecen todas. He viajado tanto, visitado bocas, penetrado rostros, acariciado lenguas. He viajado tanto, danzado en las cavidades más oscuras. He viajado tanto, merece que me duchen más a menudo. He viajado tanto, balanceándome suavemente entre esos muslos poderosos que me llevan y me sostienen. He viajado tanto, sin realmente huir. He viajado tanto, huyendo a veces. He viajado tanto, enjabonado por respeto a mí mismo, perfumado sin vergüenza. He viajado tanto, sometido al ritmo de un hermano agonizante en mi espalda. He viajado tanto, conocí los temblores más desesperados. He viajado tanto, siempre lavado, siempre mimado. He viajado tanto, pero ese es el sentido de nuestras vidas: bailar, morir babeando y empezar de nuevo. He recorrido el mundo conocido por tantos nombres diferentes: "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"... He recorrido el mundo, a veces me perdí.
He viajado tanto, soy Moneypenis y tú me amas.`,

    PT: `EU VIAJEI TANTO, os quartos com vista parecem-se todos. Eu viajei tanto, visitei bocas, penetrei rostos, acariciei línguas. Eu viajei tanto, dancei nas cavidades mais sombrias que se parecem às cavidades mais sombrias. Eu viajei tanto, mereço ser banhado mais vezes do que a minha vez. Eu viajei tanto, balançado suave entre essas coxas poderosas que me portam e suportam. Eu viajei tanto, sem verdadeiramente fugir. Eu viajei tanto, a fugir às vezes. Eu viajei tanto, ensaboado por respeito por mim mesmo, perfumado sem vergonha de vocês. Eu viajei tanto, submetido ao ritmo de um irmão agonizante nas minhas costas. Eu viajei tanto, conheci os tremores mais desesperados. Eu viajei tanto, sempre lavado, sempre mimado. Eu viajei tanto, mas esse é o sentido das nossas vidas: dançar, morrer a babar e recomeçar. Eu percorri o mundo conhecido por tantos nomes diferentes: "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"... Eu percorri o mundo, às vezes perdi-me. Eu viajei tanto que, às vezes, resta de mim somente essa sensação que resulta "as águas de março"...
Eu viajei tanto, sou Moneypenis e tu me amas.`,

    DE: `ICH BIN SO VIEL GEREIST, Hotelzimmer mit Aussicht sehen alle gleich aus. Ich bin so viel gereist, Münder besucht, Gesichter durchdrungen, Zungen gestreichelt. Ich bin so viel gereist, in den dunkelsten Höhlen getanzt. Ich bin so viel gereist, sanft zwischen mächtigen Schenkeln geschaukelt. Ich bin so viel gereist, immer gewaschen, immer verwöhnt. Ich bin so viel gereist, aber das ist der Sinn unseres Lebens: tanzen, sabbernd sterben und neu beginnen. Ich habe die Welt unter so vielen Namen bereist: "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"...
Ich bin so viel gereist, ich bin Moneypenis und du liebst mich.`,

    IT: `HO VIAGGIATO TANTO, le camere con vista si assomigliano tutte. Ho viaggiato tanto, visitato bocche, penetrato volti, accarezzato lingue. Ho viaggiato tanto, danzato nelle cavità più buie. Ho viaggiato tanto, dondolato tra quelle cosce potenti. Ho viaggiato tanto, sempre lavato, sempre coccolato. Ho viaggiato tanto, ma questo è il senso delle nostre vite: danzare, morire sbavando e ricominciare. Ho percorso il mondo conosciuto sotto tanti nomi diversi: "El Fantastico Zob Deluxe"... "El Chibre de Oro"... "Thick Amour"... "Panzer Pénis"... "Cock Orico"...
Ho viaggiato tanto, sono Moneypenis e tu mi ami.`,

    "中": `我旅行了太多，有景观的房间看起来都一样。我旅行了太多，拜访了嘴唇，穿透了面孔，爱抚了舌头。我旅行了太多，在最黑暗的腔体中舞蹈。我旅行了太多，在那些强壮的大腿之间轻轻摇晃。我旅行了太多，总是被清洗，总是被呵护。我旅行了太多，但这就是我们生命的意义：跳舞，流着口水死去，然后重新开始。我以如此多不同的名字周游世界："El Fantastico Zob Deluxe"..."El Chibre de Oro"..."Thick Amour"..."Panzer Pénis"..."Cock Orico"...
我旅行了太多，我是Moneypenis，而你爱我。`,

    "日": `私はこんなに旅をした、景色のある部屋はみんな同じに見える。私はこんなに旅をした、口を訪れ、顔に入り込み、舌を撫でた。私はこんなに旅をした、最も暗い空洞で踊った。私はこんなに旅をした、あの力強い太ももの間でゆっくり揺られた。私はこんなに旅をした、常に洗われ、常に大切にされた。私はこんなに旅をした、でもそれが私たちの人生の意味だ：踊り、よだれを垂らして死に、また始める。私はこんなに多くの異なる名前で世界を旅した："El Fantastico Zob Deluxe"..."El Chibre de Oro"..."Thick Amour"..."Panzer Pénis"..."Cock Orico"...
私はこんなに旅をした、私はMoneypenis、そしてあなたは私を愛している。`,
  },

  IV: {
    FR: `Été 2023

Ton visage apaisé, c'est le portrait de toi que je préfère.
Décoiffé sans excès, les traits détendus, les yeux fermés,
le visage de la sérénité qui me fait t'écrire à l'encre verte.

Hé Money-p

Te souviens-tu de nos joies échangées ?
Ou se perdent-elles avec celles partagées ailleurs ?
Se confondent-elles avec mes moments d'égoïsme banal ?
Avec la fébrilité pressée de mon inexpérience ?
Ou plus tristement s'abîment-elles dans tes larmes ?
Mon tendre arc tendu, Moneypenis écris-moi.
Écris-moi tes propres vices, les lois de ton service
Écris-moi tes désirs, tes rires, tes peurs, et le pire aussi...
Je t'aime.

Ton toujours dévoué autre ♥`,

    EN: `Summer 2023

Your peaceful face, it's the portrait of you I prefer.
Slightly dishevelled, relaxed features, eyes closed,
the face of serenity that makes me write to you in green ink.

Hey Money-p

Do you remember our shared joys?
Or do they get lost with those shared elsewhere?
Do they blend with my moments of ordinary selfishness?
With the hurried excitement of my inexperience?
Or more sadly do they sink in your tears?
My tender drawn bow, Moneypenis write to me.
Write me your own vices, the rules of your service
Write me your desires, your laughter, your fears, and the worst too...
I love you.

Your ever devoted other ♥`,

    ES: `Verano 2023

Tu cara apaciguada, es el retrato tuyo que prefiero.
Despeinado sin exceso, rasgos relajados, ojos cerrados,
el rostro de la serenidad que me hace escribirte con tinta verde.

Oye Money-p

¿Te acuerdas de nuestras alegrías intercambiadas?
¿O se pierden con las compartidas en otro lugar?
¿Se confunden con mis momentos de egoísmo banal?
¿Con la febrilidad apresurada de mi inexperiencia?
¿O más tristemente se arruinan en tus lágrimas?
Mi tierno arco tenso, Moneypenis escríbeme.
Escríbeme tus propios vicios, las leyes de tu servicio
Escríbeme tus deseos, tus risas, tus miedos, y lo peor también...
Te quiero.

Tu siempre dedicado otro ♥`,

    PT: `Verão 2023

O teu rosto apaziguado, é o retrato de ti que prefiro.
Despenteado sem excessos, traços relaxados, olhos fechados,
o rosto da serenidade que me faz escrever-te a tinta verde.

Ei Money-p

Lembras-te das nossas alegrias trocadas?
Ou perdem-se com as partilhadas noutro lugar?
Confundem-se com os meus momentos de egoísmo banal?
Com a febrilidade apressada da minha inexperiência?
Ou mais tristemente estragam-se nas tuas lágrimas?
Meu terno arco tenso, Moneypenis escreve-me.
Escreve-me os teus próprios vícios, as leis do teu serviço
Escreve-me os teus desejos, as tuas risadas, os teus medos, e o pior também...
Eu te amo.

O teu sempre dedicado outro ♥`,

    DE: `Sommer 2023

Dein friedliches Gesicht, das ist das Porträt von dir, das ich bevorzuge.
Leicht zerzaust, entspannte Züge, geschlossene Augen,
das Gesicht der Gelassenheit, das mich dazu bringt, dir mit grüner Tinte zu schreiben.

Hey Money-p

Erinnerst du dich an unsere getauschten Freuden?
Oder gehen sie verloren mit denen, die anderswo geteilt wurden?
Schreib mir deine eigenen Laster, die Regeln deines Dienstes
Schreib mir deine Wünsche, dein Lachen, deine Ängste, und das Schlimmste auch...
Ich liebe dich.

Dein immer ergebenes anderes ♥`,

    IT: `Estate 2023

Il tuo viso pacificato, è il ritratto di te che preferisco.
Scarmigliato senza eccessi, tratti rilassati, occhi chiusi,
il volto della serenità che mi fa scriverti con inchiostro verde.

Ehi Money-p

Ti ricordi delle nostre gioie condivise?
O si perdono con quelle condivise altrove?
Scrivimi i tuoi vizi, le leggi del tuo servizio
Scrivimi i tuoi desideri, le tue risate, le tue paure, e il peggio anche...
Ti amo.

Il tuo sempre devoto altro ♥`,

    "中": `2023年夏

你平静的脸，是我最喜欢的你的样子。
微乱的发，放松的轮廓，闭着的眼睛，
那宁静的面孔让我用绿色墨水给你写信。

嘿 Money-p

你还记得我们交换的快乐吗？
还是它们随着在别处分享的快乐而迷失了？
把你的欲望、笑声、恐惧，还有最糟糕的也写给我……
我爱你。

你永远忠诚的另一个♥`,

    "日": `2023年夏

あなたの穏やかな顔、それが私の好きなあなたの肖像。
少し乱れた髪、くつろいだ表情、閉じた目、
その静けさの顔が私に緑のインクであなたに書かせる。

ねえ Money-p

私たちが交わした喜びを覚えている？
それとも他で分かち合ったものと共に消えてしまった？
あなたの欲望、笑い、恐れ、そして最悪のことも書いてください……
愛しています。

あなたのいつも献身的なもう一つ♥`,
  },

  V: {
    FR: `Je déguise mes désirs
J'ai fait miens ceux des autres
Mes plaisirs restent avec moi
Vous n'en saurez jamais rien...
Peut-être est-ce de m'en priver ?
Je suis le kiné de vos creux intimes
Celui de vos intimités saillantes.
Vous pouvez aussi jouer au médecin,
Jouer à l'infirmière... Pas l'anesthésiste...
Je ne suis jamais trop patient :
Le temps est compté !
Je suis Moneypenis et toi tu m'aimes...

Tu payes pour m'enrouler dans la soie de ta mère,
M'attacher une cravate de Noël ou la laisse du chien.
Je suis à toi le temps que le temps passe. C'est tout...
Je n'ai aucune honte ni de toi ni de moi. As-tu cette chance ?
My name is Moneypenis, only my heart is for sale.
Tu peux ajouter Monsieur si ça te fait du bien ou simplement m'appeler :
"My Little Lord"... "The Fat Lady Beat", "Jesus" ou "Baby Beast"...
"Deep Johnny Deep"... Comme tu préfères.
Je suis épuisé de t'écouter, comme je suis épuisé d'avoir écouté d'autres avant toi.
Moi mon talent il est là, à nu devant toi. C'est ce que je sais faire, et je le fais bien.
Alors ta gueule, paye et viens on baise.`,

    EN: `I disguise my desires
I made others' mine
My pleasures stay with me
You will never know them...
Perhaps it is to deprive myself of them?
I am the physiotherapist of your intimate hollows
The one of your protruding intimacies.
You can also play doctor,
Play nurse... Not anesthesiologist...
I am never too patient:
Time is limited!
I am Moneypenis and you love me...

You pay to wrap me in your mother's silk,
Tie a Christmas tie or a dog leash around me.
I am yours as long as time passes. That's all...
I have no shame of you or of me. Do you have that luck?
My name is Moneypenis, only my heart is for sale.
You can add Sir if it makes you feel better or just call me:
"My Little Lord"... "The Fat Lady Beat", "Jesus" or "Baby Beast"...
"Deep Johnny Deep"... As you prefer.
I am exhausted from listening to you, just as I am exhausted from having listened to others before you.
My talent is there, naked before you. That is what I know how to do, and I do it well.
Shut up, pay and come, let's fuck.`,

    ES: `Disfrazo mis deseos
He hecho míos los de otros
Mis placeres permanecen conmigo
Nunca los conoceréis...
¿Quizás es para privarme de ellos?
Soy el fisioterapeuta de vuestros huecos íntimos
El de vuestras intimidades salientes.
También podéis jugar al médico,
Jugar a la enfermera... No al anestesista...
Nunca soy demasiado paciente:
¡El tiempo es limitado!
Soy Moneypenis y tú me amas...

Pagas para envolverme en la seda de tu madre.
Soy tuyo mientras pasa el tiempo. Eso es todo...
No tengo vergüenza ni de ti ni de mí. ¿Tienes esa suerte?
My name is Moneypenis, only my heart is for sale.
Cállate, paga y ven, vamos a follar.`,

    PT: `Eu disfarço meus desejos
Fiz meus os dos outros
Meus prazeres permanecem comigo
Você jamais saberá deles...
Talvez seja para me privar deles?
Sou o fisioterapeuta dos vossos ocos íntimos
O das vossas intimidades salientes.
Também podes fazer-te passar por médico,
Jogar à enfermeira... Não ao anestesista...
Nunca sou demasiado paciente:
O tempo está contado!
Sou Moneypenis e tu me amas...

Pagas para me enrolar na seda da tua mãe.
Sou teu o tempo que o tempo passa. É tudo...
Não tenho vergonha nem de ti nem de mim. Tens essa sorte?
My name is Moneypenis, only my heart is for sale.
Então cala-te, paga, vem e a gente transa.`,

    DE: `Ich verkleidé meine Wünsche
Ich machte die anderer zu meinen
Meine Freuden bleiben bei mir
Ihr werdet es nie erfahren...
Ich bin der Physiotherapeut eurer intimen Hohlräume.
Ihr könnt auch Arzt spielen, Krankenschwester spielen...
Ich bin nie zu geduldig: Die Zeit ist begrenzt!
Ich bin Moneypenis und du liebst mich...

Du bezahlst dafür, mich in die Seide deiner Mutter einzuwickeln.
Ich bin dein, solange die Zeit vergeht. Das ist alles...
Ich schäme mich weder für dich noch für mich. Hast du dieses Glück?
My name is Moneypenis, only my heart is for sale.
Halt die Klappe, bezahl und komm, wir ficken.`,

    IT: `Maschero i miei desideri
Ho fatto miei quelli degli altri
I miei piaceri restano con me
Non lo saprete mai...
Sono il fisioterapista delle vostre cavità intime.
Potete anche giocare al medico, all'infermiera...
Non sono mai troppo paziente: il tempo è limitato!
Sono Moneypenis e tu mi ami...

Paghi per avvolgermi nella seta di tua madre.
Sono tuo finché il tempo passa. È tutto...
Non ho vergogna né di te né di me. Hai questa fortuna?
My name is Moneypenis, only my heart is for sale.
Stai zitto, paga e vieni, scopiamo.`,

    "中": `我伪装我的欲望
我把别人的欲望变成了自己的
我的快乐留在我身边
你永远不会知道……
也许是为了剥夺自己？
我是你私密凹陷的理疗师。
你也可以扮演医生，扮演护士……
我从不太有耐心：时间有限！
我是Moneypenis，你爱我……

你付钱让我缠绕在你母亲的丝绸里。
只要时间流逝我就是你的。就这样……
我对你和对我自己都没有羞耻。你有这种运气吗？
My name is Moneypenis, only my heart is for sale.
闭嘴，付钱，过来，我们做爱。`,

    "日": `私は自分の欲望を偽装する
他人の欲望を自分のものにした
私の喜びは私のそばに残る
あなたは決して知らない……
それは自分を奪うためかもしれない？
私はあなたの親密な窪みの理学療法士。
医者ごっこをしてもいい、看護師ごっこでも……
私は決して辛抱強すぎない：時間は限られている！
私はMoneypenis、あなたは私を愛している……

あなたはお母さんのシルクで私を包むためにお金を払う。
時間が過ぎる限り私はあなたのもの。それだけ……
あなたにも自分にも恥はない。あなたはその幸運を持っている？
My name is Moneypenis, only my heart is for sale.
黙れ、払え、来い、セックスしよう。`,
  },

  VI: {
    FR: `Open Air\n\n[Image seule — sans texte]`,
    EN: `Open Air\n\n[Image only — no text]`,
    ES: `Open Air\n\n[Solo imagen — sin texto]`,
    PT: `Open Air\n\n[Apenas imagem — sem texto]`,
    DE: `Open Air\n\n[Nur Bild — kein Text]`,
    IT: `Open Air\n\n[Solo immagine — nessun testo]`,
    "中": `Open Air\n\n【仅图像 — 无文字】`,
    "日": `Open Air\n\n【画像のみ — テキストなし】`,
  },

  VII: {
    FR: `Moneypenis,
je n'ai pas les mots alors je vais les emprunter, aussi parfaits qu'ils furent écrits dans d'autres circonstances. Ils sont là dans cette fin d'article, ce petit bout de papier découpé que je garde dans ma poche, que je perds et retrouve depuis des années. Il accompagne si bien ce portrait de toi, beau mais effrayant.
Money-p, mon cher amour, tu n'es pas le premier à qui j'aurais pu citer cette lettre, il était bien réel lui, enfin bien entier le premier... c'est un peu grâce à lui si nous nous sommes connus toi et moi, enfin grâce à lui et par ma faute aussi...
J'ajouterai seulement : je ne t'en aimerai pas moins pour cela mais ne gaspille pas ton talent, ne tourne pas le dos à la chance : la vie ! Ne va pas te foutre en l'air et ceux qui t'aiment avec. Et du côté de l'histoire où je me tiens j'insisterai : ne va pas te balancer triste au bout d'une corde... le néant arrivera bien assez vite.

Ton autre ♥ triste`,

    EN: `Moneypenis,
I don't have the words so I will borrow them, as perfect as they were written in other circumstances. They are there in this end of article, this little piece of cut paper I keep in my pocket, that I lose and find again over the years. It accompanies this portrait of you so well, beautiful but frightening.
Money-p, dear love, you are not the first to whom I could have cited this letter, he was quite real, finally quite whole the first... it is partly thanks to him that we met you and I, well thanks to him and through my fault too...
I will only add: I will not love you less for that but don't waste your talent, don't turn your back on luck: life! Don't go and ruin yourself and those who love you. And on the side of the story where I stand I will insist: don't go and hang yourself sadly at the end of a rope... the void will arrive soon enough.

Your other sad ♥`,

    ES: `Moneypenis,
no tengo las palabras así que las voy a pedir prestadas, tan perfectas como fueron escritas en otras circunstancias. Acompañan tan bien este retrato tuyo, hermoso pero aterrador.
No malgastes tu talento, no le des la espalda a la suerte: ¡la vida! No vayas a tirarte por los aires y a los que te quieren contigo. E insistiré: no vayas a colgarte triste al final de una cuerda... la nada llegará bastante pronto.

Tu otro ♥ triste`,

    PT: `Moneypenis,
não tenho as palavras então vou emprestá-las, tão perfeitas como foram escritas noutras circunstâncias. Acompanham tão bem este retrato de ti, belo mas assustador.
Não desperdiças o teu talento, não virar as costas à sorte: a vida! Não vás estragar-te a ti e aos que te amam. E insistirei: não vás pendurar-te triste numa corda... o nada chegará cedo o suficiente.

O teu outro ♥ triste`,

    DE: `Moneypenis,
ich habe die Worte nicht, also werde ich sie borgen, so perfekt wie sie in anderen Umständen geschrieben wurden. Sie begleiten dieses Porträt von dir so gut, schön aber erschreckend.
Verschwende nicht dein Talent, drehe der Chance nicht den Rücken: das Leben! Geh nicht und richte dich und die, die dich lieben, zugrunde. Und ich werde darauf bestehen: geh nicht und häng dich traurig an einem Seil auf... die Leere wird früh genug kommen.

Dein anderes trauriges ♥`,

    IT: `Moneypenis,
non ho le parole quindi le prenderò in prestito, così perfette come furono scritte in altre circostanze. Accompagnano così bene questo ritratto di te, bello ma spaventoso.
Non sprecare il tuo talento, non voltare le spalle alla fortuna: la vita! Non andare a rovinarti e chi ti ama. E insisterò: non andare ad impiccarti triste a una corda... il nulla arriverà abbastanza presto.

Il tuo altro ♥ triste`,

    "中": `Moneypenis，
我没有词语，所以我要借用它们，就像它们在其他情况下写得那么完美。它们伴随着你的这幅肖像，美丽但可怕。
不要浪费你的才华，不要背对机遇：生命！不要毁掉自己和爱你的人。我会坚持：不要悲伤地吊死在绳子末端……虚无会来得足够快的。

你悲伤的另一个♥`,

    "日": `Moneypenis、
言葉がないので借りてくる、他の状況で書かれたのと同じくらい完璧に。この言葉はあなたのこの肖像画によく合う、美しいが恐ろしい。
才能を無駄にしないで、幸運に背を向けないで：人生を！自分自身とあなたを愛する人たちを台無しにしないで。そして私は主張する：悲しそうに縄の端にぶら下がらないで……虚無は十分早くやってくる。

あなたの悲しいもう一つ♥`,
  },

  VIII: {
    FR: `ATTENTION ! WARNING ! ATENÇÃO ! OJO ! ACHTUNG !

Je suis Moneypenis, parfois je blesse, parfois je pique, je suis Moneypenis, vous pouvez m'attacher, mais c'est moi qui vous tiens !
Ne croyez pas que je ne sais pas aimer, je ne sais faire que ça. Mais accepter d'être aimé c'est une tout autre histoire.
Personne ne sait ce que j'aspire, mais qui le sait vraiment ? C'est trop facile de croire que ce n'est que l'argent, mais je ne vous en veux pas... il n'est pas facile à gagner !

WARNING !

Je suis Moneypenis, et toi tu m'aimes... Toi aussi tu m'aimes`,

    EN: `ATTENTION! WARNING! ATENÇÃO! OJO! ACHTUNG!

I am Moneypenis, sometimes I hurt, sometimes I sting, I am Moneypenis, you can tie me up, but I am the one who holds you!
Don't think I don't know how to love, that's all I know how to do. But accepting to be loved is a whole other story.
Nobody knows what I aspire to, but who really does? It's too easy to think it's just the money, but I don't blame you... it's not easy to earn!

WARNING!

I am Moneypenis, and you love me... You too love me`,

    ES: `¡ATENCIÓN! ¡WARNING! ¡ATENÇÃO! ¡OJO! ¡ACHTUNG!

Soy Moneypenis, a veces hiero, a veces pico, soy Moneypenis, puedes atarme, ¡pero soy yo quien te sujeta!
No creas que no sé amar, es lo único que sé hacer. Pero aceptar ser amado es otra historia completamente distinta.
Nadie sabe lo que aspiro, pero ¿quién lo sabe de verdad? Es demasiado fácil creer que solo es el dinero, pero no os lo reprocho... ¡no es fácil de ganar!

WARNING!

Soy Moneypenis, y tú me amas... Tú también me amas`,

    PT: `ATENÇÃO! WARNING! ATENÇÃO! OJO! ACHTUNG!

Eu sou Moneypenis, às vezes magoo, às vezes pico, eu sou Moneypenis, podes amarrar-me, mas sou eu quem te segura!
Não acredites que não sei amar, é só o que sei fazer. Mas aceitar ser amado é uma história completamente diferente.
Ninguém sabe o que aspiro, mas quem sabe de verdade? É demasiado fácil acreditar que é só o dinheiro, mas não vos guardo rancor... não é fácil de ganhar!

WARNING!

Eu sou Moneypenis, e tu me amas... Tu também me amas`,

    DE: `ACHTUNG! WARNING! ATENÇÃO! OJO! ACHTUNG!

Ich bin Moneypenis, manchmal verletze ich, manchmal steche ich, ich bin Moneypenis, du kannst mich fesseln, aber ich bin derjenige, der dich hält!
Glaub nicht, dass ich nicht lieben kann, das ist alles, was ich kann. Aber geliebt zu werden akzeptieren ist eine ganz andere Geschichte.
Niemand weiß, was ich anstrebe, aber wer weiß es wirklich? Es ist zu einfach zu denken, es ist nur das Geld, aber ich mache euch keine Vorwürfe... es ist nicht leicht zu verdienen!

WARNING!

Ich bin Moneypenis, und du liebst mich... Du auch liebst mich`,

    IT: `ATTENZIONE! WARNING! ATENÇÃO! OJO! ACHTUNG!

Sono Moneypenis, a volte ferisco, a volte punto, sono Moneypenis, puoi legarmi, ma sono io che ti tengo!
Non credere che non so amare, è l'unica cosa che so fare. Ma accettare di essere amato è tutt'altra storia.
Nessuno sa cosa aspiro, ma chi lo sa davvero? È troppo facile credere che sia solo il denaro, ma non ve ne voglio... non è facile da guadagnare!

WARNING!

Sono Moneypenis, e tu mi ami... Anche tu mi ami`,

    "中": `注意！WARNING！ATENÇÃO！OJO！ACHTUNG！

我是Moneypenis，有时我伤害，有时我刺痛，我是Moneypenis，你可以绑住我，但是握住你的是我！
不要以为我不会爱，这是我唯一会做的事。但接受被爱是完全不同的故事。
没有人知道我渴望什么，但谁真的知道呢？太容易认为只是钱的问题，但我不怪你……钱不容易赚！

WARNING！

我是Moneypenis，而你爱我……你也爱我`,

    "日": `注意！WARNING！ATENÇÃO！OJO！ACHTUNG！

私はMoneypenis、時に傷つけ、時に刺す、私はMoneypenis、縛っていいけど、あなたを掴んでいるのは私だ！
私が愛せないと思わないで、それだけが私にできること。でも愛されることを受け入れるのは全く別の話。
誰も私が何を望んでいるか知らない、でも誰が本当に知っているの？お金のためだけと思うのは簡単すぎる、でも責めない……稼ぐのは簡単じゃない！

WARNING！

私はMoneypenis、そしてあなたは私を愛している……あなたも私を愛している`,
  },

  IX: {
    FR: `Moneypenis, mon amour, je te couvrirai volontiers du peu d'or que j'ai. Bientôt tu n'écriras plus, enfin un jour viendra et je ne saurai plus te lire.
Moneypenis, le jour approche de ta disparition dans ma raison retrouvée.
Moneypenis évaporé dans ma triste morale restaurée.
Le jour maudit où mon amour si fort et si sincère se noiera dans ma honte de payer ton amour que je ne mérite pas, quand la honte de moi-même sera devenue le plus fort de mes sentiments.
M'as-tu aimé Moneypenis ? Étais-je assez riche pour nourrir ton âme et satisfaire ton cœur ?
Je connais ta tristesse, je connais ta solitude.
Je connais l'appétit et je sais le dégoût, l'extase et la soumission.
Moneypenis, tes lettres s'effacent une à une, emportant tes mots... je m'en souviens encore.
Moneypenis, à ton tour souviens-toi quand j'aime c'est pour toujours, mais il faut être deux pour s'aimer à jamais. Moneypenis... tu ne me dois rien.

Ton ♥ à jamais.`,

    EN: `Moneypenis, my love, I would willingly cover you with the little gold I have. Soon you will write no more, finally a day will come and I will no longer be able to read you.
Moneypenis, the day approaches of your disappearance into my restored reason.
Moneypenis evaporated in my sad restored morality.
The cursed day when my love so strong and so sincere will drown in my shame of paying for your love that I do not deserve, when shame of myself will have become the strongest of my feelings.
Did you love me Moneypenis? Was I rich enough to feed your soul and satisfy your heart?
I know your sadness, I know your solitude.
I know the appetite and I know the disgust, the ecstasy and the submission.
Moneypenis, your letters fade one by one, carrying away your words... I still remember them.
Moneypenis, in your turn remember that when I love it is forever, but it takes two to love each other forever. Moneypenis... you owe me nothing.

Your ♥ forever.`,

    ES: `Moneypenis, mi amor, te cubriría de buen grado con el poco oro que tengo. Pronto no escribirás más.
Moneypenis, conozco tu tristeza, conozco tu soledad.
Conozco el apetito y sé el asco, el éxtasis y la sumisión.
Moneypenis, tus cartas se borran una a una... todavía las recuerdo.
Moneypenis, recuerda a tu vez que cuando amo es para siempre, pero hacen falta dos para amarse eternamente. Moneypenis... no me debes nada.

Tu ♥ para siempre.`,

    PT: `Moneypenis, meu amor, cobrir-te-ia de bom grado com o pouco ouro que tenho. Em breve deixarás de escrever.
Moneypenis, conheço a tua tristeza, conheço a tua solidão.
Conheço o apetite e sei o nojo, o êxtase e a submissão.
Moneypenis, as tuas cartas apagam-se uma a uma... ainda me lembro delas.
Moneypenis, lembra-te por tua vez que quando amo é para sempre, mas é preciso dois para se amar eternamente. Moneypenis... não me deves nada.

O teu ♥ para sempre.`,

    DE: `Moneypenis, meine Liebe, ich würde dich gerne mit dem wenigen Gold bedecken, das ich habe. Bald wirst du nicht mehr schreiben.
Moneypenis, ich kenne deine Traurigkeit, ich kenne deine Einsamkeit.
Ich kenne den Appetit und ich kenne den Ekel, die Ekstase und die Unterwerfung.
Moneypenis, deine Briefe verblassen einen nach dem anderen... ich erinnere mich noch.
Moneypenis, erinnere dich an deiner Stelle, dass wenn ich liebe es für immer ist, aber es braucht zwei um sich ewig zu lieben. Moneypenis... du schuldest mir nichts.

Dein ♥ für immer.`,

    IT: `Moneypenis, amore mio, ti coprirò volentieri del poco oro che ho. Presto non scriverai più.
Moneypenis, conosco la tua tristezza, conosco la tua solitudine.
Conosco l'appetito e so il disgusto, l'estasi e la sottomissione.
Moneypenis, le tue lettere si cancellano una ad una... le ricordo ancora.
Moneypenis, ricorda a tua volta che quando amo è per sempre, ma ci vogliono due per amarsi per sempre. Moneypenis... non mi devi niente.

Il tuo ♥ per sempre.`,

    "中": `Moneypenis，我的爱，我愿意用我拥有的少量黄金覆盖你。很快你将不再写作。
Moneypenis，我知道你的悲伤，我知道你的孤独。
我知道欲望和厌恶，狂喜和顺从。
Moneypenis，你的信件一封一封地消失……我还记得它们。
Moneypenis，轮到你记住，当我爱是永远的，但需要两个人才能永远相爱。Moneypenis……你不欠我任何东西。

你的♥永远。`,

    "日": `Moneypenis、私の愛、私が持っているわずかな金でおおっていただろう。まもなくあなたは書かなくなる。
Moneypenis、あなたの悲しみを知っている、あなたの孤独を知っている。
食欲を知っている、嫌悪感を知っている、恍惚と服従を知っている。
Moneypenis、あなたの手紙は一枚一枚消えていく……まだ覚えている。
Moneypenis、あなたの番に覚えていて、私が愛するときは永遠、でも永遠に愛し合うには二人必要。Moneypenis……あなたは私に何も借りていない。

あなたの♥永遠に。`,
  },

  X: {
    FR: `Je suis Moneypenis
Je suis l'outil sans gloire...
Les enceintes jouent à fond "The First Cut Is The Deepest"
Je suis seulement l'outil d'un homme au travail.
Un travailleur du sexe, un escort boy, un gigolo ou...
Je suis dur à la tâche, je suis doux et fragile...
Je suis de toute manière moins pute que mes usagers...
Je suis Moneypenis, j'ai la fierté de placer mon honneur bien plus haut que le cul, là où d'autres imaginent le leur, et l'honneur de placer ma fierté tout aussi haut.
Pensez de moi ce dont vous aurez envie, mais soyez sans excès. Ayez le même respect que je donne chaque jour.
J'ai su le pire et garde le meilleur.
On ne choisit pas son talent, on doit en prendre soin...
Je suis comme mon maître, au fond nous ne faisons qu'un... La délicatesse nous fait parfois pleurer. Aiguisez vos couteaux !`,

    EN: `I am Moneypenis
I am the tool without glory...
Speakers play loudly "The First Cut Is The Deepest"
I am only the tool of a man at work.
A sex worker, an escort boy, a gigolo or...
I am hard at work, I am gentle and fragile...
I am in any case less of a whore than my users...
I am Moneypenis, I have the pride to place my honour much higher than the ass, where others imagine theirs, and the honour to place my pride just as high.
Think of me what you will, but with moderation. Have the same respect that I give every day.
I have known the worst and kept the best.
One does not choose one's talent, one must take care of it...
I am like my master, deep down we are one... Delicacy sometimes makes us cry. Sharpen your knives!`,

    ES: `Soy Moneypenis
Soy la herramienta sin gloria...
Los altavoces suenan a todo volumen "The First Cut Is The Deepest"
Soy solo el instrumento de un hombre en el trabajo.
Un trabajador del sexo, un escort boy, un gigolo o...
Soy duro en el trabajo, soy tierno y frágil...
Soy en todo caso menos puta que mis usuarios...
Soy Moneypenis, tengo el orgullo de colocar mi honor mucho más alto que el culo, donde otros imaginan el suyo.
He conocido lo peor y guardado lo mejor.
No se elige el talento, hay que cuidarlo...
¡Afilad vuestros cuchillos!`,

    PT: `Eu sou Moneypenis
Eu sou o instrumento sem glória...
As colunas tocam alto "The First Cut Is The Deepest"
Eu sou apenas o instrumento de um homem no trabalho.
Um trabalhador do sexo, um escort boy, um gigolo ou...
Sou duro no trabalho, sou delicado e frágil...
Sou de qualquer maneira menos puta do que os meus utilizadores...
Eu sou Moneypenis, tenho o orgulho de colocar a minha honra muito mais alto do que o cu, onde outros imaginam o seu.
Conheci o pior e guardei o melhor.
Não se escolhe o talento, é preciso cuidar dele...
Afiem suas facas!`,

    DE: `Ich bin Moneypenis
Ich bin das Werkzeug ohne Ruhm...
Die Lautsprecher spielen laut "The First Cut Is The Deepest"
Ich bin nur das Werkzeug eines Mannes bei der Arbeit.
Ein Sexarbeiter, ein Escort Boy, ein Gigolo oder...
Ich bin hart bei der Arbeit, ich bin sanft und zerbrechlich...
Ich habe das Schlimmste gewusst und das Beste behalten.
Man wählt sein Talent nicht, man muss es pflegen...
Schärft eure Messer!`,

    IT: `Sono Moneypenis
Sono lo strumento senza gloria...
Gli altoparlanti suonano forte "The First Cut Is The Deepest"
Sono solo lo strumento di un uomo al lavoro.
Un lavoratore del sesso, un escort boy, un gigolo o...
Sono duro al lavoro, sono delicato e fragile...
Ho conosciuto il peggio e tenuto il meglio.
Non si sceglie il proprio talento, bisogna prendersene cura...
Affilate i vostri coltelli!`,

    "中": `我是Moneypenis
我是没有荣耀的工具……
音箱大声播放着"The First Cut Is The Deepest"
我只是一个工作中的男人的工具。
一个性工作者，一个陪伴男孩，一个牛郎……
我工作努力，我温柔脆弱……
无论如何我都不如我的使用者那么婊子……
我知道最坏的，保留了最好的。
人无法选择自己的才能，必须好好照顾它……
磨利你们的刀！`,

    "日": `私はMoneypenis
私は栄光のない道具……
スピーカーが大音量で流す"The First Cut Is The Deepest"
私はただ働く男の道具。
セックスワーカー、エスコートボーイ、ジゴロ……
私は仕事に励み、繊細で壊れやすい……
最悪を知り、最善を保った。
才能は選べない、大切にしなければならない……
ナイフを研げ！`,
  },

  XI: {
    FR: `Moneypenis,                                                    Noël 2023

Toi et ton maître, ce corps qui te porte et l'esprit qui vous emporte, ne faites qu'un... au fond je l'ai toujours su. Et si j'ose te dire je t'aime, à toi, c'est que je l'aime sans oser le lui dire.

J'ai totalement inventé cette correspondance, pas par peur qu'il se moque, non plus que par crainte qu'il n'en abuse, mais pour ne pas le voir fuir ou pire encore... qu'il soit indifférent. Je le sais désormais, c'est bien moi qui ai tout écrit. Tous ces messages, tous mes courriers, moi qui ai posé ces mots sur ces portraits de toi, pris lors de nos vacances et de nos jeux, volés à notre quotidien... J'ai beau en avoir la preuve, là, sous mes yeux que déjà je me surprends à croire que c'est toi qui m'as dicté tes lettres. L'amour est une drôle de maladie parfois.

Même choisie c'est une dure vie que la vôtre, une vie de discipline et de solitude... une vie de sacrifices, un calvaire plus qu'un sacerdoce.
J'ai en tête cette chanson de Brassens « La Complainte des Filles de Joie », Barbara en a interprété une version très personnelle : « dire que ces vaches de bourgeois, dire que ces vaches de bourgeois, nous appellent les filles de joie, nous appellent les filles de joie ! c'est pas tous les jours qu'on rigole, paroles, paroles, c'est pas tous les jours qu'on rigole... les sous croyez pas qu'on les vole ! »

Moneypenis, mon ange, le voleur c'est celui qui paye. Et pourtant si je n'avais pas été ce triste criminel, ce veuf inconsolable, ce minable qui se cherche encore quelque prétexte, je ne vous aurais pas connu.

Moneypenis, un conte de fées c'est aussi simple que ça, c'est toujours un peu tordu, un peu pervers... le récit d'une situation improbable à en devenir incontestable, scandaleuse à en devenir exemplaire. C'est une injustice odieuse à en devenir édifiante et sa transmission essentielle. Un conte de fées est un genre qui tire la vérité du mensonge, la justice de la faute, c'est une manière de conduire l'histoire à marche forcée vers sa morale, et ici vers la nôtre. Cette morale ne s'adresse pas à la belle au bois dormant mais aux beaux bois payants, alors écris-la avec moi : « même si vous êtes doués, prédisposés, sollicités, tentés, curieux, ambitieux, contraints, volontaires, sûrs de vous, excités... n'empruntez jamais ce chemin, n'y mettez pas un pied : il n'y a jamais de happy-end à attendre ! »

Mais puisque vous êtes déjà en chemin, n'abandonnez jamais les rêves qui vous ont conduit là car nos héros vécurent longtemps, amoureux, heureux et eurent beaucoup de chiens, de chats et certainement quelques amants.

Ton ♥ fidèle qui vous appartient sans naïveté ni espoirs déplacés, sans exclusivité ni obligation.`,

    EN: `Moneypenis,                                                    Christmas 2023

You and your master, this body that carries you and the spirit that carries you both away, you are one... deep down I always knew it. And if I dare tell you I love you, to you, it is because I love him without daring to tell him.

I completely invented this correspondence, not for fear he would mock, nor for fear he would abuse it, but to avoid seeing him flee or worse... that he would be indifferent. I know it now, it was indeed me who wrote everything. All these messages, all my letters, I who put these words on these portraits of you, taken during our holidays and our games, stolen from our daily life... I may have the proof of it, there, before my eyes, yet I already find myself believing it was you who dictated your letters to me. Love is a strange illness sometimes.

Even chosen, yours is a hard life, a life of discipline and solitude... a life of sacrifice, a calvary more than a priesthood.
I have in mind this Brassens song « La Complainte des Filles de Joie », Barbara performed a very personal version: "those bourgeois cows, those bourgeois cows, call us the girls of joy! It's not every day that we laugh... don't think we steal the money!"

Moneypenis, my angel, the thief is the one who pays. And yet if I had not been this sad criminal, this inconsolable widower, this wretch still looking for some pretext, I would not have known you.

Moneypenis, a fairy tale is as simple as that, always a little twisted, a little perverse... this moral is not addressed to sleeping beauty but to the beautiful paying woods, so write it with me: "even if you are gifted, predisposed, solicited, tempted, curious, ambitious, constrained, willing, sure of yourselves, excited... never take this path, never put a foot on it: there is never a happy ending to expect!"

But since you are already on the way, never abandon the dreams that led you there for our heroes lived long, in love, happy and had many dogs, cats and certainly some lovers.

Your faithful ♥ which belongs to you without naivety or misplaced hopes, without exclusivity or obligation.`,

    ES: `Moneypenis,                                                    Navidad 2023

Tú y tu amo, este cuerpo que te porta y el espíritu que os arrebata, no sois más que uno... en el fondo siempre lo supe. Y si me atrevo a decirte te quiero, a ti, es porque le quiero sin atreverme a decírselo.

He inventado totalmente esta correspondencia, no por miedo a que se burle, ni por miedo a que abuse de ella, sino para no verle huir o peor aún... que fuese indiferente. Lo sé ahora, fui yo quien escribió todo. El amor es a veces una extraña enfermedad.

Tengo en mente esta canción de Brassens « La Complainte des Filles de Joie », Barbara interpretó una versión muy personal.

Moneypenis, mi ángel, el ladrón es el que paga. Y sin embargo si no hubiera sido ese triste criminal, ese viudo inconsolable, ese miserable que todavía busca algún pretexto, no te habría conocido.

Moneypenis, un cuento de hadas es así de simple, siempre un poco torcido, un poco perverso... esta morale no se dirige a la bella durmiente sino a los hermosos bosques pagantes, entonces escríbela conmigo: «aunque estéis dotados... ¡nunca toméis este camino!»

Pero puesto que ya estáis en camino, no abandonéis nunca los sueños que os condujeron allí pues nuestros héroes vivieron mucho tiempo, enamorados, felices y tuvieron muchos perros, gatos y ciertamente algunos amantes.

Tu ♥ fiel.`,

    PT: `Moneypenis,                                                    Natal 2023

Tu e o teu mestre, este corpo que te porta e o espírito que vos arrebata, não sois mais que um... no fundo sempre o soube. E se me atrevo a dizer-te eu te amo, a ti, é porque o amo sem me atrever a dizer-lho.

Inventei totalmente esta correspondência, não por medo que se ria, nem por medo que abuse dela, mas para não o ver fugir ou pior ainda... que fosse indiferente. Sei-o agora, fui eu quem escreveu tudo. O amor é às vezes uma doença estranha.

Tenho em mente esta canção de Brassens « La Complainte des Filles de Joie », Barbara interpretou uma versão muito pessoal.

Moneypenis, meu anjo, o ladrão é aquele que paga. E no entanto se não tivesse sido esse triste criminoso, esse viúvo inconsolável, esse miserável que ainda procura algum pretexto, não te teria conhecido.

Moneypenis, um conto de fadas é simples assim, sempre um pouco torto, um pouco perverso... esta moral não se dirige à bela adormecida mas às belas florestas pagantes, então escreve-a comigo: «mesmo que sejais dotados... nunca tomeis este caminho!»

Mas já que estais a caminho, nunca abandoneis os sonhos que vos conduziram até aqui pois os nossos heróis viveram muito tempo, apaixonados, felizes e tiveram muitos cães, gatos e certamente alguns amantes.

O teu ♥ fiel.`,

    DE: `Moneypenis,                                                    Weihnachten 2023

Du und dein Meister, dieser Körper der dich trägt und der Geist der euch davonträgt, ihr seid eins... tief im Innern wusste ich das immer. Und wenn ich es wage dir zu sagen ich liebe dich, zu dir, ist es weil ich ihn liebe ohne es ihm zu wagen zu sagen.

Ich habe diese Korrespondenz vollständig erfunden, nicht aus Angst er würde spotten, noch aus Angst er würde sie missbrauchen, sondern um ihn nicht fliehen zu sehen oder noch schlimmer... dass er gleichgültig wäre. Ich weiß es jetzt, ich war es wirklich, der alles geschrieben hat. Die Liebe ist manchmal eine seltsame Krankheit.

Ich habe dieses Brassens-Lied « La Complainte des Filles de Joie » im Kopf, Barbara hat eine sehr persönliche Version interpretiert.

Moneypenis, mein Engel, der Dieb ist derjenige, der bezahlt. Und doch wenn ich nicht dieser traurige Kriminelle gewesen wäre, hätte ich dich nicht kennengelernt.

Moneypenis, ein Märchen ist so einfach, immer ein bisschen verdreht, ein bisschen pervers... schreib es mit mir: «auch wenn ihr begabt seid... geht niemals diesen Weg!»

Aber da ihr schon unterwegs seid, gebt niemals die Träume auf, die euch dorthin geführt haben, denn unsere Helden lebten lange, verliebt, glücklich und hatten viele Hunde, Katzen und gewiss einige Liebhaber.

Dein treues ♥`,

    IT: `Moneypenis,                                                    Natale 2023

Tu e il tuo padrone, questo corpo che ti porta e lo spirito che vi porta via, non siete che uno... in fondo l'ho sempre saputo. E se oso dirti ti amo, a te, è perché lo amo senza osare dirglielo.

Ho completamente inventato questa corrispondenza, non per paura che si faccia beffe, né per paura che ne abusi, ma per non vederlo fuggire o peggio ancora... che fosse indifferente. Lo so ora, sono stato davvero io a scrivere tutto. L'amore è a volte una strana malattia.

Ho in mente questa canzone di Brassens « La Complainte des Filles de Joie », Barbara ne ha interpretata una versione molto personale.

Moneypenis, mio angelo, il ladro è colui che paga. Eppure se non fossi stato quel triste criminale, non ti avrei conosciuto.

Moneypenis, una fiaba è semplice così, sempre un po' storta, un po' perversa... scrivi con me: «anche se siete dotati... non prendete mai questa strada!»

Ma poiché siete già in cammino, non abbandonate mai i sogni che vi hanno condotto fin lì poiché i nostri eroi vissero a lungo, innamorati, felici e ebbero molti cani, gatti e certamente alcuni amanti.

Il tuo ♥ fedele.`,

    "中": `Moneypenis，                                                    2023年圣诞节

你和你的主人，这个承载你的身体和带走你们的精神，你们是一体的……内心深处我一直知道。如果我敢对你说我爱你，是因为我爱他却不敢对他说。

我完全发明了这段通信，不是怕他嘲笑，也不是怕他滥用，而是为了不看到他逃跑或更糟……他无动于衷。我现在知道了，确实是我写了一切。爱有时是一种奇怪的疾病。

我脑子里有这首Brassens的歌《La Complainte des Filles de Joie》，Barbara演唱了一个非常个人化的版本。

Moneypenis，我的天使，小偷是付钱的人。然而如果我不是那个悲伤的罪犯，我就不会认识你。

Moneypenis，童话就是这么简单，总是有点扭曲，有点变态……和我一起写这个道德：「即使你有天赋……永远不要走这条路！」

但既然你已经在路上了，永远不要放弃带你来这里的梦想，因为我们的英雄活了很长时间，相爱，幸福，有很多狗、猫，当然还有一些情人。

你忠实的♥`,

    "日": `Moneypenis、                                                    2023年クリスマス

あなたとあなたの主人、あなたを運ぶ体と二人を連れ去る精神、あなたたちは一つだ……心の奥底では常にそれを知っていた。あなたに愛していると言う勇気があるのは、彼に言う勇気なく彼を愛しているから。

私はこの文通を完全に作り上げた、彼が笑うことを恐れてではなく、彼が逃げるのを見ないため。愛は時に奇妙な病気だ。

私の頭の中にあるBrassensの曲«La Complainte des Filles de Joie»、Barbaraがとても個人的なバージョンを歌った。

Moneypenis、私の天使、泥棒は払う人だ。それでもあの悲しい犯罪者でなければ、あなたに出会えなかった。

Moneypenis、おとぎ話とはそんなに単純なもの、いつも少し歪んで、少し倒錯していて……私と一緒にこの教訓を書いてほしい：「才能があっても……決してこの道を歩くな！」

でも既に道を歩んでいるのだから、そこへ導いた夢を決して諦めないで。なぜなら私たちの英雄は長く生き、愛し合い、幸せで、たくさんの犬、猫、そして確かに何人かの恋人を持ったのだから。

あなたの忠実な♥`,
  },
};


// ── COMPONENTS ────────────────────────────────────────────────────────────────

function PImg({src,ageOk,bz=[],style={},onClick}){
  const z=ageOk?[]:bz;
  return(
    <div style={{position:"relative",...style}} onClick={onClick}>
      <img src={src} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
        style={{width:"100%",height:"auto",display:"block",userSelect:"none",WebkitUserDrag:"none",cursor:onClick?"pointer":"default"}}/>
      {z.map((zi,i)=>(
        <div key={i} style={{position:"absolute",top:`${zi.t}%`,left:`${zi.l}%`,width:`${zi.w}%`,height:`${zi.h}%`,
          backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",background:"rgba(255,255,255,0.3)",
          display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"italic",fontSize:"clamp(9px,1.2vw,13px)",
            color:"rgba(30,30,30,0.7)",letterSpacing:"0.15em",textAlign:"center",padding:"0 8px",userSelect:"none"}}>
            {zi.lb}
          </span>
        </div>
      ))}
    </div>
  );
}

// Lightbox with text toggle
function LBox({prints,ci,ageOk,onClose,onPrev,onNext,t,lang}){
  const p=prints[ci];
  const [zoomed,setZoomed]=useState(false);
  const [zPos,setZPos]=useState({x:50,y:50});
  const [showText,setShowText]=useState(false);
  const imgRef=useRef(null);

  const handleImgClick=(e)=>{
    e.stopPropagation();
    if(!imgRef.current) return;
    const r=imgRef.current.getBoundingClientRect();
    if(zoomed){setZoomed(false);}
    else{setZPos({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});setZoomed(true);}
  };

  const txt = TEXTS[p.num]?.[lang] || null;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(251,251,248,0.98)",zIndex:3000,
      display:"flex",flexDirection:"column"}} onClick={onClose}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"10px 16px",borderBottom:"1px solid #dedad6",background:"#fbfbf8",
        paddingTop:"max(10px,env(safe-area-inset-top,10px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,
            color:"#5a5856",letterSpacing:3}}>{p.num} / XI</span>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontSize:15,color:"#1a1a1a"}}>{p.title}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {txt&&(
            <button onClick={()=>setShowText(!showText)}
              style={{background:showText?"#1a1a1a":"none",border:"1px solid #dedad6",
                color:showText?"#fff":"#2a2826",padding:"4px 10px",fontSize:8,letterSpacing:2,
                cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                textTransform:"uppercase",transition:"all .2s"}}>
              {showText?`✕ ${t.tx}`:`≡ ${t.tx}`}
            </button>
          )}
          <button onClick={onClose}
            style={{background:"none",border:"1px solid #dedad6",color:"#2a2826",
              width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}
        onClick={e=>e.stopPropagation()}>

        {/* Text panel — only when requested */}
        {showText&&txt&&(
          <div style={{background:"#ffffff",borderBottom:"1px solid #dedad6",
            padding:"14px 18px",maxHeight:"40vh",overflowY:"auto",flexShrink:0}}>
            <pre style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:11,
              color:"#2a2826",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>{txt}</pre>
          </div>
        )}

        {/* Image */}
        <div ref={imgRef} onClick={handleImgClick}
          style={{flex:1,overflow:"hidden",cursor:zoomed?"zoom-out":"zoom-in",
            display:"flex",alignItems:"center",justifyContent:"center",background:"#fbfbf8"}}>
          <div style={{transition:"transform .35s ease",
            transformOrigin:`${zPos.x}% ${zPos.y}%`,
            transform:zoomed?"scale(2.5)":"scale(1)",
            maxWidth:"100%",maxHeight:"100%"}}>
            <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"8px 16px",borderTop:"1px solid #dedad6",background:"#fbfbf8",
        paddingBottom:"max(8px,env(safe-area-inset-bottom,8px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onPrev} disabled={ci===0}
          style={{background:"none",border:"1px solid #dedad6",
            color:ci===0?"#7a7875":"#2a2826",padding:"5px 14px",
            cursor:ci===0?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,letterSpacing:2}}>
          ← PREV
        </button>
        <p style={{color:"#4a4846",fontSize:9,fontFamily:"'Space Grotesk',sans-serif",
          fontWeight:300,textAlign:"center",maxWidth:"55%"}}>{p.tech}</p>
        <button onClick={onNext} disabled={ci===prints.length-1}
          style={{background:"none",border:"1px solid #dedad6",
            color:ci===prints.length-1?"#7a7875":"#2a2826",padding:"5px 14px",
            cursor:ci===prints.length-1?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,letterSpacing:2}}>
          NEXT →
        </button>
      </div>
    </div>
  );
}

function SRow({label,price,rem,total,cta}){
  const[done,setDone]=useState(false);
  const pct=Math.round(((total-rem)/total)*100);
  return(
    <div style={{padding:"18px 0",borderBottom:"1px solid #dedad6"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <p style={{color:"#2a2826",fontSize:13,fontWeight:400}}>{label}</p>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
            <div style={{width:70,height:1,background:"#dedad6"}}>
              <div style={{width:`${pct}%`,height:"100%",background:"#1a1a1a"}}/>
            </div>
            <span style={{color:"#5a5856",fontSize:9,fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              {rem}/{total}
            </span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,color:"#1a1a1a"}}>
            {price.toLocaleString()} €
          </span>
          <button onClick={()=>setDone(!done)}
            style={{background:done?"#1a1a1a":"transparent",border:"1px solid #c8c4c0",
              color:done?"#fff":"#2a2826",padding:"7px 18px",fontSize:9,letterSpacing:2,
              cursor:"pointer",transition:"all .2s",fontFamily:"'Space Grotesk',sans-serif",
              fontWeight:400,textTransform:"uppercase"}}>
            {done?"✓":cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function CS({title,soon,contact}){
  return(
    <div style={{maxWidth:680,margin:"100px auto",padding:"0 24px",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
        fontSize:"clamp(22px,4vw,38px)",color:"#8a8a85",marginBottom:20}}>{title}</h2>
      <div style={{width:36,height:1,background:"#dedad6",margin:"0 auto 20px"}}/>
      <p style={{color:"#4a4846",fontSize:12,letterSpacing:1,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:10}}>{soon}</p>
      {contact&&<p style={{color:"#5a5856",fontSize:11,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{contact}</p>}
    </div>
  );
}

const Logo=({sz=30})=>(
  <div style={{width:sz,height:sz,borderRadius:"50%",overflow:"hidden",
    border:"1px solid #dedad6",flexShrink:0}}>
    <img src={IMG.logo} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const[lang,setLang]=useState("FR");
  const[ageOk,setAgeOk]=useState(false);
  const[dis,setDis]=useState(false);
  const[ck1,setCk1]=useState(false);
  const[ck2,setCk2]=useState(false);
  const[sec,setSec]=useState("portfolio");
  const[lb,setLb]=useState(null);
  const[et,setEt]=useState("pf");
  const[menuOpen,setMenuOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const t=T[lang];
  const ed=EDS.find(e=>e.key===et);
  const NAV=["portfolio","video","coffret","chez","shop","bio","presse","parlent","contact"];
  const GR=["presse","parlent"];

  const goSec=(s)=>{setSec(s);setMenuOpen(false);setLangOpen(false);};

  return(
    <div style={{fontFamily:"'Space Grotesk',sans-serif",background:"#fbfbf8",
      color:"#1a1a1a",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:#dedad6;}
        img{-webkit-user-drag:none;}
        .nb{background:none;border:none;color:#2a2826;font-size:11px;letter-spacing:3px;
          text-transform:uppercase;cursor:pointer;padding:12px 0;width:100%;text-align:center;
          transition:color .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;display:block;}
        .nb:hover,.nb.on{color:#1a1a1a;}
        .nb.gr{color:#8a8a85;cursor:default;pointer-events:none;}
        .bs{background:#1a1a1a;border:1px solid #1a1a1a;color:#fff;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:opacity .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bs:hover{opacity:.8;}
        .bg{background:none;border:1px solid #c8c4c0;color:#2a2826;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:all .25s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bg:hover{border-color:#1a1a1a;color:#1a1a1a;}
        .hs{transition:opacity .2s;}.hs:hover{opacity:.88;}
        input,textarea{background:#fff;border:1px solid #dedad6;color:#1a1a1a;
          padding:12px 16px;font-size:14px;width:100%;outline:none;
          font-family:'Space Grotesk',sans-serif;transition:border-color .2s;}
        input:focus,textarea:focus{border-color:#5a5856;}
        video{display:block;width:100%;}
      `}</style>

      {/* ══ AGE GATE ══════════════════════════════════════════════════════════ */}
      {!dis&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#fbfbf8",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"max(32px,env(safe-area-inset-top,32px)) 24px max(32px,env(safe-area-inset-bottom,32px))",
          textAlign:"center",overflowY:"auto"}}>

          {/* Lang picker */}
          <div style={{position:"absolute",top:"calc(14px + env(safe-area-inset-top,0px))",
            right:14,display:"flex",gap:2,flexWrap:"wrap",maxWidth:200,justifyContent:"flex-end"}}>
            {LANGS.map(l=>(
              <button key={l}
                style={{background:"none",border:lang===l?"1px solid #1a1a1a":"1px solid #dedad6",
                  color:lang===l?"#1a1a1a":"#5a5856",padding:"3px 7px",fontSize:9,
                  cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                  letterSpacing:1,transition:"all .15s"}}
                onClick={()=>setLang(l)}>{l}</button>
            ))}
          </div>

          <Logo sz={80}/>
          <div style={{height:16}}/>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(20px,5vw,32px)",color:"#1a1a1a",marginBottom:4,lineHeight:1.2}}>
            I Love You Moneypenis
          </h1>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,
            letterSpacing:3,color:"#4a4846",marginBottom:4,textTransform:"uppercase"}}>
            Sébastien Moreu & André Vaszkievicz · Paris 2024
          </p>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
            letterSpacing:4,color:"#8a8a85",marginBottom:24,textTransform:"uppercase"}}>
            {t.aw}
          </p>

          {/* Declaration box */}
          <div style={{background:"#ffffff",border:"1px solid #dedad6",
            padding:"18px 20px",maxWidth:420,width:"100%",marginBottom:20,textAlign:"left"}}>
            <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:11,
              color:"#3a3836",lineHeight:1.8,marginBottom:16}}>{t.am}</p>

            <label style={{display:"flex",alignItems:"flex-start",gap:10,
              cursor:"pointer",marginBottom:12}}>
              <input type="checkbox" checked={ck1} onChange={e=>setCk1(e.target.checked)}
                style={{marginTop:2,width:16,height:16,accentColor:"#1a1a1a",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                fontSize:11,color:"#2a2826",lineHeight:1.6}}>{t.ck1}</span>
            </label>

            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
              <input type="checkbox" checked={ck2} onChange={e=>setCk2(e.target.checked)}
                style={{marginTop:2,width:16,height:16,accentColor:"#1a1a1a",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                fontSize:11,color:"#2a2826",lineHeight:1.6}}>{t.ck2}</span>
            </label>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",maxWidth:360}}>
            <button className="bs"
              style={{opacity:ck1&&ck2?1:0.35,transition:"opacity .2s",
                cursor:ck1&&ck2?"pointer":"not-allowed"}}
              onClick={()=>{if(ck1&&ck2){setAgeOk(true);setDis(true);}}}>
              {t.ap}
            </button>
            <button className="bg"
              onClick={()=>{setAgeOk(false);setDis(true);}}>
              {t.am2}
            </button>
          </div>

          <div style={{marginTop:20,display:"flex",gap:16,fontSize:9,color:"#8a8a85",
            letterSpacing:1,fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            <a href={`https://${t.si}`} style={{color:"#8a8a85",textDecoration:"none"}}>{t.si}</a>
            <span>·</span>
            <a href={`https://${t.pv}`} style={{color:"#8a8a85",textDecoration:"none"}}>{t.pv}</a>
          </div>
        </div>
      )}

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:800,
        background:"rgba(251,251,248,0.97)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid #dedad6",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{height:52,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 14px",gap:8}}>

          {/* Logo + titre */}
          <div style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",flexShrink:0}}
            onClick={()=>goSec("portfolio")}>
            <Logo sz={26}/>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
              fontSize:8,letterSpacing:3,color:"#1a1a1a",whiteSpace:"nowrap"}}>
              A.V.S.M PRINTS
            </span>
          </div>

          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>

            {/* Lang dropdown */}
            <div style={{position:"relative"}}>
              <button onClick={()=>{setLangOpen(!langOpen);setMenuOpen(false);}}
                style={{background:"none",border:"1px solid #dedad6",color:"#1a1a1a",
                  padding:"5px 8px",fontSize:9,letterSpacing:1,cursor:"pointer",
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                  display:"flex",alignItems:"center",gap:3,transition:"all .2s"}}>
                {lang} <span style={{fontSize:7,color:"#5a5856"}}>▾</span>
              </button>
              {langOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                  background:"#fbfbf8",border:"1px solid #dedad6",zIndex:900,
                  minWidth:52,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
                  {LANGS.filter(l=>l!==lang).map(l=>(
                    <button key={l}
                      onClick={()=>{setLang(l);setLangOpen(false);}}
                      style={{display:"block",width:"100%",background:"none",border:"none",
                        borderBottom:"1px solid #f3f2ef",padding:"9px 0",fontSize:9,
                        letterSpacing:1,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                        fontWeight:400,color:"#2a2826",textAlign:"center"}}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 18+ toggle */}
            <button onClick={()=>{if(!ageOk){setDis(false);}else{setAgeOk(false);}setLangOpen(false);}}
              style={{background:"none",
                border:`1px solid ${ageOk?"#1a1a1a":"#dedad6"}`,
                color:ageOk?"#1a1a1a":"#5a5856",padding:"5px 7px",fontSize:8,
                letterSpacing:1,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                fontWeight:400,transition:"all .2s",whiteSpace:"nowrap"}}>
              {ageOk?"● 18+":"○ 18+"}
            </button>

            {/* Burger */}
            <button onClick={()=>{setMenuOpen(!menuOpen);setLangOpen(false);}}
              style={{background:"none",border:"1px solid #dedad6",cursor:"pointer",
                padding:"7px 9px",display:"flex",flexDirection:"column",gap:4,
                alignItems:"center",transition:"all .2s"}}>
              <span style={{display:"block",width:18,height:1.5,background:"#2a2826",
                transition:"all .25s",
                transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none"}}/>
              <span style={{display:"block",width:18,height:1.5,
                background:menuOpen?"transparent":"#2a2826",transition:"all .25s"}}/>
              <span style={{display:"block",width:18,height:1.5,background:"#2a2826",
                transition:"all .25s",
                transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MENU OVERLAY ══════════════════════════════════════════════════════ */}
      {menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:790,
          background:"rgba(251,251,248,0.98)",backdropFilter:"blur(20px)",
          display:"flex",flexDirection:"column",
          paddingTop:"calc(52px + env(safe-area-inset-top,0px))",
          paddingBottom:"env(safe-area-inset-bottom,20px)"}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{flex:1,display:"flex",flexDirection:"column",
            justifyContent:"center",alignItems:"center",gap:0}}>
            {t.nav.map((n,i)=>(
              <button key={n}
                className={`nb${sec===NAV[i]?" on":""}${GR.includes(NAV[i])?" gr":""}`}
                onClick={()=>{if(!GR.includes(NAV[i]))goSec(NAV[i]);}}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{paddingTop:"calc(52px + env(safe-area-inset-top,0px))"}}>

      {/* ══ PORTFOLIO ════════════════════════════════════════════════════════ */}
      {sec==="portfolio"&&(<>
        <div style={{background:"#ffffff",textAlign:"center",
          padding:"60px 20px 44px",borderBottom:"1px solid #dedad6"}}>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
            letterSpacing:5,color:"#4a4846",marginBottom:12,textTransform:"uppercase"}}>
            {t.hl}
          </p>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(28px,6.5vw,72px)",lineHeight:1.15,color:"#1a1a1a",
            marginBottom:12,whiteSpace:"pre-line"}}>{t.ht}</h1>
          <p style={{color:"#2a2826",fontSize:13,letterSpacing:2,marginBottom:4,fontWeight:400}}>
            {t.hs}
          </p>
          <p style={{color:"#4a4846",fontSize:11,letterSpacing:1,marginBottom:20}}>{t.hy}</p>
          <p style={{color:"#3a3836",fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",
            maxWidth:460,margin:"0 auto 24px",fontWeight:300}}>{t.hd}</p>
          <button className="bg" style={{width:"auto",display:"inline-block"}}
            onClick={()=>document.getElementById("pg")?.scrollIntoView({behavior:"smooth"})}>
            {t.hc}
          </button>
        </div>

        <div style={{maxWidth:860,margin:"0 auto",padding:"40px 14px 70px"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
              fontSize:"clamp(20px,3.5vw,36px)"}}>{t.pt}</h2>
            <span style={{color:"#5a5856",fontSize:9,letterSpacing:3,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>— XI</span>
          </div>
          <p style={{color:"#3a3836",fontSize:12,lineHeight:1.9,whiteSpace:"pre-line",
            marginBottom:32,fontWeight:300}}>{t.ps}</p>

          <div id="pg" style={{display:"flex",flexDirection:"column"}}>
            {PRINTS.map((p,idx)=>(
              <div key={p.id} className="hs"
                style={{display:"flex",alignItems:"stretch",
                  borderBottom:"1px solid #dedad6",background:"#ffffff",cursor:"pointer"}}
                onClick={()=>setLb(idx)}
                onMouseEnter={e=>e.currentTarget.style.background="#fdfcfa"}
                onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}>
                <div style={{flexShrink:0,width:"32%",maxWidth:200,background:"#f6f5f2"}}>
                  <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                </div>
                <div style={{flex:1,padding:"20px 18px",display:"flex",
                  flexDirection:"column",justifyContent:"center",gap:7}}>
                  <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:9,color:"#5a5856",letterSpacing:4,textTransform:"uppercase"}}>
                    {p.num} / XI
                  </span>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontSize:"clamp(15px,2.2vw,22px)",fontWeight:400,color:"#1a1a1a",
                    lineHeight:1.3}}>{p.title}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:10,color:"#4a4846"}}>{p.tech}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:8,color:"#8a8a85",letterSpacing:2,textTransform:"uppercase"}}>
                    {t.mg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {/* ══ VIDÉO ════════════════════════════════════════════════════════════ */}
      {sec==="video"&&(
        <div style={{maxWidth:960,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",color:"#5a5856",
                fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.vt}</h2>
          </div>
          <p style={{color:"#4a4846",fontSize:11,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:28}}>
            {t.vs}
          </p>
          <div style={{background:"#000",border:"1px solid #1a1a1a"}}>
            <video src={ageOk?VID.full:VID.gate} controls preload="metadata"
              onContextMenu={e=>e.preventDefault()}
              style={{width:"100%",display:"block",background:"#000"}}/>
          </div>
          <p style={{color:"#5a5856",fontSize:8,letterSpacing:2,marginTop:8,
            textAlign:"right",fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            {t.pr}
          </p>
        </div>
      )}

      {/* ══ COFFRET ══════════════════════════════════════════════════════════ */}
      {sec==="coffret"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#5a5856",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.ct}</h2>
          </div>
          <div style={{color:"#3a3836",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:32}}>
            {t.cs}
          </div>

          {/* ──────── Hero : vue d'ensemble ──────── */}
          <div style={{background:"#ffffff",border:"1px solid #dedad6",marginBottom:24}}>
            <img src={IMG.coffrets_flat} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"8px 14px",color:"#4a4846",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 2 coffrets · Petit Format + Grand Format
            </p>
          </div>

          {/* ──────── PETIT FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Petit Format · 30 × 40 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#5a5856",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>50 portfolios · 01 → 50</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.coffret_pf_print,cap:"Coffret PF fermé · Tirage I extrait"},
              {src:IMG.box_open,        cap:"Coffret PF ouvert · Colophon"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #dedad6"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
            <div style={{background:"#ffffff",border:"1px solid #dedad6"}}>
              <PImg src={IMG.open_pf} ageOk={ageOk} bz={[{t:18,l:52,w:42,h:62,lb:""}]}/>
              <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret PF ouvert · Tirage V
              </p>
            </div>
            <div style={{background:"#ffffff",border:"1px solid #dedad6"}}>
              <img src={IMG.open_pf_2} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret PF ouvert · Premières pages
              </p>
            </div>
          </div>

          {/* ──────── GRAND FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Grand Format · 50 × 70 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#5a5856",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>15 portfolios · 01 → 15</span>
          </h3>
          <div style={{display:"flex",justifyContent:"center",
            background:"#ffffff",border:"1px solid #dedad6"}}>
            <div style={{maxWidth:540,width:"100%"}}>
              <img src={IMG.coffret_gf_closed} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret GF fermé
              </p>
            </div>
          </div>

          {/* ──────── COMPARATIF DES FORMATS ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Comparatif des formats
          </h3>
          <div style={{background:"#ffffff",border:"1px solid #dedad6"}}>
            <PImg src={IMG.warning_cmp} ageOk={ageOk}
              bz={[{t:36,l:10,w:22,h:42,lb:""},{t:25,l:46,w:50,h:65,lb:""}]}/>
            <p style={{padding:"8px 14px",color:"#4a4846",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Tirage VIII — WARNING! · PF (30 × 40) vs GF (50 × 70)
            </p>
          </div>

          {/* ──────── LE CONTENU ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Les 11 tirages
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.fan,         cap:"Vue éventail · Drap blanc"},
              {src:IMG.prints_line, cap:"Alignement · Les 11 planches"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #dedad6"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{background:"#ffffff",border:"1px solid #dedad6"}}>
            <img src={IMG.coffret_detail} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 10px",color:"#4a4846",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Détail · Intérieur du coffret
            </p>
          </div>
        </div>
      )}

      {/* ══ CHEZ VOUS ════════════════════════════════════════════════════════ */}
      {sec==="chez"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#5a5856",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.zt}</h2>
          </div>
          <p style={{color:"#3a3836",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:32}}>
            {t.zs}
          </p>
          <div style={{background:"#ffffff",border:"1px solid #dedad6",marginBottom:2}}>
            <img src={ageOk?IMG.inside:IMG.inside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#4a4846",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 11 tirages encadrés · Chambre · Paris
            </p>
          </div>
          <div style={{background:"#ffffff",border:"1px solid #dedad6",marginBottom:2}}>
            <img src={ageOk?IMG.outside:IMG.outside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#4a4846",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 11 tirages encadrés · Atelier · Paris
            </p>
          </div>
        </div>
      )}

      {/* ══ SHOP ═════════════════════════════════════════════════════════════ */}
      {sec==="shop"&&(
        <div style={{maxWidth:940,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#5a5856",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.st}</h2>
          </div>
          <div style={{display:"flex",borderBottom:"1px solid #dedad6",marginBottom:28}}>
            {EDS.map(e=>(
              <button key={e.key} onClick={()=>setEt(e.key)}
                style={{background:"none",border:"none",
                  borderBottom:et===e.key?"1px solid #1a1a1a":"1px solid transparent",
                  color:et===e.key?"#1a1a1a":"#5a5856",padding:"9px 22px",fontSize:9,
                  letterSpacing:3,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                  fontWeight:400,textTransform:"uppercase",transition:"all .2s",marginBottom:-1}}>
                {e.key==="pf"?t.pft:t.gft}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:8,
            padding:18,background:"#ffffff",border:"1px solid #dedad6",alignItems:"center"}}>
            <img src={et==="pf"?IMG.coffret_pf_print:IMG.coffret_gf_closed} alt=""
              draggable={false} onContextMenu={e=>e.preventDefault()}
              style={{width:"100%",display:"block"}}/>
            <div>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
                letterSpacing:4,color:"#5a5856",marginBottom:8,textTransform:"uppercase"}}>
                {et==="pf"?t.pft:t.gft}
              </p>
              <p style={{fontSize:13,fontWeight:400,color:"#2a2826",marginBottom:5}}>
                {et==="pf"?t.pfc:t.gfc}
              </p>
              <p style={{color:"#4a4846",fontSize:11,marginBottom:5,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{t.sg}</p>
              <p style={{color:"#5a5856",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                {et==="pf"?t.pfi:t.gfi}
              </p>
            </div>
          </div>
          <SRow label={et==="pf"?t.p1:t.p3} price={ed.pr.port}
            rem={ed.rm.port} total={ed.rm.tot} cta={t.by}/>
          <SRow label={et==="pf"?t.p2:t.p4} price={ed.pr.single}
            rem={99} total={110} cta={t.rv}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",
            gap:2,marginTop:32}}>
            {[{ti:t.sh,bo:t.sb},{ti:t.py,bo:t.pb},{ti:t.co,bo:t.cb}].map(c=>(
              <div key={c.ti} style={{background:"#ffffff",border:"1px solid #dedad6",
                padding:"18px 16px"}}>
                <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                  fontSize:15,fontWeight:400,marginBottom:8}}>{c.ti}</p>
                <p style={{color:"#3a3836",fontSize:12,lineHeight:1.9,
                  whiteSpace:"pre-line",fontWeight:300}}>{c.bo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ BIO ══════════════════════════════════════════════════════════════ */}
      {sec==="bio"&&(
        <div style={{maxWidth:840,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:40}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#5a5856",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.bt}</h2>
          </div>

          {/* Bios first */}
          {[{n:t.sn,b:t.sb2,i:"S.M.",ph:IMG.portrait_sm},
            {n:t.vn,b:t.vb, i:"A.V.",ph:IMG.portrait_av}].map((a,i)=>(
            <div key={i}>
              <div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:28,
                marginBottom:i===0?20:44,paddingBottom:i===0?0:44}}>
                <div style={{paddingTop:3}}>
                  <div style={{width:80,height:80,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #dedad6",margin:"0 auto"}}>
                    <img src={a.ph} alt={a.n} draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:300,fontSize:8,color:"#8a8a85",letterSpacing:2,marginTop:8}}>
                    {a.i}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontSize:21,fontWeight:400,marginBottom:12}}>{a.n}</p>
                  {a.b.split("\n\n").map((para,j)=>(
                    <p key={j} style={{color:"#2a2826",fontSize:14,lineHeight:1.9,fontWeight:300,
                      marginBottom:12}}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Duo entre les 2 bios */}
              {i===0&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                  margin:"20px auto 40px",paddingBottom:30,
                  borderBottom:"1px solid #dedad6"}}>
                  <div style={{width:100,height:100,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #dedad6"}}>
                    <img src={IMG.portrait_duo} alt="Sébastien & André" draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:300,fontSize:8,color:"#8a8a85",letterSpacing:2,marginTop:10,
                    fontStyle:"italic"}}>
                    S.M. & A.V.
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Signature photos grid AFTER bios — with conditional blur on sex-revealing prints */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:10,marginBottom:14,letterSpacing:.3}}>
            Séance de signature
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#5a5856",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>Paris · 2024</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:2,background:"#ededea"}}>
            {[
              {src:"/sign-01.jpg",bz:[]},
              {src:"/sign-02.jpg",bz:[]},
              {src:"/sign-03.jpg",bz:[{t:6,l:14,w:67,h:72,lb:""}]},
              {src:"/sign-04.jpg",bz:[{t:0,l:18,w:48,h:28,lb:""}]},
              {src:"/sign-05.jpg",bz:[{t:4,l:14,w:75,h:50,lb:""}]},
              {src:"/sign-06.jpg",bz:[]},
              {src:"/sign-07.jpg",bz:[{t:48,l:0,w:52,h:46,lb:""}]},
              {src:"/sign-08.jpg",bz:[]},
            ].map((s,i)=>(
              <div key={i} style={{background:"#ffffff"}}>
                <PImg src={s.src} ageOk={ageOk} bz={s.bz}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {sec==="presse"&&<CS title={t.prst} soon={t.prss} contact={t.prsc}/>}
      {sec==="parlent"&&<CS title={t.plt} soon={t.pls} contact={null}/>}

      {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
      {sec==="contact"&&(
        <div style={{maxWidth:500,margin:"60px auto",padding:"0 18px 70px",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32,
            justifyContent:"center"}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#5a5856",fontSize:18,lineHeight:1}}>←</button>
            <Logo sz={48}/>
          </div>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:18,
            letterSpacing:5,marginBottom:4}}>A.V.S.M PRINTS</h2>
          <p style={{color:"#5a5856",fontSize:9,letterSpacing:2,marginBottom:28,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            I LOVE YOU MONEYPENIS · ESM SAINT-TROPEZ
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:9,textAlign:"left",
            marginBottom:12}}>
            <input placeholder={t.n1}/>
            <input placeholder={t.n2}/>
            <textarea placeholder={t.n3} rows={5} style={{resize:"vertical"}}/>
          </div>
          <button className="bg" style={{width:"auto",display:"inline-block"}}>
            {t.ns}
          </button>
        </div>
      )}

      </div>{/* paddingTop */}

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{borderTop:"1px solid #dedad6",
        padding:"16px 18px calc(16px + env(safe-area-inset-bottom,0px))",
        background:"#fbfbf8",display:"flex",justifyContent:"space-between",
        alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Logo sz={20}/>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
            fontSize:8,letterSpacing:4,color:"#5a5856"}}>A.V.S.M PRINTS</span>
        </div>
        <p style={{color:"#5a5856",fontSize:8,whiteSpace:"pre-line",textAlign:"center",
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,letterSpacing:.3}}>
          {t.lg}
        </p>
        <a href={`https://${t.pv}`}
          style={{color:"#5a5856",fontSize:8,letterSpacing:1,textDecoration:"none",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{t.pv}</a>
      </footer>

      {/* ══ LIGHTBOX ═════════════════════════════════════════════════════════ */}
      {lb!==null&&(
        <LBox prints={PRINTS} ci={lb} ageOk={ageOk} lang={lang}
          onClose={()=>setLb(null)}
          onPrev={e=>{e.stopPropagation();setLb(i=>Math.max(0,i-1));}}
          onNext={e=>{e.stopPropagation();setLb(i=>Math.min(PRINTS.length-1,i+1));}}
          t={t}/>
      )}
    </div>
  );
}
