import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface MyModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  information: string;
  children: any
}

const Info = ({ isVisible, onClose, title, information, children }: MyModalProps) => {
  return (
    <Modal visible={isVisible}>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 10 }}>
          {title}
        </Text>

        <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 10  }}>
          {information}
        </Text>

        <Pressable onPress={onClose}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 10  }}>
            Close
          </Text>
        </Pressable>

        {children}
      </View>
    </Modal>
  );
}

export default Info;
