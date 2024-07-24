import {Alert} from 'react-native';
import RNFS from 'react-native-fs';

export const saveFile = async (fileContent, fileName) => {
  try {
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, fileContent, 'utf8');
    Alert.alert('Success', `GPX file saved to ${path}`);
  } catch (error) {
    Alert.alert('Error', `Failed to save GPX file: ${error.message}`);
  }
};
