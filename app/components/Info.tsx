import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface MyModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  information: string;
}

const Info = ({ isVisible, onClose, title, information }: MyModalProps) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={{ backgroundColor: "#ff0000", padding: 20 }}>
        <Text style={{ fontSize: 30, color: "#fff",   textAlign: 'center', marginVertical: 10 }}>
          {title}
        </Text>

        <Text style={{ fontSize: 18, color: "#fff", lineHeight: 30, textAlign: 'center', marginVertical: 10  }}>
          {information}
        </Text>

        <Pressable onPress={onClose}>
          <Text style={{ fontSize: 18, color: "#fff", textAlign: 'center', marginVertical: 10  }}>
            Close
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

export default Info;
