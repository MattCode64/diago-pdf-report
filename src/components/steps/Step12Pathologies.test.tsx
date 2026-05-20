import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step12Pathologies } from './Step12Pathologies';
import { renderWithForm } from '../../test/renderWithForm';
import {
  PATHOLOGY_KEYS,
  PATHOLOGY_LABELS,
  PATHOLOGY_STATUS_OPTIONS,
  RISQUES,
} from '../../data/constants';
import { PATHOLOGY_AUTO_TEXTS } from '../../data/pathologyTexts';

describe('Step12Pathologies', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step12Pathologies />);
      expect(screen.getByText('Étape 12')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Pathologies & risques', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Qualifiez chaque pathologie et cochez les risques identifiés.',
        ),
      ).toBeInTheDocument();
    });

    it('affiche l\'encart explicatif sur l\'injection auto de la conclusion', () => {
      renderWithForm(<Step12Pathologies />);
      expect(
        screen.getByText(/conclusion technique pré-remplie est automatiquement injectée/),
      ).toBeInTheDocument();
    });

    it('affiche les trois sections', () => {
      renderWithForm(<Step12Pathologies />);
      expect(
        screen.getByRole('heading', { name: 'État des pathologies', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Risques immédiats', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Conclusion & préconisations', level: 3 }),
      ).toBeInTheDocument();
    });
  });

  describe('select de chaque pathologie', () => {
    it('affiche un select pour chacune des 8 pathologies avec son libellé', () => {
      renderWithForm(<Step12Pathologies />);
      expect(PATHOLOGY_KEYS.length).toBe(8);
      PATHOLOGY_KEYS.forEach((k) => {
        expect(screen.getByText(PATHOLOGY_LABELS[k])).toBeInTheDocument();
      });
      expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(8);
    });

    it('chaque select propose les 5 statuts PATHOLOGY_STATUS_OPTIONS', () => {
      renderWithForm(<Step12Pathologies />);
      // On vérifie sur le premier select : il doit y avoir ras/correct/surveiller/necessaire/urgente
      const selects = screen.getAllByRole('combobox');
      const first = selects[0] as HTMLSelectElement;
      const values = within(first)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      PATHOLOGY_STATUS_OPTIONS.forEach((opt) => {
        expect(values).toContain(opt.value);
      });
    });

    it('par défaut tous les selects sont à "ras"', () => {
      renderWithForm(<Step12Pathologies />);
      const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
      // Les 8 premiers selects sont ceux des pathologies (avant la "Texte final" qui est textarea)
      selects.slice(0, 8).forEach((s) => {
        expect(s.value).toBe('ras');
      });
    });

    it('met à jour pathologiesState quand on change un statut', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step12Pathologies />);

      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[0], 'urgente');

      expect(methods.getValues('pathologiesState.remonteesCapillaires')).toBe('urgente');
    });
  });

  describe('notice "Aucun texte automatique"', () => {
    const NOTICE_TEXT = /Aucun texte automatique pour cette pathologie/;

    it('n\'apparaît pas quand le statut est "ras"', () => {
      renderWithForm(<Step12Pathologies />);
      expect(screen.queryByText(NOTICE_TEXT)).not.toBeInTheDocument();
    });

    it('n\'apparaît pas quand une pathologie AVEC texte auto passe à "necessaire"', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          pathologiesState: {
            remonteesCapillaires: 'necessaire',
            infiltrationMursEnterres: 'ras',
            contaminationElementsExterieurs: 'ras',
            condensation: 'ras',
            qualiteAir: 'ras',
            infiltrationFacade: 'ras',
            infiltrationToiture: 'ras',
            infiltrationTerrasses: 'ras',
          },
        },
      });
      // remonteesCapillaires a un texte auto => pas de notice
      expect(screen.queryByText(NOTICE_TEXT)).not.toBeInTheDocument();
    });

    it('apparaît quand une pathologie SANS texte auto passe à "necessaire"', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          pathologiesState: {
            remonteesCapillaires: 'ras',
            infiltrationMursEnterres: 'ras',
            contaminationElementsExterieurs: 'ras',
            condensation: 'ras',
            qualiteAir: 'necessaire',
            infiltrationFacade: 'ras',
            infiltrationToiture: 'ras',
            infiltrationTerrasses: 'ras',
          },
        },
      });
      // qualiteAir n'a pas de texte auto => notice présente
      expect(screen.getAllByText(NOTICE_TEXT).length).toBe(1);
    });

    it('apparaît aussi pour le statut "urgente" sur une pathologie sans texte auto', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          pathologiesState: {
            remonteesCapillaires: 'ras',
            infiltrationMursEnterres: 'ras',
            contaminationElementsExterieurs: 'urgente',
            condensation: 'ras',
            qualiteAir: 'ras',
            infiltrationFacade: 'ras',
            infiltrationToiture: 'ras',
            infiltrationTerrasses: 'ras',
          },
        },
      });
      expect(screen.getAllByText(NOTICE_TEXT).length).toBe(1);
    });

    it('apparaît N fois si N pathologies sans texte sont en necessaire/urgente', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          pathologiesState: {
            remonteesCapillaires: 'ras',
            infiltrationMursEnterres: 'ras',
            contaminationElementsExterieurs: 'necessaire',
            condensation: 'ras',
            qualiteAir: 'urgente',
            infiltrationFacade: 'necessaire',
            infiltrationToiture: 'ras',
            infiltrationTerrasses: 'ras',
          },
        },
      });
      // 3 pathologies sans texte auto en triggered => 3 notices
      expect(screen.getAllByText(NOTICE_TEXT).length).toBe(3);
    });

    it('ne s\'affiche pas pour le statut "surveiller" (non triggered)', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          pathologiesState: {
            remonteesCapillaires: 'ras',
            infiltrationMursEnterres: 'ras',
            contaminationElementsExterieurs: 'surveiller',
            condensation: 'ras',
            qualiteAir: 'ras',
            infiltrationFacade: 'ras',
            infiltrationToiture: 'ras',
            infiltrationTerrasses: 'ras',
          },
        },
      });
      expect(screen.queryByText(NOTICE_TEXT)).not.toBeInTheDocument();
    });
  });

  describe('PATHOLOGY_AUTO_TEXTS — cohérence', () => {
    it('ne contient des textes que pour remontees, infiltrationMursEnterres et condensation', () => {
      expect(Object.keys(PATHOLOGY_AUTO_TEXTS)).toEqual(
        expect.arrayContaining(['remonteesCapillaires', 'infiltrationMursEnterres', 'condensation']),
      );
      // Les 5 autres n'ont pas de texte
      expect(PATHOLOGY_AUTO_TEXTS.contaminationElementsExterieurs).toBeUndefined();
      expect(PATHOLOGY_AUTO_TEXTS.qualiteAir).toBeUndefined();
      expect(PATHOLOGY_AUTO_TEXTS.infiltrationFacade).toBeUndefined();
      expect(PATHOLOGY_AUTO_TEXTS.infiltrationToiture).toBeUndefined();
      expect(PATHOLOGY_AUTO_TEXTS.infiltrationTerrasses).toBeUndefined();
    });
  });

  describe('Risques immédiats', () => {
    it('affiche une checkbox pour chacun des 8 risques', () => {
      renderWithForm(<Step12Pathologies />);
      expect(RISQUES.length).toBe(8);
      RISQUES.forEach((r) => {
        expect(screen.getByRole('checkbox', { name: r })).toBeInTheDocument();
      });
    });

    it('aucun risque coché par défaut', () => {
      renderWithForm(<Step12Pathologies />);
      RISQUES.forEach((r) => {
        expect(screen.getByRole('checkbox', { name: r })).not.toBeChecked();
      });
    });

    it('coche un risque et l\'ajoute à risquesCoches', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step12Pathologies />);

      await user.click(screen.getByRole('checkbox', { name: 'Aspergillus' }));

      expect(methods.getValues('risquesCoches')).toEqual(['Aspergillus']);
    });

    it('décoche un risque déjà coché', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          risquesCoches: ['Chocs électriques', 'Aspergillus', 'Risque Sanitaire'],
        },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Aspergillus' }));

      expect(methods.getValues('risquesCoches')).toEqual([
        'Chocs électriques',
        'Risque Sanitaire',
      ]);
    });

    it('pré-coche les risques depuis defaultValues', () => {
      renderWithForm(<Step12Pathologies />, {
        defaultValues: {
          risquesCoches: ['Suspicion de mérule', 'Risques structurels'],
        },
      });
      expect(screen.getByRole('checkbox', { name: 'Suspicion de mérule' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Risques structurels' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Aspergillus' })).not.toBeChecked();
    });
  });

  describe('Conclusion & préconisations', () => {
    it('affiche les deux textareas (Votre texte personnel + Texte final)', () => {
      renderWithForm(<Step12Pathologies />);
      expect(screen.getByPlaceholderText(/Saisissez votre conclusion personnelle/)).toBeInTheDocument();
      expect(
        screen.getByLabelText('Texte final (assemblé automatiquement, éditable si besoin)'),
      ).toBeInTheDocument();
    });

    it('met à jour texteManuel à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step12Pathologies />);

      await user.type(
        screen.getByPlaceholderText(/Saisissez votre conclusion personnelle/),
        'Note du diagnostiqueur',
      );

      expect(methods.getValues('texteManuel')).toBe('Note du diagnostiqueur');
    });

    it('permet d\'éditer manuellement le texte final', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step12Pathologies />);

      const final = screen.getByLabelText(
        'Texte final (assemblé automatiquement, éditable si besoin)',
      );
      await user.type(final, 'Édition manuelle du texte assemblé');

      expect(methods.getValues('conclusionPathologies')).toBe(
        'Édition manuelle du texte assemblé',
      );
    });

    it('le textarea Votre texte personnel a rows=5', () => {
      renderWithForm(<Step12Pathologies />);
      expect(
        screen.getByPlaceholderText(/Saisissez votre conclusion personnelle/),
      ).toHaveAttribute('rows', '5');
    });

    it('le textarea Texte final a rows=10', () => {
      renderWithForm(<Step12Pathologies />);
      expect(
        screen.getByLabelText('Texte final (assemblé automatiquement, éditable si besoin)'),
      ).toHaveAttribute('rows', '10');
    });
  });
});
