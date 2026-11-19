import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ListaVazia } from './Avisos';
import { listarSaidas } from '../servicos/saidas';
import { ehAdministrador } from '../servicos/autenticacao';
import { formatarData } from '../utilitarios/formatacao';
import { avisarErroDeConexao } from '../utilitarios/erros';
import { cores } from '../utilitarios/cores';

// Histórico de saídas, mostrado na aba "Saídas" da tela de Estoque.
export default function ListaSaidas({ usuario }) {
  const [saidas, setSaidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const ehAdmin = ehAdministrador(usuario);

  async function carregarSaidas() {
    setCarregando(true);
    try {
      setSaidas(await listarSaidas(usuario));
    } catch (erro) {
      avisarErroDeConexao('carregar as saídas');
    }
    setCarregando(false);
  }

  useFocusEffect(
    useCallback(() => {
      carregarSaidas();
    }, [usuario])
  );

  return (
    <FlatList
      data={saidas}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
      refreshing={carregando}
      onRefresh={carregarSaidas}
      ListHeaderComponent={
        <Text style={styles.titulo}>{ehAdmin ? 'Todas as saídas' : 'Saídas que você registrou'}</Text>
      }
      ListEmptyComponent={carregando ? null : <ListaVazia mensagem="Nenhuma saída registrada." />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.icone}>
            <Ionicons name="arrow-down" size={18} color={cores.vermelho} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.produto}>{item.produtoNome}</Text>
            <Text style={styles.detalhe}>
              Aluno: <Text style={styles.negrito}>{item.aluno}</Text>
            </Text>
            {ehAdmin && <Text style={styles.detalhe}>Registrado por: {item.professorNome}</Text>}
            <Text style={styles.detalhe}>{formatarData(item.data)}</Text>
          </View>

          <Text style={styles.quantidade}>−{item.quantidade}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 14,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.vermelhoClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  produto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
  },
  detalhe: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  negrito: {
    fontWeight: 'bold',
    color: cores.texto,
  },
  quantidade: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.vermelho,
    marginLeft: 8,
  },
});
