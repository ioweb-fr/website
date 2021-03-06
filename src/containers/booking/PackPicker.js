import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import PackList               from '~/components/PackList';
import * as actions           from '~/actions';

class PackPicker extends PureComponent {
  @autobind
  handlePackChange(event) {
    this.props.actions.updateBooking({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      lang,
      pack,
      minPack,
      city,
    } = this.props;

    return (
      <PackList
        {...{
          handlePackChange: this.handlePackChange,
          lang,
          city,
          pack,
          minPack,
        }}
      />
    );
  }
}

function mapStateToProps({ route, booking, rooms, apartments }) {
  const { lang, minPack } = route;
  const { roomId, pack } = booking;
  const room = rooms[roomId];
  const isLoading = !room || room.isLoading;

  return {
    lang,
    pack,
    minPack,
    city: !isLoading && apartments[room.ApartmentId].addressCity,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
