import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step01ClientInfo } from './Step01ClientInfo';
import { renderWithForm } from '../../test/renderWithForm';
import { QUALITE_DEMANDEUR, DIAG_NOMS, DIAG_PRENOMS } from '../../data/constants';

describe('Step01ClientInfo', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByText('Étape 1')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Informations générales', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Identité du demandeur et du technicien.'),
      ).toBeInTheDocument();
    });

    it('affiche les deux sections Client et Diagnostiqueur', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByRole('heading', { name: 'Client', level: 3 })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Diagnostiqueur', level: 3 }),
      ).toBeInTheDocument();
    });

    it('affiche tous les champs Client', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByLabelText('Nom', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText('Prénom', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText('Adresse')).toBeInTheDocument();
      expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
      expect(screen.getByLabelText('Ville')).toBeInTheDocument();
      expect(screen.getByLabelText('Portable')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Qualité')).toBeInTheDocument();
    });

    it('affiche tous les champs Diagnostiqueur', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByLabelText('Nom', { selector: 'select' })).toBeInTheDocument();
      expect(screen.getByLabelText('Prénom', { selector: 'select' })).toBeInTheDocument();
      expect(screen.getByLabelText('Date du diagnostic')).toBeInTheDocument();
      expect(screen.getByLabelText('Référence dossier')).toBeInTheDocument();
    });
  });

  describe('input types and modes', () => {
    it('le champ Code postal a inputMode="numeric"', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByLabelText('Code postal')).toHaveAttribute('inputmode', 'numeric');
    });

    it('le champ Portable a type="tel" et inputMode="tel"', () => {
      renderWithForm(<Step01ClientInfo />);
      const tel = screen.getByLabelText('Portable');
      expect(tel).toHaveAttribute('type', 'tel');
      expect(tel).toHaveAttribute('inputmode', 'tel');
    });

    it('le champ Email a type="email" et inputMode="email"', () => {
      renderWithForm(<Step01ClientInfo />);
      const email = screen.getByLabelText('Email');
      expect(email).toHaveAttribute('type', 'email');
      expect(email).toHaveAttribute('inputmode', 'email');
    });

    it('le champ Date du diagnostic a type="date"', () => {
      renderWithForm(<Step01ClientInfo />);
      expect(screen.getByLabelText('Date du diagnostic')).toHaveAttribute('type', 'date');
    });
  });

  describe('select options', () => {
    it('le select Qualité contient toutes les options QUALITE_DEMANDEUR', () => {
      renderWithForm(<Step01ClientInfo />);
      const select = screen.getByLabelText('Qualité') as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      expect(optionValues).toContain('');
      QUALITE_DEMANDEUR.forEach((q) => expect(optionValues).toContain(q));
    });

    it('le select diag Nom contient toutes les options DIAG_NOMS', () => {
      renderWithForm(<Step01ClientInfo />);
      const select = screen.getByLabelText('Nom', { selector: 'select' }) as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      DIAG_NOMS.forEach((n) => expect(optionValues).toContain(n));
    });

    it('le select diag Prénom contient toutes les options DIAG_PRENOMS', () => {
      renderWithForm(<Step01ClientInfo />);
      const select = screen.getByLabelText('Prénom', { selector: 'select' }) as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      DIAG_PRENOMS.forEach((p) => expect(optionValues).toContain(p));
    });

    it('chaque select a un placeholder "— Sélectionner —" comme première option', () => {
      renderWithForm(<Step01ClientInfo />);
      const qualite = screen.getByLabelText('Qualité') as HTMLSelectElement;
      const diagNom = screen.getByLabelText('Nom', { selector: 'select' }) as HTMLSelectElement;
      [qualite, diagNom].forEach((sel) => {
        const firstOption = within(sel).getAllByRole('option')[0] as HTMLOptionElement;
        expect(firstOption.textContent).toBe('— Sélectionner —');
        expect(firstOption.value).toBe('');
      });
    });
  });

  describe('default values from form', () => {
    it('pré-remplit les champs avec les valeurs par défaut du formulaire', () => {
      renderWithForm(<Step01ClientInfo />, {
        defaultValues: {
          clientNom: 'Dupont',
          clientPrenom: 'Marie',
          clientCP: '75001',
          clientEmail: 'marie@example.com',
          clientQualite: 'Propriétaire',
        },
      });
      expect(screen.getByLabelText('Nom', { selector: 'input' })).toHaveValue('Dupont');
      expect(screen.getByLabelText('Prénom', { selector: 'input' })).toHaveValue('Marie');
      expect(screen.getByLabelText('Code postal')).toHaveValue('75001');
      expect(screen.getByLabelText('Email')).toHaveValue('marie@example.com');
      expect(screen.getByLabelText('Qualité')).toHaveValue('Propriétaire');
    });

    it('a une dossierRef pré-générée non-vide', () => {
      renderWithForm(<Step01ClientInfo />);
      const ref = screen.getByLabelText('Référence dossier') as HTMLInputElement;
      expect(ref.value).toMatch(/^Dossier Ref\. \d{4}-\d{3}$/);
    });

    it('a une diagDate pré-remplie au format ISO', () => {
      renderWithForm(<Step01ClientInfo />);
      const date = screen.getByLabelText('Date du diagnostic') as HTMLInputElement;
      expect(date.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('user interactions', () => {
    it('met à jour le formulaire quand on saisit dans un champ texte', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step01ClientInfo />);

      const nom = screen.getByLabelText('Nom', { selector: 'input' });
      await user.type(nom, 'Martin');

      expect(nom).toHaveValue('Martin');
      expect(methods.getValues('clientNom')).toBe('Martin');
    });

    it('met à jour le formulaire quand on sélectionne une qualité', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step01ClientInfo />);

      await user.selectOptions(screen.getByLabelText('Qualité'), 'Bailleur');

      expect(methods.getValues('clientQualite')).toBe('Bailleur');
    });

    it('met à jour le formulaire quand on sélectionne un diagnostiqueur', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step01ClientInfo />);

      await user.selectOptions(screen.getByLabelText('Nom', { selector: 'select' }), 'Da Cruz');
      await user.selectOptions(screen.getByLabelText('Prénom', { selector: 'select' }), 'Steven');

      expect(methods.getValues('diagNom')).toBe('Da Cruz');
      expect(methods.getValues('diagPrenom')).toBe('Steven');
    });

    it('permet de saisir tous les champs Client de bout en bout', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step01ClientInfo />);

      await user.type(screen.getByLabelText('Nom', { selector: 'input' }), 'Durand');
      await user.type(screen.getByLabelText('Prénom', { selector: 'input' }), 'Sophie');
      await user.type(screen.getByLabelText('Adresse'), '12 rue de la Paix');
      await user.type(screen.getByLabelText('Code postal'), '75002');
      await user.type(screen.getByLabelText('Ville'), 'Paris');
      await user.type(screen.getByLabelText('Portable'), '0612345678');
      await user.type(screen.getByLabelText('Email'), 'sophie@durand.fr');
      await user.selectOptions(screen.getByLabelText('Qualité'), 'Locataire');

      const values = methods.getValues();
      expect(values.clientNom).toBe('Durand');
      expect(values.clientPrenom).toBe('Sophie');
      expect(values.clientAdresse).toBe('12 rue de la Paix');
      expect(values.clientCP).toBe('75002');
      expect(values.clientVille).toBe('Paris');
      expect(values.clientTel).toBe('0612345678');
      expect(values.clientEmail).toBe('sophie@durand.fr');
      expect(values.clientQualite).toBe('Locataire');
    });

    it('permet de modifier la référence dossier', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step01ClientInfo />);

      const ref = screen.getByLabelText('Référence dossier');
      await user.clear(ref);
      await user.type(ref, 'CUSTOM-001');

      expect(methods.getValues('dossierRef')).toBe('CUSTOM-001');
    });
  });

  describe('accessibility', () => {
    it('chaque label est lié à son input via htmlFor/id', () => {
      const { container } = renderWithForm(<Step01ClientInfo />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        const htmlFor = label.getAttribute('for');
        if (htmlFor) {
          expect(container.querySelector(`#${htmlFor}`)).toBeInTheDocument();
        }
      });
    });
  });
});
