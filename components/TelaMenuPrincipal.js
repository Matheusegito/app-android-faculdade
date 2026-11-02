
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function ControleDeEstoque() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Estoque</Text>
    </View>
  );
}

function Perfil() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
    </View>
  );
}

function Insights() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Insights</Text>
    </View>
  );
}

function MenuPersonalizado(props) {
  const { onLogout } = props;

  return (
    <View style={{ flex: 1 }}>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            props.navigation.closeDrawer();
            onLogout();
          }}
        >
          <Text style={styles.logoutText}>
            ↪  Sair
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default function TelaMenuPrincipal({ onLogout }) {
  return (
    <Drawer.Navigator
      initialRouteName="Controle de Estoque"

      drawerContent={(props) => (
        <MenuPersonalizado
          {...props}
          onLogout={onLogout}
        />
      )}

      screenOptions={{
        headerStyle: {
          backgroundColor: '#E2211C',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#E2211C',
        drawerActiveBackgroundColor: '#DCEAF5',
      }}
    >

      <Drawer.Screen
        name="Controle de Estoque"
        component={ControleDeEstoque}
      />

      <Drawer.Screen
        name="Perfil"
        component={Perfil}
      />

      <Drawer.Screen
        name="Insights"
        component={Insights}
      />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#E2211C',
  },

  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 15,
  },

  logoutButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FCE8E8',
  },

  logoutText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
