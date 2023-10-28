import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

function Info({ isVisible, onClose, title, information }) {
  return (
    <Modal isVisible={isVisible}>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        {/* Custom alert icon */}
        <Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 10 }}>
          {title}
        </Text>

        {/* Alert content */}
        <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 10  }}>
        {information}
        </Text>

        {/* Close button */}
        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 10  }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default Info;
