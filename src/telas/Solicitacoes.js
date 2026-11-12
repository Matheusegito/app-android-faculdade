import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Botao from '../componentes/Botao';
import BotaoFlutuante from '../componentes/BotaoFlutuante';
import { ListaVazia } from '../componentes/Avisos';
import { listarSolicitacoes, atualizarStatusSolicitacao } from '../servicos/solicitacoes';
import { ehAdministrador, ehProfessor } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { statusSolicitacao } from '../dados/dadosSolicitacoes';
import { formatarData } from '../utilitarios/formatacao';
import { cores } from '../utilitarios/cores';

const coresStatus = {
  Pendente: { fundo: cores.laranjaClaro, texto: cores.laranja },
  Aprovada: { fundo: cores.verdeClaro, texto: cores.verde },
  Rejeitada: { fundo: cores.vermelhoClaro, texto: cores.vermelho },
};

export default function Solicitacoes({ navigation }) {
  const { usuario } = useSessao();
  const ehAdmin = ehAdministrador(usuario);
  const [solicitacoes, setSolicitacoes] = useState([]);

  async function carregarSolicitacoes() {
    if (usuario) {
      setSolicitacoes(await listarSolicitacoes(usuario));
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarSolicitacoes();
    }, [usuario])
  );

  async function mudarStatus(id, novoStatus) {
    await atualizarStatusSolicitacao(id, novoStatus);
    carregarSolicitacoes();
  }

  function renderizarSolicitacao({ item }) {
    const corStatus = coresStatus[item.status];

    return (
      <View style={styles.card}>
        <View style={styles.topo}>
          <Text style={styles.produto}>{item.produtoNome}</Text>
          <View style={[styles.etiqueta, { backgroundColor: corStatus.fundo }]}>
            <Text style={[styles.textoEtiqueta, { color: corStatus.texto }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.detalhe}>
          Quantidade: <Text style={styles.negrito}>{item.quantidade}</Text>
        </Text>
        {ehAdmin && (
          <Text style={styles.detalhe}>
            Professor: <Text style={styles.negrito}>{item.professorNome}</Text>
          </Text>
        )}
        <Text style={styles.detalhe}>Data: {formatarData(item.data)}</Text>
        {item.observacao ? <Text style={styles.observacao}>"{item.observacao}"</Text> : null}

        {ehAdmin && item.status === statusSolicitacao.pendente && (
          <View style={styles.acoes}>
            <Botao
              titulo="Rejeitar"
              variante="secundario"
              icone="close"
              estilo={styles.botaoAcao}
              onPress={() => mudarStatus(item.id, statusSolicitacao.rejeitada)}
            />
            <Botao
              titulo="Aprovar"
              icone="checkmark"
              estilo={styles.botaoAcao}
              onPress={() => mudarStatus(item.id, statusSolicitacao.aprovada)}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={renderizarSolicitacao}
        ListHeaderComponent={
          <Text style={styles.titulo}>{ehAdmin ? 'Todas as solicitações' : 'Minhas solicitações'}</Text>
        }
        ListEmptyComponent={<ListaVazia mensagem="Nenhuma solicitação encontrada." />}
      />

      {ehProfessor(usuario) && <BotaoFlutuante onPress={() => navigation.navigate('NovaSolicitacao')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    padding: 14,
    paddingBottom: 110,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 12,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  produto: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
    marginRight: 8,
  },
  etiqueta: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  textoEtiqueta: {
    fontSize: 12,
    fontWeight: 'bold',
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
  observacao: {
    fontSize: 13,
    color: cores.texto,
    fontStyle: 'italic',
    marginTop: 8,
  },
  acoes: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  botaoAcao: {
    flex: 1,
    height: 42,
  },
});
