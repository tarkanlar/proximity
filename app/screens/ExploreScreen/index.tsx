import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppContext } from '../../context';
import { Header } from '../../layout';
import { ThemeColors } from '../../types';

const ExploreScreen: React.FC = () => {

  const { theme } = useContext(AppContext);

  return (
    <View style={styles(theme).container}>
      <Header title='Explore' />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.base
  }
});

export default ExploreScreen;