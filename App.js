import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const BUTTONS = [
  { key: '^m', label: 'Mulligan' },
  { key: 'o', label: 'Fly Over' },
  { key: 'h', label: 'Hide UI' },
  { key: 'u', label: 'Putting Mode' },
  { key: 'b', label: 'Remove Camera Blockers' },
];

const SERVER = '192.168.1.71';
const PORT = '3130';

/**
* Returns true of the screen is in landscape mode
*/
const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};

const requestKey = (key) => {
  const params = new URLSearchParams({ key });
  return fetch(`http://${SERVER}:${PORT}/keyboard?${params}`);
}

export function KeyboardButton({ label, keyname }) {
  console.log(label, keyname);
  const handlePress = () => {
    console.log('fetch', keyname);
    requestKey(keyname).then(() => {
      console.log('key requested');
    }).catch(error => {
      console.log('key error');
      Alert.alert('Unable to send key!');
    });
  }
  return (
    <TouchableHighlight onPress={handlePress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    </TouchableHighlight>
  )
}

export function ArrowButton({ children, keyname }) {
  const handlePress = () => {
    console.log('fetch', keyname);
    requestKey(keyname);
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      {children}
    </TouchableOpacity>
  )
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLandscapeLayout, setIsLandscapeLayout] = useState(isLandscape());
  
  Dimensions.addEventListener('change', () => {
    setIsLandscapeLayout(isLandscape());
  });


  return (
    <View style={styles.container}>
      <View style={{ ...styles.containerGrid, ...isLandscapeLayout && styles.containerGridLandscape }}>
        <View style={{ ...styles.aimView, ...isLandscapeLayout && styles.aimViewLandscape }}>
          <View style={styles.aimGrid}>
            <View style={styles.aimGridFillRow}>
              <ArrowButton keyname="up">
                <Ionicons name="md-caret-up-circle" size={100} />
              </ArrowButton>
            </View>
            <View style={styles.aimGridCenterRow}>
              <ArrowButton keyname="left">
                <Ionicons name="md-caret-back-circle" size={100} />
              </ArrowButton>
              <Text style={styles.aimText}>AIM</Text>
              <ArrowButton keyname="right">
                <Ionicons name="md-caret-forward-circle" size={100} />
              </ArrowButton>
            </View>
            <View style={styles.aimGridFillRow}>
              <ArrowButton keyname="down">
                <Ionicons name="md-caret-down-circle" size={100} />
              </ArrowButton>
            </View>
          </View>
        </View>

        <View style={{ ...styles.buttonView, ...isLandscapeLayout && styles.buttonViewLandscape }}>
          <View style={styles.buttonGrid}>
            <FlatList
              data={BUTTONS}
              renderItem={({item}) => <KeyboardButton key={item.key} keyname={item.key} label={item.label} />}
              keyExtractor={item => item.key}
            />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  containerGrid: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  containerGridLandscape: {
    flexDirection: 'row',
  },
  aimView: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 0,
    flexShrink: 0,
    paddingTop: 50,
  },
  aimViewLandscape: {
    marginLeft: 40,
    marginRight: 40,
    // flexShrink: 0,
    // flexGrow: 0,
  },
  aimGrid: {
    // flex: 1,
    backgroundColor: '#00ffaa',
    display: 'flex',
    // alignItems: 'flex-start',
    flexDirection: 'column',
    // flexWrap: 'wrap',
    flexShrink: 1,
    flexGrow: 0,
  },
  aimGridFillRow: {
    flexGrow: 1,
    alignItems: 'center',
  },
  aimGridCenterRow: {
    flexGrow: 1,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 40,

  },
  aimText: {
    width: 100,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  aimButton: {
    // backgroundColor: '#DDDDDD',
  },
  buttonView: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    // backgroundColor: 'lime',
    paddingTop: 5,
  },
  buttonViewLandscape: {
    paddingTop: 40,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 50,
  },
  buttonGrid: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // flexWrap: 'wrap',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#00ffaa',
    padding: 20,
    margin: 10,
    // width: 150,
    // height: 100,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 24,
  },
});
