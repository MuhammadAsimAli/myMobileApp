import React from "react";
import { BackHandler } from "react-native";
import { MapView } from "expo";
export default class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      location: {
        latitude: 24.860735, longitude: 67.001137
      }
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    setTimeout(() => {
      this.refs.map.fitToElements(true);
    }, 1000);
    this.interval = setInterval(() => {
      this.refs.map.fitToElements(true);
      // this.refs.map.animateCamera({
      //   center: this.state.location,
      //   zoom: 10
      // })
    }, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval)
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate("Main")
    return true;
  }

  render() {
    // console.warn(this.props.navigation.state.params.item.lat, this.props.navigation.state.params.item.long)
    return (
      <MapView
        ref="map"
        style={{ flex: 1 }}
        region={{
          longitude: this.props.navigation.state.params.item.long,
          latitude: this.props.navigation.state.params.item.lat,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        zoom={'10'}

      >
        <MapView.Marker
          coordinate={{
            longitude: this.props.navigation.state.params.item.long,
            latitude: this.props.navigation.state.params.item.lat,
          }}
          title={'Driver location'}
          description={'is Here'}
        />
      </MapView>
    );
  }
}

