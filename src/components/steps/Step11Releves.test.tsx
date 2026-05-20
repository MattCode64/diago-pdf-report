import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step11Releves } from './Step11Releves';
import { renderWithForm } from '../../test/renderWithForm';
import { TEST_NITRATE_OPTIONS, NITRATE_VALUES, OUI_NON } from '../../data/constants';

describe('Step11Releves', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step11Releves />);
      expect(screen.getByText('Étape 11')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Relevés & prélèvements', level: 2 }),
      ).toBeInTheDocument();
      expect(screen.getByText('Mesures effectuées sur place.')).toBeInTheDocument();
    });

    it('affiche les trois sections', () => {
      renderWithForm(<Step11Releves />);
      expect(
        screen.getByRole('heading', { name: 'Test nitrate', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: "Tests d'humidité", level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Synthèse', level: 3 }),
      ).toBeInTheDocument();
    });

    it('affiche le bloc d\'info T660/Hygromètre/IGERESS', () => {
      renderWithForm(<Step11Releves />);
      expect(screen.getByText(/valeurs en digit de 0 à 200/)).toBeInTheDocument();
      expect(screen.getByText(/taux d'humidité dans l'air/)).toBeInTheDocument();
      expect(screen.getByText(/évalue la pollution de l'air \(COV\)/)).toBeInTheDocument();
    });
  });

  describe('RadioGroup Test nitrate', () => {
    it('affiche les 3 options TEST_NITRATE_OPTIONS', () => {
      renderWithForm(<Step11Releves />);
      TEST_NITRATE_OPTIONS.forEach((opt) => {
        expect(screen.getByRole('radio', { name: opt })).toBeInTheDocument();
      });
    });

    it('"Non" est sélectionné par défaut', () => {
      renderWithForm(<Step11Releves />);
      expect(screen.getByRole('radio', { name: 'Non' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Oui' })).not.toBeChecked();
    });

    it('passe à "Oui" et déclenche l\'affichage de la liste des relevés', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />);

      expect(screen.queryByText('Ajouter un relevé')).not.toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: 'Oui' }));

      expect(methods.getValues('testNitrate')).toBe('Oui');
      expect(screen.getByText('Ajouter un relevé')).toBeInTheDocument();
    });

    it('cache la liste des relevés quand on passe à "Non nécessaire"', async () => {
      const user = userEvent.setup();
      renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      expect(screen.getByText('Ajouter un relevé')).toBeInTheDocument();

      await user.click(screen.getByRole('radio', { name: 'Non nécessaire' }));

      expect(screen.queryByText('Ajouter un relevé')).not.toBeInTheDocument();
    });
  });

  describe('NitrateTestList (relevés)', () => {
    it('affiche un message "Aucun relevé ajouté" quand la liste est vide', () => {
      renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });
      expect(screen.getByText('Aucun relevé ajouté pour le moment.')).toBeInTheDocument();
    });

    // Helpers : retrouve le select Taux et l'input Lieu d'une ligne donnée via leur attribut name.
    const tauxSelect = (idx = 0) =>
      document.querySelector(
        `select[name="testNitrateListe.${idx}.valeur"]`,
      ) as HTMLSelectElement;
    const lieuInput = (idx = 0) =>
      document.querySelector(
        `input[name="testNitrateListe.${idx}.lieu"]`,
      ) as HTMLInputElement;

    it('ajoute un relevé au clic sur "Ajouter un relevé"', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      await user.click(screen.getByRole('button', { name: /Ajouter un relevé/ }));

      expect(methods.getValues('testNitrateListe')).toEqual([{ valeur: '0', lieu: '' }]);
      expect(screen.getByText('Taux (mg)')).toBeInTheDocument();
      expect(screen.getByText('Lieu du prélèvement')).toBeInTheDocument();
    });

    it('le select Taux contient toutes les valeurs NITRATE_VALUES', async () => {
      const user = userEvent.setup();
      renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      await user.click(screen.getByRole('button', { name: /Ajouter un relevé/ }));

      const select = tauxSelect();
      const values = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      NITRATE_VALUES.forEach((v) => expect(values).toContain(String(v)));
    });

    it('modifie la valeur et le lieu d\'un relevé', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      await user.click(screen.getByRole('button', { name: /Ajouter un relevé/ }));
      await user.selectOptions(tauxSelect(), '100');
      await user.type(lieuInput(), 'Mur Nord – pied de mur');

      expect(methods.getValues('testNitrateListe')).toEqual([
        { valeur: '100', lieu: 'Mur Nord – pied de mur' },
      ]);
    });

    it('ajoute plusieurs relevés', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      const addBtn = () => screen.getByRole('button', { name: /Ajouter un relevé/ });
      await user.click(addBtn());
      await user.click(addBtn());
      await user.click(addBtn());

      expect(methods.getValues('testNitrateListe')).toHaveLength(3);
    });

    it('supprime un relevé via le bouton corbeille', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />, {
        defaultValues: { testNitrate: 'Oui' },
      });

      await user.click(screen.getByRole('button', { name: /Ajouter un relevé/ }));
      await user.click(screen.getByRole('button', { name: /Ajouter un relevé/ }));
      expect(methods.getValues('testNitrateListe')).toHaveLength(2);

      const removeBtns = screen.getAllByRole('button', { name: 'Supprimer ce relevé' });
      await user.click(removeBtns[0]);

      expect(methods.getValues('testNitrateListe')).toHaveLength(1);
    });
  });

  describe('Tests T660 / Hygromètre / IGERESS', () => {
    it('affiche les 3 sélecteurs avec options OUI_NON', () => {
      renderWithForm(<Step11Releves />);
      const t660 = screen.getByLabelText('Humidimètre T660') as HTMLSelectElement;
      const hygro = screen.getByLabelText('Hygromètre') as HTMLSelectElement;
      const igeres = screen.getByLabelText('IGERESS') as HTMLSelectElement;

      [t660, hygro, igeres].forEach((sel) => {
        const values = within(sel)
          .getAllByRole('option')
          .map((o) => (o as HTMLOptionElement).value);
        OUI_NON.forEach((v) => expect(values).toContain(v));
      });
    });

    it('par défaut, ne montre pas les textareas de détails', () => {
      renderWithForm(<Step11Releves />);
      expect(screen.queryByPlaceholderText(/Notes \/ relevés T660/)).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/Taux d'humidité/)).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/Résultats COV/)).not.toBeInTheDocument();
    });

    it('affiche la textarea T660Details quand testT660=Oui', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />);

      await user.selectOptions(screen.getByLabelText('Humidimètre T660'), 'Oui');

      expect(methods.getValues('testT660')).toBe('Oui');
      expect(screen.getByPlaceholderText(/Notes \/ relevés T660/)).toBeInTheDocument();
    });

    it('affiche la textarea HygroDetails quand testHygro=Oui', async () => {
      const user = userEvent.setup();
      renderWithForm(<Step11Releves />);

      await user.selectOptions(screen.getByLabelText('Hygromètre'), 'Oui');

      expect(screen.getByPlaceholderText(/Taux d'humidité/)).toBeInTheDocument();
    });

    it('affiche la textarea IgeresDetails quand testIgeres=Oui', async () => {
      const user = userEvent.setup();
      renderWithForm(<Step11Releves />);

      await user.selectOptions(screen.getByLabelText('IGERESS'), 'Oui');

      expect(screen.getByPlaceholderText(/Résultats COV/)).toBeInTheDocument();
    });

    it('met à jour les détails de chaque test indépendamment', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />);

      await user.selectOptions(screen.getByLabelText('Humidimètre T660'), 'Oui');
      await user.selectOptions(screen.getByLabelText('Hygromètre'), 'Oui');
      await user.type(screen.getByPlaceholderText(/Notes \/ relevés T660/), '80 digit');
      await user.type(screen.getByPlaceholderText(/Taux d'humidité/), '65%');

      const values = methods.getValues();
      expect(values.testT660Details).toBe('80 digit');
      expect(values.testHygroDetails).toBe('65%');
      // IGERESS reste inactif => details reste vide
      expect(values.testIgeresDetails).toBe('');
    });
  });

  describe('Synthèse — obsFinales', () => {
    it('met à jour obsFinales à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step11Releves />);

      await user.type(
        screen.getByLabelText('Observations finales / synthèse des mesures'),
        'Bilan: humidité structurelle confirmée',
      );

      expect(methods.getValues('obsFinales')).toBe(
        'Bilan: humidité structurelle confirmée',
      );
    });

    it('la textarea Synthèse a rows=5', () => {
      renderWithForm(<Step11Releves />);
      expect(
        screen.getByLabelText('Observations finales / synthèse des mesures'),
      ).toHaveAttribute('rows', '5');
    });
  });
});
