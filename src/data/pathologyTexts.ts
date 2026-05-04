import type { PathologyKey } from './constants';

const REMONTEES = `Les relevés effectuées mettent en évidence une humidité structurelle très élevée (supérieure à 60 digits / 200), accompagnée de salpêtre, de dégradations de maçonnerie, de peintures écaillées, ainsi que de moisissures en pied de mur.

L’ensemble de ces symptômes est caractéristique d’un phénomène de remontées capillaires, correspondant à la migration ascendante de l’eau par les pores des matériaux depuis les parties basses du bâti.

Ce phénomène génère une érosion progressive des liants de maçonnerie, et expose l’ouvrage à un risque structurel.

Les variations hydriques du sol, accentuées par les aléas climatiques (sécheresse puis réhydratation), amplifient la montée d’eau par capillarité et réduisent la capacité des matériaux à évacuer l’humidité. La présence de salpêtre, cristallisation des nitrates, confirme une migration active d’eau depuis les fondations et indique une possible aggravation à moyen terme.

Un risque sanitaire existe également, notamment en cas d’hygrométrie excessive dans les pièces ou derrière les doublages, pouvant favoriser le développement de moisissures et la dégradation des matériaux isolants.

Il faut réaliser un traitement adapté à la nature de la maçonnerie, qui va permettre de recréer une bande d’arase.

Il est impératif d’utiliser des injections de résine liquide, et non des crèmes ou mousses, dont la densité trop élevée ne permet pas une diffusion correcte dans la maçonnerie et peut même entraîner une fragilisation des matériaux en exerçant des pressions inadaptées dans les pores du mur.

La mise en œuvre de ces actions est indispensable afin de stabiliser la structure, d’éviter la poursuite de la dégradation des murs et de prévenir les risques sanitaires liés à l’humidité excessive.

Madame, Monsieur sont informés du risque de dégradation du bâti ainsi que des risques sanitaires associés en l’absence de traitement adapté.`;

const INFILTRATION_MURS_ENTERRES = `Les mesures réalisées mettent en évidence une humidité structurelle très élevée (supérieure à 60 digits / 200), associée à la présence de salpêtre, de dégradations de maçonnerie, de peintures écaillées, ainsi que de moisissures en pied de mur et derrière les doublages. Ces éléments caractérisent une infiltration active d’eau au niveau des parois enterrées.

La situation présente un risque structurel avéré, lié à l’érosion progressive des liants de maçonnerie.

L’évolution typique se décompose en trois stades :

	•	Stade 1 : apparition de salpêtre ;
	•	Stade 2 : taches d’humidité et pénétrations d’eau occasionnelles ;
	•	Stade 3 : risque d’inondation.

Les aléas météorologiques, notamment les épisodes de sécheresse suivis de réhydratation des sols, accentuent la pression hydrostatique sur les parois enterrées et réduisent la capacité de rétention des sols. La cristallisation des nitrates (salpêtre) prouve qu’il y a une migration active d’eau à travers la maçonnerie et laisse présager une aggravation possible vers des infiltrations plus massives à moyen terme.

Un risque sanitaire existe également, notamment en cas d’hygrométrie excessive dans les pièces ou derrière les doublages, pouvant favoriser le développement de moisissures et la dégradation des matériaux isolants.

Un décaissement périphérique est fortement déconseillé en raison du risque de déséquilibre des fondations et des phénomènes mécaniques de retrait-gonflement des sols.

Les interventions doivent donc être réalisées depuis l’intérieur, avec :

	•	un traitement de type cuvelage, restructurant, hydrofuge et hydrophobe adapté,
	•	une décompression de la maçonnerie (drainage interne, relevage si nécessaire),
	•	l’exclusion des solutions à base de ciment ou de chaux, inadaptées dans ce contexte.

Il est impératif d’engager ces travaux afin de stabiliser la structure, limiter la dégradation des matériaux et prévenir les risques d’inondation et de contamination fongique.

Madame, Monsieur sont informés du risque de dégradation du bâti ainsi que des risques sanitaires associés en l’absence de traitement adapté.`;

const CONDENSATION = `Les relevés hygrométriques effectués dans l’air ambiant mettent en évidence un taux d’humidité nettement supérieur aux seuils généralement admis (supérieur à 55 %). Ce déséquilibre hygrométrique s’accentue particulièrement durant la nuit, lorsque la température extérieure diminue et que l’accumulation d’humidité liée à l’activité humaine atteint son maximum (respiration, transpiration, douches, sommeil).

Ce contexte favorise l’apparition de phénomènes de condensation sur les parois froides et zones de ponts thermiques. Il en résulte un développement de moisissures, notamment de type aspergillus, directement lié à un air vicié et à un défaut de renouvellement d’air constant. Ces micro-organismes peuvent avoir un impact notable sur les voies respiratoires, en particulier chez les personnes immunodéprimées, asthmatiques ou âgées.

Madame, Monsieur sont informés du risque de dégradation du bâti ainsi que des risques sanitaires associés en l’absence de traitement adapté.

Un traitement ponctuel par dépression présente une efficacité limitée, dans la mesure où il ne garantit pas une action homogène sur l’ensemble du volume. De même, une simple déshumidification ne constitue pas une solution suffisante, puisqu’elle ne traite pas les causes structurelles telles que les ponts thermiques.

Il est donc nécessaire d’intervenir sur l’ensemble du volume, au moyen d’un dispositif global permettant une régulation de la température, de la pression et de la qualité de l’air, afin d’assurer un traitement durable et efficace du phénomène de condensation.`;

export const PATHOLOGY_AUTO_TEXTS: Partial<Record<PathologyKey, string>> = {
  remonteesCapillaires: REMONTEES,
  infiltrationMursEnterres: INFILTRATION_MURS_ENTERRES,
  condensation: CONDENSATION,
};

export const AUTO_TEXT_MARKER = '--- ANALYSE TECHNIQUE ---';
