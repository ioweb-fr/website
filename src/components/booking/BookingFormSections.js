import { IntlProvider, Text } from 'preact-i18n';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from '~/containers/booking/PackPicker';
import ClientInputs			      from '~/containers/booking/ClientInputs';
import EligibilityInput		   	from '~/containers/booking/EligibilityInput';

export default function BookingFormSections({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        <section>
          <h3><Text id="housingPack">Choose Your Housing Pack</Text></h3>
          <PackPicker />
        </section>

        <section>
          <h3><Text id="detail">Detailed comparison</Text></h3>
          <FeatureList lang={lang} isPriceHidden />
        </section>

        <section>
          <h3><Text id="personal">Personal info</Text></h3>
          <ClientInputs />
        </section>

        <section>
          <h3><Text id="eligibility">Eligibility, Terms and Conditions</Text></h3>
          <EligibilityInput />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  housingPack: 'Choisissez Votre Pack Logement',
  detail: 'Comparaison Détaillée',
  personal: 'Infos personnelles',
  date: {
    first: 'Date et heure prévues de checkin',
    last: '(Possibilité de changer à n\'importe quel moment)',
  },
  eligibility: 'Eligibilité, modalités et Conditions',
} };
