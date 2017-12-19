import { IntlProvider, Text } from 'preact-i18n';
import { route }              from 'preact-router';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import BookingFormSections    from '~/components/booking/BookingFormSections';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class BookingForm extends PureComponent {
  @autobind
  async handleSubmit() {
    const {
      room,
      booking,
      actions,
    } = this.props;

    await actions.validateBooking(booking);
    const { response: { rentingId } } = await actions.saveBooking({ room, booking });

    route(`/${this.props.lang}/summary/${rentingId}`);
  }

  componentWillMount() {
    const { roomId, actions } = this.props;

    actions.updateBooking({ roomId });
  }

  componentDidMount() {
    const {
      roomId,
      room,
      actions,
    } = this.props;

    if ( !room ) {
      return actions.getRoom(roomId)
        .then(({ response: { data: [roomData] } }) =>
          roomData.id !== roomId &&
          route(window.location.pathname.replace(/[\w-]+$/, roomData.id)) &&
          actions.updateBooking({ roomId: roomData.id })
        );
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const {
      lang,
      room,
      booking,
      isLoading,
      isRoomAvailable,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    // This is probably never true
    if ( room.name === undefined ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <h1 class="content">
            <Text id="errors.room">
              Sorry, there was an error preparing your booking for this room.
            </Text>
          </h1>
        </IntlProvider>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <h1>
            <Text id="title">Booking details for room</Text><br />
            <em>{room.name}</em>
          </h1>

          { isRoomAvailable ?
            <BookingFormSections lang={lang} /> :
            <p>
              <Text id="errors.unavailable">
                Sorry, this room isn't available for booking.
              </Text>
            </p>
          }

          <nav class="text-center">
            { booking.isSaving ?
              <ProgressBar type="circular" mode="indeterminate" /> :
              <Button raised primary
                label="Continue"
                icon="forward"
                onClick={this.handleSubmit}
                disabled={!booking.isEligible || !booking.hasAcceptedTerms}
              />
            }
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ route: { lang }, rooms, booking }, { roomId }) {
  const room = rooms[roomId];

  if ( !room || room.isLoading ) {
    return { isLoading: true };
  }

  return {
    lang,
    roomId,
    room,
    booking,
    isRoomAvailable: Utils.isRoomAvailable( room ),
  };
}

const definition = { 'fr-FR': {
  title: 'Réservation de la chambre',
  datetime: 'Date et heure',
  description: 'Cette chambre est disponible immédiatement et la location commencera au',
  pack: {
    basic: 'Basique',
    comfort: 'Confort',
    privilege: 'Privilège',
  },
  errors: {
    unavailable: 'Désolé, cette chambre n\'est plus dispobible.',
    room: 'Désolé, une erreur est survenue lors de la préparation de votre réservation.',
  },
  button: 'Continuer',
} };

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);