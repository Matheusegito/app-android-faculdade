import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../utilitarios/cores';
import { formatarPreco, estaComEstoqueBaixo } from '../utilitarios/formatacao';

// Card de um produto na lista do estoque.
// O administrador vê os botões de quantidade, editar e excluir.
// O professor vê os botões de registrar saída e de solicitar reposição.
export default function ItemProduto({
  produto,
  ehAdmin,
  aoEditar,
  aoExcluir,
  aoAlterarQuantidade,
  aoSolicitar,
  aoRegistrarSaida,
}) {
  const estoqueBaixo = estaComEstoqueBaixo(produto);

  return (
    <View style={[styles.card, estoqueBaixo && styles.cardBaixo]}>
      <View style={styles.linha}>
        {produto.foto ? (
          <Image source={{ uri: produto.foto }} style={styles.foto} />
        ) : (
          <View style={[styles.foto, styles.semFoto]}>
            <Ionicons name="shirt-outline" size={26} color={cores.textoSecundario} />
          </View>
        )}

        <View style={styles.informacoes}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.detalhe}>
            {produto.categoria} · Tam. {produto.tamanho}
          </Text>
          {produto.preco ? <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text> : null}
        </View>

        <View style={styles.quantidade}>
          <Text style={[styles.numero, estoqueBaixo && styles.numeroBaixo]}>{produto.quantidade}</Text>
          <Text style={styles.minimo}>mín. {produto.quantidadeMinima}</Text>
        </View>
      </View>

      {estoqueBaixo && (
        <View style={styles.etiqueta}>
          <Ionicons name="alert-circle" size={14} color={cores.vermelho} />
          <Text style={styles.textoEtiqueta}>Estoque baixo</Text>
        </View>
      )}

      {ehAdmin ? (
        <View style={styles.acoes}>
          <View style={styles.contador}>
            <TouchableOpacity style={styles.botaoContador} onPress={() => aoAlterarQuantidade(produto, -1)}>
              <Ionicons name="remove" size={18} color={cores.texto} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoContador} onPress={() => aoAlterarQuantidade(produto, 1)}>
              <Ionicons name="add" size={18} color={cores.texto} />
            </TouchableOpacity>
          </View>

          <View style={styles.contador}>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => aoEditar(produto)}>
              <Ionicons name="create-outline" size={20} color={cores.texto} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => aoExcluir(produto)}>
              <Ionicons name="trash-outline" size={20} color={cores.vermelho} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.acoesProfessor}>
          <TouchableOpacity style={styles.botaoProfessor} onPress={() => aoRegistrarSaida(produto)}>
            <Ionicons name="arrow-down-circle-outline" size={16} color={cores.vermelho} />
            <Text style={styles.textoProfessor}>Registrar saída</Text>
          </TouchableOpacity>
          <View style={styles.divisor} />
          <TouchableOpacity style={styles.botaoProfessor} onPress={() => aoSolicitar(produto)}>
            <Ionicons name="repeat-outline" size={16} color={cores.vermelho} />
            <Text style={styles.textoProfessor}>Solicitar reposição</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cardBaixo: {
    borderColor: '#F5B7B1',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foto: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  semFoto: {
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  informacoes: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
  },
  detalhe: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  preco: {
    fontSize: 13,
    color: cores.texto,
    marginTop: 4,
  },
  quantidade: {
    alignItems: 'center',
    minWidth: 50,
  },
  numero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
  },
  numeroBaixo: {
    color: cores.vermelho,
  },
  minimo: {
    fontSize: 11,
    color: cores.textoSecundario,
  },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: cores.vermelhoClaro,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 10,
  },
  textoEtiqueta: {
    fontSize: 12,
    color: cores.vermelho,
    fontWeight: '600',
    marginLeft: 4,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  contador: {
    flexDirection: 'row',
  },
  botaoContador: {
    width: 36,
    height: 32,
    borderRadius: 8,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botaoAcao: {
    padding: 6,
    marginLeft: 8,
  },
  acoesProfessor: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  botaoProfessor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  divisor: {
    width: 1,
    backgroundColor: cores.borda,
  },
  textoProfessor: {
    color: cores.vermelho,
    fontWeight: '600',
    marginLeft: 6,
  },
});
